import sys
import os

# For importing from the parent directory (to access parsers)
sys.path.append(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

from database.queries.scholarship_queries import insert_china_full_scholarship

from parsers.china_parser import parse_china_scholarship
# Downloaded from https://www.campuschina.org/content/details3_847.html
with open("uploads/html/china_scholarship_001.html","r", encoding = "utf-8") as f:
    html_of_campuschina_org = f.read()

# Downloaded from https://bd.china-embassy.gov.cn/eng/sghd/202512/t20251219_11776194.htm
with open("uploads/html/china_scholarship_002.html","r", encoding = "utf-8") as f:
    html_of_china_bd_ambassy = f.read()

final_data = parse_china_scholarship(html_of_campuschina_org, html_of_china_bd_ambassy)


result = insert_china_full_scholarship(final_data)

if result["status"] == 201:
    print("Inserted successfully!")
else:
    print("Failed:", result["error"])



# print(f"=== {final_data['scholarship_title']} ===")

# # Loop over each section object to cleanly unpack and print them
# for section in final_data['sections']:
#     print(f"\n--- {section['section_title']} ---")
#     print(section['content'])