import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  AlertCircle,
  GraduationCap,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import DocumentMatchingLevel from "../../components/Dashboard/DocumentMatchingLevel";
import LanguageProficiencyMatching from "../../components/Dashboard/LanguageProficiencyMatching";
import Loader from "../../components/ReusableComp/Loader";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

function getToken() {
  return localStorage.getItem("token");
}

async function apiRequest(url, options = {}) {
  const token = getToken();

  if (!token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      typeof body.detail === "string"
        ? body.detail
        : body.message || "The request could not be completed.";
    throw new Error(detail);
  }

  return body;
}

function unwrapScholarship(body) {
  return body?.scholarship || body?.data || body;
}

function getLanguageValue(language) {
  if (typeof language === "string" || typeof language === "number") {
    return String(language);
  }

  return String(
    language?.language ||
      language?.study_language ||
      language?.language_name ||
      language?.name ||
      language?.value ||
      language?.code ||
      language?.id ||
      ""
  );
}

function getLanguageLabel(language) {
  if (typeof language === "string" || typeof language === "number") {
    return String(language);
  }

  return String(
    language?.language ||
      language?.study_language ||
      language?.language_name ||
      language?.name ||
      language?.label ||
      language?.value ||
      language?.code ||
      "Study language"
  );
}

function displayValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(displayValue).join(", ");

  if (typeof value === "object") {
    return (
      value.explanation ||
      value.description ||
      value.message ||
      value.name ||
      JSON.stringify(value)
    );
  }

  return String(value);
}

function getScoreValue(result) {
  const candidates = [
    result?.eligibility_score,
    result?.summary?.eligibility_score,
    result?.summary?.score,
  ];

  for (const candidate of candidates) {
    if (candidate === null || candidate === undefined || candidate === "") {
      continue;
    }

    if (typeof candidate === "number" || typeof candidate === "string") {
      return candidate;
    }

    if (typeof candidate === "object") {
      const nested =
        candidate.percentage ??
        candidate.score ??
        candidate.value ??
        candidate.overall_score ??
        candidate.eligibility_percentage;

      if (nested !== null && nested !== undefined && nested !== "") {
        return nested;
      }
    }
  }

  return null;
}

function formatScore(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue) ? `${numericValue}%` : String(value);
}

function Recommendations({ items }) {
  const recommendations = Array.isArray(items) ? items : items ? [items] : [];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <Sparkles className="text-amber-500" size={19} />
        <h3 className="font-bold text-slate-900">
          Improvement recommendations
        </h3>
      </div>

      {recommendations.length ? (
        <ul className="mt-4 space-y-3">
          {recommendations.map((item, index) => (
            <li
              key={item?.id ?? index}
              className="flex gap-3 text-sm leading-6 text-slate-700"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-700">
                {index + 1}
              </span>

              <span>
                {typeof item === "string"
                  ? item
                  : item?.recommendation ||
                    item?.suggestion ||
                    item?.message ||
                    item?.description ||
                    displayValue(item)}
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

export default function EligibilityAnalysisPage() {
  const { scholarshipId } = useParams();

  const [scholarship, setScholarship] = useState(null);
  const [scholarshipLoading, setScholarshipLoading] = useState(true);
  const [scholarshipError, setScholarshipError] = useState("");

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // Counter used to ignore stale analysis responses
  // (double clicks, navigating to another scholarship, unmount).
  const analysisRequestIdRef = useRef(0);

  const numericScholarshipId = useMemo(() => {
    const parsed = Number(scholarshipId);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [scholarshipId]);

  // FIX #1: depend ONLY on the scholarship ID.
  // Before, analysisResult / availableLanguages / selectedLanguage were
  // also dependencies, so every result or language selection re-ran this
  // effect, wiped the state and unmounted the result sections while React
  // was updating them. That caused the insertBefore error.
  useEffect(() => {
    let cancelled = false;

    // Invalidate any analysis request still in flight for the old scholarship.
    analysisRequestIdRef.current += 1;

    async function loadScholarship() {
      setScholarship(null);
      setAnalysisResult(null);
      setAnalysisLoading(false);
      setAvailableLanguages([]);
      setSelectedLanguage("");
      setAnalysisError("");

      if (!numericScholarshipId) {
        setScholarshipError("The scholarship ID in this URL is invalid.");
        setScholarshipLoading(false);
        return;
      }

      setScholarshipLoading(true);
      setScholarshipError("");

      try {
        const body = await apiRequest(
          `${API_BASE_URL}/api/scholarships/${numericScholarshipId}`
        );

        if (!cancelled) {
          setScholarship(unwrapScholarship(body));
        }
      } catch (error) {
        if (!cancelled) {
          setScholarshipError(
            error.message || "Unable to load scholarship information."
          );
        }
      } finally {
        if (!cancelled) {
          setScholarshipLoading(false);
        }
      }
    }

    loadScholarship();

    return () => {
      cancelled = true;
      // Also invalidate pending analysis requests on unmount.
      analysisRequestIdRef.current += 1;
    };
  }, [numericScholarshipId]);

  // Performs the analysis.
  // A fresh run passes an empty language.
  // Continue Analysis passes the student's selected language.
  const runAnalysis = useCallback(
    async (languageOverride = selectedLanguage) => {
      if (!numericScholarshipId) {
        setAnalysisError("A valid database scholarship ID is required.");
        return;
      }

      // Only the latest request is allowed to update state.
      const requestId = ++analysisRequestIdRef.current;
      const isStale = () => requestId !== analysisRequestIdRef.current;

      setAnalysisLoading(true);
      setAnalysisError("");

      try {
        const body = await apiRequest(`${API_BASE_URL}/api/matching/analyze`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scholarship_id: numericScholarshipId,
            preferred_study_language: languageOverride || null,
          }),
        });

        if (isStale()) return;

        // Backend requires the student to select a study language.
        if (body.status === "language_selection_required") {
          const languages = Array.isArray(body.available_languages)
            ? body.available_languages
            : [];

          setAvailableLanguages(languages);
          setAnalysisResult(null);

          if (!languages.length) {
            throw new Error(
              body.message ||
                "A study language is required, but the API did not return available languages."
            );
          }

          const firstLanguage = getLanguageValue(languages[0]);

          if (!languageOverride && firstLanguage) {
            setSelectedLanguage(firstLanguage);
          }

          return;
        }

        // Analysis completed successfully.
        if (body.status !== "evaluated") {
          throw new Error(
            body.message ||
              "The eligibility analysis could not be completed."
          );
        }

        setAvailableLanguages([]);
        setAnalysisResult(body);
      } catch (error) {
        if (!isStale()) {
          setAnalysisError(error.message || "Eligibility analysis failed.");
        }
      } finally {
        if (!isStale()) {
          setAnalysisLoading(false);
        }
      }
    },
    [numericScholarshipId, selectedLanguage]
  );

  // Start a completely fresh analysis.
  // Do not reuse the previously selected language.
  const startAnalysis = useCallback(() => {
    setAnalysisResult(null);
    setAnalysisError("");
    setAvailableLanguages([]);
    setSelectedLanguage("");

    // Explicitly send null for preferred_study_language.
    runAnalysis("");
  }, [runAnalysis]);

  const scholarshipTitle =
    scholarship?.title ||
    scholarship?.scholarship_name ||
    scholarship?.name ||
    `Scholarship #${scholarshipId}`;

  const country =
    scholarship?.country ||
    scholarship?.country_name ||
    scholarship?.destination_country;

  const score = getScoreValue(analysisResult);

  const checkButtonLabel = analysisLoading
    ? "Analyzing..."
    : analysisResult
      ? "Run analysis again"
      : "Check my eligibility";

  return (
    <main
      translate="no"
      className="notranslate mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8"
    >
      <div>
        <Link
          to="/dashboard/eligibility-analysis"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
        >
          <ArrowLeft size={16} />
          <span>Back to eligibility overview</span>
        </Link>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
              Scholarship eligibility check
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {scholarshipTitle}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              {/* FIX #2: old expression always gave "Country: undefined"
                  and rendered a bare text node. */}
              <span>
                {country
                  ? `Country: ${country}`
                  : "Country information not available"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
            <GraduationCap size={18} />
            <span>Eligibility analysis</span>
          </div>
        </div>
      </div>

      {scholarshipLoading && (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <Loader message="Loading scholarship information..." />
        </div>
      )}

      {scholarshipError && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <span>{scholarshipError}</span>
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Analyze your eligibility
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
              Run the analysis against your saved student profile and the
              scholarship requirements. If the program offers multiple study
              languages, select one before continuing.
            </p>
          </div>

          {/* Fresh analysis button */}
          <button
            type="button"
            onClick={startAnalysis}
            disabled={
              analysisLoading || scholarshipLoading || !numericScholarshipId
            }
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {analysisLoading ? (
              <LoaderCircle
                key="icon-loading"
                className="animate-spin"
                size={17}
              />
            ) : (
              <RefreshCw key="icon-idle" size={16} />
            )}

            <span>{checkButtonLabel}</span>
          </button>
        </div>

        {/* Study language selection */}
        {availableLanguages.length > 0 && (
          <div className="mt-5 rounded-xl border border-sky-200 bg-sky-50 p-4">
            <label
              htmlFor="study-language"
              className="block text-sm font-bold text-slate-800"
            >
              Select your preferred study language
            </label>

            <p className="mt-1 text-sm text-slate-600">
              This program has multiple study-language options. Choose one to
              continue the complete analysis.
            </p>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <select
                id="study-language"
                value={selectedLanguage}
                onChange={(event) => setSelectedLanguage(event.target.value)}
                className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              >
                <option value="">Choose a study language</option>

                {availableLanguages.map((language, index) => {
                  const value = getLanguageValue(language);

                  return (
                    <option key={`${value}-${index}`} value={value}>
                      {getLanguageLabel(language)}
                    </option>
                  );
                })}
              </select>

              {/* Continue with selected language */}
              <button
                type="button"
                onClick={() => runAnalysis(selectedLanguage)}
                disabled={!selectedLanguage || analysisLoading}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 text-sm font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {analysisLoading && (
                  <LoaderCircle className="animate-spin" size={16} />
                )}

                <span>Continue analysis</span>
              </button>
            </div>
          </div>
        )}

        {analysisError && (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
          >
            {analysisError}
          </p>
        )}
      </section>

      {/* Analysis result */}
      {analysisResult && (
        <div
          key={
            analysisResult.check_uuid ||
            `scholarship-${numericScholarshipId}-analysis`
          }
          className="space-y-6"
        >
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                  Overall eligibility
                </p>

                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Analysis completed
                </h2>

                {analysisResult.selected_study_language && (
                  <p className="mt-1 text-sm text-slate-500">
                    <span>
                      {`Study language: ${displayValue(
                        analysisResult.selected_study_language
                      )}`}
                    </span>
                  </p>
                )}

                {analysisResult.check_uuid && (
                  <p className="mt-1 text-xs text-slate-400">
                    <span>
                      {`Analysis reference: ${analysisResult.check_uuid}`}
                    </span>
                  </p>
                )}
              </div>

              {score !== undefined && score !== null && (
                <div className="min-w-32 rounded-xl bg-sky-50 px-5 py-4 text-center">
                  <p className="text-xs font-semibold text-sky-700">
                    Eligibility score
                  </p>

                  <p className="mt-1 text-3xl font-black tabular-nums text-sky-900">
                    {formatScore(score)}
                  </p>
                </div>
              )}
            </div>
          </section>

          <DocumentMatchingLevel
            scholarshipId={numericScholarshipId}
            initialResult={analysisResult.document_matching || null}
          />

          <LanguageProficiencyMatching
            result={analysisResult.language_proficiency_matching || null}
          />

          <Recommendations items={analysisResult.recommendations} />
        </div>
      )}
    </main>
  );
}