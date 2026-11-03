
from database.connection import get_db_connection
from matching.profile_loader import load_student_profile
from matching.program_selector import select_scholarship_program

import pprint


def main():
    user_id = 17
    scholarship_id = 1

    student_data = load_student_profile(user_id)

    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        result = select_scholarship_program(
            cursor=cursor,
            student_data=student_data,
            scholarship_id=scholarship_id,
        )

        print("\nProgram selection result:")
        pprint.pp(result)

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()


if __name__ == "__main__":
    main()
