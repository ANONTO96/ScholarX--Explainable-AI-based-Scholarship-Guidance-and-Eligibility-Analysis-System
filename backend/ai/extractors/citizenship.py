import re


def extract_citizenship(sentence):

    facts = []

    if re.search(
        r"country other than the prc|non[- ]?prc",
        sentence,
        re.IGNORECASE
    ):

        facts.append(

            {
                "type": "citizenship",
                "value": "International"
            }

        )

    return facts