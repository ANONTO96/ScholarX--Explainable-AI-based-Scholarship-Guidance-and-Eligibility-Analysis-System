import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from api.auth.dependencies import get_current_user
from matching.engine import analyze_scholarship
from database.connection import get_db_connection

router = APIRouter(prefix="/api/matching", tags=["Scholarship Matching"])


class AnalyzeScholarshipRequest(BaseModel):
    scholarship_id: int
    preferred_study_language: Optional[str] = None


@router.post("/analyze")
def analyze_database_scholarship(
    request: AnalyzeScholarshipRequest,
    current_user: dict = Depends(get_current_user),
):
    """Run the existing matching engine for the authenticated student."""
    try:
        user_id = int(current_user["user_id"])
        result = analyze_scholarship(
            user_id=user_id,
            scholarship_id=request.scholarship_id,
            preferred_study_language=request.preferred_study_language,
        )
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        # Keep internal database/engine details in server logs only.
        print(f"Scholarship analysis failed: {exc}")
        raise HTTPException(
            status_code=500,
            detail="Unable to analyze this scholarship right now.",
        ) from exc


def parse_json(value):
    if value is None:
        return None

    if isinstance(value, (dict, list)):
        return value

    try:
        return json.loads(value)
    except (TypeError, ValueError):
        return value


@router.get("/history")
def get_eligibility_history(
    current_user: dict = Depends(get_current_user),
):
    user_id = int(current_user["user_id"])

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                e.id,
                e.check_uuid,
                e.scholarship_id,
                e.program_id,
                e.rule_id,
                e.status,
                e.student_value,
                e.required_value,
                e.reason,
                e.recommendation,
                e.rule_data,
                e.analysis_summary,
                e.created_at,
                s.title AS scholarship_title,
                s.country AS scholarship_country,
                p.program_name
            FROM eligibility_check_results e
            LEFT JOIN scholarships s
                ON s.id = e.scholarship_id
            LEFT JOIN scholarship_programs p
                ON p.id = e.program_id
            WHERE e.user_id = %s
            ORDER BY e.created_at DESC, e.id DESC
        """, (user_id,))

        rows = cursor.fetchall()
        history = {}

        for row in rows:
            check_uuid = row["check_uuid"]

            if check_uuid not in history:
                history[check_uuid] = {
                    "check_uuid": check_uuid,
                    "scholarship_id": row["scholarship_id"],
                    "scholarship_title": row["scholarship_title"],
                    "country": row["scholarship_country"],
                    "program_id": row["program_id"],
                    "program_name": row["program_name"],
                    "created_at": (
                        row["created_at"].isoformat()
                        if row["created_at"] else None
                    ),
                    "summary": parse_json(row["analysis_summary"]),
                    "requirements": [],
                }

            history[check_uuid]["requirements"].append({
                "rule_id": row["rule_id"],
                "status": row["status"],
                "student_value": row["student_value"],
                "required_value": row["required_value"],
                "reason": row["reason"],
                "recommendation": row["recommendation"],
                "rule_data": parse_json(row["rule_data"]),
            })

        return {
            "success": True,
            "total": len(history),
            "history": list(history.values()),
        }

    except Exception as exc:
        print(f"Eligibility history retrieval failed: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Unable to retrieve eligibility history.",
        ) from exc

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()