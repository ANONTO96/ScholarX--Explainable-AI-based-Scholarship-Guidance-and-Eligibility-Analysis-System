# import mysql.connector 

# def get_db_connection():
#     database_config = {
#         "host": "localhost",
#         "user": "root",
#         "password": "",
#         "database": "study_abroad_ai"
#     }
#     return mysql.connector.connect(**database_config) # ** unpacks the dictionary into keyword arguments for the connect function



import os
import mysql.connector


def get_db_connection():
    database_config = {
        "host": os.getenv("MYSQLHOST"),
        "port": int(os.getenv("MYSQLPORT")),
        "user": os.getenv("MYSQLUSER"),
        "password": os.getenv("MYSQLPASSWORD"),
        "database": os.getenv("MYSQLDATABASE"),
    }

    return mysql.connector.connect(**database_config)