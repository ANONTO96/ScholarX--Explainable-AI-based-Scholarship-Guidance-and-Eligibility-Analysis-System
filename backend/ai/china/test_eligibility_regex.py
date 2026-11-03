import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from ai.china.eligibility.extractor import extract_eligibility


class EligibilityRegexTests(unittest.TestCase):
    def test_cgs_core_rules_and_program_scope(self):
        sentences = [
            "be a citizen of a country other than the PRC and in good health both mentally and physically",
            "Applicants must be under the age of 25 when applying for an undergraduate program",
            "Applicants must be under the age of 35 when applying for a master's program",
            "Applicants must be under the age of 40 when applying for a doctoral program",
            "Applicants must have a high school diploma when applying for bachelor programs",
            "Applicants must have a bachelor's degree when applying for master's programs",
            "Applicants must have a master's degree when applying for doctoral programs",
            'take the "China Scholastic Competency Assessment (short as CSCA)" and upload a valid score report when applying for bachelor programs',
            "have passed the HSK (Level 4) when applying for a Chinese-taught master's or doctoral program",
            "meet the admission requirements of the university of preference in terms of language proficiency and academic ability, among others, when applying for a program taught in a language other than Chinese",
        ]
        result = extract_eligibility(sentences)
        by_program = {item["program"]: item["rules"] for item in result["program_rules"]}
        self.assertEqual(set(by_program), {"Undergraduate", "Master", "Doctoral"})
        self.assertIn(("age", "25"), {(r["rule_type"], r["rule_value"]) for r in by_program["Undergraduate"]})
        self.assertIn(("age", "35"), {(r["rule_type"], r["rule_value"]) for r in by_program["Master"]})
        self.assertIn(("age", "40"), {(r["rule_type"], r["rule_value"]) for r in by_program["Doctoral"]})
        self.assertTrue(any(r["rule_type"] == "entrance_exam" for r in by_program["Undergraduate"]))
        self.assertTrue(any(r["rule_type"] == "language_exam" and r["rule_value"] == "HSK 4" for r in by_program["Master"]))
        self.assertTrue(any(r["rule_type"] == "language_exam" and r["rule_value"] == "HSK 4" for r in by_program["Doctoral"]))
        for program in ("Undergraduate", "Master", "Doctoral"):
            conditional = [r for r in by_program[program] if r["rule_type"] == "language_proficiency"]
            self.assertEqual(len(conditional), 1)
            self.assertEqual(conditional[0]["condition"]["value"], "Chinese")
            self.assertEqual(conditional[0]["condition"]["operator"], "!=")
        self.assertFalse(any("IELTS" in r["rule_value"] for group in result["program_rules"] for r in group["rules"]))
        self.assertTrue(any(r["rule_type"] == "citizenship" for r in result["scholarship_rules"]))
        self.assertTrue(any(r["rule_type"] == "health" for r in result["scholarship_rules"]))

    def test_every_rule_has_source_sentence(self):
        result = extract_eligibility([
            "be a citizen of a country other than the PRC and in good health",
            "have passed the HSK (Level 4) when applying for a Chinese-taught master's or doctoral program",
        ])
        all_rules = result["scholarship_rules"] + [
            rule for group in result["program_rules"] for rule in group["rules"]
        ]
        self.assertTrue(all(rule.get("source_sentence") for rule in all_rules))


if __name__ == "__main__":
    unittest.main()
