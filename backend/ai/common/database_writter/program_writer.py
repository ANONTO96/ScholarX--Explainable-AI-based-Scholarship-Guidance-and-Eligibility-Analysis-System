from database.queries.scholarship_queries import insert_scholarship_programs


def insert_programs(scholarship_id, programs):

    try:

        response = insert_scholarship_programs(
            scholarship_id,
            programs
        )

        return response

    except Exception as e:

        return {
            "status": 500,
            "error": str(e)
        }