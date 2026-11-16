
import json

from database.connection import get_db_connection
from services.student_profile_service import load_student_data


ELIGIBILITY_KEYWORDS = {
    "eligibility", "eligible", "scholarship", "analysis",
    "score", "requirement", "requirements", "passed",
    "failed", "under review", "not eligible",
}

MAX_ANALYSES = 2
MAX_RULES_PER_ANALYSIS = 20
MAX_DOCUMENTS_PER_ANALYSIS = 15
MAX_RECOMMENDATIONS = 10
MAX_TEXT_LENGTH = 300


def remove_internal_user_ids(data):
    """Remove internal user identifiers recursively."""

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

    return any(
        keyword in question
        for keyword in ELIGIBILITY_KEYWORDS
    )


def _decode_json(value):
    if value is None:
        return {}

    if isinstance(value, (dict, list)):
        return value

    if isinstance(value, (bytes, bytearray)):
        value = value.decode("utf-8")

    if isinstance(value, str):
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return {}

    return {}


def _compact_text(value):
    if isinstance(value, str):
        return value[:MAX_TEXT_LENGTH]

    return value


def _compact_profile(student_data):
    profile = student_data.get("profile") or {}

    # Only include profile fields relevant to scholarship analysis.
    profile_fields = [
        "nationality",
        "age",
        "current_study_level",
        "field_of_study",
        "institution_name",
        "current_gpa",
        "gpa_scale",
        "annual_budget",
        "budget_currency",
        "work_experience_months",
        "leadership_experience",
        "community_service",
        "research_experience",
        "international_student",
        "currently_enrolled",
    ]

    compact_profile = {
        field: profile.get(field)
        for field in profile_fields
        if profile.get(field) is not None
    }

    return {
        "profile": compact_profile,
        "degrees": student_data.get("degrees", [])[:10],
        "languages": student_data.get("languages", [])[:10],
        "attributes": student_data.get("attributes", [])[:15],
    }


def _compact_analysis_summary(summary):
    """Keep useful report-level information without duplicated details."""

    summary = _decode_json(summary)

    if not isinstance(summary, dict):
        return {}

    fields = [
        "status",
        "eligibility_score",
        "document_matching_score",
        "overall_matching_score",
        "matching_score_summary",
        "total_rules",
        "selected_study_language",
        "program",
        "program_selection",
    ]

    compact = {
        field: summary[field]
        for field in fields
        if field in summary and summary[field] is not None
    }

    recommendations = summary.get("recommendations") or []

    compact["recommendations"] = [
        {
            key: _compact_text(value)
            for key, value in item.items()
            if key in {"rule_id", "suggestion", "reason"}
        }
        for item in recommendations[:MAX_RECOMMENDATIONS]
        if isinstance(item, dict)
    ]

    return compact


def _load_recent_analysis_ids(cursor, user_id):
    """Retrieve the latest unique eligibility analysis IDs."""

    cursor.execute(
        """
        SELECT
            check_uuid,
            MAX(created_at) AS created_at
        FROM eligibility_check_results
        WHERE user_id = %s
        GROUP BY check_uuid
        ORDER BY created_at DESC
        LIMIT %s
        """,
        (user_id, MAX_ANALYSES),
    )

    return cursor.fetchall() or []


def _load_analysis_details(cursor, user_id, check_uuid, created_at):
    """Load one report with its actual evaluated rules and documents."""

    cursor.execute(
        """
        SELECT
            scholarship_id,
            program_id,
            analysis_summary,
            rule_data
        FROM eligibility_check_results
        WHERE user_id = %s
          AND check_uuid = %s
        LIMIT %s
        """,
        (user_id, check_uuid, MAX_RULES_PER_ANALYSIS),
    )

    rule_rows = cursor.fetchall() or []

    if not rule_rows:
        return None

    first_row = rule_rows[0]

    rules = []

    for row in rule_rows:
        rule = _decode_json(row.get("rule_data"))

        if isinstance(rule, dict):
            rules.append({
    key: _compact_text(value)
    for key, value in rule.items()
})

    # Retrieve document-level results separately.
    cursor.execute(
        """
        SELECT
            document_name,
            mandatory,
            has_document,
            status,
            student_value,
            required_value,
            reason,
            recommendation,
            document_score,
            document_max_score,
            document_percentage
        FROM eligibility_document_check_results
        WHERE user_id = %s
          AND check_uuid = %s
        LIMIT %s
        """,
        (user_id, check_uuid, MAX_DOCUMENTS_PER_ANALYSIS),
    )

    document_rows = cursor.fetchall() or []

    documents = [
        {
            key: _compact_text(value)
            for key, value in document.items()
        }
        for document in document_rows
    ]

    return {
        "analysis_date": str(created_at),
        "scholarship_id": first_row.get("scholarship_id"),
        "program_id": first_row.get("program_id"),
        "summary": _compact_analysis_summary(
            first_row.get("analysis_summary")
        ),
        "requirement_results": rules,
        "document_results": documents,
        "retrieved_rule_count": len(rules),
        "retrieved_document_count": len(documents),
    }


def build_student_context(user_id, question=None):
    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        student_data = load_student_data(cursor, user_id) or {}

        context = {
            "student_profile": _compact_profile(student_data),
            "recent_eligibility_analyses": [],
        }

        if _is_eligibility_question(question):

            analysis_ids = _load_recent_analysis_ids(
                cursor,
                user_id,
            )

            for analysis in analysis_ids:

                report = _load_analysis_details(
                    cursor,
                    user_id,
                    analysis["check_uuid"],
                    analysis["created_at"],
                )

                if report:
                    context["recent_eligibility_analyses"].append(
                        report
                    )

        return remove_internal_user_ids(context)

    finally:
        if cursor is not None:
            cursor.close()

        connection.close()
