
import json
import pprint

from database.connection import get_db_connection

from matching.profile_loader import load_student_profile
from matching.program_selector import select_scholarship_program
from matching.rule_loader import load_scholarship_rules

from matching.academic_matcher import evaluate_academic_rules
from matching.eligibility_evaluator import (
    evaluate_eligibility_rules,
    resolve_study_language
)


def main():
    user_id = 17
    scholarship_id = 1

    # Step 1: Load student profile.
    student_data = load_student_profile(user_id)

    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        # Step 2: Automatically select the target program.
        selection = select_scholarship_program(
            cursor,
            student_data,
            scholarship_id
        )

        print("\n1. PROGRAM SELECTION")
        pprint.pp(selection)

        if selection["status"] != "selected":
            print("\nMatching stopped: no target program selected.")
            return

        # Step 3: Get selected program information.
        program = selection["program"]
        program_id = program["id"]

        # Step 4: Load general + selected program rules.
        rules = load_scholarship_rules(
            cursor,
            scholarship_id,
            program_id
        )

        print("\n2. LOADED RULES")
        print(f"Selected program ID: {program_id}")
        print(f"Total rules: {len(rules)}")

        # Step 5: Retrieve available study languages.
        program_languages = program.get("languages")

        if isinstance(program_languages, str):
            program_languages = json.loads(program_languages)

        if not isinstance(program_languages, list) or not program_languages:
            raise ValueError(
                "No valid study languages configured for this program."
            )

        print("\n3. AVAILABLE STUDY LANGUAGES")
        pprint.pp(program_languages)

        # Step 6: Resolve preferred study language.
        if len(program_languages) == 1:
            preferred_language = resolve_study_language(
                program_languages
            )

            print(
                f"\nOnly one language available. "
                f"Automatically selected: {preferred_language}"
            )

        else:
            print("\nChoose your preferred study language:")

            for index, language in enumerate(program_languages, start=1):
                print(f"{index}. {language}")

            choice = input("\nEnter language number: ").strip()

            if not choice.isdigit():
                raise ValueError("Please enter a valid language number.")

            choice = int(choice)

            if choice < 1 or choice > len(program_languages):
                raise ValueError("Invalid language selection.")

            preferred_language = resolve_study_language(
                program_languages,
                program_languages[choice - 1]
            )

            print(f"\nSelected study language: {preferred_language}")

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()

    # Step 7: Evaluate academic requirements.
    academic_results = evaluate_academic_rules(
        student_data,
        rules
    )

    print("\n4. ACADEMIC RESULTS")
    pprint.pp(academic_results)

    # Step 8: Evaluate other eligibility requirements.
    eligibility_results = evaluate_eligibility_rules(
        student_data,
        rules,
        program_languages=program_languages,
        preferred_study_language=preferred_language
    )

    print("\n5. ELIGIBILITY RESULTS")
    pprint.pp(eligibility_results)


if __name__ == "__main__":
    main()
