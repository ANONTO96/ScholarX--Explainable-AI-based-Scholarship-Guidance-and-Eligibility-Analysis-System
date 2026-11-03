import re

PROGRAMS = [
    ("Undergraduate", r"\bundergraduate\b|\bbachelor(?:'s|’s)?\s+programs?\b"),
    ("Master", r"\bmaster(?:'s|’s)?(?:\s+or\s+doctoral)?\s+programs?\b|\bmaster(?:'s|’s)?\s+or\s+doctoral\s+program\b"),
    ("Doctoral", r"\bdoctoral\s+programs?\b|\bphd\s+programs?\b|\bmaster(?:'s|’s)?\s+or\s+doctoral\s+program\b"),
]


def program_name(text):
    """Return only explicitly mentioned target programs in current scope."""
    found = []
    for name, pattern in PROGRAMS:
        if re.search(pattern, text, re.IGNORECASE):
            found.append({"program": name})
    return found
