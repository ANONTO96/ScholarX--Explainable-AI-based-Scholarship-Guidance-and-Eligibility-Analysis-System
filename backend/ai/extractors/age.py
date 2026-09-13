import re


def extract_age(sentence):

    facts = []

    pattern = r"under\s+(?:the\s+)?age\s+of\s+(\d+)"

    match = re.search(
        pattern,
        sentence,
        re.IGNORECASE
    )

    if not match:
        return facts

    age = int(match.group(1))

    program = None

    text = sentence.lower()

    if "undergraduate" in text or "bachelor" in text:
        program = "undergraduate"

    elif "master" in text:
        program = "master"

    elif "doctoral" in text or "phd" in text:
        program = "phd"

    elif "general scholar" in text:
        program = "general"

    elif "senior scholar" in text:
        program = "senior"

    facts.append(
        {
            "type": "age_limit",
            "program": program,
            "max_age": age
        }
    )

    return facts