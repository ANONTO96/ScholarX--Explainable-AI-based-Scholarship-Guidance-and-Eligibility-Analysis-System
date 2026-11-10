import json
from datetime import timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from api.auth.dependencies import get_current_user
from matching.engine import analyze_scholarship
from database.connection import get_db_connection


router = APIRouter(
    prefix="/api/matching",
    tags=["Scholarship Matching"],
)


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
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
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


def get_or_create_history_entry(history, row):
    """
    Get an existing analysis entry or create one.

    This allows eligibility records and document records
    to belong to the same history item using check_uuid.
    """
    check_uuid = row["check_uuid"]

    if check_uuid not in history:
        history[check_uuid] = {
            "check_uuid": check_uuid,
            "scholarship_id": row["scholarship_id"],
            "scholarship_title": row.get("scholarship_title"),
            "country": row.get("scholarship_country"),
            "program_id": row.get("program_id"),
            "program_name": row.get("program_name"),
            "created_at": (
                row["created_at"].replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
                if row.get("created_at")
                else None
            ),
            "summary": {},
            "requirements": [],
            "documents": [],
        }

    entry = history[check_uuid]

    # Fill metadata if it was not available from the first query.
    if not entry.get("scholarship_title"):
        entry["scholarship_title"] = row.get("scholarship_title")

    if not entry.get("country"):
        entry["country"] = row.get("scholarship_country")

    if not entry.get("program_name"):
        entry["program_name"] = row.get("program_name")

    if not entry.get("program_id"):
        entry["program_id"] = row.get("program_id")

    return entry


def build_document_summary(documents):
    """Build aggregate document readiness from saved per-document rows."""
    total_documents = len(documents)

    matched_documents = sum(
        1 for doc in documents if doc.get("status") == "matched"
    )
    mandatory_documents = sum(
        1 for doc in documents if doc.get("mandatory")
    )
    optional_documents = total_documents - mandatory_documents
    missing_mandatory_documents = sum(
        1 for doc in documents if doc.get("status") == "missing"
    )
    missing_optional_documents = sum(
        1 for doc in documents if doc.get("status") == "optional_missing"
    )

    total_score = sum(float(doc.get("score") or 0) for doc in documents)
    maximum_score = sum(
        float(doc.get("maximum_score") or 0) for doc in documents
    )
    percentage = (
        round(total_score / maximum_score * 100, 2)
        if maximum_score > 0
        else 0.0
    )

    return {
        "available": total_documents > 0,
        "score": round(total_score, 2),
        "maximum_score": round(maximum_score, 2),
        "percentage": percentage,
        "total_documents": total_documents,
        "matched_documents": matched_documents,
        "missing_documents": (
            missing_mandatory_documents + missing_optional_documents
        ),
        "mandatory_documents": mandatory_documents,
        "optional_documents": optional_documents,
        "missing_mandatory_documents": missing_mandatory_documents,
        "missing_optional_documents": missing_optional_documents,
        # Compatibility aliases used by existing frontend components.
        "missing_mandatory": missing_mandatory_documents,
        "missing_optional": missing_optional_documents,
    }


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

        history = {}

        # --------------------------------------------------
        # 1. Retrieve existing eligibility requirement history
        # --------------------------------------------------

        cursor.execute(
            """
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
            """,
            (user_id,),
        )

        eligibility_rows = cursor.fetchall()

        for row in eligibility_rows:
            entry = get_or_create_history_entry(history, row)

            # Preserve the existing eligibility analysis summary.
            parsed_summary = parse_json(row["analysis_summary"])

            if isinstance(parsed_summary, dict):
                entry["summary"] = parsed_summary

            entry["requirements"].append({
                "rule_id": row["rule_id"],
                "status": row["status"],
                "student_value": row["student_value"],
                "required_value": row["required_value"],
                "reason": row["reason"],
                "recommendation": row["recommendation"],
                "rule_data": parse_json(row["rule_data"]),
            })

        # --------------------------------------------------
        # 2. Retrieve document check history
        # --------------------------------------------------

        cursor.execute(
            """
            SELECT
                d.id,
                d.check_uuid,
                d.user_id,
                d.scholarship_id,
                d.program_id,
                d.document_id,
                d.document_name,
                d.mandatory,
                d.has_document,
                d.status,
                d.student_value,
                d.required_value,
                d.reason,
                d.recommendation,
                d.document_score,
                d.document_max_score,
                d.document_percentage,
                d.created_at,
                s.title AS scholarship_title,
                s.country AS scholarship_country,
                p.program_name
            FROM eligibility_document_check_results d
            LEFT JOIN scholarships s
                ON s.id = d.scholarship_id
            LEFT JOIN scholarship_programs p
                ON p.id = d.program_id
            WHERE d.user_id = %s
            ORDER BY d.created_at DESC, d.id DESC
            """,
            (user_id,),
        )

        document_rows = cursor.fetchall()

        for row in document_rows:
            entry = get_or_create_history_entry(history, row)

            has_document = bool(row["has_document"])
            mandatory = bool(row["mandatory"])

            document_score = (
                float(row["document_score"])
                if row["document_score"] is not None
                else 0
            )
            document_max_score = (
                float(row["document_max_score"])
                if row["document_max_score"] is not None
                else 0
            )
            document_percentage = (
                float(row["document_percentage"])
                if row["document_percentage"] is not None
                else (
                    round(document_score / document_max_score * 100, 2)
                    if document_max_score > 0
                    else 0
                )
            )

            entry["documents"].append({
                "document_id": row["document_id"],
                "document_name": row["document_name"],
                "mandatory": mandatory,
                "has_document": has_document,
                "status": row["status"],
                "student_value": row["student_value"],
                "required_value": row["required_value"],
                "reason": row["reason"],
                "recommendation": row["recommendation"],
                "score": document_score,
                "maximum_score": document_max_score,
                "percentage": document_percentage,
                # Preserve the column names used by the existing UI too.
                "document_score": document_score,
                "document_max_score": document_max_score,
                "document_percentage": document_percentage,
            })

        # --------------------------------------------------
        # 3. Build document readiness summary for each analysis
        # --------------------------------------------------

        for entry in history.values():
            document_summary = build_document_summary(entry["documents"])

            if not isinstance(entry.get("summary"), dict):
                entry["summary"] = {}

            # Document-only checks are valid completed analyses too. This
            # ensures the UI does not hide their individual document rows.
            if entry["documents"]:
                entry["summary"].setdefault("status", "evaluated")

            # The saved per-document rows are the source of truth for the
            # history view; expose the same aggregate under both API names.
            entry["summary"]["document_matching"] = document_summary
            entry["summary"]["document_readiness"] = document_summary

        # --------------------------------------------------
        # 4. Sort combined history by analysis date
        # --------------------------------------------------

        history_list = list(history.values())

        history_list.sort(
            key=lambda item: item.get("created_at") or "",
            reverse=True,
        )

        return {
            "success": True,
            "total": len(history_list),
            "history": history_list,
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
