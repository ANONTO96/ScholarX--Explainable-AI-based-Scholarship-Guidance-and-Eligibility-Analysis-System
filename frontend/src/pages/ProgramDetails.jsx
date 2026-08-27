import {
    ArrowRight,
    BadgeDollarSign,
    BriefcaseBusiness,
    Check,
    CircleCheck,
    Clock3,
    DollarSign,
    GraduationCap,
    Globe2,
    Languages,
    Lightbulb,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    University,
    WalletCards,
    BadgeCheck,
    House,
    Info,
} from "lucide-react";

import { NavLink, useParams } from "react-router";
import programs from "../data/programs.json";


const ProgramDetails = () => {

    const { slug } = useParams();

    const program = programs.find(
        (item) => item.slug === slug
    );

    // Prevent page crash if invalid program ID
    if (!program) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-slate-900">
                        Program Not Found
                    </h1>

                    <p className="mt-3 text-slate-500">
                        The program you're looking for doesn't exist.
                    </p>

                    <NavLink
                        to="/programs"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Explore Programs
                        <ArrowRight size={18} />
                    </NavLink>
                </div>
            </div>
        );
    }

    const duration = Object.entries(program.duration);

    return (
        <div className="text-slate-900">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
            </div>

            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden">

                <div
                    className="relative min-h-140 bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${program.image})`,
                    }}
                >

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-br from-slate-950 via-blue-950 to-blue-800" />

                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

                <div className="absolute -bottom-40 right-10 h-112.5 w-112.5 rounded-full border border-white/10" />

                    <div className="relative mx-auto flex min-h-140 max-w-7xl items-center px-6 py-20">

                        <div className="max-w-4xl text-white">

                            {/* Category */}
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
                                <Sparkles size={16} />
                                {program.category}
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
                                Study
                                <span className="block bg-linear-to-r from-blue-400 via-indigo-500 to-sky-400 bg-clip-text text-transparent">
                                    {program.name}
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-200">
                                {program.description}
                            </p>

                            {/* Degrees */}
                            <div className="mt-8 flex flex-wrap gap-3">

                                {program.degrees.map((degree) => (
                                    <span
                                        key={degree}
                                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur  hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {degree}
                                    </span>
                                ))}

                            </div>

                            {/* CTA */}
                            <div className="mt-9 flex flex-wrap gap-4">

                                <NavLink
                                    to="/eligibility-analysis"
                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                                >
                                    <BadgeCheck size={18} />
                                    Check My Eligibility
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </NavLink>

                                <NavLink to="/programs" className="group inline-flex items-center gap-2 rounded-xl text-white border border-white/30 bg-white/10 px-6 py-3.5 font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                                <span className="flex items-center gap-2">
                                    Explore More Programs
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" size={18} />
                                </span>
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

                <div className="grid sm:grid-cols-2 w-[90%] sm:w-full mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-4">

                    {/* Duration */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-blue-50/50 md:border-b-0 md:border-r">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                <Clock3 size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Duration
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {duration[0]?.[1]}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Tuition */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-amber-50/50 md:border-b-0 md:border-r">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-500 group-hover:text-white">
                                <BadgeDollarSign size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Average Tuition
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {program.averageTuition}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Salary */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-emerald-50/50 md:border-b-0 md:border-r">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                                <TrendingUp size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Average Salary
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {program.career.averageSalary}
                                </p>
                            </div>

                        </div>

                    </div>


                    {/* Job Growth */}
                    <div className="group border-b border-slate-100 p-6 transition hover:bg-violet-50/50 md:border-b-0 md:border-r">

                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                                <BriefcaseBusiness size={21} />
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                    Job Growth
                                </p>

                                <p className="mt-1 font-bold text-violet-700">
                                    {program.jobGrowth}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ========================================================= */}
            {/* ABOUT THE PROGRAM */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">

                    <div className="max-w-3xl">

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-blue-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            About the Program
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Everything you need to know about{" "}
        <span className="text-blue-600">
            {program.name}.
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        {program.overview}
    </p>

</div>

                    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl">

                        {/* Decorative circles */}
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
                        <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-white/5" />

                        <div className="relative">
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-100">
                                Program snapshot
                            </p>

                            <h3 className="mt-3 text-2xl font-bold">
                                Why students choose this field
                            </h3>

                            <div className="mt-7 space-y-4">

                                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                                    <span className="text-blue-100">
                                        Universities
                                    </span>

                                    <span className="font-bold">
                                        {program.universitiesCount}+
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                                    <span className="text-blue-100">
                                        Scholarships
                                    </span>

                                    <span className="font-bold">
                                        {program.scholarshipsCount}+
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-blue-100">
                                        English Requirement
                                    </span>

                                    <span className="font-bold">
                                        IELTS {program.ielts}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </section>


            {/* ========================================================= */}
            {/* WHAT YOU'LL LEARN */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-indigo-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
            Curriculum
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        What you'll{" "}
        <span className="text-indigo-600">
            learn.
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        Explore the major areas of study and practical skills you'll
        develop throughout a {program.name} program.
    </p>

</div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                        {program.studyAreas.map((area, index) => (

                            <div
                                key={area}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >

                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                                <div className="relative">

                                    <span className="text-sm font-bold text-blue-600">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <h3 className="mt-5 font-bold text-slate-900">
                                        {area}
                                    </h3>

                                    <div className="mt-5 h-1 w-10 rounded-full bg-blue-600 transition-all duration-300 group-hover:w-16" />

                                </div>

                            </div>

                        ))}

                    </div>


                    {/* Skills */}
                    <div className="mt-14">

                        <h3 className="text-xl font-bold">
                            Key skills you'll develop
                        </h3>

                        <div className="mt-5 flex flex-wrap gap-3">

                            {program.skills.map((skill) => (

                                <span
                                    key={skill}
                                    className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 group border border-blue-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >
                                    {skill}
                                </span>

                            ))}

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* ADMISSION REQUIREMENTS */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">

                    <div>

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-violet-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Admission
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        What do you need to{" "}
        <span className="text-violet-600">
            apply?
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        Admission requirements vary by university, country and degree level.
        Here are the common requirements students should prepare for.
    </p>


    {/* IELTS Card */}
    <div className="mt-8 rounded-3xl bg-linear-to-br from-violet-600 to-indigo-700 p-7 text-white shadow-xl">

        <div className="flex items-center gap-3">
            <Languages size={25} />

            <p className="font-semibold">
                Typical English Requirement
            </p>
        </div>

        <p className="mt-4 text-4xl font-black">
            IELTS {program.ielts}
        </p>

        <p className="mt-2 text-sm text-violet-100">
            Requirements may differ between institutions.
        </p>

    </div>

    {/* Requirement Note */}
<div className="group mt-6 flex items-start gap-4 rounded-3xl border border-blue-200 bg-blue-50/70 p-6">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all
duration-500
group-hover:scale-110
">
        <Info size={20} />
    </div>

    <div>
        <p className="text-sm font-bold text-slate-900">
            Good to know
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600">
            {program.requirements.note}
        </p>
    </div>

</div>

</div>


                    <div className="space-y-5">

                        {/* Academic */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                    <GraduationCap size={21} />
                                </div>

                                <h3 className="text-lg font-bold">
                                    Academic Requirements
                                </h3>

                            </div>

                            <p className="mt-4 leading-7 text-slate-600">
                                {program.requirements.academic}
                            </p>

                        </div>


                        {/* Prerequisites */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                            <h3 className="font-bold">
                                Recommended Background
                            </h3>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                {program.requirements.prerequisites.map(
                                    (item) => (

                                        <div
                                            key={item}
                                            className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 group border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                        >
                                            <CircleCheck
                                                size={18}
                                                className="shrink-0 text-blue-600"
                                            />

                                            <span className="text-sm font-medium text-slate-700">
                                                {item}
                                            </span>
                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* Documents */}
                        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                            <h3 className="font-bold">
                                Required Documents
                            </h3>

                            <div className="mt-5 flex flex-wrap gap-2">

                                {program.requirements.documents.map(
                                    (document) => (

                                        <span
                                            key={document}
                                            className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 group border border-blue-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                        >
                                            {document}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* TUITION & COSTS */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden bg-slate-50 py-24">
                {/* Decorative background */}
                <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
                <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

                <div className="relative overflow-hidden mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-amber-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Cost of Study
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Understand your{" "}
        <span className="text-amber-600">
            investment.
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        Tuition is only one part of your study abroad budget. Consider
        living expenses and other student costs as well.
    </p>

</div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

    {/* Tuition */}
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all
duration-500
group-hover:scale-110
group-hover:rotate-4
group-hover:shadow-lg">
            <BadgeDollarSign size={22} />
        </div>

        <p className="mt-6 text-sm font-semibold text-slate-500">
            Average Tuition
        </p>

        <p className="mt-2 text-2xl font-black text-slate-900">
            {program.costs.tuition}
        </p>

        <p className="mt-2 text-sm text-slate-500">
            Typical annual range
        </p>

    </div>

    {/* Living Cost */}
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all
duration-500
group-hover:scale-110
group-hover:rotate-4
group-hover:shadow-lg">
            <House size={22} />
        </div>

        <p className="mt-6 text-sm font-semibold text-slate-500">
            Living Costs
        </p>

        <p className="mt-2 text-2xl font-black text-slate-900">
            {program.costs.livingCost}
        </p>

        <p className="mt-2 text-sm text-slate-500">
            Estimated monthly living expenses across the globe
        </p>

    </div>

    {/* Total Scholarships */}
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all
duration-500
group-hover:scale-110
group-hover:rotate-4
group-hover:shadow-lg">
            <DollarSign size={22} />
        </div>

        <p className="mt-6 text-sm font-semibold text-slate-500">
            Scholarship Availability
        </p>

        <p className="mt-2 text-2xl font-black text-slate-900">
            {program.scholarshipsCount}+
        </p>

        <p className="mt-2 text-sm text-slate-500">
            Listed scholarship opportunities
        </p>

    </div>

</div>


                    {/* Additional costs */}

                    <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-7">

                        <h3 className="text-lg font-bold">
                            Additional expenses to plan for
                        </h3>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                            {program.costs.additionalCosts.map((cost) => (

                                <div
                                    key={cost}
                                    className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 group border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                >

                                    <Check
                                        size={18}
                                        className="text-emerald-600"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        {cost}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* Cost Note */}
<div className="group mt-6 flex items-start gap-4 rounded-3xl border border-amber-200 bg-amber-50/70 p-6">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all
duration-500
group-hover:scale-110">
        <Info size={20} />
    </div>

    <div>
        <p className="text-sm font-bold text-slate-900">
            Good to know
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600">
            {program.costs.note}
        </p>
    </div>

</div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* CAREER OPPORTUNITIES */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">

                    <div>

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-emerald-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            Career Opportunities
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Where can this program{" "}
        <span className="text-emerald-600">
            take you?
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        {program.career.summary}
    </p>


    {/* Career Outlook Card */}
<div className="mt-8 rounded-3xl bg-emerald-50 p-7">

    <div className="flex items-center gap-3 text-emerald-700">
        <TrendingUp size={23} />

        <span className="font-semibold">
            Career Outlook
        </span>
    </div>

    <p className="mt-3 text-3xl font-black text-emerald-800">
        {program.career.jobGrowth}
    </p>

    <p className="mt-1 text-sm text-emerald-700">
        Current job growth outlook
    </p>

    <div className="mt-6 border-t border-emerald-200 pt-5">
        <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Average Salary
        </p>

        <p className="mt-2 text-2xl font-black text-emerald-800">
            {program.career.averageSalary}
        </p>

        <p className="mt-1 text-sm text-emerald-700">
            Typical annual salary
        </p>
    </div>

</div>

</div>


                    <div className="grid gap-4 sm:grid-cols-2">

                        {program.career.roles.map((role, index) => (

                            <div
                                key={role}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                            >

                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50 opacity-0 transition group-hover:opacity-100" />

                                <div className="relative">

                                    <span className="text-xs font-bold text-emerald-600">
                                        CAREER {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <h3 className="mt-4 font-bold text-slate-900">
                                        {role}
                                    </h3>

                                </div>

                            </div>

                        ))}

                    </div>

                    {/* Career Note */}
<div className="group flex items-start gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-all
duration-500
group-hover:scale-110">
        <Info size={20} />
    </div>

    <div>
        <p className="text-sm font-bold text-slate-900">
            Good to know
        </p>

        <p className="mt-1 text-sm leading-6 text-slate-600">
            {program.career.note}
        </p>
    </div>

</div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* TOP COUNTRIES */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-blue-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Study Destinations
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Top countries for{" "}
        <span className="text-blue-600">
            {program.name}.
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        Explore destinations where students commonly choose to study{" "}
        {program.name}.
    </p>

</div>


                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {program.topCountries.map((country, index) => (

                            <div
                                key={country}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >

                                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 opacity-0 transition group-hover:opacity-100" />

                                <div className="relative">

                                    <div className="flex items-center justify-between">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                            <Globe2 size={21} />
                                        </div>

                                        <span className="text-xs font-bold text-slate-400">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                    </div>

                                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                                        {country}
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Popular study destination
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* TOP UNIVERSITIES */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="max-w-3xl">

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-violet-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-600">
            Universities
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Top universities to{" "}
        <span className="text-violet-600">
            consider.
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        Some leading institutions offering strong academic opportunities
        related to {program.name}.
    </p>

</div>


                <div className="mt-12 grid gap-6 md:grid-cols-2">

                    {program.topUniversities.map((university, index) => (

                        <div
                            key={university}
                            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
                        >

                            {/* Decorative circle */}
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-violet-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                            <div className="relative flex items-center gap-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition duration-300 group-hover:bg-violet-600 group-hover:text-white">
                                    <University size={22} />
                                </div>

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        University {String(index + 1).padStart(2, "0")}
                                    </p>

                                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                                        {university}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* ========================================================= */}
            {/* SCHOLARSHIPS */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">

                        <div>

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-amber-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            Scholarships
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Make your education{" "}
        <span className="text-amber-600">
            more affordable.
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        {program.scholarships.description}
    </p>

    {/* Scholarship Card */}
<div className="mt-8 rounded-3xl bg-linear-to-br from-amber-500 to-orange-600 p-7 text-white shadow-xl">

    <div className="flex items-center gap-3 ">
        <WalletCards size={25} />

        <p className="font-semibold">
            Scholarship Opportunities
        </p>
    </div>

    <p className="mt-4 text-4xl font-black">
        {program.scholarshipsCount}+
    </p>

    <p className="mt-2 text-sm text-amber-100">
        Potential scholarship opportunities available to students.
    </p>

</div>

</div>


                        <div className="grid gap-4 sm:grid-cols-2">

                            {program.scholarships.types.map((type, index) => (

                                <div
                                    key={type}
                                    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                                >

                                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-50 opacity-0 transition group-hover:opacity-100" />

                                    <div className="relative">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 transition duration-300 group-hover:bg-amber-600 group-hover:text-white">
                                            <GraduationCap size={19} />
                                        </div>

                                        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                            Option {String(index + 1).padStart(2, "0")}
                                        </p>

                                        <h3 className="mt-1 font-bold">
                                            {type}
                                        </h3>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* WHY CHOOSE THIS PROGRAM */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="max-w-3xl">

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-blue-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
            Why Choose This Program?
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Is{" "}
        <span className="text-blue-600">
            {program.name}
        </span>{" "}
        right for you?
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        Consider these advantages when deciding whether this program aligns
        with your academic and career goals.
    </p>

</div>


                <div className="mt-12 grid gap-6 md:grid-cols-2">

                    {program.pros.map((item) => (

                        <div
                            key={item}
                            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                        >

                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 opacity-0 transition group-hover:opacity-100" />

                            <div className="relative flex gap-4">

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                    <Check size={21} />
                                </div>

                                <p className="pt-2 font-semibold leading-6 text-slate-800">
                                    {item}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* ========================================================= */}
            {/* THINGS TO CONSIDER */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">

                        <div className="lg:mt-29">

    {/* Section label */}
    <div className="mb-5 flex items-center gap-3">
        <span className="h-px w-10 bg-orange-600" />

        <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            Before You Decide
        </span>
    </div>

    {/* Heading */}
    <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
        Things to{" "}
        <span className="text-orange-600">
            consider.
        </span>
    </h2>

    {/* Description */}
    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
        Every program has its own challenges. Understanding these factors
        can help you make a more informed decision.
    </p>

</div>


                        <div className="space-y-4">

                            {program.considerations.map((item, index) => (

                                <div
                                    key={item}
                                    className="group relative overflow-hidden flex gap-4 rounded-2xl border border-orange-100 bg-white p-6 transition-all duration-300 hover:border-orange-200 hover:-translate-y-1 hover:shadow-lg"
                                >

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 transition duration-300 group-hover:bg-orange-600 group-hover:text-white">
                                        <Lightbulb size={19} />
                                    </div>

                                    <div>

                                        <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                                            Consideration {index + 1}
                                        </span>

                                        <p className="mt-1 font-medium leading-6 text-slate-700">
                                            {item}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* FINAL CTA */}
            {/* ========================================================= */}

            <section className=" bg-slate-50 px-6 pb-20">
                <div className="relative overflow-hidden mx-auto max-w-308 rounded-3xl bg-linear-to-br from-slate-950 via-blue-950 to-blue-800 py-24">

                {/* Decorative circles */}
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

                <div className="absolute -bottom-40 right-10 h-112.5 w-112.5 rounded-full border border-white/10" />

                <div className="relative mx-auto max-w-4xl px-6 text-center text-white">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                                <ShieldCheck className="text-sky-400" size={28} />
                                <span className="inline-block text-sm font-bold uppercase tracking-wider text-sky-400">
                        Your Next Step
                    </span>
                            </div>

                    <h2 className="mt-3 text-4xl font-black tracking-tight">
                        Is {program.name} the right fit for you?
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                        Get a personalized eligibility analysis based on your
                        academic background, English proficiency, budget and
                        study goals.
                    </p>

                    <div className="mt-9 flex flex-wrap justify-center gap-4">

                        <NavLink to="/eligibility-analysis" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500">
                                <span className="flex items-center gap-2">
                                    <BadgeCheck size={18} />
                                    Check My Eligibility
                                </span>
                            </NavLink>

                        <NavLink to="/programs" className="group inline-flex items-center gap-2 rounded-xl text-white border border-white/30 bg-white/10 px-6 py-3.5 font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                                <span className="flex items-center gap-2">
                                    Explore Other Programs
                                    <ArrowRight size={18} />
                                </span>
                            </NavLink>

                    </div>

                </div>

            </div>
            </section>

        </div>
    );
};

export default ProgramDetails;