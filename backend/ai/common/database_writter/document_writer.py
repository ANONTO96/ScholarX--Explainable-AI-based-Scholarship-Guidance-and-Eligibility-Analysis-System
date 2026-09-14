from database.queries.scholarship_queries import insert_scholarship_documents


def insert_documents(scholarship_id, documents):

    try:

        response = insert_scholarship_documents(
            scholarship_id,
            documents
        )

        return response

    except Exception as e:

        return {
            "status": 500,
            "error": str(e)
        }