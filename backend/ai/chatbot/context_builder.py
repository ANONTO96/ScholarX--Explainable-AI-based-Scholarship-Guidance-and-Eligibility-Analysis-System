import json

from database.connection import get_db_connection
from services.student_profile_service import load_student_data


def build_student_context(user_id):
    connection = get_db_connection()

    try:
        cursor = connection.cursor(dictionary=True)

        # Retrieve the authenticated student's profile.
        student_data = load_student_data(cursor, user_id)

        # Retrieve recent saved eligibility analysis records.
        cursor.execute(
            """
            SELECT
                check_uuid,
                scholarship_id,
                program_id,
                analysis_summary,
                created_at
            FROM eligibility_check_results
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 100
            """,
            (user_id,)
        )

        rows = cursor.fetchall()

        # Multiple rows can belong to the same analysis.
        # Keep only one summary per check_uuid.
        analyses = []
        seen_checks = set()

        for row in rows:
            check_uuid = str(row["check_uuid"])

            if check_uuid in seen_checks:
                continue

            seen_checks.add(check_uuid)

            summary = row.get("analysis_summary")

            if isinstance(summary, str):
                try:
                    summary = json.loads(summary)
                except json.JSONDecodeError:
                    summary = {}

            analyses.append({
                "scholarship_id": row["scholarship_id"],
                "program_id": row["program_id"],
                "analysis_date": str(row["created_at"]),
                "result": summary or {},
            })

            if len(analyses) >= 5:
                break

        # Exclude unnecessary account information.
        profile_context = {
            "profile": student_data.get("profile"),
            "degrees": student_data.get("degrees", []),
            "languages": student_data.get("languages", []),
            "documents": student_data.get("documents", []),
            "attributes": student_data.get("attributes", {}),
        }

        return {
            "student_profile": profile_context,
            "recent_eligibility_analyses": analyses,
        }

    finally:
        connection.close()