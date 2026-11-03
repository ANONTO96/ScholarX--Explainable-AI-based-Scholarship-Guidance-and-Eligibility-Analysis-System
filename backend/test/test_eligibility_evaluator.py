
from database.connection import get_db_connection

from matching.profile_loader import load_student_profile
from matching.rule_loader import load_scholarship_rules
from matching.eligibility_evaluator import evaluate_eligibility_rules

import pprint


def main():
    user_id = 17
    scholarship_id = 1
    program_id = 1

    student_data = load_student_profile(user_id)

    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        rules = load_scholarship_rules(
            cursor,
            scholarship_id,
            program_id
        )

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()

    results = evaluate_eligibility_rules(
        student_data=student_data,
        rules=rules,
        program_context={
            "study_language": "Chinese"
        }
    )

    print("\nEligibility evaluation results:")
    pprint.pp(results)


if __name__ == "__main__":
    main()
