import re


def extract_gpa(sentence: str) -> list[dict]:
    """Extract only explicit numeric GPA thresholds; never invent a threshold."""
    patterns = (
        (r"\b(?:minimum\s+)?GPA\s*(?:of|:)?\s*(\d+(?:\.\d+)?)\s*(?:/\s*(\d+(?:\.\d+)?))?", ">="),
        (r"\bGPA\s*(>=|>|<=|<|=)\s*(\d+(?:\.\d+)?)", None),
    )

    for pattern, default_operator in patterns:
        match = re.search(pattern, sentence, re.IGNORECASE)
        if not match:
            continue

        if default_operator is None:
            operator, value = match.group(1), match.group(2)
        else:
            operator, value = default_operator, match.group(1)

        return [{
            "rule_type": "minimum_gpa",
            "operator": operator,
            "rule_value": value,
            "category": "academic",
            "mandatory": True,
            "source_sentence": sentence,
        }]
    return []
