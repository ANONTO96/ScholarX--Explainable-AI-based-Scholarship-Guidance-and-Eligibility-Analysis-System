import {
    Award,
    ArrowRight,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    Clock3,
    Filter,
    Globe2,
    Heart,
    Search,
    SlidersHorizontal,
    Sparkles,
    Target,
    TrendingUp,
    XCircle,
} from "lucide-react";
import { NavLink } from "react-router";
import { useMemo, useState } from "react";

import opportunities from "../../data/opportunities";
import { studentProfile } from "../../data/studentProfile";

// IMPORTANT:
// Use your existing canonical eligibility engine.
// Adjust this import path if your engine is stored elsewhere.
import { analyzeOpportunity } from "../../utils/eligibility";
import { getFavorites, toggleFavorite as toggleStoredFavorite, } from "../../utils/favorites";


/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase();
}


function formatDate(date) {
    if (!date) {
        return "Not specified";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Not specified";
    }

    return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}


function getDaysLeft(date) {
    if (!date) {
        return null;
    }

    const deadline = new Date(date);

    if (Number.isNaN(deadline.getTime())) {
        return null;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const difference =
        deadline.getTime() -
        today.getTime();

    return Math.ceil(
        difference /
            (1000 * 60 * 60 * 24)
    );
}


function getDeadlineLabel(date) {
    const days = getDaysLeft(date);

    if (days === null) {
        return "Deadline not specified";
    }

    if (days < 0) {
        return "Deadline passed";
    }

    if (days === 0) {
        return "Due today";
    }

    if (days === 1) {
        return "1 day left";
    }

    return `${days} days left`;
}


/* ========================================================= */
/* STATUS CONFIGURATION                                      */
/* ========================================================= */

const STATUS_CONFIG = {
    strong: {
        label: "Strong Match",
        description:
            "Your profile is a strong fit for this opportunity.",
        icon: CheckCircle2,
        badge:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        iconBg:
            "bg-emerald-100 text-emerald-600",
    },

    review: {
        label: "Needs Review",
        description:
            "Some requirements need verification or improvement.",
        icon: CircleAlert,
        badge:
            "border-amber-200 bg-amber-50 text-amber-700",
        iconBg:
            "bg-amber-100 text-amber-600",
    },

    "not-eligible": {
        label: "Not Eligible",
        description:
            "One or more mandatory requirements are not met.",
        icon: XCircle,
        badge:
            "border-rose-200 bg-rose-50 text-rose-700",
        iconBg:
            "bg-rose-100 text-rose-600",
    },
};


/* ========================================================= */
/* MATCH SCORE                                               */
/* ========================================================= */

function MatchScore({ score }) {
    const radius = 24;

    const circumference =
        2 * Math.PI * radius;

    const offset =
        circumference -
        (Math.min(Math.max(score, 0), 100) /
            100) *
            circumference;

    let scoreColor = "text-rose-500";

    if (score >= 85) {
        scoreColor =
            "text-emerald-500";
    } else if (score >= 60) {
        scoreColor =
            "text-amber-500";
    }

    return (
        <div className="relative h-19 w-19 shrink-0">
            <svg
                className="h-19 w-19 -rotate-90"
                viewBox="0 0 56 56"
            >
                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    className="text-slate-100"
                />

                <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray={
                        circumference
                    }
                    strokeDashoffset={
                        offset
                    }
                    className={
                        scoreColor
                    }
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-slate-900">
                    {score}%
                </span>

                <span className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                    Match
                </span>
            </div>
        </div>
    );
}


/* ========================================================= */
/* SUMMARY CARD                                              */
/* ========================================================= */

function SummaryCard({
    icon: Icon,
    label,
    value,
    description,
    iconClass,
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
                {description}
            </p>
        </div>
    );
}


/* ========================================================= */
/* INFO ITEM                                                 */
/* ========================================================= */

function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="min-w-0 rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="h-3.5 w-3.5 shrink-0" />

                <span className="text-[10px] font-semibold uppercase tracking-wide">
                    {label}
                </span>
            </div>

            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                {value}
            </p>
        </div>
    );
}


/* ========================================================= */
/* REQUIREMENT STAT                                          */
/* ========================================================= */

function RequirementStat({
    icon: Icon,
    label,
    value,
    className,
}) {
    return (
        <div
            className={`flex items-center justify-between rounded-xl px-3 py-2.5 ${className}`}
        >
            <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />

                <span className="text-xs font-semibold">
                    {label}
                </span>
            </div>

            <span className="text-sm font-bold">
                {value}
            </span>
        </div>
    );
}


/* ========================================================= */
/* FILTER SELECT                                             */
/* ========================================================= */

function FilterSelect({
    value,
    onChange,
    icon: Icon,
    options,
    fullWidth = false,
}) {
    return (
        <div
            className={`relative ${
                fullWidth
                    ? "w-full"
                    : ""
            }`}
        >
            <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className={`h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs font-semibold text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${
                    fullWidth
                        ? "w-full"
                        : "min-w-36.25"
                }`}
            >
                {options.map(
                    (option) => (
                        <option
                            key={
                                option.value
                            }
                            value={
                                option.value
                            }
                        >
                            {
                                option.label
                            }
                        </option>
                    )
                )}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
    );
}


/* ========================================================= */
/* MATCH CARD                                                */
/* ========================================================= */

function MatchCard({
    item,
    isFavorite,
    onToggleFavorite,
}) {
    const {
        opportunity,
        analysis,
    } = item;

    const status =
        analysis?.status ||
        "review";

    const score =
        Number(
            analysis?.score
        ) || 0;

    const config =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.review;

    const StatusIcon =
        config.icon;

    const deadline =
        opportunity.deadline;

    const daysLeft =
        getDaysLeft(
            deadline
        );

    const opportunityTitle =
        opportunity.title ||
        opportunity.name ||
        "Scholarship Opportunity";

    const provider =
        opportunity.provider ||
        opportunity.organization ||
        "Scholarship Provider";

    const degree =
        Array.isArray(
            opportunity.degree
        )
            ? opportunity.degree.join(
                  ", "
              )
            : opportunity.degree ||
              "Not specified";

    const opportunityPath =
        opportunity.slug
            ? `/opportunities/${opportunity.slug}`
            : `/opportunities/${opportunity.id}`;

    return (
        <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/40">
            {/* Accent */}
            <div className="h-1 bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500" />

            <div className="p-5 sm:p-6">
                {/* =========================================
                    Header
                ========================================== */}

                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                            <Award className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-bold leading-6 text-slate-900 sm:text-lg">
                                    {
                                        opportunityTitle
                                    }
                                </h3>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                {provider}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            onToggleFavorite(
                                opportunity.id
                            )
                        }
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${
                            isFavorite
                                ? "border-rose-200 bg-rose-50 text-rose-500"
                                : "border-slate-200 bg-white text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500"
                        }`}
                        aria-label={
                            isFavorite
                                ? "Remove from favorites"
                                : "Add to favorites"
                        }
                    >
                        <Heart
                            className="h-5 w-5"
                            fill={
                                isFavorite
                                    ? "currentColor"
                                    : "none"
                            }
                        />
                    </button>
                </div>

                {/* =========================================
                    Scholarship Details + Score
                ========================================== */}

                <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-center">
                    <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                        <InfoItem
                            icon={Globe2}
                            label="Country"
                            value={
                                opportunity.country ||
                                "Not specified"
                            }
                        />

                        <InfoItem
                            icon={Award}
                            label="Funding"
                            value={
                                opportunity.funding ||
                                "Not specified"
                            }
                        />

                        <InfoItem
                            icon={Target}
                            label="Degree"
                            value={
                                degree
                            }
                        />

                        <InfoItem
                            icon={Clock3}
                            label="Deadline"
                            value={formatDate(
                                deadline
                            )}
                        />
                    </div>

                    <MatchScore
                        score={score}
                    />
                </div>

                {/* =========================================
                    Status
                ========================================== */}

                <div
                    className={`mt-5 flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${config.badge}`}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconBg}`}
                        >
                            <StatusIcon className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm font-bold">
                                {
                                    config.label
                                }
                            </p>

                            <p className="mt-0.5 text-xs opacity-80">
                                {
                                    analysis?.statusReason ||
                                    config.description
                                }
                            </p>
                        </div>
                    </div>

                    {daysLeft !==
                        null && (
                        <span className="shrink-0 text-xs font-bold">
                            {
                                getDeadlineLabel(
                                    deadline
                                )
                            }
                        </span>
                    )}
                </div>

                {/* =========================================
                    Requirement Summary
                ========================================== */}

                <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-700">
                            Requirement Summary
                        </p>

                        <span className="text-xs text-slate-400">
                            {
                                analysis?.evaluatedCount ??
                                analysis?.totalRequirements ??
                                0
                            }{" "}
                            evaluated
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <RequirementStat
                            icon={
                                CheckCircle2
                            }
                            label="Passed"
                            value={
                                analysis?.passedCount ??
                                0
                            }
                            className="bg-emerald-50 text-emerald-600"
                        />

                        <RequirementStat
                            icon={
                                CircleAlert
                            }
                            label="Review"
                            value={
                                analysis?.reviewCount ??
                                0
                            }
                            className="bg-amber-50 text-amber-600"
                        />

                        <RequirementStat
                            icon={
                                XCircle
                            }
                            label="Failed"
                            value={
                                analysis?.failedCount ??
                                0
                            }
                            className="bg-rose-50 text-rose-600"
                        />
                    </div>
                </div>

                {/* =========================================
                    Actions
                ========================================== */}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <NavLink
                        to={
                            opportunityPath
                        }
                        className="group/button flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition hover:bg-sky-600"
                    >
                        Official Website Portal

                        <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                    </NavLink>

                    <NavLink
                        to={`/opportunityDetails/${opportunity.slug}`}
                        className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
                    >
                        <Target className="h-4 w-4" />

                        View Scholarship
                    </NavLink>
                </div>
            </div>
        </article>
    );
}


/* ========================================================= */
/* EMPTY STATE                                               */
/* ========================================================= */

function EmptyState({
    searchActive,
    onReset,
}) {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                <Search className="h-7 w-7" />
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
                {searchActive
                    ? "No matches found"
                    : "No scholarship matches yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {searchActive
                    ? "Try changing your search or filters to find more opportunities."
                    : "Complete your student profile to help ScholarX identify opportunities that fit you."}
            </p>

            {searchActive && (
                <button
                    type="button"
                    onClick={
                        onReset
                    }
                    className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
}


/* ========================================================= */
/* MAIN MATCHMAKING PAGE                                     */
/* ========================================================= */

export default function Matches() {
    const [
        search,
        setSearch,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        countryFilter,
        setCountryFilter,
    ] = useState("all");

    const [
        fundingFilter,
        setFundingFilter,
    ] = useState("all");

    const [
        sortBy,
        setSortBy,
    ] = useState("score");

    const [
        showFilters,
        setShowFilters,
    ] = useState(false);

    const [favorites, setFavorites] =
    useState(() => getFavorites());


    /* =====================================================
       CANONICAL MATCH ANALYSIS

       IMPORTANT:

       There is NO eligibility logic here.

       Your existing engine is the only source of truth.
    ===================================================== */

    const evaluatedMatches = useMemo(() => {
    return (opportunities || []).map((opportunity) => {
        const evaluated = analyzeOpportunity(
            opportunity,
            studentProfile
        );

        return {
            opportunity,
            analysis: evaluated.analysis,
        };
    });
}, []);


    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary =
        useMemo(() => {
            return {
                total:
                    evaluatedMatches.length,

                strong:
                    evaluatedMatches.filter(
                        ({
                            analysis,
                        }) =>
                            analysis.status ===
                            "strong"
                    ).length,

                review:
                    evaluatedMatches.filter(
                        ({
                            analysis,
                        }) =>
                            analysis.status ===
                            "review"
                    ).length,

                notEligible:
                    evaluatedMatches.filter(
                        ({
                            analysis,
                        }) =>
                            analysis.status ===
                            "not-eligible"
                    ).length,
            };
        }, [
            evaluatedMatches,
        ]);


    /* =====================================================
       PROFILE READINESS

       This is UI-only.
       It does NOT affect eligibility scores.
    ===================================================== */

    const profileReadiness =
        useMemo(() => {
            const checks = [
                Boolean(
                    studentProfile.personal
                        ?.name
                ),

                Boolean(
                    studentProfile.personal
                        ?.email
                ),

                Boolean(
                    studentProfile.personal
                        ?.nationality
                ),

                Boolean(
                    studentProfile.personal
                        ?.age
                ),

                Boolean(
                    studentProfile.academic
                        ?.studyLevel
                ),

                Boolean(
                    studentProfile.academic
                        ?.fieldOfStudy
                ),

                studentProfile.academic
                    ?.academicPerformance !==
                    null &&
                    studentProfile.academic
                        ?.academicPerformance !==
                        undefined,

                Boolean(
                    studentProfile.english
                        ?.test
                ),

                studentProfile.english
                    ?.score !== null &&
                    studentProfile.english
                        ?.score !==
                        undefined,

                Boolean(
                    studentProfile.preferences
                        ?.studyDestination
                ),

                studentProfile.preferences
                    ?.annualBudget
                    ?.amount !== null &&
                    studentProfile.preferences
                        ?.annualBudget
                        ?.amount !==
                        undefined,

                studentProfile.experience
                    ?.workExperienceMonths !==
                    null &&
                    studentProfile.experience
                        ?.workExperienceMonths !==
                        undefined,
            ];

            const completed =
                checks.filter(
                    Boolean
                ).length;

            return Math.round(
                (completed /
                    checks.length) *
                    100
            );
        }, []);


    /* =====================================================
       FILTER OPTIONS
    ===================================================== */

    const countries =
        useMemo(() => {
            return [
                ...new Set(
                    evaluatedMatches
                        .map(
                            ({
                                opportunity,
                            }) =>
                                opportunity.country
                        )
                        .filter(Boolean)
                ),
            ].sort();
        }, [
            evaluatedMatches,
        ]);


    const fundingTypes =
        useMemo(() => {
            return [
                ...new Set(
                    evaluatedMatches
                        .map(
                            ({
                                opportunity,
                            }) =>
                                opportunity.funding
                        )
                        .filter(Boolean)
                ),
            ].sort();
        }, [
            evaluatedMatches,
        ]);


    /* =====================================================
       FILTER + SORT
    ===================================================== */

    const filteredMatches =
        useMemo(() => {
            const query =
                normalize(
                    search
                );

            const result =
                evaluatedMatches.filter(
                    ({
                        opportunity,
                        analysis,
                    }) => {
                        const title =
                            normalize(
                                opportunity.title ||
                                    opportunity.name
                            );

                        const provider =
                            normalize(
                                opportunity.provider ||
                                    opportunity.organization
                            );

                        const country =
                            normalize(
                                opportunity.country
                            );

                        const funding =
                            normalize(
                                opportunity.funding
                            );

                        const matchesSearch =
                            !query ||
                            title.includes(
                                query
                            ) ||
                            provider.includes(
                                query
                            ) ||
                            country.includes(
                                query
                            ) ||
                            funding.includes(
                                query
                            );

                        const matchesStatus =
                            statusFilter ===
                                "all" ||
                            analysis.status ===
                                statusFilter;

                        const matchesCountry =
                            countryFilter ===
                                "all" ||
                            country ===
                                normalize(
                                    countryFilter
                                );

                        const matchesFunding =
                            fundingFilter ===
                                "all" ||
                            funding ===
                                normalize(
                                    fundingFilter
                                );

                        return (
                            matchesSearch &&
                            matchesStatus &&
                            matchesCountry &&
                            matchesFunding
                        );
                    }
                );

            return [
                ...result,
            ].sort(
                (a, b) => {
                    if (
                        sortBy ===
                        "score"
                    ) {
                        return (
                            b.analysis
                                .score -
                            a.analysis
                                .score
                        );
                    }

                    if (
                        sortBy ===
                        "deadline"
                    ) {
                        const first =
                            new Date(
                                a.opportunity
                                    .deadline ||
                                    "9999-12-31"
                            ).getTime();

                        const second =
                            new Date(
                                b.opportunity
                                    .deadline ||
                                    "9999-12-31"
                            ).getTime();

                        return (
                            first -
                            second
                        );
                    }

                    if (
                        sortBy ===
                        "name"
                    ) {
                        return String(
                            a.opportunity
                                .title ||
                                a.opportunity
                                    .name ||
                                ""
                        ).localeCompare(
                            String(
                                b.opportunity
                                    .title ||
                                    b.opportunity
                                        .name ||
                                    ""
                            )
                        );
                    }

                    return 0;
                }
            );
        }, [
            evaluatedMatches,
            search,
            statusFilter,
            countryFilter,
            fundingFilter,
            sortBy,
        ]);


    /* =====================================================
       FAVORITES
    ===================================================== */

    const toggleFavorite = (id) => {
    const updated =
        toggleStoredFavorite(id);

    setFavorites(updated);
};


    const clearFilters =
        () => {
            setSearch("");
            setStatusFilter(
                "all"
            );
            setCountryFilter(
                "all"
            );
            setFundingFilter(
                "all"
            );
            setSortBy(
                "score"
            );
        };


    const searchActive =
        Boolean(search) ||
        statusFilter !== "all" ||
        countryFilter !== "all" ||
        fundingFilter !== "all";


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen bg-slate-50/70">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-sky-500 via-blue-600 to-indigo-600 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">

                    {/* Decorative circles */}

                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                        {/* Header text */}

                        <div className="max-w-2xl">

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">
                                <Sparkles className="h-4 w-4" />

                                <span className="text-xs font-semibold">
                                    AI-Powered Matchmaking
                                </span>
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Find scholarships matched to you
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-sky-50 sm:text-base">
                                ScholarX compares your student profile with scholarship requirements and helps you discover opportunities that fit your goals.
                            </p>
                        </div>


                        {/* Profile readiness */}

                        <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />

                                    <span className="text-sm font-semibold">
                                        Profile readiness
                                    </span>
                                </div>

                                <span className="text-lg font-bold">
                                    {profileReadiness}%
                                </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-500"
                                    style={{
                                        width: `${profileReadiness}%`,
                                    }}
                                />
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-sky-100">

                                <span>
                                    Complete your profile for better matching.
                                </span>

                                <NavLink
                                    to="/dashboard/profile"
                                    className="shrink-0 font-semibold text-white underline-offset-4 hover:underline"
                                >
                                    Complete
                                </NavLink>

                            </div>
                        </div>
                    </div>
                </section>


                {/* =================================================
                    SUMMARY
                ================================================= */}

                <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

                    <SummaryCard
                        icon={TrendingUp}
                        label="Total Matches"
                        value={
                            summary.total
                        }
                        description="Opportunities analyzed"
                        iconClass="bg-sky-50 text-sky-600"
                    />

                    <SummaryCard
                        icon={CheckCircle2}
                        label="Strong Matches"
                        value={
                            summary.strong
                        }
                        description="Strong overall profile fit"
                        iconClass="bg-emerald-50 text-emerald-600"
                    />

                    <SummaryCard
                        icon={CircleAlert}
                        label="Needs Review"
                        value={
                            summary.review
                        }
                        description="Potentially eligible opportunities"
                        iconClass="bg-amber-50 text-amber-600"
                    />

                    <SummaryCard
                        icon={XCircle}
                        label="Not Eligible"
                        value={
                            summary.notEligible
                        }
                        description="Mandatory requirements not met"
                        iconClass="bg-rose-50 text-rose-600"
                    />

                </section>


                {/* =================================================
                    SEARCH + FILTERS
                ================================================= */}

                <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

                        {/* Search */}

                        <div className="relative flex-1">

                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search scholarships, providers, countries..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                            />
                        </div>


                        {/* Desktop filters */}

                        <div className="hidden gap-2 md:flex">

                            <FilterSelect
                                value={
                                    statusFilter
                                }
                                onChange={
                                    setStatusFilter
                                }
                                icon={
                                    Filter
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "All Status",
                                    },
                                    {
                                        value: "strong",
                                        label: "Strong Match",
                                    },
                                    {
                                        value: "review",
                                        label: "Needs Review",
                                    },
                                    {
                                        value: "not-eligible",
                                        label: "Not Eligible",
                                    },
                                ]}
                            />

                            <FilterSelect
                                value={
                                    countryFilter
                                }
                                onChange={
                                    setCountryFilter
                                }
                                icon={
                                    Globe2
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "All Countries",
                                    },
                                    ...countries.map(
                                        (
                                            country
                                        ) => ({
                                            value: country,
                                            label: country,
                                        })
                                    ),
                                ]}
                            />

                            <FilterSelect
                                value={
                                    fundingFilter
                                }
                                onChange={
                                    setFundingFilter
                                }
                                icon={
                                    Award
                                }
                                options={[
                                    {
                                        value: "all",
                                        label: "All Funding",
                                    },
                                    ...fundingTypes.map(
                                        (
                                            funding
                                        ) => ({
                                            value: funding,
                                            label: funding,
                                        })
                                    ),
                                ]}
                            />

                            <FilterSelect
                                value={
                                    sortBy
                                }
                                onChange={
                                    setSortBy
                                }
                                icon={
                                    SlidersHorizontal
                                }
                                options={[
                                    {
                                        value: "score",
                                        label: "Best Match",
                                    },
                                    {
                                        value: "deadline",
                                        label: "Deadline",
                                    },
                                    {
                                        value: "name",
                                        label: "Name",
                                    },
                                ]}
                            />

                        </div>


                        {/* Mobile */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowFilters(
                                    (
                                        current
                                    ) =>
                                        !current
                                )
                            }
                            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 md:hidden"
                        >
                            <SlidersHorizontal className="h-4 w-4" />

                            Filters

                            <ChevronDown
                                className={`h-4 w-4 transition-transform ${
                                    showFilters
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                    </div>


                    {/* Mobile filters */}

                    {showFilters && (
                        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:hidden">

                            <FilterSelect
                                value={
                                    statusFilter
                                }
                                onChange={
                                    setStatusFilter
                                }
                                icon={
                                    Filter
                                }
                                fullWidth
                                options={[
                                    {
                                        value: "all",
                                        label: "All Status",
                                    },
                                    {
                                        value: "strong",
                                        label: "Strong Match",
                                    },
                                    {
                                        value: "review",
                                        label: "Needs Review",
                                    },
                                    {
                                        value: "not-eligible",
                                        label: "Not Eligible",
                                    },
                                ]}
                            />

                            <FilterSelect
                                value={
                                    countryFilter
                                }
                                onChange={
                                    setCountryFilter
                                }
                                icon={
                                    Globe2
                                }
                                fullWidth
                                options={[
                                    {
                                        value: "all",
                                        label: "All Countries",
                                    },
                                    ...countries.map(
                                        (
                                            country
                                        ) => ({
                                            value: country,
                                            label: country,
                                        })
                                    ),
                                ]}
                            />

                            <FilterSelect
                                value={
                                    fundingFilter
                                }
                                onChange={
                                    setFundingFilter
                                }
                                icon={
                                    Award
                                }
                                fullWidth
                                options={[
                                    {
                                        value: "all",
                                        label: "All Funding",
                                    },
                                    ...fundingTypes.map(
                                        (
                                            funding
                                        ) => ({
                                            value: funding,
                                            label: funding,
                                        })
                                    ),
                                ]}
                            />

                            <FilterSelect
                                value={
                                    sortBy
                                }
                                onChange={
                                    setSortBy
                                }
                                icon={
                                    SlidersHorizontal
                                }
                                fullWidth
                                options={[
                                    {
                                        value: "score",
                                        label: "Best Match",
                                    },
                                    {
                                        value: "deadline",
                                        label: "Deadline",
                                    },
                                    {
                                        value: "name",
                                        label: "Name",
                                    },
                                ]}
                            />

                        </div>
                    )}

                </section>


                {/* =================================================
                    RESULT HEADER
                ================================================= */}

                <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Your Matches
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {
                                    filteredMatches.length
                                }
                            </span>{" "}
                            of{" "}
                            {
                                evaluatedMatches.length
                            }{" "}
                            opportunities
                        </p>
                    </div>


                    {searchActive && (
                        <button
                            type="button"
                            onClick={
                                clearFilters
                            }
                            className="self-start text-xs font-semibold text-sky-600 hover:text-sky-700 sm:self-auto"
                        >
                            Clear all filters
                        </button>
                    )}

                </div>


                {/* =================================================
                    MATCH CARDS
                ================================================= */}

                <section className="mt-4 space-y-4">

                    {filteredMatches.length >
                    0 ? (
                        filteredMatches.map(
                            (
                                item
                            ) => (
                                <MatchCard
                                    key={
                                        item
                                            .opportunity
                                            .id
                                    }
                                    item={
                                        item
                                    }
                                    isFavorite={favorites.includes(
                                        item
                                            .opportunity
                                            .id
                                    )}
                                    onToggleFavorite={
                                        toggleFavorite
                                    }
                                />
                            )
                        )
                    ) : (
                        <EmptyState
                            searchActive={
                                searchActive
                            }
                            onReset={
                                clearFilters
                            }
                        />
                    )}

                </section>


                {/* =================================================
                    EXPLANATION
                ================================================= */}

                {filteredMatches.length >
                    0 && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">

                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-500">
                            <Sparkles className="h-4 w-4" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-sky-900">
                                How your match score works
                            </p>

                            <p className="mt-1 text-xs leading-5 text-sky-700">
                                Match scores are generated from the same eligibility engine used by ScholarX Eligibility Analysis. Mandatory requirements carry greater importance, while preferred criteria contribute to overall fit and competitiveness.
                            </p>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

