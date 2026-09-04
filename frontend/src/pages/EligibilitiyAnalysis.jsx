import {
    AlertCircle,
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    GraduationCap,
    Globe2,
    Sparkles,
    Target,
    UserRoundCheck,
    XCircle,
} from "lucide-react";
import { NavLink } from "react-router";
import { useMemo, useState } from "react";

import opportunities from "../data/opportunities.json";
import studentProfile from "../data/studentProfile";

import {analyzeOpportunity,} from "../utils/eligibility";

/* ========================================================= */
/* STATUS CONFIG                                             */
/* ========================================================= */

const statusConfig = {
    strong: {
        label: "Strong Fit",

        description:
            "Your profile meets the mandatory requirements and aligns strongly with this opportunity.",

        icon:
            CheckCircle2,

        badge:
            "bg-emerald-50 text-emerald-700 border-emerald-200",

        iconBox:
            "bg-emerald-50 text-emerald-600",

        score:
            "text-emerald-600",
    },


    review: {
        label: "Review",

        description:
            "You may be eligible, but some criteria need verification or your profile could be more competitive.",

        icon:
            AlertCircle,

        badge:
            "bg-amber-50 text-amber-700 border-amber-200",

        iconBox:
            "bg-amber-50 text-amber-600",

        score:
            "text-amber-600",
    },


    "not-eligible": {
        label: "Not Eligible",

        description:
            "At least one mandatory requirement does not currently match your profile.",

        icon:
            XCircle,

        badge:
            "bg-rose-50 text-rose-700 border-rose-200",

        iconBox:
            "bg-rose-50 text-rose-600",

        score:
            "text-rose-600",
    },
};


/* ========================================================= */
/* REQUIREMENT CATEGORY BADGE                                */
/* ========================================================= */

function RequirementCategoryBadge({
    category,
}) {
    return (
        <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                category ===
                "mandatory"
                    ? "bg-sky-50 text-sky-600"
                    : "bg-violet-50 text-violet-600"
            }`}
        >
            {category ===
            "mandatory"
                ? "Mandatory"
                : "Preferred"}
        </span>
    );
}


/* ========================================================= */
/* OPPORTUNITY CARD                                          */
/* ========================================================= */

function OpportunityCard({
    opportunity,
}) {
    const [open, setOpen] =
        useState(false);


    const config =
        statusConfig[
            opportunity
                .analysis
                .status
        ];


    const StatusIcon =
        config.icon;


    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:shadow-xl">

            {/* ===================================================== */}
            {/* MAIN CARD                                              */}
            {/* ===================================================== */}

            <div className="group p-6 sm:p-7">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* Opportunity info */}

                    <div className="flex gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-all group-hover:bg-sky-600 group-hover:text-white">

                            <Award
                                size={26}
                            />

                        </div>


                        <div>

                            <div className="flex flex-wrap items-center gap-2">

                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                                    {
                                        opportunity.category
                                    }
                                </span>


                                {opportunity.featured && (
                                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-600">
                                        Featured
                                    </span>
                                )}

                            </div>


                            <h3 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
                                {
                                    opportunity.title
                                }
                            </h3>


                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {
                                    opportunity.provider
                                }
                            </p>


                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                                <span className="inline-flex items-center gap-1.5">

                                    <Globe2
                                        size={14}
                                    />

                                    {
                                        opportunity.country
                                    }

                                </span>


                                <span className="inline-flex items-center gap-1.5">

                                    <GraduationCap
                                        size={14}
                                    />

                                    {opportunity.degree?.join(
                                        ", "
                                    )}

                                </span>


                                <span className="inline-flex items-center gap-1.5">

                                    <Sparkles
                                        size={14}
                                    />

                                    {
                                        opportunity.funding
                                    }

                                </span>

                            </div>

                        </div>

                    </div>


                    {/* Result */}

                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">

                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full border-4 ${config.badge}`}
                        >

                            <span
                                className={`text-sm font-black ${config.score}`}
                            >
                                {
                                    opportunity
                                        .analysis
                                        .score
                                }
                                %
                            </span>

                        </div>


                        <div
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.badge}`}
                        >

                            <StatusIcon
                                size={14}
                            />

                            {
                                config.label
                            }

                        </div>

                    </div>

                </div>


                {/* Description */}

                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">
                    {
                        config.description
                    }
                </p>


                {/* Status reason */}

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">

                    <p className="text-xs font-semibold leading-5 text-slate-600">
                        {
                            opportunity
                                .analysis
                                .statusReason
                        }
                    </p>

                </div>


                {/* Quick stats */}

                <div className="mt-6 grid grid-cols-3 divide-x rounded-2xl border border-slate-100 bg-slate-50">

                    <div className="p-4 text-center">

                        <p className="text-lg font-black text-emerald-600">
                            {
                                opportunity
                                    .analysis
                                    .passedCount
                            }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Passed
                        </p>

                    </div>


                    <div className="p-4 text-center">

                        <p className="text-lg font-black text-amber-500">
                            {
                                opportunity
                                    .analysis
                                    .reviewCount
                            }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Review
                        </p>

                    </div>


                    <div className="p-4 text-center">

                        <p className="text-lg font-black text-rose-500">
                            {
                                opportunity
                                    .analysis
                                    .failedCount
                            }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Not met
                        </p>

                    </div>

                </div>


                {/* Mandatory / Preferred summary */}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">

                        <div className="flex items-center justify-between">

                            <span className="text-xs font-bold text-sky-700">
                                Mandatory
                            </span>


                            <span className="text-sm font-black text-sky-700">
                                {
                                    opportunity
                                        .analysis
                                        .mandatoryPassedCount
                                }
                                /
                                {
                                    opportunity
                                        .analysis
                                        .mandatoryRequirements
                                        .length
                                }
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
                                {
                                    opportunity
                                        .analysis
                                        .preferredPassedCount
                                }
                                /
                                {
                                    opportunity
                                        .analysis
                                        .preferredRequirements
                                        .length
                                }
                            </span>

                        </div>


                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            These influence competitiveness, not automatic eligibility.
                        </p>

                    </div>

                </div>


                {/* Expand */}

                <button
                    type="button"
                    onClick={() =>
                        setOpen(
                            (
                                value
                            ) =>
                                !value
                        )
                    }
                    className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50/30"
                >

                    <span>
                        {open
                            ? "Hide requirement analysis"
                            : "See why you received this result"}
                    </span>


                    <ChevronDown
                        size={18}
                        className={`transition-transform ${
                            open
                                ? "rotate-180"
                                : ""
                        }`}
                    />

                </button>

            </div>


            {/* ===================================================== */}
            {/* REQUIREMENT BREAKDOWN                                 */}
            {/* ===================================================== */}

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

                        {opportunity
                            .analysis
                            .requirements
                            .map(
                                (
                                    item,
                                    index
                                ) => {

                                    /*
                                        IMPORTANT:

                                        `item` now comes from
                                        `analysis.requirements`,
                                        which is `results`.

                                        Therefore the same
                                        status used by the
                                        stats is displayed here.
                                    */

                                    const passed =
                                        item.type ===
                                        "pass";


                                    const failed =
                                        item.type ===
                                        "fail";


                                    const review =
                                        item.type ===
                                        "review";


                                    const statusLabel =
                                        passed
                                            ? "Passed"
                                            : failed
                                                ? "Not met"
                                                : review
                                                    ? "Review"
                                                    : "Review";


                                    return (
                                        <div
                                            key={`${item.key}-${index}`}
                                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                                        >

                                            <div className="flex gap-3">

                                                {/* Status icon */}

                                                <div
                                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                        passed
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : failed
                                                                ? "bg-rose-50 text-rose-600"
                                                                : review
                                                                    ? "bg-amber-50 text-amber-600"
                                                                    : "bg-amber-50 text-amber-600"
                                                    }`}
                                                >

                                                    {passed ? (
                                                        <CheckCircle2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    ) : failed ? (
                                                        <XCircle
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    ) : (
                                                        <AlertCircle
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    )}

                                                </div>


                                                {/* Content */}

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <p className="font-bold text-slate-900">
                                                            {
                                                                item.requirement
                                                            }
                                                        </p>


                                                        <span
                                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                                passed
                                                                    ? "bg-emerald-50 text-emerald-600"
                                                                    : failed
                                                                        ? "bg-rose-50 text-rose-600"
                                                                        : "bg-amber-50 text-amber-600"
                                                            }`}
                                                        >
                                                            {
                                                                statusLabel
                                                            }
                                                        </span>


                                                        <RequirementCategoryBadge
                                                            category={
                                                                item.category
                                                            }
                                                        />

                                                    </div>


                                                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
                                                        {
                                                            item.detail
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                    </div>


                    {/* Score explanation */}

                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">

                                <Target
                                    size={18}
                                />

                            </div>


                            <div>

                                <p className="text-sm font-black text-sky-900">
                                    How your score works
                                </p>


                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    Mandatory eligibility criteria account for 70% of the fit score and determine whether you can qualify. Preferred criteria account for 30% and measure how competitive your profile is. Missing a preferred criterion does not automatically make you ineligible.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CTA */}

                    {opportunity.website && (
                        <div className="mt-6 flex flex-wrap gap-3">

                            <a
                                href={
                                    opportunity.website
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >

                                View official opportunity

                                <ArrowRight
                                    size={
                                        16
                                    }
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

    const [
        activeFilter,
        setActiveFilter,
    ] = useState("all");


    const analyzedOpportunities = useMemo(
    () =>
        opportunities.map((opportunity) =>
            analyzeOpportunity(
                opportunity,
                studentProfile
            )
        ),
    []
);


    /* ========================================================= */
    /* COUNTS                                                    */
    /* ========================================================= */

    const counts =
        useMemo(() => {

            return {
                strong:
                    analyzedOpportunities.filter(
                        (item) =>
                            item
                                .analysis
                                .status ===
                            "strong"
                    ).length,

                review:
                    analyzedOpportunities.filter(
                        (item) =>
                            item
                                .analysis
                                .status ===
                            "review"
                    ).length,

                notEligible:
                    analyzedOpportunities.filter(
                        (item) =>
                            item
                                .analysis
                                .status ===
                            "not-eligible"
                    ).length,
            };

        }, [
            analyzedOpportunities,
        ]);


    /* ========================================================= */
    /* FILTER                                                    */
    /* ========================================================= */

    const filteredOpportunities =
        useMemo(() => {

            if (
                activeFilter ===
                "all"
            ) {
                return analyzedOpportunities;
            }

            return analyzedOpportunities.filter(
                (item) =>
                    item.analysis.status ===
                    activeFilter
            );

        }, [
            activeFilter,
            analyzedOpportunities,
        ]);


    return (
        <div className="min-h-screen bg-[#eef7ff] text-slate-900">

            {/* ===================================================== */}
            {/* HERO                                                   */}
            {/* ===================================================== */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-[#e5f3ff]">

                <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />


                <div className="absolute right-[20%] top-20 rotate-12 text-blue-200">
                    <Sparkles
                        size={70}
                        strokeWidth={1.5}
                    />
                </div>


                <div className="absolute bottom-32 left-[8%] rotate-12 text-blue-200">
                    <Target
                        size={75}
                        strokeWidth={1.2}
                    />
                </div>


                <div className="absolute bottom-10 right-[8%] text-sky-200">
                    <GraduationCap
                        size={80}
                        strokeWidth={1.2}
                    />
                </div>


                <div className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 sm:px-8 lg:px-10">

                    <div className="mx-auto max-w-4xl text-center">

                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm">

                            <Target
                                size={16}
                            />

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


            {/* ===================================================== */}
            {/* PROFILE SUMMARY                                        */}
            {/* ===================================================== */}

            <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-6">

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

                    <div className="grid lg:grid-cols-[1fr_auto]">

                        <div className="group p-6 sm:p-7">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-all group-hover:bg-sky-600 group-hover:text-white">

                                    <UserRoundCheck
                                        size={22}
                                    />

                                </div>


                                <div>

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Your Academic Profile
                                    </p>


                                    <h2 className="text-xl font-black">
                                        Computer Science Student
                                    </h2>

                                </div>

                            </div>


                            <div className="mt-5 flex flex-wrap gap-2">

                                {[
    `GPA ${
        Number.isFinite(
            Number(
                studentProfile?.academic
                    ?.academicPerformance
            )
        )
            ? Number(
                  studentProfile.academic
                      .academicPerformance
              ).toFixed(2)
            : "Not specified"
    }`,

    studentProfile?.academic?.studyLevel ||
        "Study level not specified",

    studentProfile?.academic?.fieldOfStudy ||
        "Field not specified",

    studentProfile?.preferences?.studyDestination ||
        "Destination not specified",

    `${
        studentProfile?.english?.test ||
        "English"
    } ${
        Number.isFinite(
            Number(
                studentProfile?.english?.score
            )
        )
            ? Number(
                  studentProfile.english.score
              ).toFixed(1)
            : "N/A"
    }`,

    studentProfile?.personal?.nationality ||
        "Nationality not specified",

    `Age ${
        studentProfile?.personal?.age ??
        "N/A"
    }`,
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

                                <ArrowRight
                                    className="transition-transform group-hover:translate-x-1"
                                    size={16}
                                />

                            </NavLink>

                        </div>

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* RESULT SUMMARY                                         */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 lg:px-10">

                <div className="grid gap-4 sm:grid-cols-3">

                    {/* Strong */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveFilter(
                                "strong"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                            activeFilter ===
                            "strong"
                                ? "border-emerald-300 bg-emerald-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg"
                        }`}
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <CheckCircle2
                                    size={22}
                                />

                            </div>


                            <span className="text-3xl font-black text-emerald-600">
                                {
                                    counts.strong
                                }
                            </span>

                        </div>


                        <p className="mt-5 font-black">
                            Strong Fit
                        </p>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Opportunities where your profile aligns strongly.
                        </p>

                    </button>


                    {/* Review */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveFilter(
                                "review"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                            activeFilter ===
                            "review"
                                ? "border-amber-300 bg-amber-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-lg"
                        }`}
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                                <AlertCircle
                                    size={22}
                                />

                            </div>


                            <span className="text-3xl font-black text-amber-500">
                                {
                                    counts.review
                                }
                            </span>

                        </div>


                        <p className="mt-5 font-black">
                            Review
                        </p>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Potential opportunities with criteria to verify or strengthen.
                        </p>

                    </button>


                    {/* Not eligible */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveFilter(
                                "not-eligible"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                            activeFilter ===
                            "not-eligible"
                                ? "border-rose-300 bg-rose-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-rose-200 hover:shadow-lg"
                        }`}
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">

                                <XCircle
                                    size={22}
                                />

                            </div>


                            <span className="text-3xl font-black text-rose-500">
                                {
                                    counts.notEligible
                                }
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


            {/* ===================================================== */}
            {/* OPPORTUNITIES                                          */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

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


                    <button
                        type="button"
                        onClick={() =>
                            setActiveFilter(
                                "all"
                            )
                        }
                        className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                            activeFilter ===
                            "all"
                                ? "border-sky-200 bg-sky-50 text-sky-600"
                                : "border-slate-200 bg-white text-slate-600 hover:border-sky-200"
                        }`}
                    >

                        <Award
                            size={16}
                        />

                        All opportunities

                    </button>

                </div>


                <div className="mt-10 space-y-5">

                    {filteredOpportunities.length >
                    0 ? (

                        filteredOpportunities.map(
                            (
                                opportunity
                            ) => (
                                <OpportunityCard
                                    key={
                                        opportunity.id
                                    }
                                    opportunity={
                                        opportunity
                                    }
                                />
                            )
                        )

                    ) : (

                        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">

                            <CircleAlert
                                size={
                                    35
                                }
                                className="mx-auto text-slate-300"
                            />


                            <h3 className="mt-4 text-xl font-black">
                                No opportunities in this category
                            </h3>


                            <p className="mt-2 text-sm text-slate-500">
                                Try viewing another eligibility category.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* ===================================================== */}
            {/* DISCLAIMER                                             */}
            {/* ===================================================== */}

            <section className="border-t border-slate-200 bg-white">

                <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-8">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">

                        <Sparkles
                            size={23}
                        />

                    </div>


                    <h2 className="mt-5 text-2xl font-black">
                        Your result is a guidance tool
                    </h2>


                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        ScholarX uses the information available in your profile and the eligibility information available for each opportunity. Always verify the latest requirements on the official scholarship or program website before applying.
                    </p>

                </div>

            </section>


            {/* ===================================================== */}
            {/* CTA                                                     */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl bg-white px-6 pb-12 sm:px-8">

                <div className="relative overflow-hidden rounded-3xl bg-slate-950">

                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-600/20 blur-3xl" />

                    <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />


                    <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center sm:px-8">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sky-300">

                            <Sparkles
                                size={27}
                            />

                        </div>


                        <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Keep your profile up to date
                        </h2>


                        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
                            New achievements, test scores, experience and academic results can change which opportunities are right for you.
                        </p>


                        <div className="mt-8 flex flex-wrap justify-center gap-3">

                            <NavLink
                                to="/profile"
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
