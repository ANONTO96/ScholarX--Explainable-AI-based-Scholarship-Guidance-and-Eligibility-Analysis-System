import unittest
from datetime import date, timedelta

from matching.eligibility_evaluator import (
    evaluate_eligibility_rules,
    evaluate_health_certificate,
    evaluate_criminal_record,
    evaluate_citizenship,
)
from matching.eligibility_scorer import calculate_overall_matching_score
from matching.rule_loader import _normalize_rule


class LevelThreeMatchingTests(unittest.TestCase):
    def rule(self, rule_type, value="Required", **extra):
        return {
            "id": 101,
            "rule_type": rule_type,
            "operator": "=",
            "rule_value": value,
            "mandatory": True,
            "condition_json": None,
            **extra,
        }

    def test_health_certificate_available_and_unavailable(self):
        rule = self.rule("health", "Health certificate")
        available = evaluate_health_certificate(
            rule,
            {"documents_by_checklist_id": {"health-doc": {"has_document": True}}},
        )
        unavailable = evaluate_health_certificate(
            rule,
            {"documents_by_checklist_id": {"health-doc": {"has_document": False}}},
        )
        missing = evaluate_health_certificate(rule, {"documents_by_checklist_id": {}})
        self.assertEqual(available["status"], "met")
        self.assertEqual(unavailable["status"], "not_met")
        self.assertEqual(missing["status"], "unknown")

    def test_criminal_record_uses_pcc_checklist(self):
        rule = self.rule("criminal_record", "Police clearance certificate")
        result = evaluate_criminal_record(
            rule,
            {"documents_by_checklist_id": {"pcc-doc": {"has_document": True}}},
        )
        self.assertEqual(result["status"], "met")

    def test_international_rule_uses_explicit_checkbox(self):
        rule = self.rule("citizenship", "International")
        checked = evaluate_citizenship(
            rule,
            {"nationality": "Bangladesh", "international_student": 1},
            "China",
        )
        unchecked = evaluate_citizenship(
            rule,
            {"nationality": "Bangladesh", "international_student": 0},
            "China",
        )
        missing = evaluate_citizenship(
            rule,
            {"nationality": "Bangladesh"},
            "China",
        )
        self.assertEqual(checked["status"], "met")
        self.assertEqual(unchecked["status"], "not_met")
        self.assertEqual(missing["status"], "unknown")

    def test_international_checkbox_supports_frontend_profile_shape(self):
        rule = self.rule("citizenship", "International")
        result = evaluate_citizenship(
            rule,
            {
                "personal": {"nationality": "Bangladesh"},
                "additional": {"internationalStudent": True},
            },
        )
        self.assertEqual(result["status"], "met")

    def test_specific_nationality_rule_uses_nationality_field(self):
        rule = self.rule("nationality", "Bangladeshi")
        result = evaluate_citizenship(
            rule,
            {"nationality": "Bangladesh", "international_student": False},
            "China",
        )
        self.assertEqual(result["status"], "met")

    def test_language_proficiency_rule_is_evaluated_inside_level_three(self):
        rule = self.rule(
            "language_proficiency",
            "HSK 4",
            study_language="Chinese",
        )
        student_data = {
            "profile": {},
            "languages": [{
                "language_code": "ZH",
                "test_name": "HSK 5",
                "score_numeric": 5,
                "proficiency_level": "HSK 5",
                "expiry_date": (date.today() + timedelta(days=200)).isoformat(),
            }],
        }
        results = evaluate_eligibility_rules(
            student_data=student_data,
            rules=[rule],
            program_context={"study_language": "Chinese"},
        )
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["rule_type"], "language_proficiency")
        self.assertEqual(results[0]["status"], "met")

    def test_non_chinese_language_rule_uses_moi_checklist(self):
        rule = self.rule(
            "language_proficiency",
            "University admission requirements",
            study_language="Non-Chinese",
        )
        results = evaluate_eligibility_rules(
            student_data={
                "profile": {},
                "languages": [],
                "documents_by_checklist_id": {
                    "moi-doc": {"has_document": True}
                },
            },
            rules=[rule],
            program_context={"study_language": "English"},
        )
        self.assertEqual(results[0]["status"], "met")

    def test_overall_score_averages_the_three_available_levels(self):
        result = calculate_overall_matching_score(
            {"percentage": 100, "maximum_score": 9},
            {"percentage": 50, "maximum_score": 1},
            {"score": 80, "evaluated_rules": 3},
        )
        self.assertEqual(result["score"], 77)

    def test_empty_level_is_excluded_from_overall_score(self):
        result = calculate_overall_matching_score(
            {"percentage": 100, "maximum_score": 0},
            {"percentage": 50, "maximum_score": 1},
            {"score": 80, "evaluated_rules": 3},
        )
        self.assertEqual(result["score"], 65)
        self.assertEqual(len(result["levels_included"]), 2)

    def test_database_string_false_does_not_become_mandatory(self):
        rule = _normalize_rule({
            "mandatory": "0",
            "condition_json": None,
        })
        self.assertFalse(rule["mandatory"])


if __name__ == "__main__":
    unittest.main()
