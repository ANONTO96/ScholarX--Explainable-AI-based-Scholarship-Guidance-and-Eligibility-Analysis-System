import re

PROGRAM_ALIASES = {
    "undergraduate": "Undergraduate",
    "bachelor": "Undergraduate",
    "bachelor's": "Undergraduate",
    "bachelor’s": "Undergraduate",
    "master": "Master",
    "master's": "Master",
    "master’s": "Master",
    "doctoral": "Doctoral",
    "doctorate": "Doctoral",
    "doctor": "Doctoral",
    "phd": "Doctoral",
}


def normalize_program(value: str):
    value = re.sub(r"^(?:a|an)\s+", "", value.strip().lower())
    return PROGRAM_ALIASES.get(value)


def extract_age(sentence):
    """Extract age caps tied to one of the three supported application levels."""
    results = []
    patterns = [
        re.compile(
            r"under\s+(?:the\s+)?age\s+of\s*(\d+)"
            r".*?when\s+applying\s+for\s+(?:a|an)\s+"
            r"([a-zA-Z’']+(?:\s+[a-zA-Z’']+)?)\s+programs?\b",
            re.IGNORECASE,
        ),
        re.compile(
            r"(?:applicants?|candidates?)\s+(?:must\s+be\s+)?under\s+(\d+)"
            r".*?\b(undergraduate|bachelor(?:'s|’s)?|master(?:'s|’s)?|doctoral|phd)\b",
            re.IGNORECASE,
        ),
    ]
    for pattern in patterns:
        for match in pattern.finditer(sentence):
            age, program_text = match.group(1), match.group(2)
            program = normalize_program(program_text)
            if program:
                rule = {
                    "rule_type": "age",
                    "operator": "<",
                    "rule_value": str(int(age)),
                    "program": program,
                    "category": "academic",
                    "mandatory": True,
                    "source_sentence": sentence,
                }
                if rule not in results:
                    results.append(rule)
    return results
