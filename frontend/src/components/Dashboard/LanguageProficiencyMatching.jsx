
import { CheckCircle2, CircleX, Languages } from "lucide-react";

function displayValue(value, fallback = "—") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return (
      value
        .map((entry) => displayValue(entry, ""))
        .filter(Boolean)
        .join(", ") || fallback
    );
  }

  if (typeof value === "object") {
    if (
      value.type === "document" &&
      value.document_id !== undefined
    ) {
      return `Document (ID: ${value.document_id})`;
    }

    const preferred =
      value.label ??
      value.name ??
      value.language_name ??
      value.language ??
      value.test_name ??
      value.proficiency_type ??
      value.description ??
      value.message ??
      value.type;

    if (preferred !== undefined && preferred !== null) {
      return displayValue(preferred, fallback);
    }

    return (
      Object.entries(value)
        .map(
          ([key, entry]) =>
            `${key}: ${displayValue(entry, "")}`
        )
        .filter((entry) => !entry.endsWith(": "))
        .join(" · ") || fallback
    );
  }

  return String(value);
}

function formatPercentage(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? `${number.toFixed(2)}%`
    : String(value);
}

function getLanguageName(item) {
  if (typeof item === "string" || typeof item === "number") {
    return String(item);
  }

  return displayValue(
    item?.language_name ??
      item?.language ??
      item?.name ??
      item?.language_code ??
      item?.code,
    "Required language"
  );
}

function isLanguageMatched(item) {
  if (typeof item === "string" || typeof item === "number") {
    return null;
  }

  if (typeof item?.matched === "boolean") {
    return item.matched;
  }

  if (typeof item?.is_matched === "boolean") {
    return item.is_matched;
  }

  if (typeof item?.status === "string") {
    const status = item.status.toLowerCase();

    if (
      ["matched", "met", "fulfilled", "eligible"].includes(status)
    ) {
      return true;
    }

    if (
      ["unmatched", "missing", "not_met", "not matched"].includes(status)
    ) {
      return false;
    }
  }

  return null;
}

export default function LanguageProficiencyMatching({ result = null }) {
  const percentage =
    result?.percentage ??
    result?.matching_percentage ??
    (result?.maximum_score
      ? (Number(result.score || 0) /
          Number(result.maximum_score)) *
        100
      : null);

  const languages = Array.isArray(result?.languages)
    ? result.languages
    : Array.isArray(result?.results)
      ? result.results
      : [];

  const matchedCount =
    result?.matched_languages ??
    result?.matched_count ??
    languages.filter((item) => isLanguageMatched(item) === true).length;

  const unmatchedCount =
    result?.unmatched_languages ??
    result?.unmatched_count ??
    languages.filter((item) => isLanguageMatched(item) === false).length;

  const totalCount =
    result?.total_required_languages ??
    result?.total_languages ??
    languages.length;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
          Level 2
        </p>

        <h3 className="mt-1 flex items-center gap-2 text-lg font-black text-slate-900">
          <Languages size={19} />
          Language proficiency matching
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Checks the student's recorded language qualifications against the
          scholarship's required languages. This result is independent of Level 1.
        </p>
      </div>

      {!result ? (
        <p className="p-5 text-sm text-slate-500">
          Language proficiency matching results will appear when the analysis
          API returns language_proficiency_matching.
        </p>
      ) : (
        <div className="p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-violet-50 p-4">
              <p className="text-xs font-semibold text-violet-700">
                Language matching percentage
              </p>

              <p className="mt-1 text-3xl font-black tabular-nums text-violet-950">
                {formatPercentage(percentage)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-4 text-center">
              <div>
                <p className="text-xl font-black tabular-nums text-green-900">
                  {displayValue(matchedCount, "0")}
                </p>
                <p className="text-xs text-green-900">Matched</p>
              </div>

              <div>
                <p className="text-xl font-black tabular-nums text-slate-900">
                  {displayValue(unmatchedCount, "0")}
                </p>
                <p className="text-xs text-slate-500">Unmatched</p>
              </div>

              <div>
                <p className="text-xl font-black tabular-nums text-slate-900">
                  {displayValue(totalCount, "0")}
                </p>
                <p className="text-xs text-slate-500">Required</p>
              </div>
            </div>
          </div>

          {languages.length > 0 && (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Required language</th>
                    <th className="px-3 py-3">Student evidence</th>
                    <th className="px-3 py-3 text-right">Matching</th>
                  </tr>
                </thead>

                <tbody>
                  {languages.map((item, index) => {
                    const matched = isLanguageMatched(item);

                    const evidence = displayValue(
                      item?.evidence ??
                        item?.matched_by ??
                        item?.proficiency_type ??
                        item?.test_name ??
                        item?.source
                    );

                    return (
                      <tr
                        key={`${getLanguageName(item)}-${index}`}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="px-3 py-3 font-bold text-md text-slate-800">
                          {getLanguageName(item)}
                        </td>

                        <td className="px-3 py-3 text-slate-600">
                          {evidence.replace("_", " ").charAt(0).toUpperCase() + evidence.replace("_", " ").slice(1)}
                        </td>

                        <td className="px-3 py-3 text-right">
                          {matched === null ? (
                            <span className="text-slate-500">—</span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 font-semibold ${
                                matched
                                  ? "text-emerald-700"
                                  : "text-rose-600"
                              }`}
                            >
                              {matched ? (
                                <CheckCircle2 size={15} />
                              ) : (
                                <CircleX size={15} />
                              )}

                              {matched ? "Matched" : "Not matched"}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Each required language is counted once. For English, either an
            English MOI document or an English proficiency test can satisfy the
            requirement; having both does not add an extra match.
          </p>
        </div>
      )}
    </section>
  );
}
