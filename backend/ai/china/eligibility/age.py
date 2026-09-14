import re


def extract_age(sentence):
    """
    Extract age limits and associate them with the program.

    Example:
        under the age of 35 when applying for a Master's program

    Returns:
        [
            {
                "rule_type": "age",
                "operator": "<",
                "rule_value": "35",
                "mandatory": True
            }
        ]
    """

    results = []

    pattern = re.compile(
        r"under\s+(?:the\s+)?age\s+of\s+(\d+)"
        r".*?"
        r"when\s+applying\s+for\s+(?:a|an)\s+(.+?)\s+program",
        re.IGNORECASE
    )

    match = pattern.search(sentence)

    if match:
        age = match.group(1)

        results.append({
            "rule_type": "age",
            "operator": "<",
            "rule_value": age,
            "mandatory": True
        })

    return results