import re

PROGRAMS = [
    ("Undergraduate", [
        "undergraduate",
        "bachelor",
        "bachelor program",
        "bachelor's"
    ]),

    ("Master", [
        "master",
        "master program",
        "master's"
    ]),

    ("Doctoral", [
        "doctoral",
        "doctor",
        "phd"
    ]),

    ("General Scholar", [
        "general scholar"
    ]),

    ("Senior Scholar", [
        "senior scholar"
    ])
]


def program_name(sentence):

    facts = []

    lower = sentence.lower()

    for name, keywords in PROGRAMS:

        for keyword in keywords:

            if keyword in lower:

                facts.append({

                    "program": name

                })

                break

    return facts