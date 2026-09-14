from database.queries.scholarship_queries import (
    insert_scholarship_contacts
)


def insert_contact(scholarship_id, contacts):
    try:
        response = insert_scholarship_contacts(
            scholarship_id,
            contacts
        )

        return response

    except Exception as e:
        return {
            "status": 500,
            "error": str(e)
        }