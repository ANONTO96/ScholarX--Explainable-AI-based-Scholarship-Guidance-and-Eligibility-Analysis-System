import json
import uuid

from database.connection import get_db_connection


def serialize_value(value):
    """Convert values into MySQL-compatible text."""

    if value is None:
        return None

    if isinstance(value, (dict, list)):
        return json.dumps(value, ensure_ascii=False, default=str)

    if isinstance(value, bool):
        return str(value).lower()

    return str(value)


def as_bool(value):
    """Normalize boolean values from API payloads and database drivers."""
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        return value.strip().casefold() in {"1", "true", "yes", "y", "on"}
    return False


def get_document_status(document):
    """Convert the document matcher status into the database ENUM values."""

    api_status = document.get("status")
    mandatory = as_bool(document.get("mandatory", True))

    if api_status == "met":
        return "matched"

    if api_status == "not_met":
        return "missing" if mandatory else "optional_missing"

    raise ValueError(
        f"Unknown document status: {api_status}"
    )


def save_eligibility_history(user_id, scholarship_id, result):
    """
    Save completed eligibility analysis.

    Eligibility rules:
        One row represents one evaluated rule.

    Documents:
        One row represents one scholarship document.

    All rows from the same analysis share one check_uuid.
    """

    if result.get("status") != "evaluated":
        return None

    all_rule_results = (
        result.get("academic_results", [])
        + result.get("eligibility_results", [])
    )

    document_matching = result.get("document_matching") or {}
    document_results = document_matching.get("results", [])

    language_matching = (
    result.get("language_proficiency_matching") or {}
)

    if not all_rule_results and not document_results and not language_matching:
        return None

    check_uuid = str(uuid.uuid4())

    recommendations_by_rule = {
        item["rule_id"]: item.get("suggestion")
        for item in result.get("recommendations", [])
        if item.get("rule_id") is not None
    }

    analysis_summary = {
        "status": result.get("status"),
        "eligibility_score": result.get("eligibility_score"),

        # Level 1: Document Matching
        "document_matching": document_matching,
        "document_matching_score": result.get(
            "document_matching_score"
        ),

        # Level 2: Language Proficiency Matching
        "language_proficiency_matching": result.get(
            "language_proficiency_matching"
        ),

        "total_rules": result.get("total_rules"),
        "selected_study_language": result.get(
            "selected_study_language"
        ),
        "program": result.get("program"),
        "program_selection": result.get("program_selection"),
        "recommendations": result.get("recommendations", []),
    }

    rule_query = """
        INSERT INTO eligibility_check_results (
            check_uuid,
            user_id,
            scholarship_id,
            program_id,
            rule_id,
            status,
            student_value,
            required_value,
            reason,
            recommendation,
            rule_data,
            analysis_summary
        )
        VALUES (
            %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s
        )
    """

    document_query = """
        INSERT INTO eligibility_document_check_results (
            check_uuid,
            user_id,
            scholarship_id,
            program_id,
            document_id,
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
        )
        VALUES (
            %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s, %s, %s,
            %s, %s, %s, %s
        )
    """

    rule_values = []
    document_values = []

    # Prepare eligibility-rule records.
    for rule in all_rule_results:
        rule_id = rule.get("rule_id")

        if rule_id is None:
            raise ValueError(
                "An evaluated rule is missing its rule_id."
            )

        rule_data = json.dumps(
            rule,
            ensure_ascii=False,
            default=str
        )

        summary_data = json.dumps(
            analysis_summary,
            ensure_ascii=False,
            default=str
        )

        rule_values.append((
            check_uuid,
            user_id,
            scholarship_id,
            result.get("program_id"),
            rule_id,
            rule.get("status"),
            serialize_value(rule.get("student_value")),
            serialize_value(rule.get("required_value")),
            rule.get("reason"),
            recommendations_by_rule.get(rule_id),
            rule_data,
            summary_data
        ))

    # Prepare document records using the actual API fields.
    for document in document_results:
        document_id = document.get("scholarship_document_id")

        if document_id is None:
            raise ValueError(
                "A document result is missing scholarship_document_id."
            )

        mandatory = as_bool(document.get("mandatory", True))
        has_document = as_bool(document.get("student_has_document"))

        document_status = get_document_status(document)

        score = document.get("score")
        maximum_score = document.get("maximum_score")

        if maximum_score is not None and maximum_score > 0:
            percentage = round(
                (score or 0) / maximum_score * 100,
                2
            )
        else:
            percentage = None

        document_values.append((
            check_uuid,
            user_id,
            scholarship_id,
            result.get("program_id"),
            document_id,
            document.get("document_name") or "Unnamed document",
            1 if mandatory else 0,
            1 if has_document else 0,
            document_status,
            document.get("student_value") or (
                "Available" if has_document else "Not available"
            ),
            serialize_value(document.get("required_value")),
            document.get("reason"),
            document.get("recommendation"),
            score,
            maximum_score,
            percentage
        ))

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        if rule_values:
            cursor.executemany(rule_query, rule_values)

        if document_values:
            cursor.executemany(
                document_query,
                document_values
            )

        connection.commit()

        return check_uuid

    except Exception:
        if connection:
            connection.rollback()
        raise

    finally:
        if cursor:
            cursor.close()

        if connection and connection.is_connected():
            connection.close()