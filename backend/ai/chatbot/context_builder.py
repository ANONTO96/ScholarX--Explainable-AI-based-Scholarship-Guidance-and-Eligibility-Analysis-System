
import json
from database.connection import get_db_connection
from services.student_profile_service import load_student_data


ELIGIBILITY_KEYWORDS = {
    "eligibility", "eligible", "scholarship", "analysis",
    "score", "requirement", "requirements", "passed",
    "failed", "under review", "not eligible",
}


def remove_internal_user_ids(data):
    """Remove internal user identifiers recursively before sending AI context."""

    if isinstance(data, dict):
        cleaned = {}

        for key, value in data.items():
            normalized_key = key.lower().replace("_", "").replace("-", "")

            if normalized_key in {
                "userid",
                "accountuserid",
                "internaluserid",
            }:
                continue

            cleaned[key] = remove_internal_user_ids(value)

        return cleaned

    if isinstance(data, list):
        return [remove_internal_user_ids(item) for item in data]

    return data



def _is_eligibility_question(question):
    question = (question or "").lower()
    return any(keyword in question for keyword in ELIGIBILITY_KEYWORDS)


def _remove_empty_values(value):
    """Remove empty values without changing meaningful stored values."""
    if isinstance(value, dict):
        return {
            key: _remove_empty_values(item)
            for key, item in value.items()
            if item is not None and item != "" and item != [] and item != {}
        }

    if isinstance(value, list):
        return [
            _remove_empty_values(item)
            for item in value
            if item is not None and item != "" and item != [] and item != {}
        ]

    return value


def build_student_context(user_id, question=None):
    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        student_data = load_student_data(cursor, user_id) or {}

        profile_context = {
            "profile": student_data.get("profile"),
            "degrees": student_data.get("degrees", []),
            "languages": student_data.get("languages", []),
            "documents": student_data.get("documents", []),
            "attributes": student_data.get("attributes", {}),
        }

        profile_context = _remove_empty_values(profile_context)

        analyses = []

        # Retrieve eligibility history only when relevant to the question.
        if _is_eligibility_question(question):
            cursor.execute(
                """
                SELECT
                    check_uuid,
                    scholarship_id,
                    program_id,
                    analysis_summary,
                    created_at
                FROM eligibility_check_results
                WHERE user_id = %s
                ORDER BY created_at DESC
                LIMIT 20
                """,
                (user_id,)
            )

            rows = cursor.fetchall()
            seen_checks = set()

            for row in rows:
                check_uuid = str(row["check_uuid"])

                if check_uuid in seen_checks:
                    continue

                seen_checks.add(check_uuid)

                summary = row.get("analysis_summary")

                if isinstance(summary, str):
                    try:
                        summary = json.loads(summary)
                    except json.JSONDecodeError:
                        summary = {}

                analyses.append({
                    "scholarship_id": row["scholarship_id"],
                    "program_id": row["program_id"],
                    "analysis_date": str(row["created_at"]),
                    "result": summary or {},
                })

                if len(analyses) >= 2:
                    break

        context = {
            "student_profile": profile_context,
            "recent_eligibility_analyses": analyses,
        }

        return remove_internal_user_ids(context)

    finally:
        if cursor is not None:
            cursor.close()

        connection.close()
