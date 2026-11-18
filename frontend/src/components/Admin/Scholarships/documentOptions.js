
export const DOCUMENT_OPTIONS = [
  ["passport-doc", "Passport"],
  ["nid-doc", "NID Card"],
  ["health-doc", "Health Certificate"],
  ["transcript-doc", "Academic Transcript"],
  ["certificate-doc", "Degree Certificate"],
  ["cv-doc", "CV / Resume"],
  ["study-plan-doc", "Study Plan"],
  ["recommendation-doc", "Recommendation Letter"],
  ["moi-doc", "Language Proficiency Certificate (MOI)"],
  ["pof-doc", "Proof of Fund"],
  ["research-doc", "Research Proposal"],
  ["pcc-doc", "Police Clearance Certificate"],
  ["portfolio-doc", "Portfolio"],
  ["application-form-doc", "Application Form"],
];

const LABEL_BY_CODE = Object.fromEntries(
  DOCUMENT_OPTIONS.map(([code, label]) => [code, label])
);

const CODE_BY_LABEL = Object.fromEntries(
  DOCUMENT_OPTIONS.map(([code, label]) => [label.toLowerCase(), code])
);

// Convert old underscore-based codes into the new hyphen-based codes.
const LEGACY_CODE_MAP = {
  passport_doc: "passport-doc",
  nid_doc: "nid-doc",
  nic_doc: "nid-doc",
  health_doc: "health-doc",
  transcript_doc: "transcript-doc",
  certificate_doc: "certificate-doc",
  cv_doc: "cv-doc",
  study_plan_doc: "study-plan-doc",
  recommendation_doc: "recommendation-doc",
  moi_doc: "moi-doc",
  pof_doc: "pof-doc",
  research_doc: "research-doc",
  pcc_doc: "pcc-doc",
  portfolio_doc: "portfolio-doc",
  application_form_doc: "application-form-doc",
};

export const getDocumentCode = (value) => {
  const raw = String(value || "").trim();

  if (!raw) return "";

  return (
    LEGACY_CODE_MAP[raw] ||
    CODE_BY_LABEL[raw.toLowerCase()] ||
    raw
  );
};

export const getDocumentLabel = (code) => {
  const normalized = getDocumentCode(code);

  return LABEL_BY_CODE[normalized] || normalized || "Unknown document";
};
