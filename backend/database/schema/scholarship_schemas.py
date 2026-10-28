
from pydantic import BaseModel, Field, HttpUrl


class ScholarshipSection(BaseModel):
    section_title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)


class ScholarshipCreate(BaseModel):
    scholarship_title: str = Field(min_length=1, max_length=255)
    country: str | None = None
    last_date_to_apply: str | None = None
    official_website: str | None = None
    bd_ambassy_website: str | None = None
    sections: list[ScholarshipSection] = Field(default_factory=list)


class ScholarshipUpdate(BaseModel):
    scholarship_title: str | None = Field(
        default=None, min_length=1, max_length=255
    )
    country: str | None = None
    last_date_to_apply: str | None = None
    official_website: str | None = None
    bd_ambassy_website: str | None = None
