import { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  CalendarDays,
  CircleCheck,
  Clock3,
  FileCheck2,
  Globe2,
  GraduationCap,
  HeartPulse,
  Info,
  Languages,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRoundCheck,
  WalletCards,
  ExternalLink,
  Building2,
  FileText,
} from "lucide-react";

import { NavLink, useParams } from "react-router";
import opportunities from "../data/opportunities.json";
import Loader from "../components/ReusableComp/Loader";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

/* ========================================================= */
/* HELPERS */
/* ========================================================= */

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "" && value !== "null";

const parseArray = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value.trim() ? [value] : [];
    }
  }

  return [];
};

const formatDeadline = (dateString) => {
  if (!dateString) return "Not specified";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getDaysRemaining = (dateString) => {
  if (!dateString) return null;

  const deadline = new Date(`${dateString}T23:59:59`);
  const today = new Date();

  const difference = deadline.getTime() - today.getTime();

  return Math.ceil(difference / (1000 * 60 * 60 * 24));
};

const formatCategory = (category) => {
  if (!category) return "Scholarship";

  const formatted = category.trim().replace(/_/g, " ");

  if (!formatted) return "Scholarship";

  const words = formatted.split(/\s+/);

  const capitalized = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return words.length === 1 ? `${capitalized} Scholarship` : capitalized;
};

const formatMoney = (amount, currency, period) => {
  if (!hasValue(amount)) return null;

  const formattedAmount = Number(amount).toLocaleString("en-US");

  return [
    hasValue(currency) ? currency : "",
    formattedAmount,
    hasValue(period) ? `/ ${period}` : "",
  ]
    .filter(Boolean)
    .join(" ");
};

const getBenefitText = (benefit) => {
  if (typeof benefit === "string") return benefit;

  if (!benefit) return "";

  const amount = formatMoney(benefit.amount, benefit.currency, benefit.period);

  const description =
    benefit.description ||
    benefit.coverage ||
    benefit.benefit_type ||
    "Scholarship benefit";

  return amount ? `${description}: ${amount}` : description;
};

const getProgramLanguages = (program) => parseArray(program?.languages);

const getProgramBenefits = (program) =>
  Array.isArray(program?.coverage) ? program.coverage : [];

const getRequirementCondition = (document) => {
  if (document.condition_text) {
    return document.condition_text;
  }

  return null;
};

/* ========================================================= */
/* DATA NORMALIZATION */
/* ========================================================= */

const normalizeJsonOpportunity = (item) => {
  if (!item) return null;

  return {
    source: "json",
    id: item.id,
    slug: item.slug,

    title: item.title,
    provider: item.provider,
    category: formatCategory(item.category),
    status: item.status,

    city: parseArray(item.city).join(", "),
    country: item.country,

    description: item.description,
    image: item.image,

    deadline: item.deadline,
    funding: item.funding,
    applicationFee: item.applicationFee,

    degrees: parseArray(item.degree),
    tags: parseArray(item.tags),
    benefits: parseArray(item.benefits),

    eligibility: item.eligibility || {},
    additionalRequirements: parseArray(
      item.eligibility?.additionalRequirements,
    ),

    ielts: item.ielts,

    documents: parseArray(item.documents),
    programs: parseArray(item.programs),
    contacts: parseArray(item.contacts),

    officialWebsite: item.website,
    embassyWebsite: item.bd_ambassy_website,
  };
};

const normalizeDatabaseScholarship = (item) => {
  if (!item) return null;

  const programs = Array.isArray(item.programs)
    ? item.programs.map((program) => ({
        ...program,
        languages: getProgramLanguages(program),
        coverage: getProgramBenefits(program),
      }))
    : [];

  const generalCoverage = Array.isArray(item.coverage) ? item.coverage : [];

  const documents = Array.isArray(item.documents) ? item.documents : [];

  const contacts = Array.isArray(item.contacts) ? item.contacts : [];

  const degrees = [
    ...new Set(programs.map((program) => program.program_name).filter(Boolean)),
  ];

  const benefits = generalCoverage.map(getBenefitText).filter(Boolean);

  return {
    source: "database",
    id: item.id,

    title: item.title,
    provider: "Scholarship Provider",
    category: formatCategory(item.scholarship_type),
    status: item.status,

    city: parseArray(item.cities).join(", "),
    country: item.country,

    description: null,
    image: null,

    deadline: item.last_date_to_apply,
    funding: benefits.length ? "Scholarship Benefits" : "Not specified",

    applicationFee: null,

    degrees,
    tags: parseArray(item.keywords),
    benefits,

    eligibility: {},
    additionalRequirements: [],

    ielts: null,

    documents,
    programs,
    contacts,

    generalCoverage,

    officialWebsite: item.official_website,
    embassyWebsite: item.bd_ambassy_website,
  };
};

/* ========================================================= */
/* SMALL REUSABLE UI COMPONENTS */
/* ========================================================= */

const SectionHeading = ({
  eyebrow,
  title,
  highlight,
  description,
  color = "blue",
}) => {
  const colors = {
    blue: "text-blue-600 bg-blue-600",
    emerald: "text-emerald-600 bg-emerald-600",
    amber: "text-amber-600 bg-amber-600",
    violet: "text-violet-600 bg-violet-600",
    orange: "text-orange-600 bg-orange-600",
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-5 flex items-center gap-3">
        <span className={`h-px w-10 ${colors[color].split(" ")[1]}`} />

        <span
          className={`text-xs font-bold uppercase tracking-[0.2em] ${colors[color].split(" ")[0]}`}
        >
          {eyebrow}
        </span>
      </div>

      <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        {title}{" "}
        {highlight && (
          <span className={colors[color].split(" ")[0]}>{highlight}</span>
        )}
      </h2>

      {description && (
        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600",
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600",
    amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-500",
    violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-600",
  };

  return (
    <div className="group border-b border-slate-100 p-6 transition hover:bg-slate-50 md:border-r lg:border-b-0">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition group-hover:text-white ${colors[color]}`}
        >
          <Icon size={21} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>

          <p className="mt-1 break-words font-bold text-slate-900">
            {value || "Not specified"}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ========================================================= */
/* MAIN COMPONENT */
/* ========================================================= */

const OpportunityDetails = () => {
  const { slug } = useParams();

  // Numeric IDs belong to the database.
  // Text slugs belong to opportunities.json.
  const isDatabaseOpportunity = /^\d+$/.test(slug || "");

  const [databaseResult, setDatabaseResult] = useState({
    slug: null,
    data: null,
    error: "",
  });

  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [selectedStudyLanguage, setSelectedStudyLanguage] = useState("");
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  useEffect(() => {
    setAnalysisResult(null);
    setAnalysisError("");
    setSelectedStudyLanguage("");
  }, [slug]);

  /* --------------------------------------------------------- */
  /* FETCH DATABASE SCHOLARSHIP */
  /* --------------------------------------------------------- */

  useEffect(() => {
    if (!isDatabaseOpportunity) return;

    const controller = new AbortController();

    const fetchOpportunity = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/scholarships/${slug}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to load scholarship details.");
        }

        const result = await response.json();

        if (!result.success || !result.data) {
          throw new Error("Invalid scholarship API response.");
        }

        if (!controller.signal.aborted) {
          setDatabaseResult({
            slug,
            data: result.data,
            error: "",
          });
        }
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) {
          setDatabaseResult({
            slug,
            data: null,
            error: error.message,
          });
        }
      }
    };

    fetchOpportunity();

    return () => controller.abort();
  }, [isDatabaseOpportunity, slug]);

  /* --------------------------------------------------------- */
  /* SELECT AND NORMALIZE OPPORTUNITY */
  /* --------------------------------------------------------- */

  const opportunity = useMemo(() => {
    if (isDatabaseOpportunity) {
      // Prevent displaying the previous scholarship
      // while a new database ID is being loaded.
      if (databaseResult.slug !== slug || !databaseResult.data) {
        return null;
      }

      return normalizeDatabaseScholarship(databaseResult.data);
    }

    const jsonOpportunity = opportunities.find((item) => item.slug === slug);

    return normalizeJsonOpportunity(jsonOpportunity);
  }, [slug, isDatabaseOpportunity, databaseResult]);

  /* --------------------------------------------------------- */
  /* LOADING AND ERROR STATES */
  /* --------------------------------------------------------- */

  const loading =
    isDatabaseOpportunity &&
    databaseResult.slug !== slug &&
    !databaseResult.error;

  const error =
    isDatabaseOpportunity && databaseResult.slug === slug
      ? databaseResult.error
      : "";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            <Loader message="Loading opportunity details..." />
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we retrieve the scholarship information.
          </p>
        </div>
      </div>
    );
  }

  /* --------------------------------------------------------- */
  /* NOT FOUND / ERROR */
  /* --------------------------------------------------------- */

  if (!opportunity) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Info size={30} />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-slate-900">
            Opportunity Not Found
          </h1>

          <p className="mt-3 text-slate-500">
            {error || "The opportunity you're looking for doesn't exist."}
          </p>

          <NavLink
            to="/opportunities"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore Opportunities
            <ArrowRight size={18} />
          </NavLink>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* DERIVED VALUES */
  /* ========================================================= */

  const daysRemaining = getDaysRemaining(opportunity.deadline);

  const isDeadlinePassed = daysRemaining !== null && daysRemaining < 0;

  const eligibility = opportunity.eligibility || {};

  const isDatabase = opportunity.source === "database";

  const generalBenefits = isDatabase
    ? opportunity.generalCoverage || []
    : opportunity.benefits || [];

  const hasTuitionCoverage = generalBenefits.some(
    (item) => item.benefit_type === "tuition_fee",
  );

  const hasAccommodationCoverage = generalBenefits.some(
    (item) => item.benefit_type === "accommodation",
  );

  const isFullyFunded =
    isDatabase && hasTuitionCoverage && hasAccommodationCoverage;

  const fundingLabel = isDatabase
    ? isFullyFunded
      ? "Fully Funded"
      : "Partial Funding"
    : opportunity.funding;

  const programs = opportunity.programs || [];

  const availableStudyLanguages = [
    ...new Set(
      programs
        .flatMap((program) => getProgramLanguages(program))
        .filter(Boolean)
        .map((language) => language.trim()),
    ),
  ];

  const documents = opportunity.documents || [];

  const contacts = opportunity.contacts || [];

  const hasPrograms = programs.length > 0;

  const hasBenefits = generalBenefits.length > 0;

  const hasDocuments = documents.length > 0;

  const hasContacts = contacts.length > 0;

  const hasJsonEligibility = !isDatabase && Object.keys(eligibility).length > 0;

  const website = opportunity.officialWebsite;

  const embassyWebsite = opportunity.embassyWebsite;

  const location = [opportunity.city, opportunity.country]
    .filter(Boolean)
    .join(". Country: ");

  const degreeText = opportunity.degrees.length
    ? opportunity.degrees.join(" & ")
    : "Not specified";

  const handleDatabaseAnalysis = async (language = selectedStudyLanguage) => {
    if (!isDatabase) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setAnalysisError("Please log in to analyze your eligibility.");
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/matching/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scholarship_id: Number(opportunity.id),
          preferred_study_language: language || null,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || "Eligibility analysis failed.");
      }

      setAnalysisResult(result);

      if (result.status === "language_selection_required") {
        setIsLanguageModalOpen(true);
      } else {
        setIsLanguageModalOpen(false);
      }
    } catch (error) {
      setAnalysisError(error.message || "Unable to analyze eligibility.");
    } finally {
      setAnalysisLoading(false);
    }
  };
  const openLanguageModal = () => {
    if (!availableStudyLanguages.length) {
      setAnalysisError(
        "No study languages are available for this scholarship.",
      );
      return;
    }

    setAnalysisError("");
    setAnalysisResult(null);

    const defaultLanguage =
      availableStudyLanguages.find(
        (language) => language.toLowerCase() === "english",
      ) || "English";

    setSelectedStudyLanguage(defaultLanguage);
    setIsLanguageModalOpen(true);
  };
  /* ========================================================= */
  /* RENDER */
  /* ========================================================= */

  return (
    <div className="relative overflow-hidden text-slate-900">
      {/* ========================================================= */}
      {/* BACKGROUND */}
      {/* ========================================================= */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden">
        <div className="relative min-h-140">
          {opportunity.image && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${opportunity.image})`,
              }}
            />
          )}

          <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-blue-950 to-blue-800" />

          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

          <div className="absolute -bottom-40 right-10 h-112.5 w-112.5 rounded-full border border-white/10" />

          <div className="relative mx-auto flex min-h-140 max-w-7xl items-center px-3 pb-20 pt-40 sm:px-6">
            <div className="max-w-4xl text-white">
              {/* Category and status */}

              <div className="mb-6 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                  <Sparkles size={16} />
                  {opportunity.category}
                </div>

                {opportunity.status && (
                  <div
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur ${
                      opportunity.status.toLowerCase() === "open"
                        ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
                        : "border-white/20 bg-white/10 text-slate-200"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        opportunity.status.toLowerCase() === "open"
                          ? "bg-emerald-400"
                          : "bg-slate-300"
                      }`}
                    />

                    {opportunity.status}
                  </div>
                )}

                {isDatabase && (
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-200 backdrop-blur">
                    <BadgeCheck size={16} />
                    ScholarX Verified
                  </div>
                )}
              </div>

              {/* Title */}

              <h1 className="bg-linear-to-r from-blue-400 via-indigo-500 to-sky-400 bg-clip-text text-4xl font-black leading-tight text-transparent sm:text-5xl lg:text-6xl">
                {opportunity.title}
              </h1>

              {/* Provider and location */}

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-300">
                {opportunity.provider && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-sky-400" />

                    <span>
                      Provided by{" "}
                      <strong className="text-white">
                        {opportunity.provider}
                      </strong>
                    </span>
                  </div>
                )}

                {location && (
                  <div className="flex items-center gap-2">
                    <Globe2 size={18} className="text-sky-400" />
                    <span>{location}</span>
                  </div>
                )}

                {!location && opportunity.country && (
                  <div className="flex items-center gap-2">
                    <Globe2 size={18} className="text-sky-400" />
                    <span>{opportunity.country}</span>
                  </div>
                )}
              </div>

              {/* Description */}

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                {opportunity.description ||
                  `Explore the ${opportunity.title} and review its available programs, scholarship benefits, application deadline and required documents.`}
              </p>

              {/* Degree tags */}

              {opportunity.degrees.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {opportunity.degrees.map((degree) => (
                    <span
                      key={degree}
                      className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        {degree}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}

              <div className="mt-9 flex flex-wrap gap-4">
                {isDatabase ? (
                  <button
                    type="button"
                    onClick={openLanguageModal}
                    disabled={analysisLoading}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <BadgeCheck size={18} />
                    {analysisLoading ? "Analyzing..." : "Check My Eligibility"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                ) : (
                  <NavLink
                    to="/dashboard/eligibility-analysis"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                  >
                    <BadgeCheck size={18} />
                    Check My Eligibility
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </NavLink>
                )}

                <NavLink
                  to="/opportunities"
                  className="group inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  Explore More Opportunities
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FACT BAR */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto -mt-10 max-w-7xl sm:px-6">
        <div className="mx-auto grid w-[90%] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl sm:w-full sm:grid-cols-2 lg:grid-cols-4">
          <InfoCard
            icon={WalletCards}
            label="Funding"
            value={fundingLabel}
            color="emerald"
          />

          <InfoCard
            icon={CalendarDays}
            label="Deadline"
            value={formatDeadline(opportunity.deadline)}
            color="amber"
          />

          <InfoCard
            icon={GraduationCap}
            label="Study Level"
            value={degreeText}
            color="blue"
          />

          <InfoCard
            icon={BadgeDollarSign}
            label="Application Fee"
            value={opportunity.applicationFee}
            color="violet"
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* ABOUT THE OPPORTUNITY */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-3 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow="About the Opportunity"
              title="Everything you need to know about"
              highlight={`${opportunity.title}.`}
              color="blue"
            />

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
              {opportunity.description ||
                `Review the available information for ${opportunity.title}, including its programs, funding coverage, application requirements and official contact details.`}
            </p>

            {opportunity.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {opportunity.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Snapshot */}

          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-sky-700 p-8 text-white shadow-xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

            <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/5" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                Opportunity Snapshot
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                Key details at a glance
              </h3>

              <div className="mt-7 space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <span className="text-blue-100">Provider</span>
                  <span className="text-right font-bold">
                    {opportunity.provider || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <span className="text-blue-100">Destination</span>
                  <span className="text-right font-bold">
                    {opportunity.country || "Not specified"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <span className="text-blue-100">Study Level</span>
                  <span className="text-right font-bold">{degreeText}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-blue-100">Deadline</span>
                  <span className="text-right font-bold">
                    {formatDeadline(opportunity.deadline)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* AVAILABLE PROGRAMS */}
      {/* ========================================================= */}

      {hasPrograms && (
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <SectionHeading
              eyebrow="Available Programs"
              title="Choose your academic"
              highlight="path."
              description="Explore the study levels, program durations, languages and program-specific benefits available under this scholarship."
              color="blue"
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => {
                const programBenefits = getProgramBenefits(program);
                const languages = getProgramLanguages(program);

                return (
                  <div
                    key={program.id || program.program_name}
                    className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      <GraduationCap size={23} />
                    </div>

                    <h3 className="mt-5 text-xl font-bold text-slate-900">
                      {program.program_name || "Study Program"}
                    </h3>

                    {program.duration && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <Clock3 size={16} />
                        Duration: {program.duration}
                      </div>
                    )}

                    {languages.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Languages
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          {languages.map((language, index) => (
                            <span
                              key={`${language}-${index}`}
                              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                            >
                              {language}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {programBenefits.length > 0 && (
                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Program Benefits
                        </p>

                        <div className="mt-3 space-y-3">
                          {programBenefits.map((benefit) => (
                            <div
                              key={benefit.id}
                              className="flex items-start gap-2 text-sm text-slate-600"
                            >
                              <CircleCheck
                                size={17}
                                className="mt-0.5 shrink-0 text-emerald-500"
                              />

                              <span>{getBenefitText(benefit)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {isDatabase && (analysisError || analysisResult) && (
        <section id="eligibility-analysis" className="bg-white py-12">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <BadgeCheck size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Eligibility Analysis
                  </h2>
                  <p className="text-sm text-slate-500">
                    Based on your saved student profile and this scholarship's
                    database rules.
                  </p>
                </div>
              </div>

              {analysisError && (
                <p className="mt-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  {analysisError}
                </p>
              )}

              {/* ========================================================= */}
              {/* STUDY LANGUAGE SELECTION MODAL */}
              {/* ========================================================= */}

              {isDatabase && isLanguageModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                          <Languages size={24} />
                        </div>

                        <h2 className="mt-5 text-2xl font-bold text-slate-900">
                          Choose Study Language
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                          Select the language in which you intend to study. Your
                          eligibility will be evaluated using the selected
                          language requirements.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsLanguageModalOpen(false)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close language selection"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-6 space-y-3">
                      {availableStudyLanguages.map((language) => (
                        <button
                          key={language}
                          type="button"
                          onClick={() => setSelectedStudyLanguage(language)}
                          className={`flex w-full items-center justify-between rounded-xl border p-4 text-left font-semibold transition ${
                            selectedStudyLanguage === language
                              ? "border-blue-600 bg-blue-50 text-blue-700"
                              : "border-slate-200 text-slate-700 hover:border-blue-300"
                          }`}
                        >
                          {language}

                          {selectedStudyLanguage === language && (
                            <CircleCheck size={20} className="text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-7 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsLanguageModalOpen(false)}
                        className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDatabaseAnalysis(selectedStudyLanguage)
                        }
                        disabled={!selectedStudyLanguage || analysisLoading}
                        className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {analysisLoading ? "Analyzing..." : "Continue"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {analysisResult &&
                !["language_selection_required", "evaluated"].includes(
                  analysisResult.status,
                ) && (
                  <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                    <p className="font-semibold">
                      {analysisResult.status?.replaceAll("_", " ") ||
                        "Analysis unavailable"}
                    </p>
                    <p className="mt-1">
                      {analysisResult.message ||
                        analysisResult.program_selection?.reason ||
                        "Please review your student profile and scholarship program information."}
                    </p>
                  </div>
                )}

              {analysisResult?.status === "evaluated" && (
                <>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl bg-blue-50 p-5">
                      <p className="text-sm font-medium text-blue-700">
                        Eligibility score
                      </p>
                      <p className="mt-1 text-4xl font-black text-blue-900">
                        {Math.round(
                          analysisResult.eligibility_score?.score ?? 0,
                        )}
                        %
                      </p>
                    </div>
                    <div className="rounded-2xl bg-emerald-50 p-5">
                      <p className="text-sm font-medium text-emerald-700">
                        Rules met
                      </p>
                      <p className="mt-1 text-4xl font-black text-emerald-900">
                        {analysisResult.eligibility_score?.met_rules ?? 0}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-5">
                      <p className="text-sm font-medium text-amber-700">
                        Need review
                      </p>
                      <p className="mt-1 text-4xl font-black text-amber-900">
                        {analysisResult.eligibility_score?.unknown_rules ?? 0}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    Program:{" "}
                    <strong>
                      {analysisResult.program?.program_name ||
                        "Selected from your profile"}
                    </strong>{" "}
                    · Language:{" "}
                    <strong>
                      {analysisResult.selected_study_language ||
                        "Not specified"}
                    </strong>
                  </p>

                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-slate-900">
                      Eligibility requirements
                    </h3>
                    <div className="mt-3 space-y-3">
                      {[
                        ...(analysisResult.academic_results || []),
                        ...(analysisResult.eligibility_results || []),
                      ].map((rule, index) => (
                        <div
                          key={`${rule.rule_id ?? "rule"}-${index}`}
                          className="rounded-xl border border-slate-200 p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-semibold text-slate-800">
                              {rule.category ||
                                rule.rule_type ||
                                rule.requirement ||
                                "Requirement"}
                            </p>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${rule.status === "met" ? "bg-emerald-100 text-emerald-700" : rule.status === "not_met" ? "bg-red-100 text-red-700" : rule.status === "not_applicable" ? "bg-slate-100 text-slate-600" : "bg-amber-100 text-amber-700"}`}
                            >
                              {(rule.status || "unknown").replaceAll("_", " ")}
                            </span>
                          </div>
                          {rule.reason && (
                            <p className="mt-2 text-sm text-slate-600">
                              {rule.reason}
                            </p>
                          )}
                          {rule.source_sentence && (
                            <p className="mt-1 text-xs text-slate-400">
                              Source: {rule.source_sentence}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {(analysisResult.recommendations || []).length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-slate-900">
                        How to improve your eligibility
                      </h3>
                      <div className="mt-3 space-y-3">
                        {analysisResult.recommendations.map((item, index) => (
                          <div
                            key={`${item.rule_id ?? "recommendation"}-${index}`}
                            className="rounded-xl bg-amber-50 p-4"
                          >
                            <p className="font-semibold text-slate-900">
                              {item.requirement || "Requirement to improve"}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {item.suggestion || item.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      handleDatabaseAnalysis(
                        analysisResult.selected_study_language || "",
                      )
                    }
                    disabled={analysisLoading}
                    className="mt-6 rounded-xl border border-blue-200 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                  >
                    {analysisLoading
                      ? "Rechecking..."
                      : "Re-analyze eligibility"}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* STUDY LANGUAGE SELECTION MODAL */}
      {/* ========================================================= */}

      {isDatabase && isLanguageModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Languages size={24} />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Choose Study Language
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Select your preferred study language to evaluate your
                  eligibility.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close language selection"
              >
                ×
              </button>
            </div>

            <div className="mt-6 space-y-3">
              {availableStudyLanguages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => setSelectedStudyLanguage(language)}
                  className={`flex w-full items-center justify-between rounded-xl border p-4 text-left font-semibold transition ${
                    selectedStudyLanguage === language
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-700 hover:border-blue-300"
                  }`}
                >
                  {language}

                  {selectedStudyLanguage === language && (
                    <CircleCheck size={20} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleDatabaseAnalysis(selectedStudyLanguage)}
                disabled={!selectedStudyLanguage || analysisLoading}
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {analysisLoading ? "Analyzing..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DEADLINE AND APPLICATION TIMELINE */}
      {/* ========================================================= */}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <SectionHeading
            eyebrow="Application Timeline"
            title="Don't miss your"
            highlight="deadline."
            description="Keep the application deadline and preparation timeline in mind before starting your application."
            color="amber"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Deadline */}

            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white">
                <CalendarDays size={22} />
              </div>

              <p className="mt-6 text-sm font-semibold text-slate-500">
                Application Deadline
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {formatDeadline(opportunity.deadline)}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Final date to submit your application, according to the
                available information.
              </p>
            </div>

            {/* Remaining Days */}

            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                <Clock3 size={22} />
              </div>

              <p className="mt-6 text-sm font-semibold text-slate-500">
                Application Status
              </p>

              <p
                className={`mt-2 text-2xl font-black ${
                  isDeadlinePassed ? "text-red-600" : "text-blue-600"
                }`}
              >
                {isDeadlinePassed
                  ? "Deadline Passed"
                  : opportunity.status || "Not confirmed"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {isDeadlinePassed
                  ? "The listed deadline has passed. Check the official website for updates."
                  : daysRemaining !== null
                    ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`
                    : "Check the official website for application updates."}
              </p>
            </div>

            {/* Application Fee */}

            <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                <BadgeDollarSign size={22} />
              </div>

              <p className="mt-6 text-sm font-semibold text-slate-500">
                Application Fee
              </p>

              <p className="mt-2 text-2xl font-black text-slate-900">
                {opportunity.applicationFee || "Not specified"}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                Application fee information
              </p>
            </div>
          </div>

          <div className="group mt-8 flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50/70 p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white">
              <Info size={20} />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">Important</p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Deadlines and application procedures can change. Always verify
                the latest information on the official scholarship website
                before submitting your application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* BENEFITS AND FUNDING */}
      {/* ========================================================= */}

      {hasBenefits && (
        <section className="relative overflow-hidden bg-slate-50 py-24">
          <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />

          <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-3 sm:px-6">
            <SectionHeading
              eyebrow="Funding & Benefits"
              title="What does this opportunity"
              highlight="offer?"
              description="Review the financial and practical benefits included with this scholarship opportunity."
              color="emerald"
            />

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {generalBenefits.map((benefit, index) => {
                const benefitText = getBenefitText(benefit);

                const icons = [BadgeDollarSign, WalletCards, HeartPulse, Plane];

                const Icon = icons[index % icons.length];

                return (
                  <div
                    key={benefit.id || `${benefitText}-${index}`}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition duration-500 group-hover:scale-110 group-hover:rotate-4 group-hover:bg-emerald-600 group-hover:text-white">
                        <Icon size={22} />
                      </div>

                      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Benefit {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-1 font-bold text-slate-900">
                        {benefitText}
                      </h3>

                      {benefit.applicability && (
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          Applicable to: {benefit.applicability}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Funding Highlight */}

            <div className="mt-8 rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 p-8 text-white shadow-xl">
              <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <Trophy size={25} />
                    <p className="font-semibold">Funding Information</p>
                  </div>

                  <p className="mt-3 text-3xl font-black">
                    {fundingLabel || "See listed benefits"}
                  </p>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100">
                    Review the listed benefits and any program-specific coverage
                    to understand what this scholarship provides.
                  </p>
                </div>

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                  <WalletCards size={42} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* ELIGIBILITY - JSON SOURCE */}
      {/* ========================================================= */}

      {hasJsonEligibility && (
        <section className="mx-auto max-w-7xl px-3 py-24 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <SectionHeading
                eyebrow="Eligibility"
                title="Could you be"
                highlight="eligible?"
                description="Review the main eligibility factors before applying. Some criteria may depend on the specific scholarship programme selected."
                color="violet"
              />

              {opportunity.ielts && (
                <div className="mt-8 rounded-3xl bg-linear-to-br from-violet-600 to-indigo-700 p-7 text-white shadow-xl">
                  <div className="flex items-center gap-3">
                    <Languages size={25} />
                    <p className="font-semibold">English Requirement</p>
                  </div>

                  <p className="mt-4 text-4xl font-black">
                    IELTS {opportunity.ielts}
                  </p>

                  <p className="mt-2 text-sm text-violet-100">
                    {eligibility.english?.description ||
                      "Refer to the scholarship's language requirements."}
                  </p>
                </div>
              )}

              {eligibility.nationality?.description && (
                <div className="group mt-6 flex items-start gap-4 rounded-3xl border border-blue-200 bg-blue-50/70 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                    <Globe2 size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Nationality
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {eligibility.nationality.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "International Student",
                  description: eligibility.internationalStudent?.description,
                  icon: UserRoundCheck,
                  status: eligibility.internationalStudent?.required
                    ? "Required"
                    : null,
                },
                {
                  title: "Study Level",
                  description: eligibility.studyLevel?.values?.join(", "),
                  icon: GraduationCap,
                },
                {
                  title: "Academic Performance",
                  description: hasValue(
                    eligibility.academicPerformance?.minimumGPA,
                  )
                    ? `Minimum GPA: ${eligibility.academicPerformance.minimumGPA}`
                    : null,
                  icon: GraduationCap,
                },
                {
                  title: "Work Experience",
                  description: hasValue(
                    eligibility.workExperience?.minimumMonths,
                  )
                    ? `${eligibility.workExperience.minimumMonths}+ months required`
                    : null,
                  icon: Clock3,
                  status: eligibility.workExperience?.preferred
                    ? "Preferred"
                    : null,
                },
                {
                  title: "Research Experience",
                  description: eligibility.researchExperience?.description,
                  icon: FileCheck2,
                  status: eligibility.researchExperience?.preferred
                    ? "Preferred"
                    : null,
                },
                {
                  title: "Achievements",
                  description: eligibility.achievements?.description,
                  icon: Trophy,
                  status: eligibility.achievements?.preferred
                    ? "Preferred"
                    : null,
                },
              ]
                .filter((item) => item.description)
                .map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                        <Icon size={21} />
                      </div>

                      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Requirement {String(index + 1).padStart(2, "0")}
                      </p>

                      <h3 className="mt-1 font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {item.description ||
                          "See the official scholarship requirements."}
                      </p>

                      {item.status && (
                        <span className="mt-4 inline-flex rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                          {item.status}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* REQUIRED DOCUMENTS */}
      {/* ========================================================= */}

      {hasDocuments && (
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <SectionHeading
              eyebrow="Application Documents"
              title="Prepare your"
              highlight="documents."
              description="Review the documents listed for this scholarship. Some documents may only apply to specific applicants or programs."
              color="orange"
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {documents.map((document, index) => (
                <div
                  key={
                    document.id ||
                    `${document.document_name || document.name}-${index}`
                  }
                  className="group flex gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition duration-500 group-hover:bg-orange-600 group-hover:text-white">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                        Document {String(index + 1).padStart(2, "0")}
                      </span>

                      {document.mandatory === 1 ||
                      document.mandatory === true ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                          Mandatory
                        </span>
                      ) : document.mandatory === 0 ||
                        document.mandatory === false ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          Optional
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-2 font-bold text-slate-900">
                      {document.document_name ||
                        document.name ||
                        "Required Document"}
                    </h3>

                    {(document.requirement || document.description) && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {document.requirement || document.description}
                      </p>
                    )}

                    {getRequirementCondition(document) && (
                      <div className="mt-3 rounded-xl bg-orange-50 p-3">
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                          Applicable condition
                        </p>

                        <p className="mt-1 text-sm leading-6 text-orange-800">
                          {getRequirementCondition(document)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-start gap-4 rounded-3xl border border-orange-200 bg-orange-50/70 p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Info size={20} />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-900">
                  Document reminder
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Check each document's conditions and the latest official
                  instructions before submitting your application.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* ADDITIONAL REQUIREMENTS - JSON SOURCE */}
      {/* ========================================================= */}

      {opportunity.additionalRequirements?.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <SectionHeading
              eyebrow="Additional Requirements"
              title="Check the"
              highlight="fine print."
              description="Some scholarship opportunities have additional programme-specific criteria."
              color="orange"
            />

            <div className="mt-12 space-y-4">
              {opportunity.additionalRequirements.map((requirement, index) => (
                <div
                  key={`${requirement.label}-${index}`}
                  className="group flex gap-4 rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white">
                    <Lightbulb size={21} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                        Requirement {String(index + 1).padStart(2, "0")}
                      </span>

                      {requirement.required && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                          Required
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-bold text-slate-900">
                      {requirement.label}
                    </h3>

                    <p className="mt-2 leading-7 text-slate-600">
                      {requirement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* APPLICATION PREPARATION */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-3 py-24 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Application Preparation"
              title="Get your application"
              highlight="ready."
              description="Start preparing early so you have enough time to review the requirements and collect supporting documents."
              color="blue"
            />

            <div className="mt-8 rounded-3xl bg-linear-to-br from-blue-600 to-sky-700 p-7 text-white shadow-xl">
              <div className="flex items-center gap-3">
                <FileCheck2 size={25} />
                <p className="font-semibold">Application Checklist</p>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Review the scholarship eligibility requirements.",
                  "Confirm program and language requirements.",
                  "Prepare the required supporting documents.",
                  "Verify the application deadline.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 border-b border-white/15 pb-4 last:border-0 last:pb-0"
                  >
                    <CircleCheck size={18} className="shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preparation tips */}

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: GraduationCap,
                title: "Academic Records",
                text: "Keep your transcripts, certificates and academic records organized.",
              },
              {
                icon: Languages,
                title: "Language Proof",
                text: "Check the accepted language certificates and program language requirements.",
              },
              {
                icon: FileCheck2,
                title: "Supporting Documents",
                text: "Prepare the documents required for your selected program.",
              },
              {
                icon: CalendarDays,
                title: "Apply Early",
                text: "Avoid waiting until the final days before the application deadline.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-500 group-hover:bg-blue-600 group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Step {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3 className="mt-1 font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CONTACT INFORMATION */}
      {/* ========================================================= */}

      {hasContacts && (
        <section className="bg-slate-50 py-24">
          <div className="mx-auto max-w-7xl px-3 sm:px-6">
            <SectionHeading
              eyebrow="Contact Information"
              title="Need more"
              highlight="information?"
              description="Use the contact information provided with this scholarship to reach the relevant office."
              color="blue"
            />

            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {contacts.map((contact, index) => {
                const type = (contact.contact_type || "contact").toLowerCase();

                const value = contact.value;

                let Icon = Info;
                let href = null;

                if (type === "email") {
                  Icon = Mail;
                  href = `mailto:${value}`;
                } else if (type === "phone") {
                  Icon = Phone;
                  href = `tel:${value}`;
                } else if (type === "website") {
                  Icon = Globe2;
                  href = value;
                } else if (type === "address") {
                  Icon = MapPin;
                } else if (type === "office") {
                  Icon = Building2;
                }

                return (
                  <div
                    key={contact.id || `${type}-${value}-${index}`}
                    className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {type}
                      </p>

                      {href ? (
                        <a
                          href={href}
                          target={type === "website" ? "_blank" : undefined}
                          rel={type === "website" ? "noreferrer" : undefined}
                          className="mt-2 break-all font-semibold text-slate-800 transition hover:text-blue-600"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="mt-2 break-words font-semibold text-slate-800">
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* WHY CONSIDER THIS OPPORTUNITY */}
      {/* ========================================================= */}

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <SectionHeading
            eyebrow="Why Consider This Opportunity?"
            title="A potential opportunity for"
            highlight="ambitious students."
            description="Consider how the funding, destination, degree level and eligibility requirements align with your academic and career goals."
            color="emerald"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: WalletCards,
                title: "Financial Support",
                text: "Review the scholarship benefits and program-specific funding before applying.",
              },
              {
                icon: GraduationCap,
                title: "Academic Opportunities",
                text: `Explore the available study levels: ${degreeText}.`,
              },
              {
                icon: Globe2,
                title: "International Experience",
                text: opportunity.country
                  ? `Explore the possibility of studying in ${opportunity.country}.`
                  : "Explore the destination and academic environment.",
              },
              {
                icon: Trophy,
                title: "Academic Development",
                text: "A well-prepared application can help present your academic background and achievements clearly.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-50 opacity-0 transition group-hover:opacity-100" />

                  <div className="relative flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition duration-500 group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon size={21} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>

                      <p className="mt-2 leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* THINGS TO CONSIDER */}
      {/* ========================================================= */}

      <section className="mx-auto max-w-7xl px-3 py-24 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div className="lg:mt-24">
            <SectionHeading
              eyebrow="Before You Apply"
              title="Things to"
              highlight="consider."
              description="Review the scholarship conditions carefully before committing to an application."
              color="orange"
            />
          </div>

          <div className="space-y-4">
            {[
              "Eligibility requirements may vary between individual programs.",
              "Admission to a university or program may be a separate process.",
              "Language requirements can depend on the selected program and institution.",
              "Some documents may only be required for specific applicant categories.",
              "Meeting the listed requirements does not guarantee scholarship selection.",
              "Always verify the latest information on the official provider website.",
            ].map((item, index) => (
              <div
                key={item}
                className="group flex gap-4 overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition duration-500 group-hover:bg-orange-600 group-hover:text-white">
                  <Lightbulb size={19} />
                </div>

                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                    Consideration {String(index + 1).padStart(2, "0")}
                  </span>

                  <p className="mt-1 font-medium leading-6 text-slate-700">
                    {item}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* OFFICIAL WEBSITES */}
      {/* ========================================================= */}

      {(website || embassyWebsite) && (
        <section className="mx-auto max-w-7xl px-3 pb-10 sm:px-6">
          <div className="space-y-4">
            {website && (
              <div className="group flex flex-col gap-5 rounded-3xl border border-blue-200 bg-blue-50/60 p-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white">
                    <ShieldCheck size={21} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      Official Scholarship Website
                    </p>

                    <p className="mt-1 break-all text-sm leading-6 text-slate-600">
                      {website}
                    </p>
                  </div>
                </div>

                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                >
                  Visit Official Website
                  <ExternalLink size={17} />
                </a>
              </div>
            )}

            {embassyWebsite && (
              <div className="group flex flex-col gap-5 rounded-3xl border border-sky-200 bg-sky-50/60 p-7 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-600 transition-all duration-500 group-hover:bg-sky-600 group-hover:text-white">
                    <Globe2 size={21} />
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      Bangladesh Embassy Website
                    </p>

                    <p className="mt-1 break-all text-sm leading-6 text-slate-600">
                      {embassyWebsite}
                    </p>
                  </div>
                </div>

                <a
                  href={embassyWebsite}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-500"
                >
                  Visit Embassy Website
                  <ExternalLink size={17} />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="bg-slate-50 py-20 sm:px-6">
        <div className="relative mx-auto max-w-308 overflow-hidden bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 py-24 sm:rounded-3xl">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

          <div className="absolute -bottom-40 right-10 h-112.5 w-112.5 rounded-full border border-white/10" />

          <div className="absolute right-1/4 top-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <ShieldCheck className="text-sky-400" size={22} />

              <span className="text-sm font-bold uppercase tracking-wider text-sky-400">
                Your Next Step
              </span>
            </div>

            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Could you be a good fit for{" "}
              <span className="text-sky-400">{opportunity.title}?</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Explore your eligibility based on your academic background, study
              level, nationality and the requirements of your selected
              scholarship.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              {isDatabase ? (
                <button
                  type="button"
                  onClick={openLanguageModal}
                  disabled={analysisLoading}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <BadgeCheck size={18} />
                  {analysisLoading ? "Analyzing..." : "Check My Eligibility"}
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              ) : (
                <NavLink
                  to="/dashboard/eligibility-analysis"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                >
                  <BadgeCheck size={18} />
                  Check My Eligibility
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </NavLink>
              )}

              <NavLink
                to="/opportunities"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
              >
                Explore Other Opportunities
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OpportunityDetails;
