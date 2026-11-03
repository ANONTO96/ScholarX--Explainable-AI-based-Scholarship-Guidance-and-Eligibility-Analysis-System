import re


def extract_citizenship(sentence):
    patterns = [
        r"\bcitizen\s+of\s+a\s+country\s+other\s+than\s+the\s+PRC\b",
        r"\bnot\s+a\s+citizen\s+of\s+the\s+PRC\b",
        r"\bnon[-\s]?Chinese\s+citizen\b",
    ]
    if any(re.search(pattern, sentence, re.IGNORECASE) for pattern in patterns):
        return [{
            "rule_type": "citizenship", "operator": "=", "rule_value": "International",
            "category": "academic", "mandatory": True, "source_sentence": sentence,
        }]
    return []
