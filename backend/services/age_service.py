from datetime import date, datetime


def calculate_age(
    date_of_birth: date | datetime | str | None,
    reference_date: date | None = None,
) -> int | None:
    """
    Calculate a student's age in completed years.

    Args:
        date_of_birth: Student's date of birth.
        reference_date: Date used for calculation.
                        Defaults to today's date.

    Returns:
        Age in completed years, or None if DOB is unavailable.

    Raises:
        ValueError: If DOB is invalid or in the future.
    """

    if date_of_birth is None or date_of_birth == "":
        return None

    if isinstance(date_of_birth, datetime):
        dob = date_of_birth.date()

    elif isinstance(date_of_birth, date):
        dob = date_of_birth

    elif isinstance(date_of_birth, str):
        try:
            dob = date.fromisoformat(date_of_birth)
        except ValueError:
            raise ValueError(
                "Date of birth must use YYYY-MM-DD format."
            )

    else:
        raise ValueError("Invalid date of birth.")

    today = reference_date or date.today()

    if dob > today:
        raise ValueError("Date of birth cannot be in the future.")

    age = today.year - dob.year

    if (today.month, today.day) < (dob.month, dob.day):
        age -= 1

    return age