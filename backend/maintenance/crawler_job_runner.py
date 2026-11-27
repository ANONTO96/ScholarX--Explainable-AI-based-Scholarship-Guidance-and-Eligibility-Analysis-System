import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).resolve().parents[1] / ".env", override=False)
except ImportError:
    pass

BACKEND_ROOT = Path(
    os.getenv("SCHOLARX_BACKEND_ROOT", Path(__file__).resolve().parents[1])
).expanduser().resolve()
RUNTIME_DIR = Path(
    os.getenv("SCHOLARX_CRAWLER_RUNTIME_DIR", BACKEND_ROOT / ".crawler_runtime")
).expanduser().resolve()
PYTHON_EXECUTABLE = os.getenv("SCHOLARX_PYTHON_EXECUTABLE", sys.executable)
LOCK_FILE = RUNTIME_DIR / "active.lock"
STATUS_FILE = RUNTIME_DIR / "latest_status.json"
LOG_FILE = RUNTIME_DIR / "crawler.log"

PROCESS_SCRIPTS = {
    "china_crawler": Path(
        os.getenv("SCHOLARX_CHINA_CRAWLER_SCRIPT", BACKEND_ROOT / "crawler" / "china_crawler.py")
    ).expanduser().resolve(),
    "china_rules": Path(
        os.getenv("SCHOLARX_CHINA_RULES_SCRIPT", BACKEND_ROOT / "ai" / "china" / "runner.py")
    ).expanduser().resolve(),
}


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def write_status(data):
    RUNTIME_DIR.mkdir(mode=0o700, parents=True, exist_ok=True)
    temporary = STATUS_FILE.with_suffix(".tmp")
    temporary.write_text(json.dumps(data), encoding="utf-8")
    temporary.replace(STATUS_FILE)


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Usage: crawler_job_runner.py <process> <job_id>")

    process_name, job_id = sys.argv[1], sys.argv[2]
    script = PROCESS_SCRIPTS.get(process_name)
    status = {}
    try:
        status = json.loads(STATUS_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        status = {"job_id": job_id, "process": process_name, "started_at": utc_now()}

    if script is None or not script.is_file():
        status.update({
            "status": "failed",
            "message": "Configured script does not exist.",
            "finished_at": utc_now(),
            "return_code": 2,
        })
        write_status(status)
        LOCK_FILE.unlink(missing_ok=True)
        raise SystemExit(2)

    status.update({"status": "running", "message": "The script is running."})
    write_status(status)

    try:
        with LOG_FILE.open("a", encoding="utf-8", buffering=1) as log:
            log.write(f"\n===== {process_name} started at {utc_now()} | job {job_id} =====\n")
            completed = subprocess.run(
                [PYTHON_EXECUTABLE, str(script)],
                cwd=str(BACKEND_ROOT),
                stdin=subprocess.DEVNULL,
                stdout=log,
                stderr=subprocess.STDOUT,
                check=False,
                env=os.environ.copy(),
            )
            log.write(f"===== finished at {utc_now()} | exit code {completed.returncode} =====\n")

        status.update({
            "status": "completed" if completed.returncode == 0 else "failed",
            "message": (
                "Process completed successfully."
                if completed.returncode == 0
                else f"Process exited with code {completed.returncode}. Check the execution log."
            ),
            "finished_at": utc_now(),
            "return_code": completed.returncode,
        })
        write_status(status)
    except Exception as exc:
        status.update({
            "status": "failed",
            "message": f"Worker error: {exc}",
            "finished_at": utc_now(),
            "return_code": 1,
        })
        write_status(status)
        raise
    finally:
        LOCK_FILE.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
