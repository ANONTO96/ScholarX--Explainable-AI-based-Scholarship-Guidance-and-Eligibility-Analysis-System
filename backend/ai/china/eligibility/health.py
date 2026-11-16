import re

def extract_health(sentence: str) -> list[dict]:
    # Notebook value is "Good"; the matcher later checks for the health document.
    patterns = [r"\bin good health\b", r"\bgood\s+(?:physical\s+and\s+mental\s+)?health\b",
                r"\bhealth\s+status\s*[:=]?\s*good\b"]
    if any(re.search(pattern, sentence, re.IGNORECASE) for pattern in patterns):
        return [{"rule_type": "health", "operator": "=", "rule_value": "Good",
                 "category": "academic", "mandatory": True, "source_sentence": sentence}]
    return []
