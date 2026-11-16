import { CheckCircle2, CircleHelp, CircleX, ClipboardCheck } from "lucide-react";

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");
  if (typeof value === "object") {
    return (
      value.nationality
        ? `${value.nationality}${value.international_student === undefined ? "" : ` · International: ${value.international_student ? "Yes" : "No"}`}`
        : value.label || value.name || value.value || JSON.stringify(value)
    );
  }
  return String(value);
}

function Status({ status }) {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "met") {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
        <CheckCircle2 size={15} /> Met
      </span>
    );
  }

  if (normalized === "not_met") {
    return (
      <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600">
        <CircleX size={15} /> Not met
      </span>
    );
  }

  if (normalized === "not_applicable") {
    return <span className="font-semibold text-slate-500">Not applicable</span>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-700">
      <CircleHelp size={15} /> Under review
    </span>
  );
}

export default function EligibilityMatchingLevel({ result = null }) {
  const rules = Array.isArray(result?.results) ? result.results : [];
  const percentage = result?.percentage ?? result?.score ?? null;

  const counts = {
    met: rules.filter((rule) => rule.status === "met").length,
    notMet: rules.filter((rule) => rule.status === "not_met").length,
    unknown: rules.filter((rule) => rule.status === "unknown").length,
    notApplicable: rules.filter((rule) => rule.status === "not_applicable").length,
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Level 3
        </p>
        <h3 className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
          <ClipboardCheck size={19} /> Eligibility matching
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Evaluates scholarship eligibility rules against the student's profile,
          checklist documents, and language qualifications.
        </p>
      </div>

      {!result ? (
        <p className="p-5 text-sm text-slate-500">
          Eligibility-rule results will appear after the analysis.
        </p>
      ) : (
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold text-emerald-800">
                Eligibility matching score
              </p>
              <p className="mt-1 text-3xl font-black tabular-nums text-emerald-950">
                {percentage === null || percentage === undefined ? "—" : `${Number(percentage).toFixed(0)}%`}
              </p>
              <p className="mt-1 text-xs font-semibold text-emerald-800">
                {result.points_earned ?? 0} / {result.points_possible ?? (rules.filter((rule) => ["met", "not_met", "unknown"].includes(rule.status)).length * 3)} points
                <span className="font-normal"> · 3 points per met rule</span>
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 rounded-xl bg-slate-50 p-3 text-center">
              <div>
                <p className="text-xl font-black text-emerald-700">{counts.met}</p>
                <p className="text-[11px] text-slate-500">Met</p>
              </div>
              <div>
                <p className="text-xl font-black text-rose-600">{counts.notMet}</p>
                <p className="text-[11px] text-slate-500">Failed</p>
              </div>
              <div>
                <p className="text-xl font-black text-amber-700">{counts.unknown}</p>
                <p className="text-[11px] text-slate-500">Review</p>
              </div>
              <div>
                <p className="text-xl font-black text-slate-700">{counts.notApplicable}</p>
                <p className="text-[11px] text-slate-500">N/A</p>
              </div>
            </div>
          </div>

          {rules.length > 0 ? (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Eligibility requirement</th>
                    <th className="px-3 py-3">Student information</th>
                    <th className="px-3 py-3">Scholarship rule</th>
                    <th className="px-3 py-3">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {rules.map((rule, index) => (
                    <tr
                      key={`${rule.rule_id ?? rule.rule_type ?? "rule"}-${index}`}
                      className="border-b border-slate-100 last:border-0 align-top"
                    >
                      <td className="px-3 py-3">
                        <p className="font-bold text-slate-800">
                          {String(rule.rule_type || "Requirement").replaceAll("_", " ")}
                        </p>
                        {rule.source_sentence && (
                          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                            {rule.source_sentence}
                          </p>
                        )}
                        <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${rule.mandatory ? "bg-sky-50 text-sky-700" : "bg-violet-50 text-violet-700"}`}>
                          {rule.mandatory ? "Mandatory" : "Preferred"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {displayValue(rule.student_value)}
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        <span className="font-semibold">
                          {rule.operator ? `${rule.operator} ` : ""}
                          {displayValue(rule.required_value ?? rule.rule_value)}
                        </span>
                        {rule.study_language && (
                          <p className="mt-1 text-xs text-slate-500">
                            Study language: {displayValue(rule.study_language)}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <Status status={rule.status} />
                        {rule.reason && (
                          <p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">
                            {rule.reason}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No eligibility rules were returned for this scholarship program.
            </p>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Language proficiency requirements are evaluated here against the
            scholarship's extracted rule thresholds. Level 2 separately checks
            the program's required study language.
          </p>
        </div>
      )}
    </section>
  );
}
