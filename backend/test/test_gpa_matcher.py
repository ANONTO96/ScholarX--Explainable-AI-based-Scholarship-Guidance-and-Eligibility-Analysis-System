
from matching.academic_matcher import evaluate_academic_rules


student_data = {
    "profile": {
        "current_gpa": 3.60,
        "gpa_scale": 4.00,
        "additional_information": {}
    }
}

test_rules = [
    {
        "id": 1,
        "rule_type": "minimum_gpa",
        "operator": "greater_th",
        "rule_value": "3.00",
        "mandatory": True
    },
    {
        "id": 2,
        "rule_type": "minimum_gpa",
        "operator": ">=",
        "rule_value": "3.80",
        "mandatory": True
    },
    {
        "id": 3,
        "rule_type": "minimum_academic_percentage",
        "operator": ">=",
        "rule_value": "85",
        "mandatory": True
    }
]

results = evaluate_academic_rules(student_data, test_rules)

for result in results:
    print("\n-----------------------------")
    print(result)
