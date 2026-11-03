DEFAULT_DURATION = {
    "Undergraduate": "4-5 Years",
    "Master": "2-3 Years",
    "Doctoral": "3-4 Years",
}


def merge_programs(programs, durations, languages):
    merged = []
    seen = set()
    for item in programs:
        name = item["program"]
        if name not in DEFAULT_DURATION or name in seen:
            continue
        seen.add(name)
        merged.append({
            "program": name,
            "duration": durations.get(name, DEFAULT_DURATION[name]),
            "study_language": languages,
        })
    return merged
