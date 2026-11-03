
from pprint import pprint

from matching.profile_loader import load_student_profile


if __name__ == "__main__":
    user_id = 17  # Replace with an existing student user ID.

    try:
        student = load_student_profile(user_id)
        pprint(student, sort_dicts=False)

    except Exception as error:
        print("Profile loader test failed:")
        print(error)
