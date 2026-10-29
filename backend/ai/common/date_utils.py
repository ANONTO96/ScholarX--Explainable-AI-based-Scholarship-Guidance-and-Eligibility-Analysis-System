from datetime import date, datetime
from email.utils import parsedate_to_datetime


def format_deadline(value: str | date | datetime | None) -> str | None:
    if value is None:
        return None

    if isinstance(value, datetime):
        parsed_date = value.date()
    elif isinstance(value, date):
        parsed_date = value
    else:
        value = value.strip()

        if not value:
            return None

        # Try common scraped date formats.
        formats = (
            "%Y-%m-%d",       # 2026-01-10
            "%Y/%m/%d",       # 2026/01/10
            "%B %d, %Y",      # January 10, 2026
            "%b %d, %Y",      # Jan 10, 2026
            "%d %B %Y",       # 10 January 2026
            "%d %b %Y",       # 10 Jan 2026
            "%m/%d/%Y",       # 01/10/2026
            "%d/%m/%Y",       # 10/01/2026
        )

        parsed_date = None

        for fmt in formats:
            try:
                parsed_date = datetime.strptime(value, fmt).date()
                break
            except ValueError:
                continue

        if parsed_date is None:
            raise ValueError(f"Unsupported deadline format: {value}")

    return parsed_date.strftime("%Y-%m-%d")