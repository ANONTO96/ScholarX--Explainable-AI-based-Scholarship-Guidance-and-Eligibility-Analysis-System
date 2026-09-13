
from database.queries.scholarship_queries import get_sections_by_scholarship_id
from ai.china.rule_extractor import extract_scholarship_ai_data
from ai.common.validator import validate_ai_output
from ai.common.normalizer import normalize_ai_output

import json
import os

scholarship_id = 1
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

file_path = os.path.join(BASE_DIR, "ai", "china","extracted_rule.json")


response = get_sections_by_scholarship_id(scholarship_id)
# print(response)

if response["status"] == 200:

    sections = response["data"]
    # # UNCOMMENT WHEN STORING FINISHED 
    extract_scholarship_ai_data(sections)
    # ai_response = ai_response.replace("```json", "")
    # ai_response = ai_response.replace("```", "")
    # ai_response = ai_response.strip()

    # result = json.loads(ai_response)

    with open(file_path, "r", encoding="utf-8") as file:
        result = json.load(file)


    result = normalize_ai_output(result)

    validation = validate_ai_output(result)

    if not validation["valid"]:

        print("Validation Failed")

        for error in validation["errors"]:
            print(error)

        exit()
    else:
        print(response["status"])