DEFAULT_DURATION = {
    "Undergraduate": "4-5 Years",
    "Master": "2-3 Years",
    "Doctoral": "3-4 Years",
    "General Scholar": "1 Year",
    "Senior Scholar": "1 Year",
}


def merge_programs(programs, durations, languages):

    merged = []

    for program in programs:

        merged.append({

            "program": program["program"],

            "duration": durations.get(
                program["program"],
                DEFAULT_DURATION.get(program["program"])
            ),

            "study_language": languages

        })

    return merged