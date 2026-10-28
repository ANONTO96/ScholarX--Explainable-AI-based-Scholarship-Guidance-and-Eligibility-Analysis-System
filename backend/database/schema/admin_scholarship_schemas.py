from pydantic import BaseModel, ConfigDict, Field


# Shared nested models used by the admin dashboard.

class ScholarshipProgramInput(BaseModel):
    program: str = Field(min_length=1)
    duration: str | None = None
    study_language: list[str] = Field(default_factory=list)


class ScholarshipRuleInput(BaseModel):
    rule_type: str
    operator: str
    rule_value: str
    mandatory: bool = True


class ProgramEligibilityInput(BaseModel):
    program: str
    rules: list[ScholarshipRuleInput] = Field(default_factory=list)


class ScholarshipEligibilityInput(BaseModel):
    scholarship_rules: list[ScholarshipRuleInput] = Field(default_factory=list)
    program_rules: list[ProgramEligibilityInput] = Field(default_factory=list)


class ScholarshipDocumentInput(BaseModel):
    document_name: str
    requirement: str | None = None
    condition_text: str | None = None
    mandatory: bool = True
    source_sentence: str | None = None


class ScholarshipCoverageInput(BaseModel):
    benefit_type: str
    description: str
    program: str | None = None
    amount: float | None = None
    currency: str | None = None
    period: str | None = None
    coverage: str | None = None
    applicability: str | None = None


class ScholarshipContactInput(BaseModel):
    contact_type: str
    value: str


# Admin dashboard schemas:
# - No `sections` field; the crawler keeps its existing schema.
# - Includes cities, scholarship_type, and keywords.
# - Extra fields are rejected to catch misspelled request properties.

class AdminScholarshipCreate(BaseModel):
    scholarship_title: str = Field(min_length=1, max_length=255)
    country: str | None = None
    last_date_to_apply: str | None = None
    official_website: str | None = None
    bd_ambassy_website: str | None = None
    scholarship_type: str | None = None
    cities: list[str] = Field(default_factory=list)
    keywords: list[str] = Field(default_factory=list)

    programs: list[ScholarshipProgramInput] = Field(default_factory=list)
    eligibility: ScholarshipEligibilityInput = Field(
        default_factory=ScholarshipEligibilityInput
    )
    documents: list[ScholarshipDocumentInput] = Field(default_factory=list)
    coverage: list[ScholarshipCoverageInput] = Field(default_factory=list)
    contacts: list[ScholarshipContactInput] = Field(default_factory=list)

    model_config = ConfigDict(extra="forbid")


class AdminScholarshipUpdate(BaseModel):
    scholarship_title: str | None = Field(
        default=None, min_length=1, max_length=255
    )
    country: str | None = None
    last_date_to_apply: str | None = None
    official_website: str | None = None
    bd_ambassy_website: str | None = None
    scholarship_type: str | None = None
    cities: list[str] | None = None
    keywords: list[str] | None = None

    programs: list[ScholarshipProgramInput] | None = None
    eligibility: ScholarshipEligibilityInput | None = None
    documents: list[ScholarshipDocumentInput] | None = None
    coverage: list[ScholarshipCoverageInput] | None = None
    contacts: list[ScholarshipContactInput] | None = None

    model_config = ConfigDict(extra="forbid")
