import re


def extract_exam(sentence):

    results = []

    if re.search(r"\bCSCA\b", sentence, re.IGNORECASE):

        results.append({
            "rule_type": "entrance_exam",
            "operator": "=",
            "rule_value": "CSCA",
            "mandatory": True
        })

    return results