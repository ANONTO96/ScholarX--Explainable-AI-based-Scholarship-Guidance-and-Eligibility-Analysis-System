from database.connection import get_db_connection
import mysql.connector
import json 


def insert_china_full_scholarship(final_data):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        # Insert scholarship
        scholarship_query = """
        INSERT INTO scholarships
        (title, country, last_date_to_apply, official_website, bd_ambassy_website)
        VALUES (%s, %s, %s, %s, %s)
        """

        scholarship_values = (
            final_data["scholarship_title"],
            final_data["country"],
            final_data["last_date_to_apply"],
            final_data["official_website"],
            final_data["bd_ambassy_website"]
        )

        cursor.execute(scholarship_query, scholarship_values)
        scholarship_id = cursor.lastrowid

        # Insert all sections
        section_query = """
        INSERT INTO scholarship_sections
        (scholarship_id, section_title, section_content)
        VALUES (%s, %s, %s)
        """

        for section in final_data["sections"]:
            values = (
                scholarship_id,
                section["section_title"],
                section["content"]
            )
            cursor.execute(section_query, values)

        # Commit everything together
        connection.commit()

        return {
            "status": 201,
            "scholarship_id": scholarship_id
        }
    except mysql.connector.IntegrityError as err:
        connection.rollback()
        return {
            "status": 409,
            "error": "Scholarship already exists."
        }
    except mysql.connector.Error as err:
        # Roll back everything if any query fails
        connection.rollback()

        return {
            "status": 500,
            "error": str(err)
        }

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


# insert scholarship_benefits
def insert_scholarship_coverage(
    scholarship_id,
    coverage
):

    connection = get_db_connection()
    cursor = connection.cursor()

    inserted = 0

    try:

        for item in coverage:

            benefit_type = item["benefit_type"]
            description = item["description"]

            program_id = None

            # -------------------------------------------------
            # Program-specific coverage
            # -------------------------------------------------

            if "program" in item:

                cursor.execute(
                    """
                    SELECT id
                    FROM scholarship_programs
                    WHERE scholarship_id = %s
                    AND program_name = %s
                    LIMIT 1
                    """,
                    (
                        scholarship_id,
                        item["program"]
                    )
                )

                result = cursor.fetchone()

                if not result:

                    continue

                program_id = result[0]

            # -------------------------------------------------
            # Optional fields based on benefit type
            # -------------------------------------------------

            amount = item.get("amount")
            currency = item.get("currency")
            period = item.get("period")
            coverage_value = item.get("coverage")
            applicability = item.get("applicability")

            # -------------------------------------------------
            # Insert coverage
            # -------------------------------------------------

            cursor.execute(
                """
                INSERT INTO scholarship_coverage
                (
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
                VALUES
                (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
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

            inserted += 1

        connection.commit()

        return {
            "status": 200,
            "message": "Coverage inserted successfully",
            "inserted": inserted
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