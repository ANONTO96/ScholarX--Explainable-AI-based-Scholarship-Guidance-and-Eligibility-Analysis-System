import {
  ArrowRight,
  Award,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Compass,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
} from "lucide-react";
import { Link, NavLink } from "react-router";

export default function AboutUs() {
  const values = [
    {
      icon: Target,
      title: "Student First",
      description:
        "Every feature is designed around one goal — helping students make clearer, more confident decisions about their future.",
    },
    {
      icon: BrainCircuit,
      title: "Intelligence with Purpose",
      description:
        "We combine structured data, rule-based analysis, and AI-powered guidance to turn complex scholarship information into useful insights.",
    },
    {
      icon: ShieldCheck,
      title: "Clarity & Trust",
      description:
        "Scholarship decisions can shape a student's future. That's why we focus on transparent requirements, understandable results, and reliable information.",
    },
    {
      icon: HeartHandshake,
      title: "Built to Empower",
      description:
        "ScholarX isn't here to make decisions for students. We're here to give them the information and confidence to make better ones.",
    },
  ];

  const capabilities = [
    {
      icon: Search,
      title: "Discover",
      description:
        "Find scholarships and opportunities that match your academic goals, destination, and profile.",
    },
    {
      icon: BrainCircuit,
      title: "Analyze",
      description:
        "Understand your eligibility through intelligent requirement analysis and personalized explanations.",
    },
    {
      icon: Compass,
      title: "Plan",
      description:
        "Turn opportunities into an actionable plan with clear requirements, deadlines, and next steps.",
    },
    {
      icon: Workflow,
      title: "Track",
      description:
        "Keep your scholarship journey organized from discovery to final submission.",
    },
  ];

  const stats = [
    {
      value: "AI",
      label: "Powered Guidance",
      icon: Sparkles,
    },
    {
      value: "360°",
      label: "Student Journey",
      icon: Compass,
    },
    {
      value: "24/7",
      label: "Access to Guidance",
      icon: Users,
    },
    {
      value: "One",
      label: "Smarter Platform",
      icon: GraduationCap,
    },
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative isolate overflow-hidden bg-slate-950">
        {/* Background decoration */}
<div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

<div className="absolute -bottom-48 -right-32 h-125 w-125 rounded-full bg-sky-600/20 blur-3xl" />

<div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(14,165,233,0.14),transparent_32%)]" />

{/* Subtle center glow */}
<div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left */}
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-sky-400" />
                About ScholarX
              </div>

              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                Making scholarship decisions{" "}
                <span className="bg-linear-to-r from-blue-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
                  simpler and smarter.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
                ScholarX is an AI-powered scholarship guidance platform built
                to help students discover opportunities, understand their
                eligibility, and navigate their journey with confidence.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/opportunities"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-500"
                >
                  Explore Scholarships
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  to="/learn-more-about-whole-process"
                  className="group inline-flex items-center gap-2 rounded-xl text-white border border-white/30 bg-white/10 px-6 py-3.5 font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                >
                  See How It Works
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Mini trust row */}
              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Personalized guidance
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Intelligent analysis
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Student-focused
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-4xl bg-indigo-500/10 blur-3xl" />

              <div className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/6 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                  {/* Fake dashboard top */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        SCHOLARX ANALYSIS
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-white">
                        Your Scholarship Match
                      </h3>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
                      <BrainCircuit className="h-5 w-5 text-sky-400" />
                    </div>
                  </div>

                  {/* Score */}
                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/4 p-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          Eligibility Score
                        </p>
                        <p className="mt-1 text-4xl font-bold text-white">
                          96%
                        </p>
                      </div>

                      <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        Strong Match
                      </div>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-[86%] rounded-full bg-linear-to-r from-indigo-500 via-blue-500 to-sky-500" />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mt-4 space-y-3">
                    {[
                      "Academic performance",
                      "Field of study",
                      "English proficiency",
                      "International student status",
                    ].map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </div>

                          <span className="text-sm text-slate-300">
                            {item}
                          </span>
                        </div>

                        <span className="text-xs text-slate-600">
                          0{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating card */}
                <div className="absolute -right-3 top-24 hidden w-44 rounded-2xl border border-white/10 bg-slate-900/95 p-4 shadow-xl sm:block">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10">
                      <Award className="h-4 w-4 text-emerald-400" />
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-500">
                        OPPORTUNITY
                      </p>
                      <p className="text-xs font-semibold text-white">
                        Recommended
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white to-transparent" />
      </section>

      {/* ========================================================= */}
      {/* FACT BAR */}
      {/* ========================================================= */}

      <section className="relative z-10 mx-auto -mt-10 lg:-mt-15 max-w-7xl px-6">

                <div className="grid sm:grid-cols-2 w-[90%] sm:w-full mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:grid-cols-4">
{stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group flex items-center gap-4 px-5 py-7 lg:px-8"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:text-white group-hover:bg-sky-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}

                </div>

      </section>

      {/* ========================================================= */}
      {/* OUR STORY */}
      {/* ========================================================= */}

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Visual */}
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-indigo-200 blur-2xl" />
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-sky-200 blur-2xl" />

              <div className="relative rounded-4xl border border-slate-200 bg-slate-50 p-5">
                <div className="rounded-3xl bg-slate-950 p-7 sm:p-9">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                      <Lightbulb className="h-5 w-5 text-sky-400" />
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        The idea
                      </p>
                      <p className="text-sm font-semibold text-white">
                        Information should create opportunity.
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 space-y-5">
                    <div className="h-3 w-full rounded-full bg-white/10" />
                    <div className="h-3 w-[88%] rounded-full bg-white/10" />
                    <div className="h-3 w-[72%] rounded-full bg-white/10" />
                  </div>

                  <div className="mt-10 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                      <p className="text-2xl font-bold text-white">Discover</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Find possibilities
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                      <p className="text-2xl font-bold text-white">Decide</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Understand your fit
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                      <p className="text-2xl font-bold text-white">Plan</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Know your next step
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
                      <p className="text-2xl font-bold text-white">Achieve</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Move forward
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 text-sky-600 px-4 py-2 text-xs font-semibold shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                OUR STORY
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.7rem]">
                Scholarship information is everywhere.
                <span className="block text-slate-400">
                  Guidance shouldn't be.
                </span>
              </h2>

              <div className="mt-7 space-y-5 text-base leading-7 text-slate-600">
                <p>
                  Finding the right scholarship can be overwhelming. Students
                  often have to search across different websites, interpret
                  complicated eligibility requirements, track deadlines, and
                  figure out whether an opportunity is actually right for them.
                </p>

                <p>
                  ScholarX was created to bring that journey together in one
                  intelligent platform. Instead of simply showing students
                  opportunities, we help them understand those opportunities.
                </p>

                <p>
                  From discovering scholarships to analyzing eligibility,
                  planning applications, and tracking progress, ScholarX is
                  designed to make the entire journey more structured and
                  understandable.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                </div>
                  <p className="text-sm font-semibold text-slate-700">
                    Less searching.
                </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                </div>
                  <p className="text-sm font-semibold text-slate-700">
                    More Understanding.
                </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                </div>
                  <p className="text-sm font-semibold text-slate-700">
                    Better decisions.
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* WHAT WE DO */}
      {/* ========================================================= */}

      <section className="border-y border-slate-200 bg-slate-50/70 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 text-sky-600 px-4 py-2 text-xs font-semibold shadow-sm">
              <Workflow className="h-3.5 w-3.5" />
              WHAT WE DO
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              One platform for the entire scholarship journey.
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              ScholarX brings discovery, eligibility analysis, planning, and
              tracking together so students can focus on opportunities instead
              of information overload.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/40"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-sky-50 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />

                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors group-hover:bg-sky-600 group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-semibold text-slate-300 rounded-md p-0.5 group-hover:text-white group-hover:bg-sky-600 transition-all">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-6 text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* MISSION */}
      {/* ========================================================= */}

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-4xl bg-slate-950 px-7 py-14 sm:px-12 lg:px-16 lg:py-16">
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
            <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3.5 py-2 text-xs font-semibold text-sky-400">
                  <Target className="h-3.5 w-3.5" />
                  OUR MISSION
                </div>

                <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Make opportunity easier to reach.
                </h2>
              </div>

              <div>
                <p className="text-lg leading-8 text-slate-400">
                  Our mission is to reduce the gap between students and the
                  opportunities they deserve. We believe access to education
                  shouldn't depend on how much time someone has to search
                  through scattered information or how well they understand
                  complicated application requirements.
                </p>

                <p className="mt-5 text-lg leading-8 text-slate-400">
                  ScholarX uses technology to organize that complexity, explain
                  it clearly, and help students move forward with a plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* VALUES */}
      {/* ========================================================= */}

      <section className="bg-slate-50 py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            {/* Heading */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 text-sky-600 px-4 py-2 text-xs font-semibold shadow-sm">
                <HeartHandshake className="h-3.5 w-3.5" />
                WHAT WE BELIEVE
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Technology should make important decisions feel simpler.
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                These principles influence how we design our product, analyze
                opportunities, and communicate with students.
              </p>
            </div>

            {/* Values */}
            <div className="grid gap-4 sm:grid-cols-2">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:text-white group-hover:bg-sky-600">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {value.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* HOW SCHOLARX IS DIFFERENT */}
      {/* ========================================================= */}

      <section className="bg-white py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 text-sky-600 px-4 py-2 text-xs font-semibold shadow-sm">
              <Award className="h-3.5 w-3.5" />
              THE SCHOLARX APPROACH
            </div>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              We don't just help students find scholarships.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              We help them understand where they stand and what they can do
              next.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {/* Traditional */}
            <div className="rounded-2xl shadow-md border border-slate-200 bg-slate-50 p-7 hover:-translate-y-2 hover:shadow-xl hover:border-slate-300 transition-all duration-300">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Traditional Search
              </p>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Information overload
              </h3>

              <div className="mt-7 space-y-4">
                {[
                  "Search across multiple websites",
                  "Read lengthy requirements",
                  "Manually compare opportunities",
                  "Track deadlines yourself",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-500"
                  >
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* ScholarX */}
            <div className="relative overflow-hidden rounded-2xl shadow-md border border-indigo-200 bg-indigo-50/60 p-7 shadow-indigo-100/40 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300 transition-all duration-300">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-indigo-200/30 blur-3xl" />

              <div className="relative">
                <div className="inline-flex rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  ScholarX
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  Intelligent guidance
                </h3>

                <div className="mt-7 space-y-4">
                  {[
                    "Discover relevant opportunities",
                    "Analyze your eligibility",
                    "Understand missing requirements",
                    "Build a clear action plan",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-sm font-medium text-slate-700"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="rounded-2xl shadow-md shadow-emerald-100/40 border border-emerald-200 bg-emerald-50/50 p-7 hover:-translate-y-2 hover:shadow-xl hover:border-emerald-300 transition-all duration-300">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                The Result
              </p>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Confident decisions
              </h3>

              <div className="mt-7 space-y-4">
                {[
                  "Know which opportunities fit",
                  "Understand why you qualify",
                  "Identify what you need to improve",
                  "Move forward with confidence",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-slate-600"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <GraduationCap className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Your next opportunity could be closer than you think.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Start exploring scholarships, understand your eligibility, and
                take the next step toward your academic goals with ScholarX.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <NavLink
              to="/eligibility-analysis"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-indigo-500"
            >
              Start with ScholarX
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </NavLink>

            <a href="https://wa.me/8801XXXXXXXXX"
              target="_blank"
  rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-500 hover:bg-slate-800"
            >
              Talk To Us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}