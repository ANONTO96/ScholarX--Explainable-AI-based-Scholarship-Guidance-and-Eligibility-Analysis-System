"""Three-level ScholarX matching score calculation.

Every applicable requirement is worth exactly 3 points:
- met: 3 points
- not_met: 0 points
- unknown: 0 points
- not_applicable: excluded from the level denominator

Each level is expressed as a percentage. The overall matchmaking score is
the arithmetic average of Level 1, Level 2 and Level 3 percentages.
"""

import math

MATCH_POINTS_PER_REQUIREMENT = 3


def _round_score(value):
    """Round a non-negative score consistently with JavaScript Math.round."""
    return math.floor(float(value) + 0.5)


def calculate_rule_points(results):
    """Calculate Level 3 points from evaluated scholarship eligibility rules."""
    applicable = [
        rule for rule in (results or [])
        if isinstance(rule, dict)
        and rule.get("status") in {"met", "not_met", "unknown"}
    ]

    met_count = sum(1 for rule in applicable if rule.get("status") == "met")
    total_count = len(applicable)
    points_earned = met_count * MATCH_POINTS_PER_REQUIREMENT
    points_possible = total_count * MATCH_POINTS_PER_REQUIREMENT
    percentage = (
        points_earned / points_possible * 100
        if points_possible
        else 0.0
    )

    return {
        "score": _round_score(percentage),
        "percentage": round(percentage, 2),
        "points_earned": points_earned,
        "points_possible": points_possible,
        "points_per_requirement": MATCH_POINTS_PER_REQUIREMENT,
        "total_rules": len(results or []),
        "evaluated_rules": total_count,
        "met_rules": met_count,
        "not_met_rules": sum(
            1 for rule in applicable if rule.get("status") == "not_met"
        ),
        "unknown_rules": sum(
            1 for rule in applicable if rule.get("status") == "unknown"
        ),
        "not_applicable_rules": sum(
            1 for rule in (results or [])
            if isinstance(rule, dict) and rule.get("status") == "not_applicable"
        ),
    }


def calculate_eligibility_score(results):
    """Backward-compatible public name for Level 3's 3-point rule score."""
    return calculate_rule_points(results)


def _level_percentage(result, percentage_keys=("percentage", "matching_percentage")):
    if not isinstance(result, dict):
        return 0.0

    for key in percentage_keys:
        value = result.get(key)
        if value is not None:
            try:
                number = float(value)
                if math.isfinite(number):
                    return max(0.0, min(100.0, number))
            except (TypeError, ValueError):
                pass

    # Legacy fallback: score/max score.
    maximum = result.get("maximum_score")
    score = result.get("score")
    try:
        maximum = float(maximum)
        score = float(score)
        if maximum > 0:
            return max(0.0, min(100.0, score / maximum * 100))
    except (TypeError, ValueError):
        pass
    return 0.0


def calculate_overall_matching_score(
    document_matching,
    language_proficiency_matching,
    eligibility_score,
):
    """Average all three level percentages; an empty level contributes 0."""
    level_scores = {
        "level_1_document_matching": round(
            _level_percentage(document_matching), 2
        ),
        "level_2_language_proficiency": round(
            _level_percentage(language_proficiency_matching), 2
        ),
        "level_3_eligibility_matching": round(
            _level_percentage(eligibility_score), 2
        ),
    }

    overall = sum(level_scores.values()) / 3

    return {
        "score": _round_score(overall),
        "percentage": round(overall, 2),
        "level_scores": level_scores,
        "levels_included": list(level_scores.keys()),
        "levels_excluded": [],
        "weighting": "equal",
        "formula": "(Level 1 + Level 2 + Level 3) / 3",
    }
