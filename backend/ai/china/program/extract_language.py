import re

def extract_languages(text):

    languages = ["English"]   # Always include English

    if re.search(r"chinese", text, re.I):
        languages.append("Chinese")

    return languages