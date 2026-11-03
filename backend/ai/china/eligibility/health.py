import re


def extract_health(sentence):
    if re.search(r"\bgood\s+health\b", sentence, re.IGNORECASE):
        return [{
            "rule_type": "health", "operator": "=", "rule_value": "Good",
            "category": "academic", "mandatory": True, "source_sentence": sentence,
        }]
    return []
