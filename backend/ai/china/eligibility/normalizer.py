
import json
from .operators import validate_operator

REQUIRED_FIELDS = ("rule_type", "category")


def normalize_rule(
    rule: dict,
    scholarship_id: int,
    program_id_map: dict[str, int] | None = None
) -> dict:

    program_id_map = program_id_map or {}

    missing = [
        field for field in REQUIRED_FIELDS
        if rule.get(field) in (None, "")
    ]

    if missing:
        raise ValueError(
            f"Rule missing required fields: {', '.join(missing)}"
        )

    operator = rule.get("operator")
    rule_value = rule.get("rule_value")
    source_sentence = rule.get("source_sentence")

    # Validate operator only when one is provided.
    if operator is not None and not validate_operator(operator):
        raise ValueError(f"Unsupported operator: {operator}")

    program = rule.get("program")

    if program:
        if program not in program_id_map:
            raise ValueError(
                f"No program_id mapping provided for {program!r}"
            )
        scope = "program"
        program_id = program_id_map[program]
    else:
        scope = "scholarship"
        program_id = None

    condition = rule.get("condition")

    return {
        "scholarship_id": int(scholarship_id),
        "program_id": program_id,
        "scope": scope,
        "rule_type": str(rule["rule_type"]).strip().lower(),
        "operator": operator,
        "rule_value": (
            str(rule_value) if rule_value is not None else None
        ),
        "category": str(rule["category"]).strip().lower(),
        "study_language": rule.get("study_language"),
        "condition_json": (
            json.dumps(condition, ensure_ascii=False)
            if condition else None
        ),
        "source_sentence": (
            source_sentence.strip()
            if source_sentence else None
        ),
        "mandatory": int(bool(rule.get("mandatory", True))),
    }
