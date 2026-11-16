import re

# Keep the database rule_type as "citizenship". These are source-text aliases.
INTERNATIONAL_PATTERNS = [
    r"\bcitizen\s+of\s+a\s+country\s+other\s+than\s+(?:the\s+)?PRC\b",
    r"\bnot\s+a\s+citizen\s+of\s+(?:the\s+)?PRC\b",
    r"\bnon[-\s]?Chinese\s+citizen\b",
    r"\binternational\s+students?\b",
    r"\bforeign(?:er|\s+nationals?)\b",
]

def extract_citizenship(sentence: str) -> list[dict]:
    if any(re.search(p, sentence, re.IGNORECASE) for p in INTERNATIONAL_PATTERNS):
        return [{"rule_type":"citizenship", "operator":"=", "rule_value":"International",
                 "category":"academic", "mandatory":True, "source_sentence":sentence}]
    return []
