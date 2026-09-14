import re


def extract_experience(sentence):

    facts = []

    match = re.search(
        r"(\d+)\s+years?.*experience",
        sentence,
        re.IGNORECASE
    )

    if match:

        facts.append(

            {
                "type": "experience",
                "years": int(match.group(1))
            }

        )

    return facts