import re


def extract_degree(sentence):

    facts = []

    text = sentence.lower()

    if "high school diploma" in text:

        facts.append(

            {
                "type": "minimum_degree",
                "degree": "High School"
            }

        )

    elif "bachelor" in text:

        facts.append(

            {
                "type": "minimum_degree",
                "degree": "Bachelor"
            }

        )

    elif "master" in text:

        facts.append(

            {
                "type": "minimum_degree",
                "degree": "Master"
            }

        )

    elif "associate professor" in text:

        facts.append(

            {
                "type": "minimum_degree",
                "degree": "Associate Professor"
            }

        )

    return facts