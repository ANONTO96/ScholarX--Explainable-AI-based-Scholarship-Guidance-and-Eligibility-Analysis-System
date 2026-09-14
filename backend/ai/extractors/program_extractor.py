#!/usr/bin/env python3

import re


PROGRAMS = {
    "undergraduate": {
        "keywords": [
            "undergraduate",
            "bachelor",
            "bachelor's"
        ],
        "degree_level": "Undergraduate"
    },

    "master": {
        "keywords": [
            "master",
            "master's"
        ],
        "degree_level": "Master"
    },

    "doctoral": {
        "keywords": [
            "doctoral",
            "doctor",
            "phd"
        ],
        "degree_level": "Doctoral"
    },

    "general scholar": {
        "keywords": [
            "general scholar"
        ],
        "degree_level": "Non-degree"
    },

    "senior scholar": {
        "keywords": [
            "senior scholar"
        ],
        "degree_level": "Non-degree"
    }
}


LANGUAGES = [
    "english",
    "chinese",
    "japanese",
    "korean",
    "french",
    "german",
    "russian"
]


def extract_programs(text):

    text_lower = text.lower()

    programs = []

    for program_name, info in PROGRAMS.items():

        exists = False

        for keyword in info["keywords"]:

            if re.search(rf"\b{re.escape(keyword)}\b", text_lower):

                exists = True
                break

        if not exists:
            continue

        duration = extract_duration(text, info["keywords"])

        language = extract_language(text, info["keywords"])

        programs.append(
            {
                "program_name": program_name.title(),
                "degree_level": info["degree_level"],
                "duration": duration,
                "study_language": language
            }
        )

    return programs


def extract_duration(text, keywords):

    text_lower = text.lower()

    for keyword in keywords:

        pattern = (
            rf"{keyword}.*?"
            rf"(\d+(?:-\d+)?)\s*"
            rf"(?:year|years|month|months)"
        )

        match = re.search(
            pattern,
            text_lower,
            re.IGNORECASE | re.DOTALL
        )

        if match:

            value = match.group(1)

            unit = re.search(
                r"(year|years|month|months)",
                match.group(0),
                re.IGNORECASE
            ).group(1)

            return f"{value} {unit}"

    return None


def extract_language(text, keywords):

    text_lower = text.lower()

    for keyword in keywords:

        pattern = rf"{keyword}.*?(english|chinese|japanese|korean|french|german|russian)"

        match = re.search(
            pattern,
            text_lower,
            re.IGNORECASE | re.DOTALL
        )

        if match:

            return match.group(1).title()

    found = []

    for language in LANGUAGES:

        if language in text_lower:

            found.append(language.title())

    if found:

        return ", ".join(sorted(set(found)))

    return None