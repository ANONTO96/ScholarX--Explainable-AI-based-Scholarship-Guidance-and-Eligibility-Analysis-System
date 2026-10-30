import {
    AlertCircle,
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    Filter,
    GraduationCap,
    Globe2,
    Search,
    SlidersHorizontal,
    Sparkles,
    Target,
    UserRoundCheck,
    XCircle,
} from "lucide-react";

import { NavLink } from "react-router";
import { useMemo, useState } from "react";
import { useDashboard } from "../../context/Dashboard/useDashboard";

/* ========================================================= */
/* HELPERS                                                    */
/* ========================================================= */

function normalize(value) {
    return String(value ?? "").trim().toLowerCase();
}

function formatProfileNumber(value, decimals) {
    if (
        value === null ||
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
    ) {
        return "Not specified";
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number.toFixed(decimals)
        : "Not specified";
}


/* ========================================================= */
/* STATUS CONFIG                                              */
/* ========================================================= */

const statusConfig = {
    strong: {
        label: "Strong Fit",
        description:
            "Your profile meets the mandatory requirements and aligns strongly with this opportunity.",
        icon: CheckCircle2,
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconBox: "bg-emerald-50 text-emerald-600",
        score: "text-emerald-600",
    },

    review: {
        label: "Review",
        description:
            "You may be eligible, but some criteria need verification or your profile could be more competitive.",
        icon: AlertCircle,
        badge: "bg-amber-50 text-amber-700 border-amber-200",
        iconBox: "bg-amber-50 text-amber-600",
        score: "text-amber-600",
    },

    "not-eligible": {
        label: "Not Eligible",
        description:
            "At least one mandatory requirement does not currently match your profile.",
        icon: XCircle,
        badge: "bg-rose-50 text-rose-700 border-rose-200",
        iconBox: "bg-rose-50 text-rose-600",
        score: "text-rose-600",
    },
};

/* ========================================================= */
/* FILTER SELECT                                              */
/* ========================================================= */

function FilterSelect({
    value,
    onChange,
    icon: Icon,
    options,
    fullWidth = false,
}) {
    return (
        <div className={`relative ${fullWidth ? "w-full" : ""}`}>
            <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-xs font-semibold text-slate-600 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 ${fullWidth ? "w-full" : "min-w-36"
                    }`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
    );
}

/* ========================================================= */
/* REQUIREMENT CATEGORY BADGE                                */
/* ========================================================= */

function RequirementCategoryBadge({ category }) {
    return (
        <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${category === "mandatory"
                ? "bg-sky-50 text-sky-600"
                : "bg-violet-50 text-violet-600"
                }`}
        >
            {category === "mandatory" ? "Mandatory" : "Preferred"}
        </span>
    );
}

/* ========================================================= */
/* OPPORTUNITY CARD                                          */
/* ========================================================= */

function OpportunityCard({ opportunity }) {
    const [open, setOpen] = useState(false);

    const analysis = opportunity.analysis;

    const config =
        statusConfig[analysis?.status] || statusConfig.review;

    const StatusIcon = config.icon;

    const degree = Array.isArray(opportunity.degree)
        ? opportunity.degree.join(", ")
        : opportunity.degree || "Not specified";

    const score = Number(analysis?.score);

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:shadow-xl">

            <div className="group p-6 sm:p-7">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex min-w-0 gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-all group-hover:bg-sky-600 group-hover:text-white">
                            <Award size={26} />
                        </div>

                        <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                                {opportunity.category && (
                                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                                        {opportunity.category}
                                    </span>
                                )}

                                {opportunity.featured && (
                                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-600">
                                        Featured
                                    </span>
                                )}

                            </div>

                            <h3 className="mt-2 wrap-break-word text-xl font-black text-slate-950 sm:text-2xl">
                                {opportunity.title || opportunity.name || "Scholarship Opportunity"}
                            </h3>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {opportunity.provider || opportunity.organization || "Scholarship Provider"}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                                <span className="inline-flex items-center gap-1.5">
                                    <Globe2 size={14} />
                                    {opportunity.country || "Country not specified"}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <GraduationCap size={14} />
                                    {degree}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <Sparkles size={14} />
                                    {opportunity.funding || "Funding not specified"}
                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">

                        <div className="flex flex-col items-center gap-1.5">

                            <div className={`flex h-14 w-14 items-center justify-center rounded-full border-4 ${config.badge}`}>
                                <span className={`text-sm font-black ${config.score}`}>
                                    {Number.isFinite(score) ? score : 0}%
                                </span>
                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                                Fit Score
                            </span>

                        </div>

                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.badge}`}>
                            <StatusIcon size={14} />
                            {config.label}
                        </div>

                    </div>

                </div>

                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">
                    {config.description}
                </p>

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-xs font-semibold leading-5 text-slate-600">
                        {analysis?.statusReason || "Review the requirement breakdown for more information."}
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-3 divide-x rounded-2xl border border-slate-100 bg-slate-50">

                    <div className="p-4 text-center">
                        <p className="text-lg font-black text-emerald-600">
                            {analysis?.passedCount ?? 0}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Passed
                        </p>
                    </div>

                    <div className="p-4 text-center">
                        <p className="text-lg font-black text-amber-500">
                            {analysis?.reviewCount ?? 0}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Review
                        </p>
                    </div>

                    <div className="p-4 text-center">
                        <p className="text-lg font-black text-rose-500">
                            {analysis?.failedCount ?? 0}
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Not met
                        </p>
                    </div>

                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-sky-700">
                                Mandatory
                            </span>

                            <span className="text-sm font-black text-sky-700">
                                {analysis?.mandatoryPassedCount ?? 0}/
                                {analysis?.mandatoryRequirements?.length ?? 0}
                            </span>
                        </div>

                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            These determine actual eligibility.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-violet-700">
                                Preferred
                            </span>

                            <span className="text-sm font-black text-violet-700">
                                {analysis?.preferredPassedCount ?? 0}/
                                {analysis?.preferredRequirements?.length ?? 0}
                            </span>
                        </div>

                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            These influence competitiveness, not automatic eligibility.
                        </p>
                    </div>

                </div>

                <button
                    type="button"
                    onClick={() => setOpen((value) => !value)}
                    className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50/30"
                >
                    <span>
                        {open
                            ? "Hide requirement analysis"
                            : "See why you received this result"}
                    </span>

                    <ChevronDown
                        size={18}
                        className={`transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>

            </div>

            {open && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-7">

                    <div className="mb-5">

                        <p className="text-sm font-bold uppercase tracking-wider text-sky-600">
                            Requirement breakdown
                        </p>

                        <h4 className="mt-1 text-xl font-black text-slate-950">
                            How your profile compares
                        </h4>

                        <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
                            Mandatory requirements determine eligibility. Preferred requirements influence competitiveness without automatically disqualifying you.
                        </p>

                    </div>

                    <div className="space-y-3">

                        {(analysis?.requirements ?? []).map((item, index) => {

                            const passed = item.type === "pass";
                            const failed = item.type === "fail";

                            const statusLabel = passed
                                ? "Passed"
                                : failed
                                    ? "Not met"
                                    : "Review";

                            return (
                                <div
                                    key={`${item.key}-${index}`}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                                >

                                    <div className="flex gap-3">

                                        <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${passed
                                            ? "bg-emerald-50 text-emerald-600"
                                            : failed
                                                ? "bg-rose-50 text-rose-600"
                                                : "bg-amber-50 text-amber-600"
                                            }`}>
                                            {passed ? (
                                                <CheckCircle2 size={16} />
                                            ) : failed ? (
                                                <XCircle size={16} />
                                            ) : (
                                                <AlertCircle size={16} />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">

                                            <div className="flex flex-wrap items-center gap-2">

                                                <p className="font-bold text-slate-900">
                                                    {item.requirement}
                                                </p>

                                                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${passed
                                                    ? "bg-emerald-50 text-emerald-600"
                                                    : failed
                                                        ? "bg-rose-50 text-rose-600"
                                                        : "bg-amber-50 text-amber-600"
                                                    }`}>
                                                    {statusLabel}
                                                </span>

                                                <RequirementCategoryBadge category={item.category} />

                                            </div>

                                            <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
                                                {item.detail}
                                            </p>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                <Target size={18} />
                            </div>

                            <div>
                                <p className="text-sm font-black text-sky-900">
                                    How your score works
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    The Scholarship Fit Score summarizes how closely your profile aligns with the opportunity's configured requirements. Mandatory criteria help determine eligibility, while preferred criteria provide additional information about your profile fit. Missing information may require verification. This score is not a probability of receiving a scholarship or a guarantee of an award.
                                </p>
                            </div>

                        </div>

                    </div>

                    {opportunity.website && (
                        <div className="mt-6 flex flex-wrap gap-3">

                            <a
                                href={opportunity.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition hover:translate-y-0.5 hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >
                                View official opportunity

                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </a>

                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

/* ========================================================= */
/* MAIN PAGE                                                 */
/* ========================================================= */

export default function EligibilityAnalysis() {

    /* =====================================================
       FILTER STATE
    ===================================================== */

    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [countryFilter, setCountryFilter] = useState("all");
    const [fundingFilter, setFundingFilter] = useState("all");
    const [sortBy, setSortBy] = useState("score");
    const [showFilters, setShowFilters] = useState(false);

    /* =====================================================
       DASHBOARD DATA
    ===================================================== */

    const {
        profile,
        profileReadiness,
        profileCompletion,
        eligibilityOpportunities: analyzedOpportunities,
        matchStats,
    } = useDashboard();

    const counts = {
        strong: matchStats?.strong ?? 0,
        review: matchStats?.review ?? 0,
        notEligible: matchStats?.notEligible ?? 0,
    };

    const readinessPercentage = Math.min(
        100,
        Math.max(0, profileReadiness?.percentage ?? 0)
    );

    // Use profile completion to determine whether the student
    // has started entering scholarship-related information.
    const hasStartedProfile =
        (profileCompletion?.completed ?? 0) > 0;

    const isProfileIncomplete =
        hasStartedProfile && readinessPercentage < 100;

    /* =====================================================
       FILTER OPTIONS
    ===================================================== */

    const countries = useMemo(() => {
        return [
            ...new Set(
                analyzedOpportunities
                    .map((item) => item.country)
                    .filter(Boolean)
            ),
        ].sort();
    }, [analyzedOpportunities]);

    const fundingTypes = useMemo(() => {
        return [
            ...new Set(
                analyzedOpportunities
                    .map((item) => item.funding)
                    .filter(Boolean)
            ),
        ].sort();
    }, [analyzedOpportunities]);

    /* =====================================================
       FILTER + SORT
    ===================================================== */

    const filteredOpportunities = useMemo(() => {

        const query = normalize(search);

        const result = analyzedOpportunities.filter((item) => {

            const opportunity = item;
            const analysis = item.analysis ?? {};

            const title = normalize(
                opportunity.title || opportunity.name
            );

            const provider = normalize(
                opportunity.provider || opportunity.organization
            );

            const country = normalize(opportunity.country);
            const funding = normalize(opportunity.funding);
            const category = normalize(opportunity.category);

            const degree = normalize(
                Array.isArray(opportunity.degree)
                    ? opportunity.degree.join(" ")
                    : opportunity.degree
            );

            const matchesSearch =
                !query ||
                title.includes(query) ||
                provider.includes(query) ||
                country.includes(query) ||
                funding.includes(query) ||
                category.includes(query) ||
                degree.includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                analysis.status === statusFilter;

            const matchesCardStatus =
                activeFilter === "all" ||
                analysis.status === activeFilter;

            const matchesCountry =
                countryFilter === "all" ||
                country === normalize(countryFilter);

            const matchesFunding =
                fundingFilter === "all" ||
                funding === normalize(fundingFilter);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCardStatus &&
                matchesCountry &&
                matchesFunding
            );
        });

        return [...result].sort((a, b) => {

            if (sortBy === "score") {
                return (
                    (Number(b.analysis?.score) || 0) -
                    (Number(a.analysis?.score) || 0)
                );
            }

            if (sortBy === "deadline") {
                const first = new Date(
                    a.deadline || "9999-12-31"
                ).getTime();

                const second = new Date(
                    b.deadline || "9999-12-31"
                ).getTime();

                return first - second;
            }

            if (sortBy === "name") {
                return String(
                    a.title || a.name || ""
                ).localeCompare(
                    String(b.title || b.name || "")
                );
            }

            return 0;
        });

    }, [
        analyzedOpportunities,
        search,
        statusFilter,
        activeFilter,
        countryFilter,
        fundingFilter,
        sortBy,
    ]);

    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
        setCountryFilter("all");
        setFundingFilter("all");
        setSortBy("score");
        setActiveFilter("all");
    };

    const searchActive =
        Boolean(search.trim()) ||
        statusFilter !== "all" ||
        countryFilter !== "all" ||
        fundingFilter !== "all" ||
        activeFilter !== "all";

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen bg-[#eef7ff] text-slate-900">

            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-[#e5f3ff]">

                <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

                <div className="absolute right-[25%] top-20 rotate-12 text-blue-200 lg:right-[30%] lg:top-25">
                    <Sparkles size={70} strokeWidth={1.5} />
                </div>

                <div className="absolute bottom-32 left-[15%] rotate-12 text-blue-200">
                    <Target size={75} strokeWidth={1.2} />
                </div>

                <div className="absolute bottom-10 right-[8%] text-sky-200">
                    <GraduationCap size={80} strokeWidth={1.2} />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-40 sm:px-8 lg:px-10">

                    <div className="mx-auto max-w-4xl text-center">

                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm">
                            <Target size={16} />
                            Eligibility Analysis
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            See which opportunities
                            <br />
                            <span className="text-indigo-600">
                                fit your profile
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            ScholarX compares your student profile against available opportunities and separates actual eligibility from competitive profile fit.
                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                PROFILE SUMMARY
            ===================================================== */}

            <section className="relative z-20 mx-auto -mt-12 max-w-7xl px-3 sm:px-6 lg:px-8">

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

                    <div className="grid lg:grid-cols-[1fr_auto]">

                        <div className="group p-6 sm:p-7">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-all group-hover:bg-sky-600 group-hover:text-white">
                                    <UserRoundCheck size={22} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Your Academic Profile
                                    </p>

                                    <h2 className="text-xl font-black">
                                        {profile?.academic?.fieldOfStudy
                                            ? `${profile.academic.fieldOfStudy} Student`
                                            : "Student Profile"}
                                    </h2>
                                </div>

                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">

                                {[
                                    `GPA ${formatProfileNumber(profile?.academic?.academicPerformance, 2)}`,
                                    profile?.academic?.studyLevel || "Study level not specified",
                                    profile?.academic?.fieldOfStudy || "Field not specified",
                                    profile?.preferences?.studyDestination || "Destination not specified",
                                    `${profile?.english?.test || "English"} ${formatProfileNumber(profile?.english?.score, 1)}`,
                                    profile?.personal?.nationality || "Nationality not specified",
                                    `Age ${profile?.personal?.age ?? "N/A"}`,
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                                    >
                                        {item}
                                    </span>
                                ))}

                            </div>

                        </div>

                        <div className="flex items-center border-t border-slate-100 bg-sky-50/50 p-6 lg:border-l lg:border-t-0">

                            <NavLink
                                to="/dashboard/profile"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition-all hover:translate-y-0.5 hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >
                                Update profile
                                <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
                            </NavLink>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                PROFILE ONBOARDING
            ===================================================== */}

            {!hasStartedProfile ? (

                <section className="mx-auto max-w-7xl px-3 py-16 sm:px-6 lg:px-8">

                    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">

                        <div className="h-1 bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500" />

                        <div className="px-5 py-12 text-center sm:px-10 sm:py-16">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                <CircleAlert size={30} />
                            </div>

                            <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
                                Your Scholarship Analysis Is Waiting
                            </h2>

                            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                                We need some information about your academic background,
                                nationality, English proficiency, and study preferences
                                before we can evaluate scholarship opportunities for you.
                                Complete your profile to unlock personalized eligibility results.
                            </p>

                            <div className="mx-auto mt-7 max-w-md rounded-2xl bg-slate-50 p-5 text-left">

                                <div className="flex items-center justify-between gap-3">

                                    <span className="text-sm font-bold text-slate-700">
                                        Profile readiness
                                    </span>

                                    <span className="text-sm font-black text-sky-600">
                                        {readinessPercentage}%
                                    </span>

                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">

                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-sky-400 to-blue-600 transition-all duration-500"
                                        style={{
                                            width: `${readinessPercentage}%`,
                                        }}
                                    />

                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    {profileReadiness?.completed ?? 0} of{" "}
                                    {profileReadiness?.total ?? 0} requirements completed.
                                </p>

                            </div>

                            <NavLink
                                to="/dashboard/profile"
                                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white shadow-sm shadow-sky-200 transition hover:bg-sky-600"
                            >
                                Complete My Profile
                                <ArrowRight size={17} />
                            </NavLink>

                            <p className="mt-4 text-xs text-slate-400">
                                Your name and email are not required for scholarship eligibility analysis.
                            </p>

                        </div>

                    </div>

                </section>

            ) : (

                <>

                    {/* =====================================================
                        PROFILE READINESS NOTICE
                    ===================================================== */}

                    {isProfileIncomplete && (
                        <section className="mx-auto max-w-7xl px-3 pt-12 sm:px-6 lg:px-8">

                            <div className="overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">

                                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                            <CircleAlert size={23} />
                                        </div>

                                        <div className="min-w-0">

                                            <h3 className="font-bold text-amber-900">
                                                Your profile is not fully complete
                                            </h3>

                                            <p className="mt-1 max-w-2xl text-sm leading-6 text-amber-800">
                                                Your scholarship analysis is based on the information
                                                currently available. Adding your remaining academic,
                                                personal, and preference details can improve the
                                                accuracy of your eligibility assessment.
                                            </p>

                                            <div className="mt-4 max-w-md">

                                                <div className="mb-2 flex items-center justify-between">

                                                    <span className="text-xs font-bold text-amber-800">
                                                        Profile readiness
                                                    </span>

                                                    <span className="text-sm font-black text-amber-700">
                                                        {readinessPercentage}%
                                                    </span>

                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-amber-200">

                                                    <div
                                                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                                                        style={{
                                                            width: `${readinessPercentage}%`,
                                                        }}
                                                    />

                                                </div>

                                                <p className="mt-2 text-xs text-amber-700">
                                                    {profileReadiness?.completed ?? 0} of{" "}
                                                    {profileReadiness?.total ?? 0} profile
                                                    requirements completed.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    <NavLink
                                        to="/dashboard/profile"
                                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white px-5 py-3 text-sm font-bold text-amber-800 shadow-sm transition hover:bg-amber-100"
                                    >
                                        Complete profile
                                        <ArrowRight size={16} />
                                    </NavLink>

                                </div>

                            </div>

                        </section>
                    )}

                    {/* =====================================================
                        RESULT SUMMARY
                    ===================================================== */}

                    <section className="mx-auto max-w-7xl px-3 pt-16 sm:px-6 lg:px-8">

                        <div className="grid gap-4 sm:grid-cols-3">

                            <button
                                type="button"
                                onClick={() => setActiveFilter(activeFilter === "strong" ? "all" : "strong")}
                                className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${activeFilter === "strong"
                                    ? "border-emerald-300 bg-emerald-50 shadow-lg"
                                    : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <CheckCircle2 size={22} />
                                    </div>

                                    <span className="text-3xl font-black text-emerald-600">
                                        {counts.strong}
                                    </span>
                                </div>

                                <p className="mt-5 font-black">
                                    Strong Fit
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Opportunities where your profile aligns strongly.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveFilter(activeFilter === "review" ? "all" : "review")}
                                className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${activeFilter === "review"
                                    ? "border-amber-300 bg-amber-50 shadow-lg"
                                    : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                        <AlertCircle size={22} />
                                    </div>

                                    <span className="text-3xl font-black text-amber-500">
                                        {counts.review}
                                    </span>
                                </div>

                                <p className="mt-5 font-black">
                                    Review
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Potential opportunities with criteria to verify or strengthen.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveFilter(activeFilter === "not-eligible" ? "all" : "not-eligible")}
                                className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${activeFilter === "not-eligible"
                                    ? "border-rose-300 bg-rose-50 shadow-lg"
                                    : "border-slate-200 bg-white hover:border-rose-200 hover:shadow-lg"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                        <XCircle size={22} />
                                    </div>

                                    <span className="text-3xl font-black text-rose-500">
                                        {counts.notEligible}
                                    </span>
                                </div>

                                <p className="mt-5 font-black">
                                    Not Eligible
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Opportunities with mandatory requirements you do not currently meet.
                                </p>
                            </button>

                        </div>

                    </section>

                    {/* =====================================================
                        OPPORTUNITIES HEADER
                    ===================================================== */}

                    <section className="mx-auto max-w-7xl px-3 pt-20 sm:px-6 lg:px-8">

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <div className="mb-3 flex items-center gap-3">
                                    <span className="h-px w-8 bg-sky-600" />

                                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">
                                        Your results
                                    </span>
                                </div>

                                <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                                    Opportunities for your profile
                                </h2>

                                <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                                    Each opportunity is evaluated using mandatory eligibility requirements and preferred profile factors so that competitive weaknesses are not mistaken for hard ineligibility.
                                </p>

                            </div>

                        </div>

                    </section>

                    {/* =====================================================
                        SEARCH + FILTERS
                    ===================================================== */}

                    <section className="mx-auto mt-7 max-w-7xl px-3 sm:px-6 lg:px-8">

                        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

                                <div className="relative flex-1">

                                    <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Search scholarships, providers, countries..."
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    />

                                </div>

                                <div className="hidden gap-2 md:flex">

                                    <FilterSelect
                                        value={statusFilter}
                                        onChange={setStatusFilter}
                                        icon={Filter}
                                        options={[
                                            { value: "all", label: "All Status" },
                                            { value: "strong", label: "Strong Fit" },
                                            { value: "review", label: "Review" },
                                            { value: "not-eligible", label: "Not Eligible" },
                                        ]}
                                    />

                                    <FilterSelect
                                        value={countryFilter}
                                        onChange={setCountryFilter}
                                        icon={Globe2}
                                        options={[
                                            { value: "all", label: "All Countries" },
                                            ...countries.map((country) => ({
                                                value: country,
                                                label: country,
                                            })),
                                        ]}
                                    />

                                    <FilterSelect
                                        value={fundingFilter}
                                        onChange={setFundingFilter}
                                        icon={Award}
                                        options={[
                                            { value: "all", label: "All Funding" },
                                            ...fundingTypes.map((funding) => ({
                                                value: funding,
                                                label: funding,
                                            })),
                                        ]}
                                    />

                                    <FilterSelect
                                        value={sortBy}
                                        onChange={setSortBy}
                                        icon={SlidersHorizontal}
                                        options={[
                                            { value: "score", label: "Best Fit" },
                                            { value: "deadline", label: "Deadline" },
                                            { value: "name", label: "Name" },
                                        ]}
                                    />

                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowFilters((current) => !current)}
                                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 md:hidden"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filters

                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                                    />
                                </button>

                            </div>

                            {showFilters && (
                                <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 md:hidden">

                                    <FilterSelect
                                        value={statusFilter}
                                        onChange={setStatusFilter}
                                        icon={Filter}
                                        fullWidth
                                        options={[
                                            { value: "all", label: "All Status" },
                                            { value: "strong", label: "Strong Fit" },
                                            { value: "review", label: "Review" },
                                            { value: "not-eligible", label: "Not Eligible" },
                                        ]}
                                    />

                                    <FilterSelect
                                        value={countryFilter}
                                        onChange={setCountryFilter}
                                        icon={Globe2}
                                        fullWidth
                                        options={[
                                            { value: "all", label: "All Countries" },
                                            ...countries.map((country) => ({
                                                value: country,
                                                label: country,
                                            })),
                                        ]}
                                    />

                                    <FilterSelect
                                        value={fundingFilter}
                                        onChange={setFundingFilter}
                                        icon={Award}
                                        fullWidth
                                        options={[
                                            { value: "all", label: "All Funding" },
                                            ...fundingTypes.map((funding) => ({
                                                value: funding,
                                                label: funding,
                                            })),
                                        ]}
                                    />

                                    <FilterSelect
                                        value={sortBy}
                                        onChange={setSortBy}
                                        icon={SlidersHorizontal}
                                        fullWidth
                                        options={[
                                            { value: "score", label: "Best Fit" },
                                            { value: "deadline", label: "Deadline" },
                                            { value: "name", label: "Name" },
                                        ]}
                                    />

                                </div>
                            )}

                        </div>

                    </section>

                    {/* =====================================================
                        RESULT COUNT + CLEAR FILTERS
                    ===================================================== */}

                    <section className="mx-auto mt-7 max-w-7xl px-3 sm:px-6 lg:px-8">

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                            <div>

                                <h3 className="text-lg font-bold text-slate-900">
                                    Eligibility Results
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Showing{" "}
                                    <span className="font-semibold text-slate-700">
                                        {filteredOpportunities.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-slate-700">
                                        {analyzedOpportunities.length}
                                    </span>{" "}
                                    opportunities
                                </p>

                            </div>

                            {searchActive && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="self-start text-xs font-semibold text-sky-600 hover:text-sky-700 sm:self-auto"
                                >
                                    Clear all filters
                                </button>
                            )}

                        </div>

                    </section>

                    {/* =====================================================
                        OPPORTUNITY RESULTS
                    ===================================================== */}

                    <section className="mx-auto max-w-7xl px-3 py-5 pb-20 sm:px-6 lg:px-8">

                        <div className="space-y-5">

                            {filteredOpportunities.length > 0 ? (

                                filteredOpportunities.map((opportunity) => (
                                    <OpportunityCard
                                        key={opportunity.id}
                                        opportunity={opportunity}
                                    />
                                ))

                            ) : (

                                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                                        <Search size={28} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                                        {searchActive
                                            ? "No opportunities found"
                                            : "No opportunities in this category"}
                                    </h3>

                                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                        {searchActive
                                            ? "Try changing your search terms or filters to find more scholarship opportunities."
                                            : "There are currently no opportunities in this eligibility category."}
                                    </p>

                                    {searchActive && (
                                        <button
                                            type="button"
                                            onClick={clearFilters}
                                            className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                                        >
                                            Clear Filters
                                        </button>
                                    )}

                                </div>

                            )}

                        </div>

                    </section>

                </>

            )}

            {/* =====================================================
                DISCLAIMER
            ===================================================== */}

            <section className="border-t border-slate-200 bg-white">

                <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-8">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                        <Sparkles size={23} />
                    </div>

                    <h2 className="mt-5 text-2xl font-black">
                        Your result is a guidance tool
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        ScholarX uses the information available in your profile and the eligibility information available for each opportunity. Always verify the latest requirements on the official scholarship or program website before applying.
                    </p>

                </div>

            </section>

            {/* =====================================================
    CTA
===================================================== */}

            <section className="w-full bg-white px-3 pb-12 sm:px-6">

                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950">

                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-600/20 blur-3xl" />

                    <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center sm:px-8">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sky-300">
                            <Sparkles size={27} />
                        </div>

                        <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Keep your profile up to date
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
                            New achievements, test scores, experience and academic results can change which opportunities are right for you.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">

                            <NavLink
                                to="/dashboard/profile"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-6 py-3 font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition-all hover:-translate-y-1"
                            >
                                Update my profile
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </NavLink>

                            <NavLink
                                to="/learn-more-about-eligibility-analysis"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
                            >
                                Learn how it works
                            </NavLink>

                        </div>

                    </div>

                </div>

            </section>

        </div>
    );
}
