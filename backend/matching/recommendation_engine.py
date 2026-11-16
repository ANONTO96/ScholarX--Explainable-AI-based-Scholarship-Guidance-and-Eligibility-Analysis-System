def generate_recommendations(rule_results):
    """
    Generate explainable recommendations for scholarship rules.

    Supported statuses:
    - not_met: The student does not satisfy the requirement.
    - unknown: The system does not have enough information.

    Unknown requirements are not treated as failures.
    """

    recommendations = []

    for rule in rule_results:
        status = rule.get("status")

        if status not in ("not_met", "unknown"):
            continue

        rule_type = rule.get("rule_type", "general")

        recommendation = {
            "rule_id": rule.get("rule_id"),
            "rule_type": rule_type,
            "status": status,
            "mandatory": rule.get("mandatory", False),
            "requirement": rule.get("required_value"),
            "student_value": rule.get("student_value"),
            "reason": rule.get("reason"),
            "suggestion": get_improvement_suggestion(
                rule_type,
                status,
                rule
            )
        }

        recommendations.append(recommendation)

    return recommendations


def get_improvement_suggestion(rule_type, status, rule=None):
    """
    Generate recommendations based on the rule type and evaluation status.
    """

    rule = rule or {}

    if status == "unknown":

        unknown_suggestions = {
            "age": (
                "Your age information is unavailable. "
                "Add your date of birth or age to your student profile "
                "so the system can evaluate this requirement."
            ),

            "health": (
                "Your health-certificate checklist status is unavailable. "
                "Add the health certificate to your document checklist and "
                "mark whether it is available."
            ),

            "criminal_record": (
                "Your police-clearance document status is unavailable. "
                "Add the Police Clearance Certificate (PCC) to your document "
                "checklist and mark whether it is available."
            ),

            "criminal_record_certificate": (
                "Your police-clearance document status is unavailable. "
                "Update the PCC document checklist availability."
            ),

            "police_clearance": (
                "Your police-clearance document status is unavailable. "
                "Update the PCC document checklist availability."
            ),

            "entrance_exam": (
                "Your entrance examination information is unavailable. "
                "Update your exam status or result in your profile and "
                "verify the required examination."
            ),

            "language_proficiency": (
                "Your language proficiency information is incomplete. "
                "Add your language test details and scores so the system "
                "can evaluate this requirement."
            ),

            "minimum_gpa": (
                "Your academic performance information is unavailable "
                "or incomplete. Update your academic records so the "
                "system can evaluate this requirement."
            ),

            "minimum_academic_percentage": (
                "Your academic percentage information is unavailable. "
                "Update your academic records so the system can "
                "evaluate this requirement."
            )
        }

        return unknown_suggestions.get(
            rule_type,
            "The system cannot verify this requirement with the "
            "available profile information. Update your profile "
            "or verify the requirement manually."
        )

    if status == "not_met":

        improvement_suggestions = {
            "maximum_age": (
                "Age requirements generally cannot be changed. "
                "Consider scholarships with a higher age limit."
            ),

            "minimum_age": (
                "Check whether you meet the minimum age requirement "
                "or explore programs with different age criteria."
            ),

            "minimum_academic_percentage": (
                "Improve your academic performance in future semesters "
                "if possible. You can also explore scholarships with "
                "lower academic requirements."
            ),

            "minimum_gpa": (
                "Work on improving your GPA where possible and consider "
                "scholarships with more flexible academic requirements."
            ),

            "language_proficiency": (
                "Prepare for the required language proficiency test "
                "and work toward achieving the required score."
            ),

            "entrance_exam": (
                "Prepare for the required entrance examination and "
                "check its examination schedule."
            ),

            "nationality": (
                "Look for scholarships whose nationality requirements "
                "match your citizenship."
            ),

            "citizenship": (
                "Explore scholarships that accept applicants from "
                "your country."
            ),

            "health": (
                "Obtain the required health certificate and mark it as "
                "available in your student document checklist."
            ),

            "criminal_record": (
                "Obtain your Police Clearance Certificate (PCC) and mark it "
                "as available in your student document checklist."
            ),

            "criminal_record_certificate": (
                "Obtain the required police-clearance certificate and mark "
                "it as available in your document checklist."
            ),

            "police_clearance": (
                "Obtain the required police-clearance certificate and mark "
                "it as available in your document checklist."
            )
        }

        return improvement_suggestions.get(
            rule_type,
            "Review this scholarship requirement and check whether "
            "you can satisfy it through an alternative approach."
        )

    return "Review the scholarship requirement for more information."