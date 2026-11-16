from ai.china import eligibility
from database.queries.scholarship_queries import (
    insert_scholarship_eligibility
)


def insert_eligibility(scholarship_id, eligibility):

    try:

        print("SCHOLARSHIP ID:", scholarship_id)

        print(
            "SCHOLARSHIP RULES:",
            eligibility.get("scholarship_rules")
        )

        print(
            "GPA RULE:",
            [
                r for r in eligibility.get("scholarship_rules", [])
                if r.get("rule_type") == "minimum_gpa"
            ]
)
        response = insert_scholarship_eligibility(
            scholarship_id,
            eligibility
        )

        return response

    except Exception as e:

        return {
            "status": 500,
            "error": str(e)
        }