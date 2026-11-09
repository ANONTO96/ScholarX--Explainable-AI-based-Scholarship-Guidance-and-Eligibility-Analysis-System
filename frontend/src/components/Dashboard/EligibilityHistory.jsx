import { useCallback, useEffect, useState } from "react";
import {
  History,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  CircleAlert,
  XCircle,
  FileText,
  Loader2,
  Languages
} from "lucide-react";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

function formatPercentage(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return `${number.toFixed(2)}%`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

function getDocumentReadiness(item) {
  const summary = item.summary || {};

  return summary.document_matching || summary.document_readiness || {};
}

function getLanguageMatching(item) {
  return item?.summary?.language_proficiency_matching || null;
}

function getLanguageEvidence(evidence) {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    return "No matching evidence found";
  }

  return evidence
    .map((item) => {
      if (item.type === "moi_document") {
        return "Medium of Instruction (MOI) document";
      }

      if (item.type === "proficiency_test") {
        const details = [
          item.test_name,
          item.score != null ? `Score: ${item.score}` : null,
          item.proficiency_level ? `Level: ${item.proficiency_level}` : null,
        ].filter(Boolean);

        return details.join(" · ") || "Proficiency test record";
      }

      return item.type || "Evidence available";
    })
    .join("; ");
}

function getRequirementStatus(status) {
  switch (status) {
    case "met":
      return {
        label: "Met",
        color: "text-green-700 bg-green-50",
        icon: CheckCircle2,
      };

    case "not_met":
      return {
        label: "Not met",
        color: "text-red-700 bg-red-50",
        icon: XCircle,
      };

    case "unknown":
      return {
        label: "Unknown",
        color: "text-yellow-700 bg-yellow-50",
        icon: CircleAlert,
      };

    case "not_applicable":
      return {
        label: "Not applicable",
        color: "text-gray-600 bg-gray-100",
        icon: CircleAlert,
      };

    default:
      return {
        label: status || "Unavailable",
        color: "text-gray-600 bg-gray-100",
        icon: CircleAlert,
      };
  }
}

function getDocumentStatus(document) {
  switch (document.status) {
    case "matched":
      return {
        label: "Matched",
        color: "text-green-700 bg-green-50",
        icon: CheckCircle2,
      };

    case "optional_missing":
      return {
        label: "Optional missing",
        color: "text-yellow-700 bg-yellow-50",
        icon: CircleAlert,
      };

    case "missing":
      return {
        label: "Missing",
        color: "text-red-700 bg-red-50",
        icon: XCircle,
      };

    default:
      return {
        label: document.status || "Unknown",
        color: "text-gray-600 bg-gray-100",
        icon: CircleAlert,
      };
  }
}

function isUnreliableLegacyDocumentData(item) {
  // This is the specific old record we previously identified
  // as having corrupted document data.
  const corruptedLegacyIds = ["b9543954-3999-45f6-a9ab-6ba1c85af882"];

  return corruptedLegacyIds.includes(item.check_uuid);
}

function Metric({ label, value, color = "text-gray-900" }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value ?? "—"}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const Icon = status.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}
    >
      <Icon size={14} />
      {status.label}
    </span>
  );
}

function EligibilityHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [expandedItems, setExpandedItems] = useState({});

  const fetchHistory = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view your eligibility history.");
        setHistory([]);
        return;
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
          `Unable to load history. Server returned ${response.status}.`,
        );
      }

      const data = await response.json();
      const records = Array.isArray(data.history) ? data.history : [];

      setHistory(records);

      // Show every saved analysis and its individual document rows on the
      // overall Eligibility Analysis page immediately after loading.
      setExpandedItems(
        Object.fromEntries(
          records.map((item, index) => [
            item.check_uuid || `history-${index}`,
            true,
          ]),
        ),
      );
    } catch (err) {
      console.error("Eligibility history error:", err);
      setError(err.message || "Failed to load eligibility history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <History className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">
              Eligibility History
            </h1>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            Review your previous scholarship eligibility and document matching
            results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                const shouldExpand = !history.every((item, index) =>
                  Boolean(expandedItems[item.check_uuid || `history-${index}`]),
                );

                setExpandedItems(
                  Object.fromEntries(
                    history.map((item, index) => [
                      item.check_uuid || `history-${index}`,
                      shouldExpand,
                    ]),
                  ),
                );
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              {history.every((item, index) =>
                Boolean(expandedItems[item.check_uuid || `history-${index}`]),
              )
                ? "Collapse all"
                : "Expand all"}
            </button>
          )}

          <button
            onClick={() => fetchHistory(true)}
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

      {/* Empty state */}
      {!error && history.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <History size={42} className="mx-auto text-gray-400" />

          <h2 className="mt-4 text-lg font-bold text-gray-800">
            No eligibility history found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Your completed scholarship eligibility checks will appear here.
          </p>
        </div>
      )}

      {/* History records */}
      <div className="space-y-5">
        {history.map((item, index) => {
          const summary = item.summary || {};
          const eligibilityScore = summary.eligibility_score || {};

          const requirements = Array.isArray(item.requirements)
            ? item.requirements
            : [];

          const documents = Array.isArray(item.documents) ? item.documents : [];

          const documentReadiness = getDocumentReadiness(item);
          const languageMatching = getLanguageMatching(item);

          const languageResults = Array.isArray(languageMatching?.languages)
            ? languageMatching.languages
            : [];

          const isEvaluated = summary.status === "evaluated";

          const unreliableDocumentData = isUnreliableLegacyDocumentData(item);

          const hasDocumentRecords =
            isEvaluated &&
            documents.length > 0 &&
            documentReadiness.available !== false &&
            !unreliableDocumentData;

          const checkUuid = item.check_uuid || `history-${index}`;

          const isExpanded = !!expandedItems[checkUuid];

          const eligibilityPercentage =
            eligibilityScore.percentage ?? eligibilityScore.score;

          function formatDocumentName(name) {
            if (!name) return "Unnamed Document";

            return String(name)
              .replace(/[-_]/g, " ")
              .replace(/\s*doc$/i, "")
              .trim()
              .toLowerCase()
              .replace(/\b\w/g, (char) => char.toUpperCase())
              .replace(/\b(Pcc|Moi)\b/gi, (word) => word.toUpperCase());
          }

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

                {/* Summary metrics */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Metric
                    label="Eligibility Score"
                    value={
                      eligibilityPercentage != null
                        ? formatPercentage(eligibilityPercentage)
                        : "Not available"
                    }
                    color="text-blue-700"
                  />

                  <Metric
                    label="Document Matching"
                    value={
                      hasDocumentRecords
                        ? formatPercentage(documentReadiness.percentage)
                        : unreliableDocumentData
                          ? "Historical data issue"
                          : "Not recorded"
                    }
                    color="text-violet-700"
                  />

                  <Metric
                    label="Language Proficiency"
                    value={
                      languageMatching
                        ? formatPercentage(languageMatching.percentage)
                        : "Not recorded"
                    }
                    color="text-emerald-700"
                  />
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="space-y-7 border-t border-gray-200 bg-gray-50 p-5 md:p-6">
                  {/* Eligibility requirements */}
                  <section>
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        Eligibility Analysis
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Saved eligibility rule results for this scholarship
                        check.
                      </p>
                    </div>

                    {requirements.length === 0 ? (
                      <p className="rounded-lg bg-white p-4 text-sm text-gray-500">
                        No eligibility requirement records available.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {requirements.map((requirement, reqIndex) => {
                          const status = getRequirementStatus(
                            requirement.status,
                          );

                          return (
                            <div
                              key={requirement.id || reqIndex}
                              className="rounded-xl border border-gray-200 bg-white p-4"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {requirement.rule_name ||
                                      requirement.requirement_name ||
                                      requirement.name ||
                                      `Requirement ${reqIndex + 1}`}
                                  </p>

                                  {requirement.reason && (
                                    <p className="mt-1 text-sm text-gray-500">
                                      {requirement.reason}
                                    </p>
                                  )}
                                </div>

                                <StatusBadge status={status} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </section>

                  {/* Document matching */}
                  <section>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <FileText size={21} className="text-violet-600" />

                        <h3 className="text-lg font-bold text-gray-900">
                          Document Matching
                        </h3>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Previously saved document matching results for this
                        check.
                      </p>
                    </div>

                    {!hasDocumentRecords ? (
                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <div className="flex items-start gap-3">
                          <CircleAlert
                            className="mt-0.5 shrink-0 text-yellow-700"
                            size={20}
                          />

                          <div>
                            <p className="font-semibold text-yellow-900">
                              {unreliableDocumentData
                                ? "Historical document data may be inaccurate"
                                : "Document results not recorded"}
                            </p>

                            <p className="mt-1 text-sm text-yellow-800">
                              {unreliableDocumentData
                                ? "This older record contains inconsistent document information. Its document matching score should not be treated as reliable."
                                : "Individual document matching results are not available for this history record. This does not mean that all documents were missing."}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Main matching score */}
                        <div className="mb-4 rounded-xl border border-violet-200 bg-violet-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-violet-900">
                                Document Matching Score
                              </p>

                              <p className="mt-1 text-sm text-violet-700">
                                Saved document matching result
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-2xl font-black text-violet-700">
                                {formatPercentage(documentReadiness.percentage)}
                              </p>

                              <p className="text-xs font-semibold text-violet-600">
                                {documentReadiness.score ?? 0}
                                {" / "}
                                {documentReadiness.maximum_score ?? 0}
                                {" points"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Document summary */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                          <Metric
                            label="Total Documents"
                            value={
                              documentReadiness.total_documents ??
                              documents.length
                            }
                          />

                          <Metric
                            label="Matched"
                            value={
                              documentReadiness.matched_documents ??
                              documents.filter(
                                (doc) => doc.status === "matched",
                              ).length
                            }
                            color="text-green-700"
                          />

                          <Metric
                            label="Missing Mandatory"
                            value={
                              documentReadiness.missing_mandatory ??
                              documents.filter(
                                (doc) => doc.status === "missing",
                              ).length
                            }
                            color="text-red-700"
                          />

                          <Metric
                            label="Missing Optional"
                            value={
                              documentReadiness.missing_optional ??
                              documents.filter(
                                (doc) => doc.status === "optional_missing",
                              ).length
                            }
                            color="text-yellow-700"
                          />
                        </div>

                        {/* Document counts */}
                        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4">
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                            <span>
                              Mandatory:{" "}
                              <strong>
                                {documentReadiness.mandatory_documents ?? "—"}
                              </strong>
                            </span>

                            <span>
                              Optional:{" "}
                              <strong>
                                {documentReadiness.optional_documents ?? "—"}
                              </strong>
                            </span>
                          </div>
                        </div>

                        {/* Individual document results */}
                        <div className="mt-5 space-y-3">
                          <h4 className="font-bold text-gray-900">
                            Individual Document Results
                          </h4>

                          {documents.map((document, docIndex) => {
                            const status = getDocumentStatus(document);

                            return (
                              <div
                                key={
                                  document.id ||
                                  document.document_id ||
                                  docIndex
                                }
                                className="rounded-xl border border-gray-200 bg-white p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <FileText
                                        size={17}
                                        className="shrink-0 text-gray-400"
                                      />

                                      <p className="font-semibold text-gray-900">
                                        {formatDocumentName(
                                          document.document_name,
                                        ) || `Document ${docIndex + 1}`}
                                      </p>

                                      <span
                                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                          document.mandatory
                                            ? "bg-blue-50 text-blue-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                      >
                                        {document.mandatory
                                          ? "Mandatory"
                                          : "Optional"}
                                      </span>
                                    </div>

                                    <p className="mt-2 text-sm text-gray-500">
                                      Student checklist:{" "}
                                      <strong>
                                        {document.has_document
                                          ? "Available"
                                          : "Not available"}
                                      </strong>
                                    </p>

                                    {/* {document.required_value && (
                                      <p className="mt-1 text-sm text-gray-600">
                                        Requirement:{" "}
                                        {document.required_value
                                          .replace(/-doc$/i, "")
                                          .replace(/-/g, " ")
                                          .replace(/\b\w/g, (character) =>
                                            character.toUpperCase(),
                                          )}
                                      </p>
                                    )} */}

                                    {/* {document.reason && (
                                      <p className="mt-2 text-sm text-gray-600">
                                        {document.reason}
                                      </p>
                                    )} */}

                                    {document.recommendation && (
                                      <p className="mt-2 text-sm text-red-700">
                                        Recommendation:{" "}
                                        {document.recommendation}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex shrink-0 flex-col items-end gap-2">
                                    <StatusBadge status={status} />

                                    <span className="text-xs font-semibold text-gray-500">
                                      {document.document_score ??
                                        document.score ??
                                        0}
                                      {" / "}
                                      {document.document_max_score ??
                                        document.maximum_score ??
                                        0}
                                      {" points"}
                                      {" · "}
                                      {formatPercentage(
                                        document.document_percentage ??
                                          document.percentage,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </section>

                  {/* Language Proficiency Matching */}
                  <section>
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <Languages size={21} className="text-emerald-600" />

                        <h3 className="text-lg font-bold text-gray-900">
                          Language Proficiency Matching
                        </h3>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        Previously saved Level 2 language matching results for
                        this analysis.
                      </p>
                    </div>

                    {!languageMatching ? (
                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <p className="font-semibold text-yellow-900">
                          Language results not recorded
                        </p>
                        <p className="mt-1 text-sm text-yellow-800">
                          This analysis was saved without a Level 2 language
                          matching result. New analyses will store this result
                          after the backend update.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <Metric
                            label="Matching Percentage"
                            value={formatPercentage(
                              languageMatching.percentage,
                            )}
                            color="text-emerald-700"
                          />

                          <Metric
                            label="Required Languages"
                            value={
                              languageMatching.total_required_languages ?? 0
                            }
                          />

                          <Metric
                            label="Matched"
                            value={languageMatching.matched_languages ?? 0}
                            color="text-green-700"
                          />

                          <Metric
                            label="Unmatched"
                            value={languageMatching.unmatched_languages ?? 0}
                            color="text-red-700"
                          />
                        </div>

                        <div className="space-y-3">
                          {languageResults.length === 0 ? (
                            <p className="rounded-lg bg-white p-4 text-sm text-gray-500">
                              No language requirements were evaluated.
                            </p>
                          ) : (
                            languageResults.map((language, languageIndex) => (
                              <div
                                key={`${language.language_name || language.language}-${languageIndex}`}
                                className="rounded-xl border border-gray-200 bg-white p-4"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {language.language_name ||
                                        language.language}
                                    </p>

                                    <p className="mt-1 text-sm text-gray-600">
                                      Evidence:{" "}
                                      {getLanguageEvidence(language.evidence)}
                                    </p>
                                  </div>

                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                      language.matched
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                    }`}
                                  >
                                    {language.matched
                                      ? "Matched"
                                      : "Not matched"}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <p className="mt-4 text-xs leading-5 text-gray-500">
                          Each required language is counted once. English can be
                          satisfied by either the MOI document or an English
                          proficiency test. Having both does not increase the
                          matching score.
                        </p>
                      </>
                    )}
                  </section>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EligibilityHistory;
