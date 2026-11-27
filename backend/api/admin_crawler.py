import json
import os
import subprocess
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

import jwt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

# Optional local .env loading. Production cPanel variables can be configured
# through Setup Python App and will take precedence over values in .env.
try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[1] / ".env", override=False)
except ImportError:
    pass

router = APIRouter(prefix="/api/admin/crawler", tags=["Admin - Crawler"])
bearer = HTTPBearer(auto_error=False)

BACKEND_ROOT = Path(
    os.getenv("SCHOLARX_BACKEND_ROOT", Path(__file__).resolve().parents[1])
).expanduser().resolve()
RUNTIME_DIR = Path(
    os.getenv("SCHOLARX_CRAWLER_RUNTIME_DIR", BACKEND_ROOT / ".crawler_runtime")
).expanduser().resolve()
PYTHON_EXECUTABLE = os.getenv("SCHOLARX_PYTHON_EXECUTABLE", sys.executable)
WORKER_FILE = Path(
    os.getenv("SCHOLARX_CRAWLER_WORKER", BACKEND_ROOT / "maintenance" / "crawler_job_runner.py")
).expanduser().resolve()

LOCK_FILE = RUNTIME_DIR / "active.lock"
STATUS_FILE = RUNTIME_DIR / "latest_status.json"

PROCESS_SCRIPTS = {
    "china_crawler": Path(
        os.getenv("SCHOLARX_CHINA_CRAWLER_SCRIPT", BACKEND_ROOT / "crawler" / "china_crawler.py")
    ).expanduser().resolve(),
    "china_rules": Path(
        os.getenv("SCHOLARX_CHINA_RULES_SCRIPT", BACKEND_ROOT / "ai" / "china" / "runner.py")
    ).expanduser().resolve(),
}


class RunRequest(BaseModel):
    process: str


def _read_status():
    try:
        return json.loads(STATUS_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return {
            "status": "idle",
            "process": None,
            "message": "No crawler execution has been recorded.",
            "started_at": None,
            "finished_at": None,
            "return_code": None,
            "log_tail": "",
        }


def _require_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
):
    # Reuse the exact JWT secret/algorithm already used by ScholarX login.
    secret = os.getenv("JWT_SECRET")
    algorithm = os.getenv("JWT_ALGORITHM", "HS256")

    if not secret:
        raise HTTPException(status_code=500, detail="JWT configuration is missing.")
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authentication required.")

    try:
        payload = jwt.decode(credentials.credentials, secret, algorithms=[algorithm])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token.")

    if str(payload.get("role", "")).lower() != "admin":
        raise HTTPException(status_code=403, detail="Administrator access required.")
    return payload


@router.get("/status")
def crawler_status(_admin=Depends(_require_admin)):
    status = _read_status()
    log_file = RUNTIME_DIR / "crawler.log"

    if log_file.is_file():
        try:
            with log_file.open("rb") as handle:
                handle.seek(max(0, log_file.stat().st_size - 12000))
                status["log_tail"] = handle.read().decode("utf-8", errors="replace")
        except OSError:
            pass
    return status


@router.post("/run", status_code=202)
def run_crawler(data: RunRequest, _admin=Depends(_require_admin)):
    script = PROCESS_SCRIPTS.get(data.process)
    if script is None:
        raise HTTPException(status_code=422, detail="Unsupported crawler process.")
    if not script.is_file():
        raise HTTPException(status_code=404, detail=f"Configured script not found: {script}")
    if not WORKER_FILE.is_file():
        raise HTTPException(status_code=500, detail=f"Crawler worker not found: {WORKER_FILE}")

    RUNTIME_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)

    try:
        lock_fd = os.open(str(LOCK_FILE), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise HTTPException(status_code=409, detail="A data-processing task is already running.")

    job_id = str(uuid.uuid4())
    started_at = datetime.now(timezone.utc).isoformat()

    try:
        with os.fdopen(lock_fd, "w", encoding="utf-8") as lock:
            lock.write(job_id)

        status = {
            "job_id": job_id,
            "process": data.process,
            "status": "queued",
            "message": "The process has been accepted and is starting.",
            "started_at": started_at,
            "finished_at": None,
            "return_code": None,
            "log_tail": "",
        }
        STATUS_FILE.write_text(json.dumps(status), encoding="utf-8")

        subprocess.Popen(
            [PYTHON_EXECUTABLE, str(WORKER_FILE), data.process, job_id],
            cwd=str(BACKEND_ROOT),
            stdin=subprocess.DEVNULL,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            close_fds=True,
            start_new_session=True,
            env=os.environ.copy(),
        )
        return status
    except Exception as exc:
        LOCK_FILE.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail=f"Unable to start crawler process: {exc}")
