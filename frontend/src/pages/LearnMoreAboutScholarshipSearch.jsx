import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    CircleDollarSign,
    FileCheck2,
    GraduationCap,
    Lightbulb,
    Search,
    Sparkles,
    Target,
    UserRoundCheck,
    WalletCards,
} from "lucide-react";
import { NavLink } from "react-router";

const steps = [
    {
        number: "01",
        icon: UserRoundCheck,
        title: "Build your student profile",
        description:
            "Start by adding your academic background, preferred study destination, field of study, budget, and other important details.",
        points: [
            "Academic qualifications",
            "Preferred countries",
            "Study level & subject",
            "Budget preferences",
        ],
    },
    {
        number: "02",
        icon: Search,
        title: "Discover scholarships",
        description:
            "ScholarX searches scholarship opportunities based on the information in your profile so you can focus on opportunities that actually fit.",
        points: [
            "Government scholarships",
            "University scholarships",
            "Merit-based funding",
            "Need-based opportunities",
        ],
    },
    {
        number: "03",
        icon: Target,
        title: "Check your eligibility",
        description:
            "Review the requirements of each scholarship and understand how well your profile matches the eligibility criteria.",
        points: [
            "Academic requirements",
            "Language requirements",
            "Age & nationality criteria",
            "Required documents",
        ],
    },
    {
        number: "04",
        icon: FileCheck2,
        title: "Prepare your application",
        description:
            "Once you find a suitable scholarship, prepare the required documents and make sure every requirement is covered before applying.",
        points: [
            "Academic transcripts",
            "CV / Resume",
            "Statement of purpose",
            "Recommendation letters",
        ],
    },
    {
        number: "05",
        icon: CheckCircle2,
        title: "Apply & track",
        description:
            "Submit your application through the official scholarship or university portal and keep track of deadlines and application progress.",
        points: [
            "Save important deadlines",
            "Track applications",
            "Monitor application status",
            "Follow up when needed",
        ],
    },
];

const scholarshipTypes = [
    {
        icon: GraduationCap,
        title: "University Scholarships",
        description:
            "Funding offered directly by universities to attract talented international students.",
    },
    {
        icon: CircleDollarSign,
        title: "Government Scholarships",
        description:
            "Scholarships funded by national governments for international or domestic students.",
    },
    {
        icon: WalletCards,
        title: "Need-Based Funding",
        description:
            "Financial support designed to help students who demonstrate financial need.",
    },
    {
        icon: Sparkles,
        title: "Merit Scholarships",
        description:
            "Awards based on academic performance, achievements, leadership, or other strengths.",
    },
];

const tips = [
    "Start searching several months before your intended intake.",
    "Do not rely only on your GPA — scholarships consider many factors.",
    "Always check the official scholarship website before applying.",
    "Keep your transcripts, CV, passport, and certificates ready.",
    "Create a deadline tracker so you never miss an important date.",
    "Apply to multiple suitable scholarships instead of depending on one opportunity.",
];

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

export default function LearnMoreAboutScholarshipSearch() {
    return (
        <div className="min-h-screen bg-[#eef7ff] text-slate-900">
            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-[#e5f3ff]">
                {/* Decorative shapes */}
                <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

                <div className="absolute right-[20%] top-20 rotate-12 text-blue-200">
                    <Sparkles size={70} strokeWidth={1.5} />
                </div>

                <div className="absolute bottom-60 left-[8%] rotate-12 text-blue-200">
                    <BookOpen size={75} strokeWidth={1.2} />
                </div>

                <div className="absolute bottom-12 right-[8%] text-indigo-200">
                    <GraduationCap size={80} strokeWidth={1.2} />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-4xl text-center">
                        {/* Badge */}
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm backdrop-blur-3xl">
                            <Search size={16} />
                            Scholarship Search Guide
                        </div>

                        {/* Heading */}
                        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
                            Find scholarships
                            <br />
                            <span className="text-indigo-600">
                                that fit your future
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            Scholarship searching does not have to be
                            complicated. Learn how ScholarX helps you discover,
                            understand, and organize scholarship opportunities
                            that match your goals.
                        </p>

                        {/* Buttons */}
                        <div className="mt-9 flex flex-wrap items-center justify-center">
                            <NavLink
                                to="/programs"
                                className="group inline-flex items-center gap-2 px-4 py-2 font-semibold text-slate-950 shrink-0 text-lg rounded-2xl
               bg-[#DCEEFF]
               border border-[#3A2C2C]
               shadow-[2px_3px_0px_0px_#3A2C2C]
               transition-all duration-200
               hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >
                                Start exploring
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
            {/* INTRO FACT BAR */}
            {/* ========================================================= */}

            <section className="relative z-20 mx-auto -mt-12 max-w-6xl px-6">
                <div className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:grid-cols-3">
                    <div className="border-b border-slate-200 p-6 text-center sm:border-b-0 sm:border-r hover:bg-indigo-50/20">
                        <Search
                            className="mx-auto mb-3 text-indigo-600"
                            size={25}
                        />
                        <p className="text-lg font-black">Discover</p>
                        <p className="mt-1 text-sm text-slate-500">
                            Find opportunities that match you
                        </p>
                    </div>

                    <div className="border-b border-slate-200 p-6 text-center sm:border-b-0 sm:border-r hover:bg-indigo-50/20">
                        <Target
                            className="mx-auto mb-3 text-indigo-600"
                            size={25}
                        />
                        <p className="text-lg font-black">Understand</p>
                        <p className="mt-1 text-sm text-slate-500">
                            Know exactly what you qualify for
                        </p>
                    </div>

                    <div className="p-6 text-center hover:bg-indigo-50/20">
                        <CheckCircle2
                            className="mx-auto mb-3 text-indigo-600"
                            size={25}
                        />
                        <p className="text-lg font-black">Apply</p>
                        <p className="mt-1 text-sm text-slate-500">
                            Prepare and submit with confidence
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* WHAT IS SCHOLARSHIP SEARCH */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                <div className="grid items-center gap-14 lg:grid-cols-2">
                    <div>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-indigo-600" />
                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                                Before you start
                            </span>
                        </div>

                        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                            Scholarship searching is more than just finding
                            money.
                        </h2>

                        <p className="mt-6 max-w-xl leading-7 text-slate-600">
                            The right scholarship should fit your academic
                            profile, study goals, destination, financial needs,
                            and eligibility. That is why a good search starts
                            with understanding <strong>you</strong> first.
                        </p>

                        <div className="mt-7 space-y-4">
                            {[
                                "Know what you want to study",
                                "Understand your academic strengths",
                                "Choose realistic study destinations",
                                "Identify the funding you need",
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
                                        The better your profile is defined, the
                                        easier it becomes to identify
                                        scholarships worth your time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* HOW IT WORKS */}
            {/* ========================================================= */}

            <section
                id="how-it-works"
                className="border-y border-slate-200 bg-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                            How to search
                        </span>

                        <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                            Your scholarship search,
                            <br />
                            step by step.
                        </h2>

                        <p className="mt-5 leading-7 text-slate-600">
                            Follow a simple process to move from discovering an
                            opportunity to submitting a strong application.
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

                                        <p className="mt-1 text-4xl font-black text-slate-200 md:text-5xl group-hover:text-indigo-600">
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
                                        <div className="absolute -bottom-6 left-12.25 z-10 hidden h-6 w-px bg-slate-300 md:block" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* SCHOLARSHIP TYPES */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                <div className="max-w-2xl">
                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-indigo-600" />
                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                            Know your options
                        </span>
                    </div>


                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                        Not all scholarships work the same way.
                    </h2>

                    <p className="mt-4 leading-7 text-slate-600">
                        Understanding the different types of funding helps you
                        search more strategically.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {scholarshipTypes.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.title}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
            </section>

            {/* ========================================================= */}
            {/* WHAT TO PREPARE */}
            {/* ========================================================= */}

            <section className="bg-[#e5f3ff]">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                    <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                        <div>
                            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#3A2C2C] bg-white shadow-[2px_3px_0px_0px_#3A2C2C]">
                                <FileCheck2
                                    size={27}
                                    className="text-indigo-600"
                                />
                            </div>

                            <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
                                Prepare before you apply.
                            </h2>

                            <p className="mt-5 leading-7 text-slate-600">
                                Many scholarship applications require similar
                                documents. Having them ready can make the
                                application process much easier.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                "Academic transcripts",
                                "Passport / identification",
                                "CV or Resume",
                                "Statement of Purpose",
                                "Recommendation letters",
                                "English proficiency results",
                                "Certificates & achievements",
                                "Financial documents",
                            ].map((item, index) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                                >
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                                        {index + 1}
                                    </div>

                                    <span className="text-sm font-semibold text-slate-700">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* TIPS */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
                <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
                    <div>
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Lightbulb size={24} />
                        </div>

                        <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                            Smart scholarship
                            <br />
                            search tips.
                        </h2>

                        <p className="mt-4 leading-7 text-slate-600">
                            A few habits can make your scholarship search more
                            effective and help you avoid wasting time on
                            opportunities that are not a good fit.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {tips.map((tip, index) => (
                            <div
                                key={tip}
                                className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                            >
                                <span className="text-sm font-black text-indigo-500">
                                    0{index + 1}
                                </span>

                                <p className="text-sm font-medium leading-6 text-slate-600">
                                    {tip}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* FINAL CTA */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 sm:px-8 pb-12">
                <div className="relative overflow-hidden rounded-3xl border-t border-slate-200 bg-slate-950">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

                    <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />

                <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:px-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-indigo-300">
                        <Sparkles size={27} />
                    </div>

                    <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                        Ready to find your opportunity?
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
                        Start exploring study opportunities and build your
                        scholarship journey with ScholarX.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <NavLink
                            to="/programs"
                            className="group inline-flex items-center gap-2 rounded-xl border bg-white px-6 py-3 font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition-all hover:-translate-y-1"
                        >
                            Explore opportunities
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </NavLink>

                        <NavLink
                            to="/"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10 hover:-translate-y-1"
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