
import {
    ArrowRight,
    CheckCircle2,
    CircleAlert,
    Search,
    Sparkles,
    Target,
    TrendingUp,
    X,
} from "lucide-react";

import { NavLink } from "react-router";
import { useState } from "react";

import { useDashboard } from "../../context/Dashboard/useDashboard";
import EligibilityHistory from "../../components/Dashboard/EligibilityHistory";

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
                        {value ?? 0}
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
/* MAIN MATCHMAKING PAGE                                     */
/* ========================================================= */

export default function Matches() {
    /* =====================================================
       CENTRALIZED DASHBOARD DATA
    ===================================================== */

    const {
        profileReadiness,
        profileCompletion,
        showProfileOnboarding,
        matchStats,
    } = useDashboard();

    /* =====================================================
       PAGE-LOCAL SEARCH STATE
    ===================================================== */

    const [search, setSearch] = useState("");

    /* =====================================================
       SUMMARY
    ===================================================== */

    const summary = matchStats ?? {
        total: 0,
        strong: 0,
        review: 0,
        notEligible: 0,
    };

    /* =====================================================
       PROFILE READINESS
    ===================================================== */

    const readinessPercentage =
        profileReadiness?.percentage ?? 0;

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen bg-slate-50/70">
            <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

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
                                ScholarX compares your student profile with
                                scholarship requirements and helps you discover
                                opportunities that fit your goals.
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
                                    {readinessPercentage}%
                                </span>
                            </div>

                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/20">
                                <div
                                    className="h-full rounded-full bg-white transition-all duration-500"
                                    style={{
                                        width: `${readinessPercentage}%`,
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
                    PROFILE ONBOARDING
                ================================================= */}

                {showProfileOnboarding && (
                    <section className="mt-6 overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
                        <div className="h-1 bg-linear-to-r from-sky-400 via-blue-500 to-indigo-500" />

                        <div className="px-5 py-10 text-center sm:px-8 sm:py-14">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                                <Target className="h-8 w-8" />
                            </div>

                            <h2 className="mt-5 text-xl font-bold text-slate-900 sm:text-2xl">
                                Complete Your Profile to Unlock Matches
                            </h2>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                                Start by adding your academic background,
                                English proficiency, nationality, study
                                destination, and budget. ScholarX will
                                progressively evaluate scholarship opportunities
                                as you complete your profile.
                            </p>

                            <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-50 p-4 text-left">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm font-semibold text-slate-700">
                                        Profile completion
                                    </span>

                                    <span className="text-sm font-bold text-sky-600">
                                        {profileCompletion?.completed ?? 0}/
                                        {profileCompletion?.total ?? 16} fields
                                    </span>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-linear-to-r from-sky-400 to-blue-600 transition-all duration-500"
                                        style={{
                                            width: `${profileCompletion?.percentage ?? 0}%`,
                                        }}
                                    />
                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    Complete your profile to unlock
                                    personalized scholarship analysis.
                                </p>
                            </div>

                            <NavLink
                                to="/dashboard/profile"
                                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition hover:bg-sky-600"
                            >
                                Complete My Profile

                                <ArrowRight className="h-4 w-4" />
                            </NavLink>
                        </div>
                    </section>
                )}

                {/* =================================================
                    MATCH SUMMARY + ELIGIBILITY HISTORY
                ================================================= */}

                {!showProfileOnboarding && (
                    <>
                        {/* Summary cards */}

                        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <SummaryCard
                                icon={TrendingUp}
                                label="Total Matches"
                                value={summary.total}
                                description="Opportunities analyzed"
                                iconClass="bg-sky-50 text-sky-600"
                            />

                            <SummaryCard
                                icon={CheckCircle2}
                                label="Strong Matches"
                                value={summary.strong}
                                description="Strong overall profile fit"
                                iconClass="bg-emerald-50 text-emerald-600"
                            />

                            <SummaryCard
                                icon={CircleAlert}
                                label="Needs Review"
                                value={summary.review}
                                description="Potentially eligible opportunities"
                                iconClass="bg-amber-50 text-amber-600"
                            />

                            <SummaryCard
                                icon={X}
                                label="Not Eligible"
                                value={summary.notEligible}
                                description="Mandatory requirements not met"
                                iconClass="bg-rose-50 text-rose-600"
                            />
                        </section>

                        {/* Search eligibility history */}

                        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Search scholarship, country, or program..."
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                                        aria-label="Clear search"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>

                            <p className="mt-2 px-1 text-xs text-slate-400">
                                Search through your previously saved
                                scholarship eligibility checks.
                            </p>
                        </section>

                        {/* Eligibility check history */}

                        <div className="mt-7">
                            <EligibilityHistory search={search} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
