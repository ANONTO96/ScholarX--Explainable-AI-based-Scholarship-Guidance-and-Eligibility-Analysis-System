from matching.eligibility_scorer import calculate_eligibility_score

results = [
    {"status": "met"},
    {"status": "met"},
    {"status": "met"},
    {"status": "not_met"},
    {"status": "unknown"},
]

print(calculate_eligibility_score(results))