import { useCallback, useEffect, useState } from "react";
import DocumentMatchingLevel from "./DocumentMatchingLevel";
import LanguageProficiencyMatching from "./LanguageProficiencyMatching";
import EligibilityMatchingLevel from "./EligibilityMatchingLevel";
import { History, ChevronDown, RefreshCw, Loader2, Search } from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

function formatPercentage(value) {
  if (value === null || value === undefined || value === "") return "—";

  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return `${number.toFixed(2)}%`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  // API returns UTC timestamps without timezone information.
  const normalizedValue =
    typeof value === "string" && !/(Z|[+-]\d{2}:\d{2})$/i.test(value)
      ? `${value}Z`
      : value;

  const date = new Date(normalizedValue);

  if (Number.isNaN(date.getTime())) return value;

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return date.toLocaleString("en-GB", {
    timeZone: timezone,
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getLanguageMatching(item) {
  return item?.summary?.language_proficiency_matching || null;
}


// Shape the saved history payload for the same reusable result components
// rendered by EligibilityAnalysisPage. No new analysis is run here.
function getSavedDocumentResult(item) {
  const summary = item?.summary || {};
  const raw = summary.document_matching || summary.document_readiness || null;
  const savedDocuments = Array.isArray(item?.documents) ? item.documents : [];
  const unreliableIds = ["b9543954-3999-45f6-a9ab-6ba1c85af882"];

  if (unreliableIds.includes(item?.check_uuid)) return null;
  if (!raw && savedDocuments.length === 0) return null;

  const savedResults = Array.isArray(raw?.results) ? raw.results : savedDocuments;

  return {
    ...(raw || {}),
    results: savedResults.map((document) => ({
      ...document,
      status:
        document.status === "matched"
          ? "met"
          : document.status === "missing"
            ? "not_met"
            : document.status,
      score: document.score ?? document.document_score ?? 0,
      maximum_score:
        document.maximum_score ??
        document.document_max_score ??
        document.max_score ??
        0,
      percentage:
        document.percentage ?? document.document_percentage ?? null,
    })),
    percentage: raw?.percentage ?? raw?.matching_percentage ?? null,
    score: raw?.score ?? raw?.points_earned ?? null,
    maximum_score: raw?.maximum_score ?? raw?.points_possible ?? null,
    matched_documents:
      raw?.matched_documents ??
      savedDocuments.filter((doc) => ["matched", "met"].includes(doc.status)).length,
    missing_documents:
      raw?.missing_documents ??
      savedDocuments.filter((doc) => ["missing", "not_met"].includes(doc.status)).length,
  };
}

function getSavedEligibilityResult(item) {
  const summary = item?.summary || {};
  const raw = summary.eligibility_matching || {};
  const savedRequirements = Array.isArray(item?.requirements)
    ? item.requirements
    : Array.isArray(summary.requirements)
      ? summary.requirements
      : [];
  const results = Array.isArray(raw.results) ? raw.results : savedRequirements;
  const scoreSummary = summary.eligibility_score || {};

  if (
    results.length === 0 &&
    raw.percentage == null &&
    raw.score == null &&
    scoreSummary.percentage == null &&
    scoreSummary.score == null
  ) {
    return null;
  }

  return {
    ...raw,
    results: results.map((requirement) => ({
      ...requirement,
      rule_type:
        requirement.rule_type ||
        requirement.rule_name ||
        requirement.requirement_name ||
        requirement.name ||
        "Requirement",
      required_value: requirement.required_value ?? requirement.rule_value,
      student_value: requirement.student_value ?? requirement.actual_value,
    })),
    percentage:
      raw.percentage ??
      raw.score ??
      scoreSummary.percentage ??
      scoreSummary.score ??
      null,
    points_earned: raw.points_earned ?? scoreSummary.points_earned ?? null,
    points_possible: raw.points_possible ?? scoreSummary.points_possible ?? null,
  };
}

function getSavedRecommendations(item) {
  const recommendations =
    item?.summary?.recommendations ?? item?.recommendations ?? [];
  return Array.isArray(recommendations)
    ? recommendations
    : recommendations
      ? [recommendations]
      : [];
}

function Recommendations({ items }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-slate-900">Improvement recommendations</h3>
      </div>
      {items.length ? (
        <ul className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li key={item?.id ?? index} className="flex gap-3 text-sm leading-6 text-slate-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-700">
                {index + 1}
              </span>
              <span>
                {typeof item === "string"
                  ? item
                  : item?.recommendation ||
                    item?.suggestion ||
                    item?.message ||
                    item?.description ||
                    item?.reason ||
                    JSON.stringify(item)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          No improvement recommendations were returned for this analysis.
        </p>
      )}
    </section>
  );
}


const getHistoryKey = (item, historyList = []) =>
  item.check_uuid || `history-${historyList.indexOf(item)}`;

function EligibilityHistory({ search = "" }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  const normalizedSearch = search.trim().toLowerCase();

const filteredHistory = history.filter((item) => {
    if (!normalizedSearch) return true;

    const searchableFields = [
        item.scholarship_title,
        item.title,
        item.country,
        item.program_name,
    ];

    return searchableFields.some((field) =>
        String(field ?? "")
            .toLowerCase()
            .includes(normalizedSearch)
    );
});

// API request only — no React state updates here.
const requestHistory = useCallback(async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in to view your eligibility history.");
  }

  const response = await fetch(`${API_BASE_URL}/api/matching/history`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Unable to load history. Server returned ${response.status}.`
    );
  }

  const data = await response.json();

  return Array.isArray(data?.history) ? data.history : [];
}, []);

// Initial history loading.
useEffect(() => {
  let isActive = true;

  requestHistory()
    .then((records) => {
      if (!isActive) return;

      setHistory(records);

      setExpandedItems(
  Object.fromEntries(
    records.map((item, index) => [
      item.check_uuid || `history-${index}`,
      true,
    ])
  )
);

      setError("");
    })
    .catch((err) => {
      if (!isActive) return;

      console.error("Error fetching eligibility history:", err);
      setError(err.message || "Failed to load eligibility history.");
    })
    .finally(() => {
      if (isActive) {
        setLoading(false);
      }
    });

  return () => {
    isActive = false;
  };
}, [requestHistory]);

// Manual refresh.
const fetchHistory = useCallback(async () => {
  try {
    setRefreshing(true);
    setError("");

    const records = await requestHistory();

    setHistory(records);

    setExpandedItems(
      Object.fromEntries(
        records.map((item, index) => [
          item.check_uuid || `history-${index}`,
          true,
        ])
      )
    );
  } catch (err) {
    console.error("Error refreshing eligibility history:", err);
    setError(err.message || "Failed to refresh eligibility history.");
  } finally {
    setRefreshing(false);
  }
}, [requestHistory]);


  const toggleExpanded = (checkUuid) => {
    setExpandedItems((previous) => ({
      ...previous,
      [checkUuid]: !previous[checkUuid],
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">
          Loading eligibility history...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-5">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <History className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">
             Matching History
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Review your previous scholarship eligibility and document matching
            results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {filteredHistory.length > 0 && (
            <button
              type="button"
              onClick={() => {
  const shouldExpand = !filteredHistory.every((item) =>
    Boolean(expandedItems[getHistoryKey(item, history)])
  );

  setExpandedItems((previous) => ({
    ...previous,
    ...Object.fromEntries(
      filteredHistory.map((item) => [
        getHistoryKey(item, history),
        shouldExpand,
      ])
    ),
  }));
}}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {filteredHistory.every((item) =>
  Boolean(expandedItems[getHistoryKey(item, history)])
)
  ? "Collapse all"
  : "Expand all"}
            </button>
          )}

          <button
          type="button"
            onClick={fetchHistory}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =================================================
    HISTORY CONTENT
================================================= */}

{!loading && !error && (
    <>
        {/* No history available */}
        {history.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <Search className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                    No eligibility history found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    You haven't saved any scholarship eligibility checks yet.
                    Run an eligibility analysis to see your results here.
                </p>
            </div>
        )}

        {/* Search returned no results */}
        {history.length > 0 && filteredHistory.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <Search className="h-6 w-6" />
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-800">
                    No matching scholarships found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                    We couldn't find any saved eligibility checks matching
                    "{search}". Try another scholarship name, country, or program.
                </p>
            </div>
        )}

        {/* Matching history records */}
        {filteredHistory.length > 0 && (
            <div className="space-y-5">
                {filteredHistory.map((item) => {
                    const summary = item.summary || {};

          const documentMatchingResult = getSavedDocumentResult(item);
          const languageMatchingResult = getLanguageMatching(item);
          const eligibilityMatchingResult = getSavedEligibilityResult(item);
          const recommendations = getSavedRecommendations(item);

          const checkUuid = getHistoryKey(item);

          const isExpanded = !!expandedItems[checkUuid];

          return (
            <div
              key={checkUuid}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {/* Record heading */}
              <div className="p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-gray-900">
                      {item.scholarship_title || item.title || "Scholarship"}
                    </h2>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span>{item.country || "Country unavailable"}</span>

                      <span>
                        Program: {item.program_name || "Not specified"}
                      </span>

                      <span>{formatDate(item.created_at)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpanded(checkUuid)}
                    className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    {isExpanded ? "Hide details" : "View details"}

                    <ChevronDown
                      size={17}
                      className={`transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Same matching overview as the single analysis page. */}
                <section className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-6">
                  <h3 className="text-center text-sm font-black uppercase tracking-[0.16em] text-slate-700 sm:text-base">
                    Match Making Score
                  </h3>

                  <div className="mt-4 flex justify-center">
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[5px] border-sky-200 bg-white shadow-sm sm:h-36 sm:w-36">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">Overall</span>
                      <span className="mt-1 text-3xl font-black tabular-nums text-slate-900 sm:text-4xl">
                        {formatPercentage(
                          summary.matching_score_summary?.percentage ??
                            summary.overall_matching_score ??
                            summary.matching_score_summary?.score,
                        )}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">Match score</span>
                    </div>
                  </div>

                  <div className="my-6 border-t border-slate-300" />

                  <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    <div className="px-3 py-4 text-center sm:px-5">
                      <p className="text-xs font-black uppercase tracking-wider text-sky-700">Level 1</p>
                      <h4 className="mt-1 text-base font-bold text-slate-900">Document</h4>
                      <p className="mt-2 text-3xl font-black tabular-nums text-sky-800">
                        {formatPercentage(documentMatchingResult?.percentage)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {documentMatchingResult?.score ?? 0} / {documentMatchingResult?.maximum_score ?? 0} points
                      </p>
                    </div>

                    <div className="px-3 py-4 text-center sm:px-5">
                      <p className="text-xs font-black uppercase tracking-wider text-violet-700">Level 2</p>
                      <h4 className="mt-1 text-base font-bold text-slate-900">Language</h4>
                      <p className="mt-2 text-3xl font-black tabular-nums text-violet-800">
                        {formatPercentage(languageMatchingResult?.percentage)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {languageMatchingResult?.points_earned ?? languageMatchingResult?.score ?? 0} / {languageMatchingResult?.points_possible ?? languageMatchingResult?.maximum_score ?? 0} points
                      </p>
                    </div>

                    <div className="px-3 py-4 text-center sm:px-5">
                      <p className="text-xs font-black uppercase tracking-wider text-emerald-700">Level 3</p>
                      <h4 className="mt-1 text-base font-bold text-slate-900">Eligibility</h4>
                      <p className="mt-2 text-3xl font-black tabular-nums text-emerald-800">
                        {formatPercentage(eligibilityMatchingResult?.percentage)}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {eligibilityMatchingResult?.points_earned ?? 0} / {eligibilityMatchingResult?.points_possible ?? 0} points
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-center text-[11px] text-slate-500">
                    Saved Level 1, Level 2 and Level 3 results from this analysis. Opening history does not run a new analysis.
                  </p>
                </section>
              </div>

              {/* Reuse the same Level 1, Level 2 and Level 3 UI components
                  that are rendered on EligibilityAnalysisPage. */}
              {isExpanded && (
                <div className="space-y-6 border-t border-gray-200 bg-gray-50 p-5 md:p-6">
                  <DocumentMatchingLevel
                    scholarshipId={item.scholarship_id ?? item.scholarshipId ?? null}
                    initialResult={documentMatchingResult}
                  />

                  <LanguageProficiencyMatching
                    result={languageMatchingResult}
                  />

                  <EligibilityMatchingLevel
                    result={eligibilityMatchingResult}
                  />

                  <Recommendations items={recommendations} />
                </div>
              )}
            </div>
          );
                })}
            </div>
        )}
    </>
)}
    </div>
  );
}

export default EligibilityHistory;
