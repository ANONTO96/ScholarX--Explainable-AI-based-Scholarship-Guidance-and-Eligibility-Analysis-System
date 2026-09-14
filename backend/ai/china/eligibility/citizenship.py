import re


def extract_citizenship(sentence):

    results = []

    pattern = r"citizen\s+of\s+a\s+country\s+other\s+than\s+the\s+PRC"

    if re.search(pattern, sentence, re.IGNORECASE):

        results.append({
            "rule_type": "citizenship",
            "operator": "=",
            "rule_value": "International",
            "mandatory": True
        })

    return results