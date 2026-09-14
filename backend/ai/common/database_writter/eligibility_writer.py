from database.queries.scholarship_queries import (
    insert_scholarship_eligibility
)


def insert_eligibility(scholarship_id, eligibility):

    try:

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