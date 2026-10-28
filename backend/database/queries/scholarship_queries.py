from database.connection import get_db_connection
import mysql.connector
import json 



def insert_china_full_scholarship(final_data):
    connection = get_db_connection()
    cursor = connection.cursor()

    inserted = 0
    updated = 0
    unchanged = 0
    sections_inserted = 0
    sections_updated = 0
    sections_unchanged = 0

    try:
        # --------------------------------------------------
        # Check whether the scholarship already exists
        # --------------------------------------------------
        cursor.execute(
            """
            SELECT id,
                   last_date_to_apply,
                   official_website,
                   bd_ambassy_website,
                   scholarship_type
            FROM scholarships
            WHERE title = %s AND country = %s
            LIMIT 1
            """,
            (
                final_data["scholarship_title"],
                final_data["country"]
            )
        )

        existing = cursor.fetchone()

        if existing:
            scholarship_id = existing[0]

            old_values = existing[1:]
            new_values = (
                final_data["last_date_to_apply"],
                final_data["official_website"],
                final_data["bd_ambassy_website"],
                final_data["scholarship_type"]
            )

            if old_values != new_values:
                cursor.execute(
                    """
                    UPDATE scholarships
                    SET last_date_to_apply = %s,
                        official_website = %s,
                        bd_ambassy_website = %s,
                        scholarship_type = %s
                    WHERE id = %s
                    """,
                    (*new_values, scholarship_id)
                )
                updated += 1
            else:
                unchanged += 1

        else:
            # --------------------------------------------------
            # Insert a new scholarship
            # --------------------------------------------------
            cursor.execute(
                """
                INSERT INTO scholarships
                (
                    title,
                    country,
                    last_date_to_apply,
                    official_website,
                    bd_ambassy_website,
                    scholarship_type
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (
                    final_data["scholarship_title"],
                    final_data["country"],
                    final_data["last_date_to_apply"],
                    final_data["official_website"],
                    final_data["bd_ambassy_website"],
                    final_data["scholarship_type"]
                )
            )

            scholarship_id = cursor.lastrowid
            inserted += 1

        # --------------------------------------------------
        # Insert or update scholarship sections
        # --------------------------------------------------
        cursor.execute(
            """
            SELECT id, section_title, section_content
            FROM scholarship_sections
            WHERE scholarship_id = %s
            """,
            (scholarship_id,)
        )

        existing_sections = {
            row[1]: (row[0], row[2])
            for row in cursor.fetchall()
        }

        current_section_titles = set()

        for section in final_data["sections"]:
            section_title = section["section_title"]
            section_content = section["content"]

            current_section_titles.add(section_title)

            if section_title in existing_sections:
                section_id, old_content = existing_sections[section_title]

                if old_content != section_content:
                    cursor.execute(
                        """
                        UPDATE scholarship_sections
                        SET section_content = %s
                        WHERE id = %s
                        """,
                        (section_content, section_id)
                    )
                    sections_updated += 1
                else:
                    sections_unchanged += 1

            else:
                cursor.execute(
                    """
                    INSERT INTO scholarship_sections
                    (
                        scholarship_id,
                        section_title,
                        section_content
                    )
                    VALUES (%s, %s, %s)
                    """,
                    (
                        scholarship_id,
                        section_title,
                        section_content
                    )
                )
                sections_inserted += 1

        # --------------------------------------------------
        # Remove sections no longer present in parsed data
        # --------------------------------------------------
        for section_title in existing_sections:
            if section_title not in current_section_titles:
                cursor.execute(
                    """
                    DELETE FROM scholarship_sections
                    WHERE id = %s
                    """,
                    (existing_sections[section_title][0],)
                )

                sections_updated += 1

        connection.commit()

        # --------------------------------------------------
        # Return processing result
        # --------------------------------------------------
        if inserted:
            status = 201
            message = "New scholarship inserted successfully."
        elif updated or sections_inserted or sections_updated:
            status = 200
            message = "Scholarship data updated successfully."
        else:
            status = 204
            message = "Scholarship data is already up to date."

        return {
            "status": status,
            "message": message,
            "scholarship_id": scholarship_id,
            "scholarship": {
                "inserted": inserted,
                "updated": updated,
                "unchanged": unchanged
            },
            "sections": {
                "inserted": sections_inserted,
                "updated": sections_updated,
                "unchanged": sections_unchanged
            }
        }

    except mysql.connector.Error as err:
        connection.rollback()
        raise err

    finally:
        cursor.close()
        connection.close()



# Get Scholarship section contents by scholarship_id
def get_sections_by_scholarship_id(scholarship_id):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
        SELECT section_title,
               section_content
        FROM scholarship_sections
        WHERE scholarship_id=%s
        """

        cursor.execute(query, (scholarship_id,))

        result = cursor.fetchall()

        return {
            "status": 200,
            "data": result
        }

    except mysql.connector.Error as err:

        return {
            "status": 500,
            "error": str(err)
        }

    finally:
            cursor.close()
            connection.close()


# ---------------------------------------------------------------------------
# Insert All Rule Extracted Data of the Chinese Scholarship into the database
# ---------------------------------------------------------------------------

def insert_scholarship_programs(scholarship_id, programs):

    connection = get_db_connection()
    cursor = connection.cursor()

    inserted = 0
    updated = 0
    unchanged = 0

    try:

        # Insert new / update existing
        query = """
        INSERT INTO scholarship_programs
        (
            scholarship_id,
            program_name,
            duration,
            languages
        )
        VALUES (%s, %s, %s, %s)

        ON DUPLICATE KEY UPDATE
            duration = VALUES(duration),
            languages = VALUES(languages)
        """

        # Check existing data
        check_query = """
        SELECT duration, languages
        FROM scholarship_programs
        WHERE scholarship_id = %s
          AND program_name = %s
        """

        for program in programs:

            program_name = program["program"]
            duration = program.get("duration")

            languages = program.get("study_language", [])

            # Convert list to JSON string
            if isinstance(languages, list):
                languages = json.dumps(
                    languages,
                    ensure_ascii=False
                )

            # --------------------------------
            # Check if program already exists
            # --------------------------------

            cursor.execute(
                check_query,
                (
                    scholarship_id,
                    program_name
                )
            )

            existing = cursor.fetchone()

            # --------------------------------
            # NEW PROGRAM
            # --------------------------------

            if existing is None:

                cursor.execute(
                    query,
                    (
                        scholarship_id,
                        program_name,
                        duration,
                        languages
                    )
                )

                inserted += 1

            # --------------------------------
            # EXISTING PROGRAM
            # --------------------------------

            else:

                old_duration = existing[0]
                old_languages = existing[1]

                # Same data
                if (
                    old_duration == duration
                    and old_languages == languages
                ):

                    unchanged += 1

                # Data changed
                else:

                    cursor.execute(
                        query,
                        (
                            scholarship_id,
                            program_name,
                            duration,
                            languages
                        )
                    )

                    updated += 1

        connection.commit()

        # --------------------------------
        # Return processing result
        # --------------------------------

        if inserted > 0 and updated == 0 and unchanged == 0:

            status = 201
            message = "New scholarship programs inserted."

        elif updated > 0:

            status = 200
            message = "Scholarship programs updated."

        elif unchanged > 0:

            status = 204
            message = "Scholarship programs already up to date."

        else:

            status = 200
            message = "No programs were processed."

        return {
            "status": status,
            "message": message,
            "inserted": inserted,
            "updated": updated,
            "unchanged": unchanged
        }

    except mysql.connector.Error as err:

        connection.rollback()
        raise err

    finally:

        cursor.close()
        connection.close()

# -----------------------------------------------------------------------------
# GET Program Id 
# -----------------------------------------------------------------------------
def get_program_id(scholarship_id, program_name):

    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
        SELECT id
        FROM scholarship_programs
        WHERE scholarship_id = %s
        AND program_name = %s
        LIMIT 1
        """

        cursor.execute(
            query,
            (scholarship_id, program_name)
        )

        result = cursor.fetchone()

        if result:
            return result["id"]

        return None

    finally:
        cursor.close()
        connection.close()

# -----------------------------------------------------------------------------
# Insert Program Eligibility Rules
# -----------------------------------------------------------------------------
def insert_scholarship_eligibility(scholarship_id, eligibility):

    connection = get_db_connection()
    cursor = connection.cursor()

    inserted = 0
    unchanged = 0
    updated = 0

    try:

        # --------------------------------------------------
        # Scholarship-wide rules
        # --------------------------------------------------

        scholarship_rules = eligibility.get("scholarship_rules", [])

        for rule in scholarship_rules:

            check_query = """
                SELECT id, mandatory
                FROM scholarship_eligibility
                WHERE scholarship_id = %s
                  AND program_id IS NULL
                  AND scope = 'scholarship'
                  AND rule_type = %s
                  AND operator = %s
                  AND rule_value = %s
            """

            cursor.execute(
                check_query,
                (
                    scholarship_id,
                    rule["rule_type"],
                    rule["operator"],
                    rule["rule_value"]
                )
            )

            existing = cursor.fetchone()

            if existing:

                if existing[1] != rule["mandatory"]:

                    update_query = """
                        UPDATE scholarship_eligibility
                        SET mandatory = %s
                        WHERE id = %s
                    """

                    cursor.execute(
                        update_query,
                        (
                            rule["mandatory"],
                            existing[0]
                        )
                    )

                    updated += 1

                else:
                    unchanged += 1

            else:

                insert_query = """
                    INSERT INTO scholarship_eligibility
                    (
                        scholarship_id,
                        program_id,
                        scope,
                        rule_type,
                        operator,
                        rule_value,
                        mandatory
                    )
                    VALUES (%s, NULL, 'scholarship', %s, %s, %s, %s)
                """

                cursor.execute(
                    insert_query,
                    (
                        scholarship_id,
                        rule["rule_type"],
                        rule["operator"],
                        rule["rule_value"],
                        rule["mandatory"]
                    )
                )

                inserted += 1

        # --------------------------------------------------
        # Program rules
        # --------------------------------------------------

        program_rules = eligibility.get("program_rules", [])

        for program_data in program_rules:

            program_name = program_data["program"]

            # Find program ID
            program_query = """
                SELECT id
                FROM scholarship_programs
                WHERE scholarship_id = %s
                  AND program_name = %s
                LIMIT 1
            """

            cursor.execute(
                program_query,
                (
                    scholarship_id,
                    program_name
                )
            )

            program = cursor.fetchone()

            if not program:
                continue

            program_id = program[0]

            for rule in program_data.get("rules", []):

                query = """
                    INSERT INTO scholarship_eligibility
                    (
                        scholarship_id,
                        program_id,
                        scope,
                        rule_type,
                        operator,
                        rule_value,
                        mandatory
                    )
                    VALUES (%s, %s, 'program', %s, %s, %s, %s)

                    ON DUPLICATE KEY UPDATE
                        mandatory = VALUES(mandatory)
                """

                cursor.execute(
                    query,
                    (
                        scholarship_id,
                        program_id,
                        rule["rule_type"],
                        rule["operator"],
                        rule["rule_value"],
                        rule["mandatory"]
                    )
                )

                if cursor.rowcount == 1:
                    inserted += 1
                elif cursor.rowcount == 2:
                    updated += 1
                else:
                    unchanged += 1

        connection.commit()

        return {
            "status": 200,
            "message": "Eligibility rules processed successfully",
            "inserted": inserted,
            "updated": updated,
            "unchanged": unchanged
        }

    except mysql.connector.Error as err:

        connection.rollback()
        raise err

    finally:

        cursor.close()
        connection.close()

#insert required_documents
def insert_scholarship_documents(scholarship_id, documents):

    connection = get_db_connection()
    cursor = connection.cursor()

    inserted = 0
    unchanged = 0
    updated = 0

    try:

        for document in documents:

            document_name = document["document_name"]

            # --------------------------------------------------
            # Check if document already exists
            # --------------------------------------------------

            check_query = """
                SELECT
                    id,
                    requirement,
                    condition_text,
                    mandatory,
                    source_sentence
                FROM scholarship_documents
                WHERE scholarship_id = %s
                  AND document_name = %s
                LIMIT 1
            """

            cursor.execute(
                check_query,
                (
                    scholarship_id,
                    document_name
                )
            )

            existing = cursor.fetchone()

            # --------------------------------------------------
            # Document already exists
            # --------------------------------------------------

            if existing:

                document_id = existing[0]

                old_requirement = existing[1]
                old_condition = existing[2]
                old_mandatory = existing[3]
                old_source = existing[4]

                new_requirement = document.get("requirement")
                new_condition = document.get("condition_text")
                new_mandatory = document.get("mandatory", True)
                new_source = document.get("source_sentence")

                # Check whether anything actually changed

                if (
                    old_requirement != new_requirement
                    or old_condition != new_condition
                    or old_mandatory != new_mandatory
                    or old_source != new_source
                ):

                    update_query = """
                        UPDATE scholarship_documents
                        SET
                            requirement = %s,
                            condition_text = %s,
                            mandatory = %s,
                            source_sentence = %s
                        WHERE id = %s
                    """

                    cursor.execute(
                        update_query,
                        (
                            new_requirement,
                            new_condition,
                            new_mandatory,
                            new_source,
                            document_id
                        )
                    )

                    updated += 1

                else:

                    unchanged += 1

            # --------------------------------------------------
            # New document
            # --------------------------------------------------

            else:

                insert_query = """
                    INSERT INTO scholarship_documents
                    (
                        scholarship_id,
                        document_name,
                        requirement,
                        condition_text,
                        mandatory,
                        source_sentence
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                """

                cursor.execute(
                    insert_query,
                    (
                        scholarship_id,
                        document_name,
                        document.get("requirement"),
                        document.get("condition_text"),
                        document.get("mandatory", True),
                        document.get("source_sentence")
                    )
                )

                inserted += 1

        connection.commit()

        return {
            "status": 200,
            "message": "Scholarship documents processed successfully",
            "inserted": inserted,
            "updated": updated,
            "unchanged": unchanged
        }

    except mysql.connector.Error as err:

        connection.rollback()
        raise err

    finally:

        cursor.close()
        connection.close()



# Insert or update scholarship coverage
def insert_scholarship_coverage(scholarship_id, coverage):
    connection = get_db_connection()
    cursor = connection.cursor()

    inserted = 0
    updated = 0
    skipped = 0

    try:
        for item in coverage:
            benefit_type = item["benefit_type"]
            description = item["description"]

            program_id = None

            # Program-specific coverage
            if item.get("program"):
                cursor.execute(
                    """
                    SELECT id
                    FROM scholarship_programs
                    WHERE scholarship_id = %s
                      AND program_name = %s
                    LIMIT 1
                    """,
                    (scholarship_id, item["program"])
                )

                result = cursor.fetchone()

                if not result:
                    skipped += 1
                    continue

                program_id = result[0]

            # Optional fields
            amount = item.get("amount")
            currency = item.get("currency")
            period = item.get("period")
            coverage_value = item.get("coverage")
            applicability = item.get("applicability")

            # Check whether the unique coverage record already exists.
            cursor.execute(
                """
                SELECT id
                FROM scholarship_coverage
                WHERE scholarship_id = %s
                  AND program_id_key = %s
                  AND benefit_type = %s
                  AND description = %s
                LIMIT 1
                """,
                (
                    scholarship_id,
                    program_id if program_id is not None else 0,
                    benefit_type,
                    description
                )
            )

            existing = cursor.fetchone()

            # Insert new record or update an existing record.
            cursor.execute(
                """
                INSERT INTO scholarship_coverage (
                    scholarship_id,
                    program_id,
                    benefit_type,
                    description,
                    amount,
                    currency,
                    period,
                    coverage,
                    applicability
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON DUPLICATE KEY UPDATE
                    amount = VALUES(amount),
                    currency = VALUES(currency),
                    period = VALUES(period),
                    coverage = VALUES(coverage),
                    applicability = VALUES(applicability)
                """,
                (
                    scholarship_id,
                    program_id,
                    benefit_type,
                    description,
                    amount,
                    currency,
                    period,
                    coverage_value,
                    applicability
                )
            )

            if existing:
                updated += 1
            else:
                inserted += 1

        connection.commit()

        return {
            "status": 200,
            "message": "Scholarship coverage processed successfully",
            "inserted": inserted,
            "updated": updated,
            "skipped": skipped
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()


# ----------------------------------------------------------------------------
# Insert scholarship contacts   
# ----------------------------------------------------------------------------
def insert_scholarship_contacts(
    scholarship_id,
    contacts
):
    connection = get_db_connection()
    cursor = connection.cursor()

    inserted = 0
    unchanged = 0

    try:
        for item in contacts:

            contact_type = item["contact_type"]
            value = item["value"]

            cursor.execute(
                """
                INSERT INTO scholarship_contacts
                (
                    scholarship_id,
                    contact_type,
                    value
                )
                VALUES
                (
                    %s, %s, %s
                )
                ON DUPLICATE KEY UPDATE
                    value = VALUES(value)
                """,
                (
                    scholarship_id,
                    contact_type,
                    value
                )
            )

            if cursor.rowcount == 1:
                inserted += 1
            else:
                unchanged += 1

        connection.commit()

        return {
            "status": 200,
            "message": "Contacts processed successfully",
            "inserted": inserted,
            "unchanged": unchanged
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        cursor.close()
        connection.close()