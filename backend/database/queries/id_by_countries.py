from database.connection import get_db_connection

def get_id_by_country(country_name):
    connection = get_db_connection()
    cursor = connection.cursor()

    try:
        query = """
        SELECT id FROM scholarships WHERE country=%s
        """

        cursor.execute(query, (country_name,))

        result = cursor.fetchone()

        if result:
            return {
                "status": 200,
                "data": result[0]
            }
        else:
            return {
                "status": 404,
                "error": f"Country '{country_name}' not found."
            }
    finally:
        cursor.close()
        connection.close()