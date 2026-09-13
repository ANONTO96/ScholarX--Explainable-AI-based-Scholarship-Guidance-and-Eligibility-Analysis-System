import re


def extract_health(sentence):

    results = []

    pattern = r"good\s+health"

    if re.search(pattern, sentence, re.IGNORECASE):

        results.append({
            "rule_type": "health",
            "operator": "=",
            "rule_value": "Good",
            "mandatory": True
        })

    return results