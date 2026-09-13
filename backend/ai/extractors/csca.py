import re


def extract_csca(sentence):

    facts = []

    if re.search(
        r"\bCSCA\b|China Scholastic Competency Assessment",
        sentence,
        re.IGNORECASE
    ):

        facts.append(

            {
                "type": "entrance_exam",
                "exam": "CSCA"
            }

        )

    return facts