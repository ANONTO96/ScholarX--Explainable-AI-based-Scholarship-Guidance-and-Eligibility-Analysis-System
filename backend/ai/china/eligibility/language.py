import re

SUPPORTED_PROGRAMS = ["Undergraduate", "Master", "Doctoral"]


def _programs_in_sentence(sentence):
    patterns = {
        "Undergraduate": r"\bundergraduate\b|\bbachelor(?:'s|’s)?\b",
        "Master": r"\bmaster(?:'s|’s)?\b",
        "Doctoral": r"\bdoctoral\b|\bphd\b",
    }

    return [
        name
        for name, pattern in patterns.items()
        if re.search(pattern, sentence, re.IGNORECASE)
    ]


def extract_language(sentence):
    results = []

    # Chinese-taught HSK requirements.
    hsk = re.search(
        r"\bHSK\s*\(\s*Level\s*(\d+)\s*\)",
        sentence,
        re.IGNORECASE,
    )

    if hsk and re.search(
        r"Chinese\s*[- ]?taught",
        sentence,
        re.IGNORECASE,
    ):
        programs = _programs_in_sentence(sentence)

        for program in programs:
            if program not in SUPPORTED_PROGRAMS:
                continue

            results.append({
                "rule_type": "language_proficiency",
                "operator": "=",
                "rule_value": f"HSK {int(hsk.group(1))}",
                "programs": [program],
                "category": "language",
                "study_language": "Chinese",
                "mandatory": True,
                "condition": {
                    "field": "study_language",
                    "operator": "=",
                    "value": "Chinese",
                },
                "source_sentence": sentence,
            })

        return results

    # Non-Chinese-taught programs:
    # University-specific language admission requirements.
    if re.search(
        r"program\s+taught\s+in\s+a\s+language\s+other\s+than\s+Chinese",
        sentence,
        re.IGNORECASE,
    ):
        results.append({
            "rule_type": "language_proficiency",
            "operator": "=",
            "rule_value": "University admission requirements",
            "programs": SUPPORTED_PROGRAMS.copy(),
            "category": "language",
            "study_language": "Non-Chinese",
            "mandatory": True,
            "condition": {
                "field": "study_language",
                "operator": "!=",
                "value": "Chinese",
            },
            "source_sentence": sentence,
        })

    return results