from database.queries.scholarship_queries import (
    insert_scholarship_coverage
)


def insert_coverage(scholarship_id, coverage):

    try:

        response = insert_scholarship_coverage(
            scholarship_id,
            coverage
        )

        return response

    except Exception as e:

        return {
            "status": 500,
            "error": str(e)
        }