
from database.connection import get_db_connection
from matching.rule_loader import load_scholarship_rules
import pprint


def main():
    connection = get_db_connection()
    cursor = None

    try:
        cursor = connection.cursor(dictionary=True)

        # First test: retrieve every rule for scholarship 1.
        rules = load_scholarship_rules(
            cursor=cursor,
            scholarship_id=1
        )

        print(f"Total rules found: {len(rules)}")
        pprint.pp(rules)

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()


if __name__ == "__main__":
    main()
