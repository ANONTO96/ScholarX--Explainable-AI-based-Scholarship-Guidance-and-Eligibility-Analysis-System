
import math


REQUIREMENT_WEIGHTS = {
    "nationality": 10,
    "internationalStudent": 7,
    "studyLevel": 10,
    "fieldOfStudy": 10,
    "academicPerformance": 12,
    "english": 10,
    "age": 5,
    "workExperience": 5,
    "studyDestination": 7,
    "achievements": 5,
    "leadership": 4,
    "communityService": 3,
    "researchExperience": 5,
    "isStudent": 6,
    "partnerUniversity": 4,
    "gdsc": 3,
    "innovationProject": 4,
    "universityTeam": 3,
    "admission": 2,
    "annualBudget": 7,
}


RULE_WEIGHT_MAPPING = {
    "citizenship": "internationalStudent",
    "nationality": "nationality",
    "age": "age",
    "maximum_age": "age",
    "minimum_age": "age",
    "minimum_degree": "studyLevel",
    "minimum_academic_percentage": "academicPerformance",
    "language_proficiency": "english",
    "health": "admission",
    "entrance_exam": "admission",
    "work_experience": "workExperience",
    "leadership": "leadership",
    "community_service": "communityService",
    "research_experience": "researchExperience",
    "student_status": "isStudent",
    "partner_university": "partnerUniversity",
    "gdsc": "gdsc",
    "innovation_project": "innovationProject",
    "university_team": "universityTeam",
    "study_destination": "studyDestination",
    "annual_budget": "annualBudget",
    "achievement": "achievements",
}


def get_rule_weight(rule):
    rule_type = (
        rule.get("rule_type") or ""
    ).strip().lower()

    weight_key = RULE_WEIGHT_MAPPING.get(rule_type)

    if weight_key:
        return REQUIREMENT_WEIGHTS[weight_key]

    return 3


def is_mandatory_requirement(rule):
    """
    Match the frontend isMandatoryRequirement() logic.
    """

    if not isinstance(rule, dict):
        return False

    if rule.get("mandatory") is True:
        return True

    if rule.get("mandatory") is False:
        return False

    if rule.get("preferred") is True:
        return False

    if rule.get("required") is False:
        return False

    if rule.get("required") is True:
        return True

    return False


def js_round(value):
    """
    Reproduce JavaScript Math.round() for non-negative scores.
    """

    return math.floor(value + 0.5)


def calculate_category_score(rules):
    total_weight = 0
    earned_weight = 0

    counts = {
        "pass": 0,
        "review": 0,
        "fail": 0,
    }

    for rule in rules:
        status = rule.get("status")

        if status == "met":
            normalized_status = "pass"

        elif status == "unknown":
            normalized_status = "review"

        elif status == "not_met":
            normalized_status = "fail"

        else:
            continue

        weight = get_rule_weight(rule)

        if weight <= 0:
            continue

        counts[normalized_status] += 1
        total_weight += weight

        if normalized_status == "pass":
            earned_weight += weight

        elif normalized_status == "review":
            earned_weight += weight * 0.5

    score = (
        earned_weight / total_weight * 100
        if total_weight > 0
        else None
    )

    return {
        "score": score,
        "total_weight": total_weight,
        "earned_weight": earned_weight,
        "total_rules": sum(counts.values()),
        "passed_rules": counts["pass"],
        "review_rules": counts["review"],
        "failed_rules": counts["fail"],
    }


def calculate_eligibility_score(results):
    mandatory_rules = []
    preferred_rules = []

    for rule in results:
        status = rule.get("status")

        if status == "not_applicable":
            continue

        if status not in ("met", "unknown", "not_met"):
            continue

        if is_mandatory_requirement(rule):
            mandatory_rules.append(rule)
        else:
            preferred_rules.append(rule)

    mandatory = calculate_category_score(
        mandatory_rules
    )

    preferred = calculate_category_score(
        preferred_rules
    )

    if (
        mandatory["total_weight"] > 0
        and preferred["total_weight"] > 0
    ):
        final_score = (
            mandatory["score"] * 0.70
            + preferred["score"] * 0.30
        )

    elif mandatory["total_weight"] > 0:
        final_score = mandatory["score"]

    elif preferred["total_weight"] > 0:
        final_score = preferred["score"]

    else:
        final_score = None

    return {
        "score": (
            js_round(final_score)
            if final_score is not None
            else None
        ),
        "total_rules": len(results),
        "evaluated_rules": (
            mandatory["total_rules"]
            + preferred["total_rules"]
        ),
        "met_rules": (
            mandatory["passed_rules"]
            + preferred["passed_rules"]
        ),
        "not_met_rules": (
            mandatory["failed_rules"]
            + preferred["failed_rules"]
        ),
        "unknown_rules": (
            mandatory["review_rules"]
            + preferred["review_rules"]
        ),
        "not_applicable_rules": sum(
            1
            for rule in results
            if rule.get("status") == "not_applicable"
        ),
        "mandatory": mandatory,
        "preferred": preferred,
    }
