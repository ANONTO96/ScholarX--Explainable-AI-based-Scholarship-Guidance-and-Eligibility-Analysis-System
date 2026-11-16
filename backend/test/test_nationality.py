from matching.eligibility_evaluator import evaluate_citizenship

rule = {
    "id": 95,
    "rule_type": "nationality",
    "mandatory": True,
    "operator": "=",
    "rule_value": "Non-Turkish citizen"
}

test_cases = [
    ("Bangladesh", "Turkiye", "met"),
    ("Turkiye", "Turkiye", "not_met"),
    ("China", "Turkiye", "met"),
    ("Japan", "Japan", "met"),  # Non-Turkish applicants satisfy this descriptor
]

for nationality, scholarship_country, expected in test_cases:
    profile = {"nationality": nationality}

    result = evaluate_citizenship(
        rule,
        profile,
        scholarship_country
    )

    print(
        nationality,
        scholarship_country,
        "=>",
        result["status"],
        "| Expected:",
        expected
    )