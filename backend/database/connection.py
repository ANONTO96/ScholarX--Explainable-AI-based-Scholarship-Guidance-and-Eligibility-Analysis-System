import mysql.connector 

def get_db_connection():
    database_config = {
        "host": "localhost",
        "user": "root",
        "password": "",
        "database": "study_abroad_ai"
    }
    return mysql.connector.connect(**database_config) # ** unpacks the dictionary into keyword arguments for the connect function