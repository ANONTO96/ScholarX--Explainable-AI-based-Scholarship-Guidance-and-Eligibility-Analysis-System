import re

PROGRAM_PATTERNS = [
    (r"\bundergraduate\b|\bbachelor(?:'s|’s)?\s+programs?\b|\bbachelor\s+programs?\b", "Undergraduate"),
    (r"\bmaster(?:'s|’s)?\s+programs?\b|\bmaster\s+programs?\b", "Master"),
    (r"\bdoctoral\s+programs?\b|\bphd\s+programs?\b", "Doctoral"),
]

QUALIFICATION_PATTERNS = [
    (r"\bhigh\s+school\s+(?:diploma|certificate)\b", "High School"),
    (r"\bbachelor(?:'s|’s)?\s+degree\b", "Bachelor"),
    (r"\bmaster(?:'s|’s)?\s+degree\b", "Master"),
]


def detect_target_program(sentence):
    for pattern, program in PROGRAM_PATTERNS:
        if re.search(pattern, sentence, re.IGNORECASE):
            return program
    return None


def extract_degree(sentence):
    program = detect_target_program(sentence)
    if not program:
        return []

    for pattern, qualification in QUALIFICATION_PATTERNS:
        if re.search(pattern, sentence, re.IGNORECASE):
            return [{
                "rule_type": "minimum_degree",
                "operator": ">=",
                "rule_value": qualification,
                "program": program,
                "category": "academic",
                "mandatory": True,
                "source_sentence": sentence,
            }]
    return []
