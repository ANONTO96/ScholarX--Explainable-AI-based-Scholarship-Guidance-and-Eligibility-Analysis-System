from matching.eligibility_scorer import (
    calculate_eligibility_score,
    calculate_overall_matching_score,
)


def test_level_three_awards_three_points_only_for_met_rules():
    results = [
        {"status": "met"},
        {"status": "not_met"},
        {"status": "unknown"},
        {"status": "not_applicable"},
    ]

    score = calculate_eligibility_score(results)

    assert score["points_earned"] == 3
    assert score["points_possible"] == 9
    assert score["percentage"] == 33.33
    assert score["met_rules"] == 1
    assert score["not_met_rules"] == 1
    assert score["unknown_rules"] == 1
    assert score["not_applicable_rules"] == 1


def test_overall_is_average_of_all_three_level_percentages():
    overall = calculate_overall_matching_score(
        document_matching={"score": 6, "maximum_score": 9, "percentage": 66.67},
        language_proficiency_matching={"score": 3, "maximum_score": 6, "percentage": 50},
        eligibility_score={"score": 75, "percentage": 75},
    )

    assert overall["percentage"] == 63.89
    assert overall["score"] == 64
    assert len(overall["level_scores"]) == 3


def test_empty_level_contributes_zero_to_three_level_average():
    overall = calculate_overall_matching_score(
        document_matching={"score": 0, "maximum_score": 0, "percentage": 0},
        language_proficiency_matching={"score": 3, "maximum_score": 3, "percentage": 100},
        eligibility_score={"score": 50, "percentage": 50},
    )

    assert overall["percentage"] == 50
