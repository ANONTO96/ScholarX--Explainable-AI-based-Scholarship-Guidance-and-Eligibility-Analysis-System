import re


def extract_language(sentence):

    results = []

    match = re.search(
        r"HSK\s*\(\s*Level\s*(\d+)\s*\)",
        sentence,
        re.IGNORECASE
    )

    if match:

        results.append({
            "rule_type": "language_exam",
            "operator": ">=",
            "rule_value": f"HSK {match.group(1)}",
            "mandatory": True
        })

    return results