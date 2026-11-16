import re
from .programs import detect_programs
SUPPORTED_PROGRAMS=["Undergraduate","Master","Doctoral"]

def _language_programs(sentence: str) -> list[str]:
    found=detect_programs(sentence)
    # In language clauses, the level can be singular: "master's or doctoral program".
    if re.search(r"\bmaster(?:'s|’s)?\b", sentence, re.IGNORECASE) and "Master" not in found:
        found.append("Master")
    if re.search(r"\b(?:doctoral|phd)\b", sentence, re.IGNORECASE) and "Doctoral" not in found:
        found.append("Doctoral")
    if re.search(r"\b(?:undergraduate|bachelor(?:'s|’s)?)\b", sentence, re.IGNORECASE) and "Undergraduate" not in found:
        found.append("Undergraduate")
    return [p for p in SUPPORTED_PROGRAMS if p in found]

def extract_language(sentence: str) -> list[dict]:
    results=[]
    hsk=re.search(r"\bHSK\s*(?:\(\s*Level\s*(\d+)\s*\)|Level\s*(\d+))", sentence, re.IGNORECASE)
    is_chinese_taught=bool(re.search(r"Chinese\s*[- ]?taught", sentence, re.IGNORECASE))
    if hsk and is_chinese_taught:
        level=int(hsk.group(1) or hsk.group(2))
        for program in _language_programs(sentence):
            results.append({"rule_type":"language_proficiency","operator":"=","rule_value":f"HSK {level}",
                            "program":program,"category":"language","study_language":"Chinese","mandatory":True,
                            "condition":{"field":"study_language","operator":"=","value":"Chinese"},
                            "source_sentence":sentence})
        return results
    if re.search(r"program\s+taught\s+in\s+a\s+language\s+other\s+than\s+Chinese", sentence, re.IGNORECASE):
        programs=_language_programs(sentence)
        targets=programs or SUPPORTED_PROGRAMS.copy()
        for program in targets:
            results.append({"rule_type":"language_proficiency","operator":"=","rule_value":"University admission requirements",
                            "program":program,"category":"language","study_language":"Non-Chinese","mandatory":True,
                            "condition":{"field":"study_language","operator":"!=","value":"Chinese"},
                            "source_sentence":sentence})
    return results
