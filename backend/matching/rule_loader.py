
import json


def _decode_condition(condition_json):
    """Decode condition_json while preserving invalid or plain-text values."""
    if condition_json is None:
        return None

    if isinstance(condition_json, (dict, list)):
        return condition_json

    if isinstance(condition_json, str):
        try:
            return json.loads(condition_json)
        except (json.JSONDecodeError, TypeError):
            return condition_json

    return condition_json


def _normalize_rule(rule):
    """Normalize a database rule without losing its original information."""
    rule["mandatory"] = bool(rule["mandatory"])
    rule["condition_json"] = _decode_condition(rule["condition_json"])

    return rule


def load_scholarship_rules(cursor, scholarship_id, program_id=None):
    """
    Load eligibility rules for a scholarship.

    If program_id is provided:
        Load general rules and rules for that specific program.

    If program_id is None:
        Load all rules belonging to the scholarship.

    The caller owns the database connection and cursor.
    """

    if not isinstance(scholarship_id, int) or scholarship_id <= 0:
        raise ValueError("A valid positive scholarship_id is required.")

    if program_id is not None:
        if not isinstance(program_id, int) or program_id <= 0:
            raise ValueError("program_id must be a positive integer or None.")

        query = """
            SELECT
                id,
                scholarship_id,
                program_id,
                scope,
                rule_type,
                operator,
                rule_value,
                category,
                study_language,
                condition_json,
                source_sentence,
                mandatory,
                created_at,
                updated_at
            FROM scholarship_eligibility
            WHERE scholarship_id = %s
              AND (
                    program_id IS NULL
                    OR program_id = %s
              )
            ORDER BY
                CASE WHEN program_id IS NULL THEN 0 ELSE 1 END,
                id
        """

        cursor.execute(query, (scholarship_id, program_id))

    else:
        query = """
            SELECT
                id,
                scholarship_id,
                program_id,
                scope,
                rule_type,
                operator,
                rule_value,
                category,
                study_language,
                condition_json,
                source_sentence,
                mandatory,
                created_at,
                updated_at
            FROM scholarship_eligibility
            WHERE scholarship_id = %s
            ORDER BY
                CASE WHEN program_id IS NULL THEN 0 ELSE 1 END,
                program_id,
                id
        """

        cursor.execute(query, (scholarship_id,))

    rules = cursor.fetchall()

    return [_normalize_rule(rule) for rule in rules]
