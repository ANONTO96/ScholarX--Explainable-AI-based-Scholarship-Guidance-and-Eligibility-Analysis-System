import re


def extract_degree(sentence):

    results = []

    sentence_lower = sentence.lower()

    if "high school diploma" in sentence_lower:
        results.append({
            "rule_type": "minimum_degree",
            "operator": ">=",
            "rule_value": "High School",
            "mandatory": True
        })

    elif "bachelor" in sentence_lower:
        results.append({
            "rule_type": "minimum_degree",
            "operator": ">=",
            "rule_value": "Bachelor",
            "mandatory": True
        })

    elif "master" in sentence_lower:
        results.append({
            "rule_type": "minimum_degree",
            "operator": ">=",
            "rule_value": "Master",
            "mandatory": True
        })

    return results