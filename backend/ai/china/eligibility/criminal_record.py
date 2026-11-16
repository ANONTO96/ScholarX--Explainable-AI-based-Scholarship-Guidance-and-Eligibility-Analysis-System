import re


# A required Police Clearance / Non-Criminal Record certificate is treated as
# evidence of the eligibility condition "criminal_record = Clean".
# This extractor is intentionally called on Application Documents text only.
PATTERNS = (
    r"\bnon[-\s]?criminal\s+record\b",
    r"\bcertificate\s+of\s+(?:good\s+conduct|non[-\s]?criminal\s+record)\b",
    r"\bpolice\s+clearance(?:\s+certificate)?\b",
    r"\bno\s+(?:previous\s+)?criminal\s+record\b",
    r"\bclean\s+criminal\s+record\b",
    r"\bfree\s+of\s+criminal\s+records?\b",
)


def extract_criminal_record(sentence: str) -> list[dict]:
    if not sentence or not any(
        re.search(pattern, sentence, re.IGNORECASE) for pattern in PATTERNS
    ):
        return []

    return [{
        "rule_type": "criminal_record",
        "operator": "=",
        "rule_value": "Clean",
        "category": "academic",
        "mandatory": True,
        "source_sentence": sentence,
    }]
