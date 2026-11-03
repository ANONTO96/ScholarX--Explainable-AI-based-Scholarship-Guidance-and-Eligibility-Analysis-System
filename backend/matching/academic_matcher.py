"""
Academic rule matcher.

Currently supported:
- minimum_degree

Completed qualifications are read from:
1. Structured student_degrees rows with a completed status.
2. Profile JSON: additional_information.academic.completedDegrees.

The source of each qualification is retained in the evaluation result.
"""

import json
import re


DEGREE_LEVELS = {
    "high school": 1,
    "higher secondary": 1,
    "diploma": 1,
    "bachelor": 2,
    "master": 3,
    "doctoral": 4,
}

COMPLETED_STATUSES = {"completed", "complete", "graduated"}


def normalize_degree(value):
    """Normalize common degree labels, including profile values like Bsc In CSE."""
    if not value:
        return None

    value = str(value).strip().lower()
    value = value.replace("’", "'").replace("'", "")
    value = re.sub(r"[.,]", " ", value)
    value = re.sub(r"\s+", " ", value).strip()

    aliases = {
        "high school diploma": "high school",
        "secondary school": "high school",
        "ssc": "high school",
        "higher secondary certificate": "higher secondary",
        "hsc": "higher secondary",
        "bsc": "bachelor",
        "b sc": "bachelor",
        "bachelor of science": "bachelor",
        "bachelor of arts": "bachelor",
        "bachelor of engineering": "bachelor",
        "bachelor of technology": "bachelor",
        "bachelors": "bachelor",
        "bachelors degree": "bachelor",
        "bachelor degree": "bachelor",
        "undergraduate": "bachelor",
        "msc": "master",
        "m sc": "master",
        "master of science": "master",
        "master of arts": "master",
        "masters": "master",
        "masters degree": "master",
        "master degree": "master",
        "doctorate": "doctoral",
        "phd": "doctoral",
        "ph d": "doctoral",
        "phd degree": "doctoral",
        "doctoral degree": "doctoral",
    }

    if value in aliases:
        return aliases[value]

    prefix_patterns = (
        (r"^(?:b\s*sc|bachelor(?:s)?(?: degree)?|bachelor of science)\b", "bachelor"),
        (r"^(?:m\s*sc|master(?:s)?(?: degree)?|master of science)\b", "master"),
        (r"^(?:ph\s*d|doctorate|doctoral)\b", "doctoral"),
        (r"^(?:hsc|higher secondary)\b", "higher secondary"),
        (r"^(?:ssc|high school)\b", "high school"),
    )
    for pattern, canonical in prefix_patterns:
        if re.match(pattern, value):
            return canonical

    return value


def get_degree_rank(value):
    normalized = normalize_degree(value)
    return DEGREE_LEVELS.get(normalized) if normalized else None


def collect_completed_degrees(student_data):
    """Collect recognized completed qualifications from both sources."""
    completed = []
    seen = set()

    def add(name, source, record=None):
        rank = get_degree_rank(name)
        if rank is None:
            return

        key = (normalize_degree(name), source)
        if key in seen:
            return
        seen.add(key)

        record = record or {}
        completed.append({
            "degree_level": name,
            "normalized_level": normalize_degree(name),
            "rank": rank,
            "source": source,
            "degree_title": record.get("degree_title"),
        })

    for degree in student_data.get("degrees") or []:
        status = str(degree.get("completion_status") or "").strip().lower()
        if status not in COMPLETED_STATUSES:
            continue
        name = degree.get("degree_level") or degree.get("degree_title")
        add(name, "student_degrees", degree)

    profile = student_data.get("profile") or {}
    additional_info = profile.get("additional_information") or {}
    if isinstance(additional_info, str):
        try:
            additional_info = json.loads(additional_info)
        except (TypeError, ValueError):
            additional_info = {}

    academic_info = (
        additional_info.get("academic") or {}
        if isinstance(additional_info, dict)
        else {}
    )
    profile_degrees = academic_info.get("completedDegrees", [])

    if isinstance(profile_degrees, list):
        for degree_name in profile_degrees:
            if isinstance(degree_name, str) and degree_name.strip():
                add(degree_name, "profile_json")

    return completed


def compare_degree_ranks(student_rank, required_rank, operator):
    """Compare a completed qualification against the requirement."""
    comparisons = {
        ">=": student_rank >= required_rank,
        ">": student_rank > required_rank,
        "=": student_rank == required_rank,
        "!=": student_rank != required_rank,
        "<=": student_rank <= required_rank,
        "<": student_rank < required_rank,
    }
    return comparisons.get(operator)


def evaluate_minimum_degree(rule, student_data):
    """Evaluate one minimum_degree rule using both degree sources."""
    required_degree = rule.get("rule_value")
    required_rank = get_degree_rank(required_degree)
    operator = rule.get("operator") or ">="

    completed_degrees = collect_completed_degrees(student_data)

    # Common XAI fields
    result_base = {
        "rule_id": rule["id"],
        "rule_type": "minimum_degree",
        "mandatory": rule.get("mandatory", False),
        "student_value": None,
        "required_value": required_degree,
        "operator": operator,
        "comparison_value": None,
        "comparison_operator": None,
    }

    if required_rank is None:
        return {
            **result_base,
            "status": "unknown",
            "reason": f"Unsupported required degree: {required_degree}",
            "matched_degree_sources": [],
            "completed_degrees_considered": completed_degrees,
        }

    if not completed_degrees:
        return {
            **result_base,
            "status": "unknown",
            "reason": (
                "No recognized completed qualification was found in the "
                "student's structured degree records or profile completedDegrees."
            ),
            "matched_degree_sources": [],
            "completed_degrees_considered": [],
        }

    comparisons = [
        compare_degree_ranks(
            degree["rank"],
            required_rank,
            operator
        )
        for degree in completed_degrees
    ]

    if any(result is None for result in comparisons):
        status = "unknown"
        reason = f"Unsupported degree comparison operator: {operator}"
        matching_sources = []

    elif any(comparisons):
        status = "met"

        matching_sources = sorted({
            degree["source"]
            for degree, matched in zip(completed_degrees, comparisons)
            if matched
        })

        reason = (
            f"The student's completed qualification satisfies the "
            f"{operator} {required_degree} requirement. "
            f"Matching source(s): {', '.join(matching_sources)}."
        )

    else:
        status = "not_met"
        matching_sources = []

        reason = (
            f"The student's recognized completed qualifications do not "
            f"satisfy the {operator} {required_degree} requirement."
        )

    return {
        **result_base,
        "status": status,
        "reason": reason,
        "matched_degree_sources": matching_sources,
        "completed_degrees_considered": completed_degrees,
    }

def evaluate_academic_rules(student_data, rules):
    """Evaluate supported academic rules from loaded student data."""
    if not isinstance(student_data, dict):
        raise ValueError("student_data must be a dictionary.")
    if not isinstance(rules, list):
        raise ValueError("rules must be a list.")

    results = []
    for rule in rules:
        print("DEBUG RULE TYPE:", rule.get("rule_type"))

        if rule.get("rule_type") == "minimum_degree":
            results.append(evaluate_minimum_degree(rule, student_data))

        elif rule.get("rule_type") == "minimum_academic_percentage":
            print("MINIMUM ACADEMIC PERCENTAGE RULE FOUND!")
            result = evaluate_minimum_academic_percentage(rule, student_data)
            results.append(result)

    return results



def normalize_comparison_operator(operator):
    """Normalize comparison operators from different extraction formats."""

    aliases = {
        ">": ">",
        "greater_than": ">",
        "greater_th": ">",
        "greater_than_or_equal": ">=",
        "greater_than_or_equal_to": ">=",
        "greater_than_or_equal_": ">=",
        ">=": ">=",

        "<": "<",
        "less_than": "<",
        "less_than_": "<",
        "less_than_or_equal": "<=",
        "less_than_or_equal_to": "<=",
        "<=": "<=",

        "=": "=",
        "equal": "=",
        "equals": "=",
        "==": "=",

        "!=": "!=",
        "not_equal": "!=",
        "not_equals": "!=",
    }

    if operator is None:
        return None

    return aliases.get(str(operator).strip().lower())


def get_student_gpa(student_data):
    """Read GPA and scale from structured profile fields or profile JSON."""

    profile = student_data.get("profile") or {}

    gpa = profile.get("current_gpa")
    scale = profile.get("gpa_scale")

    # Fallback to additional_information JSON.
    additional_info = profile.get("additional_information") or {}

    if isinstance(additional_info, str):
        try:
            additional_info = json.loads(additional_info)
        except (TypeError, ValueError):
            additional_info = {}

    if isinstance(additional_info, dict):
        academic = additional_info.get("academic") or {}
        performance = academic.get("academicPerformance") or {}

        if gpa is None:
            gpa = performance.get("gpa")

        if scale is None:
            scale = performance.get("scale")

    try:
        if gpa is None or scale is None:
            return None, None

        gpa = float(gpa)
        scale = float(scale)

        if scale <= 0 or gpa < 0 or gpa > scale:
            return None, None

        return gpa, scale

    except (TypeError, ValueError):
        return None, None


def compare_numeric_values(student_value, required_value, operator):
    """Compare two numeric values using a normalized operator."""

    comparisons = {
        ">": student_value > required_value,
        ">=": student_value >= required_value,
        "<": student_value < required_value,
        "<=": student_value <= required_value,
        "=": student_value == required_value,
        "!=": student_value != required_value,
    }

    return comparisons.get(operator)

def evaluate_minimum_gpa(rule, student_data):
    """Evaluate GPA only when the scholarship GPA scale is verified."""

    gpa, student_scale = get_student_gpa(student_data)

    raw_operator = rule.get("operator")
    operator = normalize_comparison_operator(raw_operator)

    required_value = rule.get("rule_value")

    result_base = {
        "rule_id": rule.get("id"),
        "rule_type": "minimum_gpa",
        "mandatory": rule.get("mandatory", False),
        "student_value": gpa,
        "required_value": required_value,
        "operator": operator or raw_operator,
        "comparison_value": None,
        "comparison_operator": operator,
        "student_gpa_scale": student_scale,
        "required_gpa_scale": None,
    }

    if gpa is None or student_scale is None:
        return {
            **result_base,
            "status": "unknown",
            "reason": "Student GPA or GPA scale is missing or invalid.",
        }

    try:
        required_gpa = float(required_value)
    except (TypeError, ValueError):
        return {
            **result_base,
            "status": "unknown",
            "reason": "The scholarship's required GPA is invalid.",
        }

    if operator is None:
        return {
            **result_base,
            "status": "unknown",
            "reason": f"Unsupported GPA comparison operator: {raw_operator}",
        }

    # We cannot compare GPA values until the scholarship scale is verified.
    return {
        **result_base,
        "status": "unknown",
        "required_value": required_gpa,
        "reason": (
            f"Student GPA is {gpa:.2f}/{student_scale:.2f}, "
            f"but the scholarship's GPA scale has not been verified. "
            f"The requirement is {operator} {required_gpa:.2f}. "
            f"Scale verification is needed before comparison."
        ),
    }


def evaluate_minimum_academic_percentage(rule, student_data):
    """Evaluate a percentage requirement using a normalized GPA estimate."""

    gpa, scale = get_student_gpa(student_data)

    raw_operator = rule.get("operator")
    operator = normalize_comparison_operator(raw_operator)

    required_value = rule.get("rule_value")

    result_base = {
        "rule_id": rule.get("id"),
        "rule_type": "minimum_academic_percentage",
        "mandatory": rule.get("mandatory", False),
        "student_value": None,
        "required_value": required_value,
        "operator": operator or raw_operator,
        "comparison_value": None,
        "comparison_operator": operator,
    }

    if gpa is None or scale is None:
        return {
            **result_base,
            "status": "unknown",
            "reason": "Student GPA or GPA scale is missing or invalid.",
        }

    try:
        required_percentage = float(required_value)
        percentage = (gpa / scale) * 100

        if not 0 <= required_percentage <= 100:
            raise ValueError("Invalid percentage threshold.")

    except (TypeError, ValueError, ZeroDivisionError):
        return {
            **result_base,
            "status": "unknown",
            "reason": "Could not calculate the academic percentage.",
        }

    if operator is None:
        return {
            **result_base,
            "status": "unknown",
            "reason": f"Unsupported percentage operator: {raw_operator}",
        }

    passed = compare_numeric_values(
        percentage,
        required_percentage,
        operator,
    )

    status = "met" if passed else "not_met"

    return {
        **result_base,
        "status": status,
        "student_value": round(percentage, 2),
        "required_value": required_percentage,
        "comparison_value": required_percentage,
        "reason": (
            f"Estimated normalized academic percentage is "
            f"{percentage:.2f}% based on GPA {gpa:.2f}/{scale:.2f}. "
            f"The requirement is {operator} {required_percentage}%. "
            f"This is an estimate, not an official percentage conversion."
        ),
        "gpa": gpa,
        "gpa_scale": scale,
        "percentage_type": "estimated",
    }


def evaluate_academic_rules(student_data, rules):
    """Evaluate supported academic rules."""

    if not isinstance(student_data, dict):
        raise ValueError("student_data must be a dictionary.")

    if not isinstance(rules, list):
        raise ValueError("rules must be a list.")

    results = []

    evaluators = {
        "minimum_degree": evaluate_minimum_degree,
        "minimum_gpa": evaluate_minimum_gpa,
        "minimum_academic_percentage": evaluate_minimum_academic_percentage,
    }

    for rule in rules:
        rule_type = rule.get("rule_type")

        evaluator = evaluators.get(rule_type)

        if evaluator:
            results.append(evaluator(rule, student_data))

    return results


def evaluate_minimum_academic_percentage(rule, student_data):
    """Evaluate an academic percentage rule using the student's GPA."""

    profile = student_data.get("profile") or {}

    # Primary source: dedicated student_profiles columns.
    gpa = profile.get("current_gpa")
    scale = profile.get("gpa_scale")
    print(f"DEBUG: GPA from profile: {gpa}, scale: {scale}")

    # Fallback source: nested additional_information JSON.
    if gpa is None or scale is None:
        additional_info = profile.get("additional_information") or {}

        if isinstance(additional_info, str):
            try:
                additional_info = json.loads(additional_info)
            except (TypeError, ValueError):
                additional_info = {}

        if isinstance(additional_info, dict):
            academic_info = additional_info.get("academic") or {}
            academic_performance = (
                academic_info.get("academicPerformance") or {}
            )

            if gpa is None:
                gpa = academic_performance.get("gpa")

            if scale is None:
                scale = academic_performance.get("scale")

    operator = rule.get("operator") or ">="
    required_value = rule.get("rule_value")

    result_base = {
        "rule_id": rule.get("id"),
        "rule_type": rule.get("rule_type"),
        "mandatory": rule.get("mandatory", False),
        "student_value": None,
        "required_value": required_value,
        "operator": operator,
        "comparison_value": None,
        "comparison_operator": None,
    }

    if gpa is None or scale is None:
        return {
            **result_base,
            "status": "unknown",
            "reason": "Academic GPA or GPA scale is missing.",
        }

    try:
        gpa = float(gpa)
        scale = float(scale)
        required_percentage = float(required_value)

        if scale <= 0 or gpa < 0 or gpa > scale:
            raise ValueError("Invalid GPA or GPA scale.")

        percentage = (gpa / scale) * 100

    except (TypeError, ValueError, ZeroDivisionError):
        return {
            **result_base,
            "status": "unknown",
            "reason": "Could not calculate the academic percentage.",
        }

    comparisons = {
        ">": percentage > required_percentage,
        ">=": percentage >= required_percentage,
        "<": percentage < required_percentage,
        "<=": percentage <= required_percentage,
        "=": percentage == required_percentage,
        "!=": percentage != required_percentage,
    }

    passed = comparisons.get(operator)

    if passed is None:
        status = "unknown"
        reason = f"Unsupported operator: {operator}"

    elif passed:
        status = "met"
        reason = (
            f"Estimated academic percentage is {percentage:.2f}%, "
            f"which satisfies the requirement of "
            f"{operator} {required_percentage}%."
        )

    else:
        status = "not_met"
        reason = (
            f"Estimated academic percentage is {percentage:.2f}%, "
            f"which does not satisfy the requirement of "
            f"{operator} {required_percentage}%."
        )

    return {
        **result_base,
        "status": status,
        "student_value": round(percentage, 2),
        "reason": reason,
        "gpa": gpa,
        "gpa_scale": scale,
        "percentage_type": "estimated",
    }
