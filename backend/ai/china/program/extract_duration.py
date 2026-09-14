import re

def extract_duration(text):

    durations = {}

    patterns = [
        ("Undergraduate", r"undergraduate.*?(\d+[-–]\d+\s*years?)"),
        ("Master", r"master.*?(\d+[-–]\d+\s*years?)"),
        ("Doctoral", r"doctoral.*?(\d+[-–]\d+\s*years?)"),
    ]

    for program, pattern in patterns:

        match = re.search(pattern, text, re.I)

        if match:
            durations[program] = match.group(1)

    return durations