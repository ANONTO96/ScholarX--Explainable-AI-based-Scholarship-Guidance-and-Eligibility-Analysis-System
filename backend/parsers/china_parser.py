from bs4 import BeautifulSoup
import re

def parse_china_scholarship(html_of_campuschina_org, html_of_china_bd_ambassy):
    
    soup_of_campuschina_org = BeautifulSoup(html_of_campuschina_org,"lxml")
    soup_of_china_bd_ambassy = BeautifulSoup(html_of_china_bd_ambassy,"lxml" )

    # print(soup_of_campuschina_org.find(class_="tit").get_text())

    # Scholarship Title
    scholarship_title = soup_of_china_bd_ambassy.find(id="News_Body_Title").get_text().removeprefix("Announcement: ")
    # print(scholarship_title)


    # --------------------------------------------------------------------------------------------------------------------------
    # Scholarship Coverage Title
    scholarship_coverage = soup_of_campuschina_org.find(lambda tag: tag.name == "b" and "Scholarship Coverage" in tag.text)
    scholarship_coverage_title = scholarship_coverage.get_text().replace("III.\n", "")

    start_p = soup_of_campuschina_org.find("p", class_="MsoPlainText", string=re.compile("1. Tuition fees"))

    scholarship_coverage_content = []

    if start_p:
        # Clean and add the first paragraph
        scholarship_coverage_content.append(re.sub(r'\s+', ' ', start_p.text).strip())
        
        # 2. Loop through the next paragraphs
        for sibling in start_p.find_next_siblings("p"):
            text = sibling.get_text(strip=True)
            
            # Simple stop condition
            if "Eligibility" in text:
                break
                
            # Clean and collect the paragraph text
            clean_p = re.sub(r'\s+', ' ', sibling.text).strip()
            scholarship_coverage_content.append(clean_p)


    # --------------------------------------------------------------------------------------------------------------------------

    # Eligibility Title
    eligibility = soup_of_campuschina_org.find(lambda tag: tag.name == "b" and "Eligibility" in tag.text)
    eligibility_title = eligibility.get_text().replace("IV.\n", "")


    start_eligibility_p = soup_of_campuschina_org.find("p", class_="MsoPlainText", string=re.compile("1. be a citizen"))

    eligibility_content = []

    if start_eligibility_p:
        eligibility_content.append(re.sub(r'\s+',' ',start_eligibility_p.text).strip())

        for siblig in start_eligibility_p.find_next_siblings("p"):
            text = siblig.get_text(strip=True)
            
            if "Application" in text:
                break
                
            clean_p = re.sub(r'\s+', ' ', siblig.text).strip()
            eligibility_content.append(clean_p)

        
    # print(eligibility_title)
    # for eligible in eligibility_content:
    #     print(eligible)


    # --------------------------------------------------------------------------------------------------------------------------
    # Application Documents Title
    application_documents = soup_of_campuschina_org.find(lambda tag: tag.name == "b" and "Documents" in tag.text)
    application_documents_title = application_documents.get_text().replace("VI.\n", "")

    start_application_documents_p = soup_of_campuschina_org.find(
        lambda tag: tag.name == "p"
        and "MsoPlainText" in tag.get("class", [])
        and re.search(r"1\. Application Form", tag.get_text())  # ✅ reads full text including child tags
    )
    application_documents_content = []

    if start_application_documents_p:
        application_documents_content.append(re.sub(r'\s+', ' ', start_application_documents_p.text).strip())
        
        for sibling in start_application_documents_p.find_next_siblings("p"):
            text = sibling.get_text(strip=True)
            
            if "Contact" in text:
                break
                
            clean_p = re.sub(r'\s+', ' ', sibling.text).strip()
            application_documents_content.append(clean_p)

    # print(application_documents_title)
    # for doc in application_documents_content:
    #     print(doc)


    # --------------------------------------------------------------------------------------------------------------------------
    # Contact Information Title
    contact_information = soup_of_campuschina_org.find(
        lambda tag: tag.name == "b" and "Contact" in tag.get_text()
    )
    contact_information_title = contact_information.get_text().replace("VII.", "").strip()

    # Find the <p> that CONTAINS <strong>Asia</strong>
    start_contact_information_p = soup_of_campuschina_org.find(
        lambda tag: tag.name == "p"
        and tag.find("strong")
        and "Asia" in tag.get_text()
    )

    contact_information_content = []

    if start_contact_information_p:
        contact_information_content.append(
            re.sub(r'\s+', ' ', start_contact_information_p.get_text()).strip()
        )

        for sibling in start_contact_information_p.find_next_siblings("p"):
            text = sibling.get_text(strip=True)

            if "Notes" in text:
                break

            cleaned = re.sub(r'\s+', ' ', sibling.get_text()).strip()
            if cleaned:
                contact_information_content.append(cleaned)

    # print(contact_information_title)
    # for contact in contact_information_content:
    #     print(contact)

    # Last Apply Date
    last_date_to_apply = soup_of_china_bd_ambassy.find(lambda tag: tag.name =='p' and "Application Deadline" in tag.text)
    if last_date_to_apply:
        last_date_to_apply_text = last_date_to_apply.get_text().replace("Application Deadline: ", "").strip()

    # --------------------------------------------------------------------------------------------------------------------------
    final_data = {
        "country": "China",
        "last_date_to_apply": last_date_to_apply_text,
        "official_website": "https://www.campuschina.org",
        "bd_ambassy_website": "https://bd.china-embassy.gov.cn",
        "scholarship_title": scholarship_title,
        "sections":[
            {
                "section_title": scholarship_coverage_title,
                "content": "\n".join(scholarship_coverage_content)
            },
            {
                "section_title": eligibility_title,
                "content": "\n".join(eligibility_content)
            }
            ,
            {
                "section_title": application_documents_title,
                "content": "\n".join(application_documents_content)
            },
            {
                "section_title": contact_information_title,
                "content": "\n".join(contact_information_content)
            }]
        }
    return final_data