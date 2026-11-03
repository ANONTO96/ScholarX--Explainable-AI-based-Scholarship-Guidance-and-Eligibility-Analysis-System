from database.connection import get_db_connection
from services.student_profile_service import load_student_data


def load_student_profile(user_id: int) -> dict:
    """
    Compatibility wrapper for the shared student profile service.

    The matching engine can continue calling:
        load_student_profile(user_id)

    All database queries and normalization are handled by
    services.student_profile_service.
    """

    if not isinstance(user_id, int) or user_id <= 0:
        raise ValueError(
            "A valid positive user_id is required."
        )

    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        return load_student_data(
            cursor,
            user_id
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()