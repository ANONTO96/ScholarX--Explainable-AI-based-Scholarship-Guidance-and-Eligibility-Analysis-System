import re


def extract_language(sentence):

    facts = []

    hsk = re.search(
        r"HSK\s*\(?Level\s*(\d)\)?",
        sentence,
        re.IGNORECASE
    )

    if hsk:

        facts.append(

            {
                "type": "language_exam",
                "exam": "HSK",
                "level": int(hsk.group(1))
            }

        )

    ielts = re.search(
        r"IELTS.*?(\d+(?:\.\d+)?)",
        sentence,
        re.IGNORECASE
    )

    if ielts:

        facts.append(

            {
                "type": "language_exam",
                "exam": "IELTS",
                "score": float(ielts.group(1))
            }

        )

    toefl = re.search(
        r"TOEFL.*?(\d+)",
        sentence,
        re.IGNORECASE
    )

    if toefl:

        facts.append(

            {
                "type": "language_exam",
                "exam": "TOEFL",
                "score": int(toefl.group(1))
            }

        )

    return facts