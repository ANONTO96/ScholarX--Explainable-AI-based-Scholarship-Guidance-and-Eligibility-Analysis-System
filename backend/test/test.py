from matching.eligibility_evaluator import evaluate_citizenship

# Test cases based on our existing scholarship rules
test_cases = [
    {
        "name": "International student - Bangladesh to China",
        "rule_value": "International",
        "nationality": "Bangladesh",
        "host_country": "China",
        "expected": "met",
    },
    {
        "name": "Non-PRC - Bangladesh to China",
        "rule_value": "Non-PRC",
        "nationality": "Bangladesh",
        "host_country": "China",
        "expected": "met",
    },
    {
        "name": "Non-Turkish citizen - Bangladesh to Turkiye",
        "rule_value": "Non-Turkish citizen",
        "nationality": "Bangladesh",
        "host_country": "Turkiye",
        "expected": "met",
    },
    {
        "name": "Non-Turkish citizen - Turkish applicant",
        "rule_value": "Non-Turkish citizen",
        "nationality": "Turkey",
        "host_country": "Turkiye",
        "expected": "not_met",
    },
    {
        "name": "Specific Chinese citizenship",
        "rule_value": "China",
        "nationality": "China",
        "host_country": "China",
        "expected": "met",
    },
    {
        "name": "Specific Chinese citizenship - Bangladesh applicant",
        "rule_value": "China",
        "nationality": "Bangladesh",
        "host_country": "China",
        "expected": "not_met",
    },
]

for case in test_cases:
    rule = {
        "id": 1,
        "rule_type": "citizenship",
        "rule_value": case["rule_value"],
        "operator": "=",
        "mandatory": True,
    }

    profile = {"nationality": case["nationality"]}

    result = evaluate_citizenship(
        rule,
        profile,
        case["host_country"],
    )

    status = result["status"]
    passed = status == case["expected"]

    print(f"\nTest: {case['name']}")
    print(f"Expected: {case['expected']}")
    print(f"Actual:   {status}")
    print(f"Result:   {'PASS' if passed else 'FAIL'}")
    print(f"Reason:   {result['reason']}")