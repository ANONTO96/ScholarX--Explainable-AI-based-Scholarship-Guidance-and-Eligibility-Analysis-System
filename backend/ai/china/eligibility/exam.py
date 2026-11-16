import re

def extract_exam(sentence: str) -> list[dict]:
    results=[]
    if re.search(r"\bCSCA\b", sentence, re.IGNORECASE) and re.search(r"\bbachelor(?:'s|’s)?\s+programs?\b|\bundergraduate\b", sentence, re.IGNORECASE):
        results.append({"rule_type":"entrance_exam","operator":"=","rule_value":"CSCA","program":"Undergraduate",
                        "category":"academic","mandatory":True,"source_sentence":sentence})
    return results
