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
    Plane,
    ShieldCheck,
    Sparkles,
    Trophy,
    UserRoundCheck,
    WalletCards,
} from "lucide-react";

import { NavLink, useParams } from "react-router";
import opportunities from "../data/opportunities.json";


const OpportunityDetails = () => {
    const { slug } = useParams();

    const opportunity = opportunities.find(
        (item) => item.slug === slug
    );

    // Prevent page crash if invalid opportunity slug
    if (!opportunity) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">

                    <h1 className="text-4xl font-bold text-slate-900">
                        Opportunity Not Found
                    </h1>

                    <p className="mt-3 text-slate-500">
                        The opportunity you're looking for doesn't exist.
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
    /* HELPERS */
    /* ========================================================= */

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
        const days = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        );

        return days;
    };

    const daysRemaining = getDaysRemaining(
        opportunity.deadline
    );

    const isDeadlinePassed =
        daysRemaining !== null && daysRemaining < 0;

    const eligibility = opportunity.eligibility || {};

    const hasValue = (value) =>
        value !== null &&
        value !== undefined &&
        value !== "";

    const getRequirementStatus = (requirement) => {
        if (!requirement) return "Not specified";

        if (requirement.required === true) {
            return "Required";
        }

        if (requirement.preferred === true) {
            return "Preferred";
        }

        return "Not required";
    };

    return (
        <div className="text-slate-900">

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

                <div
                    className="relative min-h-140 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${opportunity.image})`,
                    }}
                >

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-blue-950 to-blue-800" />

                    {/* Decorative circles */}

                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

                    <div className="absolute -bottom-40 right-10 h-112.5 w-112.5 rounded-full border border-white/10" />

                    <div className="relative mx-auto flex min-h-140 max-w-7xl items-center px-6 pt-40 pb-20">

                        <div className="max-w-4xl text-white">

                            {/* Category + Status */}
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

                            </div>


                            {/* Title */}
                            <h1 className="text-4xl bg-linear-to-r from-blue-400 via-indigo-500 to-sky-400 bg-clip-text text-transparent font-black leading-tight sm:text-5xl lg:text-6xl">

                                {opportunity.title}

                            </h1>


                            {/* Provider */}
                            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-300">

                                <div className="flex items-center gap-2">
                                    <ShieldCheck
                                        size={18}
                                        className="text-sky-400"
                                    />

                                    <span>
                                        Provided by{" "}
                                        <strong className="text-white">
                                            {opportunity.provider}
                                        </strong>
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Globe2
                                        size={18}
                                        className="text-sky-400"
                                    />

                                    <span>
                                        {opportunity.city},{" "}
                                        {opportunity.country}
                                    </span>
                                </div>

                            </div>


                            {/* Description */}
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                                {opportunity.description}
                            </p>


                            {/* Degree Tags */}
                            <div className="mt-8 flex flex-wrap gap-3">

                                {opportunity.degree?.map((degree) => (
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

                                {opportunity.funding && (
                                    <span className="rounded-xl border border-emerald-300/20 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-100 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-400/20">
                                        <span className="flex items-center gap-2">
                                            <WalletCards size={16} />
                                            {opportunity.funding}
                                        </span>
                                    </span>
                                )}

                            </div>


                            {/* CTA */}
                            <div className="mt-9 flex flex-wrap gap-4">

                                <NavLink
                                    to="/eligibility-analysis"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                                >
                                    <BadgeCheck size={18} />

                                    Check My Eligibility

                                    <ArrowRight
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    />
                                </NavLink>


                                <NavLink
                                    to="/opportunities"
                                    className="group inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                                >
                                    Explore More Opportunities

                                    <ArrowRight
                                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                    />
                                </NavLink>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* FACT BAR */}
            {/* ========================================================= */}

            <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-6">

                <div className="mx-auto grid w-[90%] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl sm:w-full sm:grid-cols-2 lg:grid-cols-4">

                    {/* Funding */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-emerald-50/50 md:border-r lg:border-b-0">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                                <WalletCards size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Funding
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {opportunity.funding || "Not specified"}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Deadline */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-amber-50/50 md:border-r lg:border-b-0">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                                <CalendarDays size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Deadline
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {formatDeadline(opportunity.deadline)}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Degree */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-blue-50/50 md:border-b-0 md:border-r">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                <GraduationCap size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Study Level
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {opportunity.degree?.join(" & ") || "Not specified"}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Application Fee */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-violet-50/50 md:border-b-0">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                                <BadgeDollarSign size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Application Fee
                                </p>

                                <p className="mt-1 font-bold text-violet-700">
                                    {opportunity.applicationFee || "Not specified"}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* ABOUT THE OPPORTUNITY */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-blue-600" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                                About the Opportunity
                            </span>
                        </div>


                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                            Everything you need to know about{" "}

                            <span className="text-blue-600">
                                {opportunity.title}.
                            </span>

                        </h2>


                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            {opportunity.description}
                        </p>


                        <div className="mt-8 flex flex-wrap gap-3">

                            {opportunity.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    {tag}
                                </span>
                            ))}

                        </div>

                    </div>


                    {/* Opportunity Snapshot */}
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

                                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                                    <span className="text-blue-100">
                                        Provider
                                    </span>

                                    <span className="font-bold">
                                        {opportunity.provider}
                                    </span>
                                </div>


                                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                                    <span className="text-blue-100">
                                        Destination
                                    </span>

                                    <span className="font-bold">
                                        {opportunity.country}
                                    </span>
                                </div>


                                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                                    <span className="text-blue-100">
                                        Funding
                                    </span>

                                    <span className="font-bold">
                                        {opportunity.funding}
                                    </span>
                                </div>


                                <div className="flex items-center justify-between">
                                    <span className="text-blue-100">
                                        English Requirement
                                    </span>

                                    <span className="font-bold">
                                        IELTS {opportunity.ielts || "Not specified"}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* DEADLINE + APPLICATION */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-amber-600" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
                                Application Timeline
                            </span>
                        </div>


                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                            Don't miss your{" "}

                            <span className="text-amber-600">
                                deadline.
                            </span>

                        </h2>


                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            Keep the application deadline and preparation timeline
                            in mind before starting your application.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {/* Deadline Card */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white">
                                <CalendarDays size={22} />
                            </div>

                            <p className="mt-6 text-sm font-semibold text-slate-500">
                                Application Deadline
                            </p>

                            <p className="mt-2 text-2xl font-black text-slate-900">
                                {formatDeadline(opportunity.deadline)}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Final date to submit your application
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
                                    isDeadlinePassed
                                        ? "text-red-600"
                                        : "text-blue-600"
                                }`}
                            >
                                {isDeadlinePassed
                                    ? "Deadline Passed"
                                    : opportunity.status || "Open"}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                {isDeadlinePassed
                                    ? "This opportunity may no longer accept applications."
                                    : daysRemaining !== null
                                        ? `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`
                                        : "Check the official programme website for updates."}
                            </p>

                        </div>


                        {/* Fee */}
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
                                Fee information for submitting your application
                            </p>

                        </div>

                    </div>


                    {/* Deadline Note */}
                    <div className="group mt-8 flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50/70 p-6">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white">
                            <Info size={20} />
                        </div>

                        <div>

                            <p className="text-sm font-bold text-slate-900">
                                Important
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Deadlines and application procedures can vary by
                                programme. Always verify the exact deadline and
                                requirements on the official scholarship website
                                before submitting your application.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* BENEFITS / FUNDING */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden bg-slate-50 py-24">

                <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl" />

                <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-emerald-600" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                                Funding & Benefits
                            </span>
                        </div>


                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                            What does this opportunity{" "}

                            <span className="text-emerald-600">
                                offer?
                            </span>

                        </h2>


                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            Understand the financial and practical benefits included
                            with this scholarship opportunity.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                        {opportunity.benefits?.map((benefit, index) => {

                            const icons = [
                                <BadgeDollarSign size={22} />,
                                <WalletCards size={22} />,
                                <HeartPulse size={22} />,
                                <Plane size={22} />,
                            ];

                            const icon = icons[index % icons.length];

                            return (
                                <div
                                    key={benefit}
                                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                                >

                                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                                    <div className="relative">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition duration-500 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-4">
                                            {icon}
                                        </div>

                                        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Benefit {String(index + 1).padStart(2, "0")}
                                        </p>

                                        <h3 className="mt-1 font-bold text-slate-900">
                                            {benefit}
                                        </h3>

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

                                    <p className="font-semibold">
                                        Funding Type
                                    </p>
                                </div>

                                <p className="mt-3 text-4xl font-black">
                                    {opportunity.funding}
                                </p>

                                <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-100">
                                    This opportunity provides the funding level
                                    indicated above. The exact coverage can vary
                                    depending on the selected DAAD programme.
                                </p>

                            </div>


                            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                                <WalletCards size={42} />
                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* ELIGIBILITY */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">

                    {/* Left */}
                    <div>

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-violet-600" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
                                Eligibility
                            </span>
                        </div>


                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                            Could you be{" "}

                            <span className="text-violet-600">
                                eligible?
                            </span>

                        </h2>


                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            Review the main eligibility factors before applying.
                            Some criteria may depend on the specific scholarship
                            programme selected.
                        </p>


                        {/* IELTS */}
                        <div className="mt-8 rounded-3xl bg-linear-to-br from-violet-600 to-indigo-700 p-7 text-white shadow-xl">

                            <div className="flex items-center gap-3">
                                <Languages size={25} />

                                <p className="font-semibold">
                                    English Requirement
                                </p>
                            </div>

                            <p className="mt-4 text-4xl font-black">
                                {opportunity.ielts
                                    ? `IELTS ${opportunity.ielts}`
                                    : "Programme Specific"}
                            </p>

                            <p className="mt-2 text-sm text-violet-100">
                                {eligibility.english?.description ||
                                    "Language requirements may vary depending on the selected programme and university."}
                            </p>

                        </div>


                        {/* Nationality Note */}
                        <div className="group mt-6 flex items-start gap-4 rounded-3xl border border-blue-200 bg-blue-50/70 p-6">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                                <Globe2 size={20} />
                            </div>

                            <div>

                                <p className="text-sm font-bold text-slate-900">
                                    Nationality
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {eligibility.nationality?.description ||
                                        "Nationality requirements may vary by programme."}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Right */}
                    <div className="grid gap-4 sm:grid-cols-2">

                        {/* International Student */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                <UserRoundCheck size={21} />
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Requirement 01
                            </p>

                            <h3 className="mt-1 font-bold text-slate-900">
                                International Student
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Applicants must be international students.
                            </p>

                            <span className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                {getRequirementStatus(
                                    eligibility.internationalStudent
                                )}
                            </span>

                        </div>


                        {/* Study Level */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                                <GraduationCap size={21} />
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Requirement 02
                            </p>

                            <h3 className="mt-1 font-bold text-slate-900">
                                Study Level
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {eligibility.studyLevel?.values?.length ? (
                                    eligibility.studyLevel.values.map((level) => (
                                        <span
                                            key={level}
                                            className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700"
                                        >
                                            {level}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-500">
                                        Not specified
                                    </span>
                                )}
                            </div>

                        </div>


                        {/* Academic */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                                <GraduationCap size={21} />
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Requirement 03
                            </p>

                            <h3 className="mt-1 font-bold text-slate-900">
                                Academic Performance
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {hasValue(
                                    eligibility.academicPerformance?.minimumGPA
                                )
                                    ? `Minimum GPA: ${eligibility.academicPerformance.minimumGPA}`
                                    : "Academic requirements vary by programme."}
                            </p>

                        </div>


                        {/* Work Experience */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                                <Clock3 size={21} />
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Requirement 04
                            </p>

                            <h3 className="mt-1 font-bold text-slate-900">
                                Work Experience
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {hasValue(
                                    eligibility.workExperience?.minimumMonths
                                )
                                    ? `${eligibility.workExperience.minimumMonths}+ months required`
                                    : "Not mandatory, but may be preferred for some programmes."}
                            </p>

                            {eligibility.workExperience?.preferred && (
                                <span className="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                    Preferred
                                </span>
                            )}

                        </div>


                        {/* Research */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition group-hover:bg-sky-600 group-hover:text-white">
                                <FileCheck2 size={21} />
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Requirement 05
                            </p>

                            <h3 className="mt-1 font-bold text-slate-900">
                                Research Experience
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Research experience is not mandatory but may
                                strengthen an application for relevant programmes.
                            </p>

                            {eligibility.researchExperience?.preferred && (
                                <span className="mt-4 inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                                    Preferred
                                </span>
                            )}

                        </div>


                        {/* Achievements */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                                <Trophy size={21} />
                            </div>

                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Requirement 06
                            </p>

                            <h3 className="mt-1 font-bold text-slate-900">
                                Achievements
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Academic, professional or extracurricular
                                achievements may strengthen your application.
                            </p>

                            {eligibility.achievements?.preferred && (
                                <span className="mt-4 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                                    Preferred
                                </span>
                            )}

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* PROGRAM-SPECIFIC REQUIREMENT */}
            {/* ========================================================= */}

            {eligibility.additionalRequirements?.length > 0 && (
                <section className="bg-slate-50 py-24">

                    <div className="mx-auto max-w-7xl px-6">

                        <div className="max-w-3xl">

                            <div className="mb-5 flex items-center gap-3">
                                <span className="h-px w-10 bg-orange-600" />

                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                                    Additional Requirements
                                </span>
                            </div>


                            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                                Check the{" "}

                                <span className="text-orange-600">
                                    fine print.
                                </span>

                            </h2>


                            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                                Some scholarship opportunities have additional
                                programme-specific criteria that cannot be
                                determined from general eligibility rules alone.
                            </p>

                        </div>


                        <div className="mt-12 space-y-4">

                            {eligibility.additionalRequirements.map(
                                (requirement, index) => (
                                    <div
                                        key={`${requirement.label}-${index}`}
                                        className="group relative overflow-hidden flex gap-4 rounded-3xl border border-orange-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
                                    >

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition-all duration-500 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-110">
                                            <Lightbulb size={21} />
                                        </div>


                                        <div>

                                            <div className="flex flex-wrap items-center gap-3">

                                                <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                                                    Requirement{" "}
                                                    {String(index + 1).padStart(2, "0")}
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
                                )
                            )}

                        </div>


                        {/* Important Note */}
                        <div className="group mt-6 flex items-start gap-4 rounded-3xl border border-orange-200 bg-orange-50/70 p-6">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white">
                                <Info size={20} />
                            </div>

                            <div>

                                <p className="text-sm font-bold text-slate-900">
                                    Important
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Meeting the general criteria does not
                                    automatically guarantee eligibility.
                                    Programme-specific requirements should
                                    always be verified before applying.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>
            )}


            {/* ========================================================= */}
            {/* APPLICATION PREPARATION */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">

                    <div>

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-blue-600" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                                Application Preparation
                            </span>
                        </div>


                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                            Get your application{" "}

                            <span className="text-blue-600">
                                ready.
                            </span>

                        </h2>


                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            Start preparing early so you have enough time to
                            satisfy programme-specific requirements and collect
                            supporting documents.
                        </p>


                        <div className="mt-8 rounded-3xl bg-linear-to-br from-blue-600 to-sky-700 p-7 text-white shadow-xl">

                            <div className="flex items-center gap-3">
                                <FileCheck2 size={25} />

                                <p className="font-semibold">
                                    Application Checklist
                                </p>
                            </div>


                            <div className="mt-6 space-y-4">

                                <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                                    <CircleCheck size={18} />

                                    <span className="text-sm">
                                        Verify your programme-specific eligibility
                                    </span>
                                </div>


                                <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                                    <CircleCheck size={18} />

                                    <span className="text-sm">
                                        Confirm language and admission requirements
                                    </span>
                                </div>


                                <div className="flex items-center gap-3">
                                    <CircleCheck size={18} />

                                    <span className="text-sm">
                                        Prepare documents before the deadline
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Application Tips */}
                    <div className="grid gap-4 sm:grid-cols-2">

                        {[
                            {
                                icon: <GraduationCap size={20} />,
                                title: "Academic Records",
                                text: "Keep your transcripts, certificates and academic records organized.",
                            },
                            {
                                icon: <Languages size={20} />,
                                title: "Language Proof",
                                text: `Prepare accepted language evidence${opportunity.ielts ? ` such as IELTS ${opportunity.ielts}` : ""}.`,
                            },
                            {
                                icon: <FileCheck2 size={20} />,
                                title: "Supporting Documents",
                                text: "Prepare programme-specific documents and supporting materials in advance.",
                            },
                            {
                                icon: <CalendarDays size={20} />,
                                title: "Apply Early",
                                text: "Avoid waiting until the final days before the application deadline.",
                            },
                        ].map((item, index) => (
                            <div
                                key={item.title}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >

                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition group-hover:opacity-100" />

                                <div className="relative">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                                        {item.icon}
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
                        ))}

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* WHY CONSIDER THIS OPPORTUNITY */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-emerald-600" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
                                Why Consider This Opportunity?
                            </span>
                        </div>


                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                            A strong opportunity for{" "}

                            <span className="text-emerald-600">
                                ambitious students.
                            </span>

                        </h2>


                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            Consider how the funding, destination, degree level
                            and eligibility requirements align with your academic
                            and career goals.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2">

                        {[
                            {
                                icon: <WalletCards size={21} />,
                                title: "Strong Financial Support",
                                text: `${opportunity.funding} funding can significantly reduce the financial burden of studying abroad.`,
                            },
                            {
                                icon: <GraduationCap size={21} />,
                                title: "Postgraduate Focus",
                                text: `The opportunity supports ${opportunity.degree?.join(" and ") || "selected"} level study.`,
                            },
                            {
                                icon: <Globe2 size={21} />,
                                title: "International Experience",
                                text: `Study in ${opportunity.country} while gaining international academic exposure.`,
                            },
                            {
                                icon: <Trophy size={21} />,
                                title: "Competitive Opportunity",
                                text: "A strong academic profile and well-prepared application can help you stand out.",
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                            >

                                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-50 opacity-0 transition group-hover:opacity-100" />

                                <div className="relative flex gap-4">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition duration-500 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110">
                                        {item.icon}
                                    </div>

                                    <div>

                                        <h3 className="font-bold text-slate-900">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 leading-6 text-slate-600">
                                            {item.text}
                                        </p>

                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* THINGS TO CONSIDER */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">

                    <div className="lg:mt-24">

                        <div className="mb-5 flex items-center gap-3">
                            <span className="h-px w-10 bg-orange-600" />

                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
                                Before You Apply
                            </span>
                        </div>


                        <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">

                            Things to{" "}

                            <span className="text-orange-600">
                                consider.
                            </span>

                        </h2>


                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                            Even fully funded opportunities can have detailed
                            conditions. Review these points carefully before
                            committing to an application.
                        </p>

                    </div>


                    <div className="space-y-4">

                        {[
                            "Eligibility requirements may vary between individual DAAD programmes.",
                            "Admission to a university or programme may be required separately.",
                            "Language requirements can depend on the selected programme and institution.",
                            "Professional experience may be required for certain development-related programmes.",
                            "Meeting the general criteria does not guarantee selection.",
                            "Always verify the latest information on the official provider website before applying.",
                        ].map((item, index) => (

                            <div
                                key={item}
                                className="group relative flex gap-4 overflow-hidden rounded-2xl border border-orange-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
                            >

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition duration-500 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-110">
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
            {/* OFFICIAL WEBSITE */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 pb-10">

                <div className="group flex flex-col gap-5 rounded-3xl border border-blue-200 bg-blue-50/60 p-7 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-start gap-4">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                            <ShieldCheck size={21} />
                        </div>

                        <div>

                            <p className="font-bold text-slate-900">
                                Verify the latest official information
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Scholarship rules, deadlines and programme-specific
                                requirements can change. Always verify the latest
                                details with the official provider.
                            </p>

                        </div>

                    </div>


                    {opportunity.website && (
                        <a
                            href={opportunity.website}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                        >
                            Official Website

                            <ArrowRight
                                size={17}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </a>
                    )}

                </div>

            </section>


            {/* ========================================================= */}
            {/* FINAL CTA */}
            {/* ========================================================= */}

            <section className="bg-slate-50 px-6 pb-20">

                <div className="relative mx-auto max-w-308 overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 py-24">

                    {/* Decorative circles */}
                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

                    <div className="absolute -bottom-40 right-10 h-112.5 w-112.5 rounded-full border border-white/10" />

                    <div className="absolute right-1/4 top-10 h-40 w-40 rounded-full bg-sky-400/10 blur-3xl" />


                    <div className="relative mx-auto max-w-4xl px-6 text-center text-white">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">

                            <ShieldCheck
                                className="text-sky-400"
                                size={25}
                            />

                            <span className="text-sm font-bold uppercase tracking-wider text-sky-400">
                                Your Next Step
                            </span>

                        </div>


                        <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">

                            Could you be a good fit for{" "}

                            <span className="text-sky-400">
                                {opportunity.title}?
                            </span>

                        </h2>


                        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                            Get a personalized eligibility analysis based on your
                            nationality, academic background, study level,
                            experience, English proficiency and other requirements.
                        </p>


                        <div className="mt-9 flex flex-wrap justify-center gap-4">

                            <NavLink
                                to="/eligibility-analysis"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                            >

                                <BadgeCheck size={18} />

                                Check My Eligibility

                                <ArrowRight
                                    size={17}
                                    className="transition-transform group-hover:translate-x-1"
                                />

                            </NavLink>


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