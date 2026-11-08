import unittest

from matching.document_matcher import evaluate_document_matches


class DocumentMatcherTests(unittest.TestCase):
    def test_mandatory_and_optional_available_documents_earn_three(self):
        result = evaluate_document_matches(
            [
                {"id": 1, "document_name": "passport", "mandatory": 1},
                {"id": 2, "document_name": "CV", "mandatory": 0},
            ],
            {
                "documents_by_checklist_id": {
                    "passport": {"checklist_id": "passport", "has_document": True},
                    "cv": {"checklist_id": "cv", "has_document": True},
                }
            },
        )
        self.assertEqual(result["score"], 6)
        self.assertEqual(result["maximum_score"], 6)
        self.assertEqual([r["score"] for r in result["results"]], [3, 3])

    def test_missing_mandatory_and_optional_documents_earn_zero(self):
        result = evaluate_document_matches(
            [
                {"id": 1, "document_name": "passport", "mandatory": 1},
                {"id": 2, "document_name": "CV", "mandatory": 0},
            ],
            {"documents_by_checklist_id": {}},
        )
        self.assertEqual(result["score"], 0)
        self.assertEqual(result["missing_documents"], 2)

    def test_case_and_whitespace_are_ignored(self):
        result = evaluate_document_matches(
            [{"id": 1, "document_name": "  Academic   Transcript ", "mandatory": True}],
            {
                "documents_by_checklist_id": {
                    "academic transcript": {
                        "checklist_id": "academic transcript",
                        "has_document": True,
                    }
                }
            },
        )
        self.assertEqual(result["score"], 3)
        self.assertEqual(result["results"][0]["status"], "met")

    def test_unavailable_checklist_row_is_zero(self):
        result = evaluate_document_matches(
            [{"id": 1, "document_name": "passport", "mandatory": True}],
            {
                "documents_by_checklist_id": {
                    "passport": {"checklist_id": "passport", "has_document": False}
                }
            },
        )
        self.assertEqual(result["score"], 0)
        self.assertEqual(result["results"][0]["status"], "not_met")


if __name__ == "__main__":
    unittest.main()
