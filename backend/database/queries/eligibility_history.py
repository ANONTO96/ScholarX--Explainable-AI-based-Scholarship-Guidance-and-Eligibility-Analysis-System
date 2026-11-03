
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


def save_eligibility_history(user_id, scholarship_id, result):
    """
    Save completed eligibility analysis.

    One row represents one evaluated rule.
    One check_uuid groups all rules from one analysis.
    """

    if result.get("status") != "evaluated":
        return None

    check_uuid = str(uuid.uuid4())

    recommendations_by_rule = {
        item["rule_id"]: item.get("suggestion")
        for item in result.get("recommendations", [])
        if item.get("rule_id") is not None
    }

    all_rule_results = (
        result.get("academic_results", [])
        + result.get("eligibility_results", [])
    )

    if not all_rule_results:
        return check_uuid

    # Complete analysis-level information.
    analysis_summary = {
        "status": result.get("status"),
        "eligibility_score": result.get("eligibility_score"),
        "total_rules": result.get("total_rules"),
        "selected_study_language": result.get(
            "selected_study_language"
        ),
        "program": result.get("program"),
        "program_selection": result.get("program_selection"),
        "recommendations": result.get("recommendations", []),
    }

    query = """
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

    values = []

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

        values.append((
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

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.executemany(query, values)
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
