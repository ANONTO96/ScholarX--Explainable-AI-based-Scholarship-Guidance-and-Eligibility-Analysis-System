import re


def extract_health(sentence):

    facts = []

    if re.search(
        r"good health|healthy",
        sentence,
        re.IGNORECASE
    ):

        facts.append(

            {
                "type": "health",
                "value": "Good"
            }

        )

    return facts