import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    CircleAlert,
    FileCheck2,
    GraduationCap,
    Info,
    Search,
    Sparkles,
    Target,
    UserRoundCheck,
    XCircle,
} from "lucide-react";
import { NavLink } from "react-router";

/* ========================================================= */
/* STUDENT PROFILE                                           */
/* ========================================================= */

const profile = [
    ["Academic performance", "GPA 3.50 / 4.00"],
    ["Study level", "Bachelor's"],
    ["Field of study", "Computer Science"],
    ["Study destination", "Australia"],
    ["English proficiency", "IELTS 7.0"],
    ["Nationality", "Bangladeshi"],
    ["Age", "25 years"],
    ["Annual budget", "$50,000"],
    ["Work experience", "6 months"],
    ["Achievements", "Hackathon Winner"],
];

/* ========================================================= */
/* WHAT SCHOLARX EVALUATES                                   */
/* ========================================================= */

const evaluationFactors = [
    {
        icon: GraduationCap,
        title: "Academic background",
        description:
            "Your GPA, academic qualifications, previous study, and academic achievements can all influence scholarship eligibility.",
    },
    {
        icon: BookOpen,
        title: "Language proficiency",
        description:
            "English proficiency and other language requirements are considered when they are part of a scholarship's criteria.",
    },
    {
        icon: Target,
        title: "Study preferences",
        description:
            "Your intended degree level, field of study, destination, and other study preferences help determine suitable opportunities.",
    },
    {
        icon: UserRoundCheck,
        title: "Personal eligibility",
        description:
            "Factors such as nationality, age, residency, and other scholarship-specific conditions may affect eligibility.",
    },
    {
        icon: FileCheck2,
        title: "Experience & achievements",
        description:
            "Work experience, leadership, competitions, research, volunteering, and other achievements can be relevant.",
    },
    {
        icon: CircleAlert,
        title: "Scholarship requirements",
        description:
            "ScholarX compares your information against the specific eligibility requirements associated with each opportunity.",
    },
];

/* ========================================================= */
/* HOW IT WORKS                                              */
/* ========================================================= */

const steps = [
    {
        number: "01",
        icon: UserRoundCheck,
        title: "Build your profile",
        description:
            "Provide your academic, personal, study, language, financial, and experience details so ScholarX has the information needed for analysis.",
        points: [
            "Academic background",
            "Study preferences",
            "Language scores",
            "Personal details",
        ],
    },
    {
        number: "02",
        icon: Search,
        title: "Review scholarship requirements",
        description:
            "Scholarship opportunities contain different eligibility rules. ScholarX organizes those requirements so they can be compared against your profile.",
        points: [
            "Academic criteria",
            "Language criteria",
            "Personal criteria",
            "Other requirements",
        ],
    },
    {
        number: "03",
        icon: Target,
        title: "Compare your profile",
        description:
            "Your profile is evaluated against the requirements of available scholarship opportunities to identify where your information fits.",
        points: [
            "Profile comparison",
            "Requirement matching",
            "Missing criteria",
            "Potential opportunities",
        ],
    },
    {
        number: "04",
        icon: CheckCircle2,
        title: "Understand your result",
        description:
            "Instead of leaving you with a confusing list of requirements, ScholarX helps explain which criteria you meet and which areas may need attention.",
        points: [
            "Eligibility overview",
            "Requirement breakdown",
            "Missing criteria",
            "Improvement areas",
        ],
    },
];

/* ========================================================= */
/* RESULT TYPES                                              */
/* ========================================================= */

const resultTypes = [
    {
        icon: CheckCircle2,
        title: "Strong fit",
        description:
            "Your profile meets the major eligibility requirements and the opportunity may be worth pursuing.",
        iconClass: "bg-emerald-50 text-emerald-600",
    },
    {
        icon: Info,
        title: "Needs review",
        description:
            "Your profile may meet several requirements, but one or more criteria need additional attention.",
        iconClass: "bg-amber-50 text-amber-600",
    },
    {
        icon: XCircle,
        title: "Not currently eligible",
        description:
            "Your profile does not currently satisfy one or more essential eligibility requirements.",
        iconClass: "bg-rose-50 text-rose-600",
    },
];

/* ========================================================= */
/* IMPROVEMENT TIPS                                          */
/* ========================================================= */

const improvements = [
    {
        number: "01",
        title: "Strengthen your academic profile",
        description:
            "Maintain strong academic performance and highlight relevant academic achievements when applying.",
    },
    {
        number: "02",
        title: "Improve your language score",
        description:
            "If a scholarship has a language threshold, achieving a stronger score can help you meet more opportunities.",
    },
    {
        number: "03",
        title: "Build meaningful experience",
        description:
            "Leadership, volunteering, research, competitions, internships, and other relevant experiences can strengthen your profile.",
    },
    {
        number: "04",
        title: "Keep your profile updated",
        description:
            "New grades, certificates, test scores, work experience, and achievements can change which opportunities fit you.",
    },
];

export default function LearnMoreAboutEligibilityAnalysis() {
    return (
        <div className="min-h-screen bg-[#eef7ff] text-slate-900">
            {/* ========================================================= */}
            {/* HERO                                                       */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-[#e5f3ff]">
                {/* Decorative background */}
                <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

                <div className="absolute right-[20%] top-20 rotate-12 text-blue-200">
                    <Sparkles size={70} strokeWidth={1.5} />
                </div>

                <div className="absolute bottom-60 left-[8%] rotate-12 text-blue-200">
                    <Target size={75} strokeWidth={1.2} />
                </div>

                <div className="absolute bottom-12 right-[8%] text-indigo-200">
                    <GraduationCap size={80} strokeWidth={1.2} />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Badge */}
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm">
                            <Target size={16} />
                            Eligibility Analysis Guide
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                            Understand where you
                            <br />
                            <span className="text-indigo-600">
                                stand before you apply
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            ScholarX helps you understand how your student
                            profile compares with scholarship requirements,
                            giving you a clearer picture of your eligibility
                            before you spend time applying.
                        </p>

                        {/* Button */}
                        <div className="mt-9 flex flex-wrap items-center justify-center">
                            <NavLink
                                to="/eligibility-analysis"
                                className="group inline-flex shrink-0 items-center gap-2 rounded-2xl border border-[#3A2C2C] bg-[#DCEEFF] px-5 py-3 text-lg font-semibold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition-all duration-200 hover:translate-y-0.5 hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >
                                Try eligibility analysis
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* FACT BAR                                                    */}
            {/* ========================================================= */}

            <section className="relative z-20 mx-auto -mt-12 max-w-6xl px-6">
                <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:grid-cols-3">
                    <div className="border-b border-slate-200 p-6 text-center transition-colors hover:bg-indigo-50/20 sm:border-b-0 sm:border-r">
                        <UserRoundCheck
                            className="mx-auto mb-3 text-indigo-600"
                            size={25}
                        />

                        <p className="text-lg font-black">
                            Your Profile
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Understand what ScholarX uses
                        </p>
                    </div>

                    <div className="border-b border-slate-200 p-6 text-center transition-colors hover:bg-indigo-50/20 sm:border-b-0 sm:border-r">
                        <Target
                            className="mx-auto mb-3 text-indigo-600"
                            size={25}
                        />

                        <p className="text-lg font-black">
                            Analyze
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Compare against requirements
                        </p>
                    </div>

                    <div className="p-6 text-center transition-colors hover:bg-indigo-50/20">
                        <CheckCircle2
                            className="mx-auto mb-3 text-indigo-600"
                            size={25}
                        />

                        <p className="text-lg font-black">
                            Understand
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            See what needs attention
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* WHAT IS ELIGIBILITY ANALYSIS                               */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    {/* Text */}
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-indigo-600" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                                What is eligibility analysis?
                            </span>
                        </div>

                        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                            Stop guessing.
                            <br />
                            Understand your eligibility.
                        </h2>

                        <p className="mt-6 max-w-xl leading-7 text-slate-600">
                            Every scholarship has its own requirements. Some
                            focus on academic performance, while others may
                            consider nationality, language proficiency, field
                            of study, achievements, financial circumstances,
                            or other criteria.
                        </p>

                        <p className="mt-4 max-w-xl leading-7 text-slate-600">
                            Eligibility Analysis brings these factors together
                            and helps you understand how your profile compares
                            with the requirements of available opportunities.
                        </p>

                        <div className="mt-7 space-y-4">
                            {[
                                "Understand the requirements before applying",
                                "Identify criteria you already meet",
                                "See areas that may need attention",
                                "Make more informed application decisions",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3"
                                >
                                    <CheckCircle2
                                        size={20}
                                        className="shrink-0 text-indigo-600"
                                    />

                                    <span className="font-medium text-slate-700">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Profile Card */}

                    <div className="relative">
                        <div className="absolute -inset-4 rounded-4xl bg-blue-100/60 blur-2xl" />

                        <div className="relative group overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500">
                                        Your Academic Profile
                                    </p>
                                    <h3 className="mt-1 text-2xl font-black">
                                        Scholarship Profile
                                    </h3>
                                </div>

                                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:text-white group-hover:bg-indigo-600">
                                    <Target size={25} />
                                </div>
                            </div>

                            <div className="mt-7 space-y-4">
                                {profile.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                                    >
                                        <span className="text-sm font-medium text-slate-500">
                                            {label}
                                        </span>

                                        <span className="text-right text-sm font-bold text-slate-900">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 rounded-2xl border border-indigo-100 hover:border-indigo-200 hover:scale-101 hover:shadow-sm transition-all bg-indigo-50 p-5">
                                <div className="flex gap-3">
                                    <Sparkles
                                        className="shrink-0 text-indigo-600"
                                        size={20}
                                    />

                                    <p className="text-sm leading-6 text-slate-600">
                                        ScholarX uses information like this to
                                        evaluate your profile against
                                        scholarship-specific requirements.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* WHAT SCHOLARX EVALUATES                                    */}
            {/* ========================================================= */}

            <section className="border-y border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-indigo-600" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                                What gets evaluated
                            </span>

                            <span className="h-px w-8 bg-indigo-600" />
                        </div>

                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                            Eligibility is more than your GPA.
                        </h2>

                        <p className="mt-5 leading-7 text-slate-600">
                            Different scholarships look for different things.
                            ScholarX considers the relevant parts of your
                            profile when comparing you with an opportunity.
                        </p>
                    </div>

                    <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {evaluationFactors.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="group rounded-2xl border border-slate-200 bg-[#f8fbff] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                                        <Icon size={23} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-black">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* HOW IT WORKS                                                */}
            {/* ========================================================= */}

            <section
                id="how-it-works"
                className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10"
            >
                <div className="mx-auto max-w-3xl text-center">
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                        How it works
                    </span>

                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                        From your profile
                        <br />
                        to a clearer answer.
                    </h2>

                    <p className="mt-5 leading-7 text-slate-600">
                        ScholarX turns a complicated set of scholarship
                        requirements into a process that is easier to
                        understand.
                    </p>
                </div>

                <div className="mt-16 space-y-6">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.number}
                                className="group relative grid gap-7 rounded-3xl border border-slate-200 bg-[#f8fbff] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl md:grid-cols-[100px_70px_1fr] md:items-start"
                            >
                                {/* Number */}
                                <div className="flex items-center gap-3 md:block">
                                    <span className="text-sm font-black tracking-widest text-indigo-500">
                                        STEP
                                    </span>

                                    <p className="mt-1 text-4xl font-black text-slate-200 transition-colors md:text-5xl group-hover:text-indigo-600">
                                        {step.number}
                                    </p>
                                </div>

                                {/* Icon */}
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-white text-indigo-600 shadow-sm">
                                    <Icon size={25} />
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 className="text-2xl font-black text-slate-950">
                                        {step.title}
                                    </h3>

                                    <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                                        {step.description}
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {step.points.map((point) => (
                                            <span
                                                key={point}
                                                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600"
                                            >
                                                {point}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Connector */}
                                {index !== steps.length - 1 && (
                                    <div className="absolute -bottom-6 left-12 z-10 hidden h-6 w-px bg-slate-300 md:block" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ========================================================= */}
            {/* UNDERSTANDING RESULTS                                       */}
            {/* ========================================================= */}

            <section className="bg-[#e5f3ff]">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                    <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        {/* Intro */}
                        <div>
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3A2C2C] bg-white shadow-[2px_3px_0px_0px_#3A2C2C]">
                                <Target
                                    size={27}
                                    className="text-indigo-600"
                                />
                            </div>

                            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                                Your result should
                                <br />
                                tell you more than "yes" or "no".
                            </h2>

                            <p className="mt-5 leading-7 text-slate-600">
                                Eligibility can have different levels of
                                confidence depending on the requirements of an
                                opportunity. The goal is to understand the
                                reasoning behind the result.
                            </p>
                        </div>

                        {/* Result cards */}
                        <div className="space-y-4">
                            {resultTypes.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.title}
                                        className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                                        >
                                            <Icon size={22} />
                                        </div>

                                        <div>
                                            <h3 className="font-black text-slate-900">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* WHY EXPLAINED ANALYSIS                                      */}
            {/* ========================================================= */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <span className="h-px w-8 bg-indigo-600" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                                Why it matters
                            </span>

                            <span className="h-px w-8 bg-indigo-600" />
                        </div>

                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Make better decisions before you apply.
                        </h2>

                        <p className="mt-5 leading-7 text-slate-600">
                            Understanding eligibility can help you prioritize
                            the opportunities where your time and effort are
                            most worthwhile.
                        </p>
                    </div>

                    <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
                        {[
                            {
                                icon: Search,
                                title: "Save time",
                                description:
                                    "Focus on opportunities that align with your profile instead of reviewing every scholarship manually.",
                            },
                            {
                                icon: Info,
                                title: "Know what is missing",
                                description:
                                    "Identify requirements or profile areas that may need attention before submitting an application.",
                            },
                            {
                                icon: Sparkles,
                                title: "Apply with confidence",
                                description:
                                    "Understand your position before investing time into preparing a scholarship application.",
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border border-slate-200 bg-[#f8fbff] p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                                >
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                        <Icon size={23} />
                                    </div>

                                    <h3 className="mt-5 text-lg font-black">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* IMPROVEMENT TIPS                                            */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                    <div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Sparkles size={24} />
                        </div>

                        <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                            Your profile can
                            <br />
                            keep getting better.
                        </h2>

                        <p className="mt-4 leading-7 text-slate-600">
                            Eligibility analysis is not only about finding out
                            where you stand today. It can also help you
                            understand what you can improve for future
                            opportunities.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {improvements.map((item) => (
                            <div
                                key={item.number}
                                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                            >
                                <span className="text-sm font-black text-indigo-500">
                                    {item.number}
                                </span>

                                <div>
                                    <h3 className="font-black text-slate-900">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* FINAL CTA                                                   */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-slate-950">
                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

                    <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:px-8">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-indigo-300">
                            <Sparkles size={27} />
                        </div>

                        <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Ready to understand your eligibility?
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
                            Build your profile and let ScholarX help you
                            understand which scholarship opportunities may
                            fit your academic journey.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <NavLink
                                to="/eligibility-analysis"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-6 py-3 font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition-all hover:-translate-y-1"
                            >
                                Start eligibility analysis
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </NavLink>

                            <NavLink
                                to="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
                            >
                                Back to ScholarX
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}