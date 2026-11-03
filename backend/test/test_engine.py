import pprint

from matching.engine import analyze_scholarship


def main():
    user_id = 2
    scholarship_id = 1

    engine_result = analyze_scholarship(
        user_id=user_id,
        scholarship_id=scholarship_id,
        preferred_study_language="English",
    )

    print("\n========== ENGINE RESULT KEYS ==========")
    print(engine_result.keys())

    print("\n========== ALL RULE RESULTS ==========")

    all_rule_results = (
        engine_result.get("academic_results", [])
        + engine_result.get("eligibility_results", [])
    )

    for rule_result in all_rule_results:
        pprint.pp(rule_result)

    print("\n========== ELIGIBILITY SCORE ==========")
    pprint.pp(engine_result.get("eligibility_score"))

    print("\n========== FULL ENGINE RESULT ==========")
    pprint.pp(engine_result)


if __name__ == "__main__":
    main()