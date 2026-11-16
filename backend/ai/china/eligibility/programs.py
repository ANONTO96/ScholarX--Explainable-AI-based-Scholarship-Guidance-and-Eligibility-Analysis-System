import re

PROGRAM_PATTERNS = {
    "Undergraduate": r"\bundergraduate\b|\bbachelor(?:'s|’s)?\s+programs?\b|\bbachelor\s+programs?\b",
    "Master": r"\bmaster(?:'s|’s)?(?:\s+or)?\s+programs?\b|\bmaster\s+programs?\b",
    "Doctoral": r"\bdoctoral\s+programs?\b|\bphd\s+programs?\b|\bdoctorate\s+programs?\b",
}

def detect_programs(sentence: str) -> list[str]:
    return [name for name, pattern in PROGRAM_PATTERNS.items()
            if re.search(pattern, sentence, re.IGNORECASE)]
