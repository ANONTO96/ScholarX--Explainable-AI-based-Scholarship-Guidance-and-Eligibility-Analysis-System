import re
from .programs import detect_programs

PROGRAM_ALIASES = {
    "undergraduate":"Undergraduate", "bachelor":"Undergraduate", "bachelor's":"Undergraduate", "bachelor’s":"Undergraduate",
    "master":"Master", "master's":"Master", "master’s":"Master",
    "doctoral":"Doctoral", "doctorate":"Doctoral", "doctor":"Doctoral", "phd":"Doctoral",
}
def normalize_program(value: str):
    value = re.sub(r"^(?:a|an)\s+", "", value.strip().lower())
    return PROGRAM_ALIASES.get(value)

def extract_age(sentence: str) -> list[dict]:
    results=[]
    patterns=[
        (r"\bunder\s+(?:the\s+)?age\s+of\s*(\d+).*?\bwhen\s+applying\s+for\s+(?:a|an)\s+(undergraduate|bachelor(?:'s|’s)?|master(?:'s|’s)?|doctoral|doctorate|phd)\s+programs?\b", "<"),
        (r"\b(?:maximum\s+age|age\s+limit)\s*(?:of|:)?\s*(\d+).*?\b(undergraduate|bachelor(?:'s|’s)?|master(?:'s|’s)?|doctoral|doctorate|phd)\b", "<="),
        (r"\bapplicants?\s+(?:must\s+be\s+)?under\s+(\d+).*?\b(undergraduate|bachelor(?:'s|’s)?|master(?:'s|’s)?|doctoral|doctorate|phd)\b", "<"),
    ]
    for pattern, operator in patterns:
        for m in re.finditer(pattern, sentence, re.IGNORECASE):
            program=normalize_program(m.group(2))
            if program:
                item={"rule_type":"age","operator":operator,"rule_value":str(int(m.group(1))),
                      "program":program,"category":"academic","mandatory":True,"source_sentence":sentence}
                if item not in results: results.append(item)
    # A numeric age requirement without a clearly identified target program is deliberately not guessed.
    return results
