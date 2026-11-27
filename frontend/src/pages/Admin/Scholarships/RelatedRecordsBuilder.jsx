import DocumentRequirements from "../../../components/Admin/Scholarships/DocumentRequirements";
import { Plus, Trash2 } from "lucide-react";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100";
const labelClass = "block text-xs font-semibold text-slate-600";
const buttonClass =
  "inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50";

const blankProgram = () => ({
  program: "",
  degree_level: [],
  duration: "",
  study_language: [],
});
const blankRule = () => ({
  rule_type: "",
  operator: ">=",
  rule_value: "",
  category: "academic",
  mandatory: true,
  study_language: null,
  condition: null,
  source_sentence: null,
});

const blankCoverage = () => ({
  benefit_type: "",
  description: "",
  program: null,
  amount: null,
  currency: "",
  period: "",
  coverage: "",
  applicability: "",
});
const blankContact = () => ({ contact_type: "", value: "" });

function Field({ label, children, className = "" }) {
  return (
    <label className={`${labelClass} ${className}`}>
      {label}
      {children}
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </Field>
  );
}

function Section({ title, description, items, onAdd, children, addLabel }) {
  return (
    <section className="space-y-3 border-t border-slate-100 pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <button type="button" onClick={onAdd} className={buttonClass}>
          <Plus size={15} />
          {addLabel}
        </button>
      </div>
      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-center text-sm text-slate-500">
          No {title.toLowerCase()} added. Use “{addLabel}” to add one.
        </div>
      ) : (
        children
      )}
    </section>
  );
}

function RemoveButton({ onClick, label = "Remove" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
    >
      <Trash2 size={14} />
      {label}
    </button>
  );
}

const SCHOLARSHIP_RULE_TYPES = [
  { value: "minimum_gpa", label: "Minimum GPA", input: "number", placeholder: "e.g. 3.8", step: "0.01", operators: [">=", ">", "<=", "<", "="], category: "academic" },
  { value: "IELTS", label: "IELTS score", input: "number", placeholder: "e.g. 6.0", step: "0.5", operators: [">=", ">", "<=", "<", "="], category: "academic" },
  { value: "Duolingo", label: "Duolingo score", input: "number", placeholder: "e.g. 100", step: "1", operators: [">=", ">", "<=", "<", "="], category: "academic" },
  { value: "work-experience", label: "Work experience", input: "number", placeholder: "Months, e.g. 30", step: "1", operators: [">=", ">", "<=", "<", "="], category: "academic", suffix: "months" },
  { value: "citizenship", label: "Citizenship", input: "select", options: ["International", "Domestic"], operators: ["=", "!="], category: "scholarship" },
  { value: "minimum_degree", label: "Minimum degree", input: "select", options: ["High School", "Diploma", "Bachelor", "Master", "PhD"], operators: [">=", "=", "in"], category: "academic" },
  { value: "entrance_exam", label: "Entrance exam", input: "select", options: ["CSCA", "SAT", "GRE", "GMAT", "University entrance exam", "Not required"], operators: ["=", "!=", "in"], category: "academic" },
  { value: "language_proficiency", label: "Language proficiency", input: "select", options: ["IELTS", "TOEFL", "Duolingo", "PTE", "HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6", "University admission requirements"], operators: ["=", "!=", ">=", "in"], category: "academic", language: true },
  { value: "health", label: "Health condition", input: "select", options: ["Good", "No serious illness", "Medically fit"], operators: ["=", "!="], category: "scholarship" },
  { value: "criminal_record", label: "Criminal record", input: "select", options: ["Clean", "No criminal record"], operators: ["=", "!="], category: "scholarship" },
  { value: "other", label: "Other requirement", input: "text", placeholder: "Describe the required value", operators: ["=", "!=", ">=", "<=", "contains", "in"], category: "academic" },
];

// Normalize legacy/database spellings so case and separators cannot
// bypass the one-rule-per-type restriction.
const normalizeRuleType = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  if (normalized === "citizen") return "citizenship";
  return normalized;
};

function ScholarshipRuleFields({ rule, onChange, onRemove, index, usedTypes }) {
  const selected = SCHOLARSHIP_RULE_TYPES.find((item) => item.value === rule.rule_type);
  const set = (key, value) => onChange({ ...rule, [key]: value });
  const operators = selected?.operators || [">=", "<=", ">", "<", "=", "!=", "in", "not_in", "contains"];

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Scholarship rule {index + 1}</span>
        <RemoveButton onClick={onRemove} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Rule type (locked after selection)">
          <select
            value={rule.rule_type || ""}
            disabled={Boolean(rule.rule_type)}
            onChange={(e) => {
              const definition = SCHOLARSHIP_RULE_TYPES.find((item) => item.value === e.target.value);
              if (!definition) return;
              onChange({
                ...rule,
                rule_type: definition.value,
                operator: definition.operators[0],
                rule_value: "",
                category: definition.category,
                study_language: null,
              });
            }}
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600`}
          >
            <option value="">Choose a requirement</option>
            {rule.rule_type && !selected && <option value={rule.rule_type}>{rule.rule_type} (existing rule)</option>}
            {SCHOLARSHIP_RULE_TYPES.filter((item) => normalizeRuleType(item.value) === normalizeRuleType(rule.rule_type) || !usedTypes.includes(normalizeRuleType(item.value))).map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
          {rule.rule_type && <span className="mt-1 block text-[11px] font-normal text-slate-500">This rule type is fixed. Remove this rule to choose another type.</span>}
        </Field>

        <Field label="Category">
          <select value={rule.category || selected?.category || "academic"} onChange={(e) => set("category", e.target.value)} className={inputClass}>
            <option value="academic">Academic</option>
            <option value="scholarship">Scholarship</option>
          </select>
        </Field>

        <Field label="Comparison operator">
          <select value={rule.operator || operators[0]} onChange={(e) => set("operator", e.target.value)} className={inputClass}>
            {operators.map((op) => <option key={op} value={op}>{op}</option>)}
          </select>
        </Field>

        <Field label={selected?.suffix ? `Required value (${selected.suffix})` : "Required value"}>
          {selected?.input === "select" ? (
            <select value={rule.rule_value ?? ""} onChange={(e) => set("rule_value", e.target.value)} className={inputClass}>
              <option value="">Select required value</option>
              {selected.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ) : (
            <input
              type={selected?.input === "number" ? "number" : "text"}
              min={selected?.input === "number" ? "0" : undefined}
              step={selected?.step}
              value={rule.rule_value ?? ""}
              onChange={(e) => set("rule_value", e.target.value)}
              placeholder={selected?.placeholder || "Enter required value"}
              className={inputClass}
            />
          )}
        </Field>

        {selected?.language && (
          <Field label="Study language">
            <select value={rule.study_language || ""} onChange={(e) => set("study_language", e.target.value || null)} className={inputClass}>
              <option value="">Select language</option>
              <option value="English">English</option>
              <option value="Chinese">Chinese</option>
              <option value="Non-Chinese">Non-Chinese</option>
            </select>
          </Field>
        )}

        <TextField label="Source sentence (optional)" value={rule.source_sentence || ""} onChange={(v) => set("source_sentence", v || null)} placeholder="Wording from official notice" />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={rule.mandatory !== false} onChange={(e) => set("mandatory", e.target.checked)} />
        Mandatory requirement
      </label>
    </div>
  );
}


const PROGRAM_RULE_TYPES = [
  { value: "age", label: "Age limit", input: "number", placeholder: "e.g. 25", step: "1", operators: ["<=", "<", ">=", ">", "="], category: "academic" },
  { value: "minimum_degree", label: "Minimum degree", input: "select", options: ["High School", "Diploma", "Bachelor", "Master", "PhD"], operators: [">=", "=", "in"], category: "academic" },
  { value: "entrance_exam", label: "Entrance exam", input: "select", options: ["CSCA", "SAT", "GRE", "GMAT", "University entrance exam", "Not required"], operators: ["=", "!=", "in"], category: "academic" },
  { value: "language_proficiency", label: "Language proficiency", input: "select", options: ["IELTS", "TOEFL", "Duolingo", "PTE", "HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6", "University admission requirements"], operators: ["=", "!=", ">=", "in"], category: "language", language: true },
  { value: "other", label: "Other program requirement", input: "text", placeholder: "Describe the required value", operators: ["=", "!=", ">=", "<=", "contains", "in"], category: "academic" },
];

function ProgramRuleFields({ rule, onChange, onRemove, index, usedTypes = [] }) {
  const selected = PROGRAM_RULE_TYPES.find(
    (item) => normalizeRuleType(item.value) === normalizeRuleType(rule.rule_type),
  );
  const set = (key, value) => onChange({ ...rule, [key]: value });
  const operators = selected?.operators || [">=", "<=", ">", "<", "=", "!=", "in", "not_in", "contains"];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">Program requirement {index + 1}</span>
        <RemoveButton onClick={onRemove} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Rule type (locked after selection)">
          <select
            value={rule.rule_type || ""}
            disabled={Boolean(rule.rule_type)}
            onChange={(e) => {
              const definition = PROGRAM_RULE_TYPES.find((item) => item.value === e.target.value);
              if (!definition) return;
              onChange({
                ...rule,
                rule_type: definition.value,
                operator: definition.operators[0],
                rule_value: "",
                category: definition.category,
                study_language: null,
              });
            }}
            className={`${inputClass} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-600`}
          >
            <option value="">Choose a program requirement</option>
            {PROGRAM_RULE_TYPES
              .filter((item) => normalizeRuleType(item.value) === normalizeRuleType(rule.rule_type) || !usedTypes.includes(normalizeRuleType(item.value)))
              .map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          {rule.rule_type && <span className="mt-1 block text-[11px] font-normal text-slate-500">This type is fixed. Remove this requirement to choose another.</span>}
        </Field>

        <Field label="Comparison operator">
          <select value={rule.operator || operators[0]} onChange={(e) => set("operator", e.target.value)} className={inputClass}>
            {operators.map((op) => <option key={op} value={op}>{op}</option>)}
          </select>
        </Field>

        <Field label={selected?.suffix ? `Required value (${selected.suffix})` : "Required value"}>
          {selected?.input === "select" ? (
            <select value={rule.rule_value ?? ""} onChange={(e) => set("rule_value", e.target.value)} className={inputClass}>
              <option value="">Select required value</option>
              {selected.options.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          ) : (
            <input
              type={selected?.input === "number" ? "number" : "text"}
              min={selected?.input === "number" ? "0" : undefined}
              step={selected?.step}
              value={rule.rule_value ?? ""}
              onChange={(e) => set("rule_value", e.target.value)}
              placeholder={selected?.placeholder || "Enter required value"}
              className={inputClass}
            />
          )}
        </Field>

        {selected?.language && (
          <Field label="Study language">
            <select value={rule.study_language || ""} onChange={(e) => set("study_language", e.target.value || null)} className={inputClass}>
              <option value="">Select language</option>
              <option value="English">English</option>
              <option value="Chinese">Chinese</option>
              <option value="Non-Chinese">Non-Chinese</option>
            </select>
          </Field>
        )}
        <TextField label="Source sentence (optional)" value={rule.source_sentence || ""} onChange={(v) => set("source_sentence", v || null)} placeholder="Wording from official notice" />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" checked={rule.mandatory !== false} onChange={(e) => set("mandatory", e.target.checked)} />
        Mandatory requirement
      </label>
    </div>
  );
}

export default function RelatedRecordsBuilder({ value, onChange }) {
  const eligibilityValue =
    value?.eligibility && typeof value.eligibility === "object"
      ? value.eligibility
      : {};
  const data = {
    programs: Array.isArray(value?.programs) ? value.programs : [],
    eligibility: {
      ...eligibilityValue,
      scholarship_rules: Array.isArray(eligibilityValue.scholarship_rules)
        ? eligibilityValue.scholarship_rules
        : [],
      program_rules: Array.isArray(eligibilityValue.program_rules)
        ? eligibilityValue.program_rules
        : [],
    },
    documents: Array.isArray(value?.documents) ? value.documents : [],
    coverage: Array.isArray(value?.coverage) ? value.coverage : [],
    contacts: Array.isArray(value?.contacts) ? value.contacts : [],
  };
  const set = (key, next) => onChange({ ...data, [key]: next });
  const updateItem = (key, index, patch) =>
    set(
      key,
      data[key].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  const updateRuleGroup = (index, patch) =>
    set("eligibility", {
      ...data.eligibility,
      program_rules: data.eligibility.program_rules.map((group, i) =>
        i === index ? { ...group, ...patch } : group,
      ),
    });
  const programNames = data.programs.map((p) => p.program).filter(Boolean);
  const usedScholarshipRuleTypes = data.eligibility.scholarship_rules
    .map((item) => normalizeRuleType(item.rule_type))
    .filter(Boolean);

  return (
    <div className="space-y-7">
      <Section
        title="Programs"
        description="Define the study programs offered under this scholarship."
        items={data.programs}
        onAdd={() => set("programs", [...data.programs, blankProgram()])}
        addLabel="Add program"
      >
        <div className="space-y-3">
          {data.programs.map((program, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm text-slate-700">
                  Program {i + 1}
                </strong>
                <RemoveButton
                  onClick={() =>
                    set(
                      "programs",
                      data.programs.filter((_, n) => n !== i),
                    )
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Program name"
                  value={program.program}
                  onChange={(v) => updateItem("programs", i, { program: v })}
                  placeholder="e.g. Master's"
                />
                <TextField
                  label="Duration"
                  value={program.duration}
                  onChange={(v) => updateItem("programs", i, { duration: v })}
                  placeholder="e.g. 2 years"
                />
                <Field label="Degree Subjects / Levels">
                  <input
                    value={(program.degree_level || []).join(", ")}
                    onChange={(e) =>
                      updateItem("programs", i, {
                        degree_level: e.target.value
                          .split(",")
                          .map((x) => x.trim()),
                      })
                    }
                    className={inputClass}
                    placeholder="CSE, Civil, Mechanical, Business, Finance etc."
                  />
                  <span className="mt-1 block font-normal text-slate-400">
                    Separate multiple values with commas.
                  </span>
                </Field>

                <Field label="Study languages">
                  <input
                    value={(program.study_language || []).join(", ")}
                    onChange={(e) =>
                      updateItem("programs", i, {
                        study_language: e.target.value
                          .split(",")
                          .map((x) => x.trim()),
                      })
                    }
                    className={inputClass}
                    placeholder="English, Chinese"
                  />
                  <span className="mt-1 block font-normal text-slate-400">
                    Separate multiple values with commas.
                  </span>
                </Field>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Eligibility"
        description="Scholarship-wide requirements are separate from program-specific requirements such as age and degree eligibility."
        items={data.eligibility.scholarship_rules}
        onAdd={() =>
          set("eligibility", {
            ...data.eligibility,
            scholarship_rules: [
              blankRule(),
              ...data.eligibility.scholarship_rules,
            ],
          })
        }
        addLabel="Add scholarship-wide rule"
      >
        <div className="space-y-4">
          {data.eligibility.scholarship_rules.map((rule, i) => (
            <div key={`scholarship-rule-segment-${i}`} className="space-y-4">
              {i > 0 && <div className="flex items-center gap-3"><div className="h-px flex-1 bg-slate-200" /><span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Next scholarship rule</span><div className="h-px flex-1 bg-slate-200" /></div>}
            <ScholarshipRuleFields
              rule={rule}
              index={i}
              usedTypes={usedScholarshipRuleTypes}
              onChange={(next) =>
                set("eligibility", {
                  ...data.eligibility,
                  scholarship_rules: data.eligibility.scholarship_rules.map(
                    (r, n) => (n === i ? next : r),
                  ),
                })
              }
              onRemove={() =>
                set("eligibility", {
                  ...data.eligibility,
                  scholarship_rules: data.eligibility.scholarship_rules.filter(
                    (_, n) => n !== i,
                  ),
                })
              }
            />
            </div>
          ))}
        </div>
        <div className="mt-7 border-t-2 border-dashed border-indigo-200 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-800">
                Program-specific rules
              </h4>
              <p className="text-xs text-slate-500">
                Requirements for an individual study program. Age limits belong here, not in scholarship-wide rules.
              </p>
            </div>
            <button
              type="button"
              disabled={!programNames.length}
              onClick={() =>
                set("eligibility", {
                  ...data.eligibility,
                  program_rules: [
                    ...data.eligibility.program_rules,
                    { program: programNames[0] || "", rules: [blankRule()] },
                  ],
                })
              }
              className={`${buttonClass} disabled:opacity-50`}
            >
              <Plus size={15} />
              Add program rules
            </button>
          </div>
          {data.eligibility.program_rules.map((group, i) => (
            <div
              key={i}
              className="rounded-xl border-2 border-indigo-100 bg-indigo-50/20 p-4 space-y-4"
            >
              <div className="flex items-end gap-3">
                <Field label="Study program" className="flex-1">
                  <select
                    value={group.program || ""}
                    onChange={(e) =>
                      updateRuleGroup(i, { program: e.target.value })
                    }
                    className={inputClass}
                  >
                    <option value="">Select program</option>
                    {programNames.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </Field>
                <RemoveButton
                  label="Remove group"
                  onClick={() =>
                    set("eligibility", {
                      ...data.eligibility,
                      program_rules: data.eligibility.program_rules.filter(
                        (_, n) => n !== i,
                      ),
                    })
                  }
                />
              </div>
              {(group.rules || []).map((rule, j) => (
                <div key={`program-${i}-rule-${j}`} className="space-y-4">
                  {j > 0 && <div className="flex items-center gap-3"><div className="h-px flex-1 bg-indigo-100" /><span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Next program requirement</span><div className="h-px flex-1 bg-indigo-100" /></div>}
                  <ProgramRuleFields
                    rule={rule}
                    index={j}
                    usedTypes={(group.rules || []).filter((_, n) => n !== j).map((item) => normalizeRuleType(item.rule_type)).filter(Boolean)}
                    onChange={(next) =>
                      updateRuleGroup(i, {
                        rules: group.rules.map((r, n) => (n === j ? next : r)),
                      })
                    }
                    onRemove={() =>
                      updateRuleGroup(i, {
                        rules: group.rules.filter((_, n) => n !== j),
                      })
                    }
                  />
                </div>
              ))}
              <div className="border-t border-indigo-100 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    updateRuleGroup(i, {
                      rules: [blankRule(), ...(group.rules || [])],
                    })
                  }
                  className={buttonClass}
                >
                  <Plus size={15} />
                  Add program requirement
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <section className="space-y-3 border-t border-slate-100 pt-6">
        <DocumentRequirements
          value={data.documents}
          onChange={(documents) => set("documents", documents)}
        />
      </section>

      <Section
        title="Coverage"
        description="Describe the financial and other benefits provided by the scholarship."
        items={data.coverage}
        onAdd={() => set("coverage", [...data.coverage, blankCoverage()])}
        addLabel="Add coverage"
      >
        <div className="space-y-3">
          {data.coverage.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <strong className="text-sm text-slate-700">
                  Coverage {i + 1}
                </strong>
                <RemoveButton
                  onClick={() =>
                    set(
                      "coverage",
                      data.coverage.filter((_, n) => n !== i),
                    )
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Benefit type"
                  value={item.benefit_type}
                  onChange={(v) =>
                    updateItem("coverage", i, { benefit_type: v })
                  }
                  placeholder="Tuition, Stipend, Accommodation"
                />
                <TextField
                  label="Description"
                  value={item.description}
                  onChange={(v) =>
                    updateItem("coverage", i, { description: v })
                  }
                  placeholder="Full tuition coverage"
                />
                <Field label="Applicable program (optional)">
                  <select
                    value={item.program || ""}
                    onChange={(e) =>
                      updateItem("coverage", i, {
                        program: e.target.value || null,
                      })
                    }
                    className={inputClass}
                  >
                    <option value="">All programs / Not specified</option>
                    {programNames.map((name) => (
                      <option key={name}>{name}</option>
                    ))}
                  </select>
                </Field>
                <TextField
                  label="Amount (optional)"
                  type="number"
                  value={item.amount ?? ""}
                  onChange={(v) =>
                    updateItem("coverage", i, { amount: v === "" ? null : v })
                  }
                  placeholder="e.g. 1500"
                />
                <TextField
                  label="Currency"
                  value={item.currency || ""}
                  onChange={(v) =>
                    updateItem("coverage", i, { currency: v || null })
                  }
                  placeholder="USD, CNY, EUR"
                />
                <TextField
                  label="Payment period"
                  value={item.period || ""}
                  onChange={(v) =>
                    updateItem("coverage", i, { period: v || null })
                  }
                  placeholder="Monthly, annually, one-time"
                />
                <TextField
                  label="Coverage details"
                  value={item.coverage || ""}
                  onChange={(v) =>
                    updateItem("coverage", i, { coverage: v || null })
                  }
                  placeholder="Full, partial, percentage"
                />
                <TextField
                  label="Applicability conditions"
                  value={item.applicability || ""}
                  onChange={(v) =>
                    updateItem("coverage", i, { applicability: v || null })
                  }
                  placeholder="Conditions or notes"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Contacts"
        description="Add official websites, email addresses, phone numbers, or embassy contacts."
        items={data.contacts}
        onAdd={() => set("contacts", [...data.contacts, blankContact()])}
        addLabel="Add contact"
      >
        <div className="space-y-3">
          {data.contacts.map((contact, i) => (
            <div key={i} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <strong className="text-sm text-slate-700">
                  Contact {i + 1}
                </strong>
                <RemoveButton
                  onClick={() =>
                    set(
                      "contacts",
                      data.contacts.filter((_, n) => n !== i),
                    )
                  }
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField
                  label="Contact type"
                  value={contact.contact_type}
                  onChange={(v) =>
                    updateItem("contacts", i, { contact_type: v })
                  }
                  placeholder="Official website, Email, Phone"
                />
                <TextField
                  label="Contact value"
                  value={contact.value}
                  onChange={(v) => updateItem("contacts", i, { value: v })}
                  placeholder="https://..., email, phone number"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
