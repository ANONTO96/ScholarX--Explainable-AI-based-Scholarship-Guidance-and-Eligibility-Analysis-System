import {
  ArrowRight,
  CalendarCheck,
  ChartNoAxesColumn,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  FileText,
  GraduationCap,
  Info,
  ListChecks,
  Search,
  Sparkles,
  Target,
  Upload,
  UserCheck,
  X,
  Clock3,
  BrainCircuit,
} from "lucide-react";
import { NavLink } from "react-router";

const LearnMoreAboutWholeProcess = () => {
  const processSteps = [
    {
      number: "01",
      title: "Plan",
      subtitle: "Find the right opportunities",
      description:
        "Discover scholarships that match your academic profile, destination, field of study, budget, and eligibility.",
      icon: CalendarCheck,
      color: "indigo",
    },
    {
      number: "02",
      title: "Track",
      subtitle: "Stay organized",
      description:
        "Keep every scholarship, deadline, document, and application status organized in one place.",
      icon: ChartNoAxesColumn,
      color: "blue",
    },
    {
      number: "03",
      title: "Submit",
      subtitle: "Apply with confidence",
      description:
        "Complete your requirements, verify your documents, and submit your applications before deadlines.",
      icon: FileCheck2,
      color: "emerald",
    },
  ];

  const planSteps = [
    {
      icon: Search,
      title: "Explore scholarships",
      description:
        "Browse scholarships based on your study destination, degree level, subject, and preferences.",
    },
    {
      icon: UserCheck,
      title: "Build your profile",
      description:
        "Add your academic background, test scores, interests, budget, and study preferences.",
    },
    {
      icon: BrainCircuit,
      title: "Analyze eligibility",
      description:
        "ScholarX compares your profile against scholarship requirements and identifies your strongest matches.",
    },
    {
      icon: Target,
      title: "Prioritize opportunities",
      description:
        "Focus on scholarships where your profile has the strongest potential instead of applying randomly.",
    },
  ];

  const trackSteps = [
    {
      icon: CalendarCheck,
      title: "Save deadlines",
      description:
        "Keep track of application deadlines so important opportunities never slip through the cracks.",
    },
    {
      icon: FileText,
      title: "Organize documents",
      description:
        "Know which documents are required for each scholarship and monitor what you have already prepared.",
    },
    {
      icon: Clock3,
      title: "Monitor progress",
      description:
        "Track every application from initial research through document preparation and submission.",
    },
    {
      icon: ListChecks,
      title: "Follow your action list",
      description:
        "Use your dashboard to understand what needs attention next and keep your application process moving.",
    },
  ];

  const submitSteps = [
    {
      icon: ClipboardCheck,
      title: "Review requirements",
      description:
        "Check eligibility rules, required documents, deadlines, academic conditions, and other scholarship criteria.",
    },
    {
      icon: Upload,
      title: "Prepare documents",
      description:
        "Gather transcripts, certificates, recommendation letters, statements, test scores, and other required materials.",
    },
    {
      icon: CheckCircle2,
      title: "Complete your checklist",
      description:
        "Verify that every required item is ready before submitting your application.",
    },
    {
      icon: FileCheck2,
      title: "Submit on time",
      description:
        "Complete the final application process and submit before the scholarship deadline.",
    },
  ];

  const mistakes = [
    "Applying without checking the complete eligibility requirements",
    "Missing application deadlines",
    "Preparing documents at the last minute",
    "Applying to scholarships that do not match your profile",
    "Forgetting required documents or application steps",
  ];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* ========================================================= */}
      {/* HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950">
        {/* Background decoration */}
<div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

<div className="absolute -bottom-48 -right-32 h-125 w-125 rounded-full bg-sky-600/20 blur-3xl" />

<div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(14,165,233,0.14),transparent_32%)]" />

{/* Subtle center glow */}
<div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/5 blur-3xl" />

{/* background frame */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 lg:px-8">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-medium text-slate-300">
              <Sparkles className="h-4 w-4 text-sky-400" />
              How ScholarX Works
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              From finding scholarships to{" "}
              <span className="text-indigo-400">submitting with confidence.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              ScholarX turns the scholarship application process into a
              structured journey. Discover opportunities, understand your
              eligibility, organize your applications, and submit without
              losing track of what matters.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <NavLink
                to="/eligibility-analysis"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-500"
              >
                Start Planning
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </NavLink>

              <a
                href="#process"
                className="group inline-flex items-center gap-2 rounded-xl text-white border border-white/30 bg-white/10 px-6 py-3.5 font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                Explore the Process
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Hero process cards */}
<div className="mt-16 grid items-stretch gap-6 md:grid-cols-3">
  {processSteps.map((step, index) => {
    const Icon = step.icon;

    return (
      <div key={step.title} className="relative flex h-full">
        <div
          className="
            group flex h-full w-full flex-col
            rounded-2xl
            border border-white/10
            bg-white/4
            p-6
            backdrop-blur-sm
            transition-all duration-300
            hover:-translate-y-2
            hover:border-indigo-400/30
            hover:bg-white/6
            hover:shadow-2xl
            hover:shadow-indigo-950/20
          "
        >
          {/* Top */}
          <div className="flex items-start justify-between">
            <div
              className="
                flex h-11 w-11 items-center justify-center
                rounded-xl
                bg-indigo-500/10
                text-indigo-400
                transition-all duration-300
                group-hover:bg-indigo-500/20
                group-hover:text-indigo-300
              "
            >
              <Icon className="h-5 w-5" />
            </div>

            <span className="text-sm font-semibold text-slate-500">
              {step.number}
            </span>
          </div>

          {/* Content */}
          <div className="mt-5">
            <h3 className="text-xl font-semibold text-white">
              {step.title}
            </h3>

            <p className="mt-1 text-sm font-medium text-indigo-300">
              {step.subtitle}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {step.description}
            </p>
          </div>

          {/* Bottom accent */}
          <div className="mt-auto pt-6">
            <div className="h-px w-full bg-white/5 transition-colors duration-300 group-hover:bg-indigo-400/20" />

            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              ScholarX Process
            </div>
          </div>
        </div>

        {/* Connector */}
        {index < processSteps.length - 1 && (
          <div className="absolute -right-6 top-1/2 z-20 hidden -translate-y-1/2 md:block">
            <div className="flex h-6 w-6 items-center justify-center">
              <ChevronRight className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
        )}
      </div>
    );
  })}
</div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTRO */}
      {/* ========================================================= */}

      <section id="process" className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              The ScholarX Journey
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              One process. Three simple stages.
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Scholarship applications can become overwhelming when
              opportunities, deadlines, requirements, and documents are spread
              across different places. ScholarX brings the entire journey
              together.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {processSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-3xl font-bold text-slate-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium text-indigo-600">
                    {step.subtitle}
                  </p>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PLAN */}
      {/* ========================================================= */}

      <section className="border-y border-slate-200 bg-slate-50 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Left */}
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                <CalendarCheck className="h-6 w-6" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
                Stage 01
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Plan your scholarship journey
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                Planning starts with understanding what opportunities are
                actually suitable for you. Instead of searching blindly,
                ScholarX helps you narrow down scholarships based on your
                profile and goals.
              </p>

              <NavLink
                to="/eligibility-analysis"
                className="group mt-7 inline-flex items-center gap-2 font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                Start with Eligibility Analysis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </NavLink>
            </div>

            {/* Right */}
            <div className="grid gap-4 sm:grid-cols-2">
              {planSteps.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:text-white group-hover:bg-indigo-600 transition-all">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-semibold text-slate-300 rounded-md p-0.5 group-hover:text-white group-hover:bg-indigo-600 transition-all">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-5 font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* PLAN FLOW */}
      {/* ========================================================= */}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-8 lg:p-10">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Info className="h-5 w-5" />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  What happens during planning?
                </h3>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  You start by creating a clear student profile. ScholarX then
                  uses your information to evaluate scholarship requirements
                  and help you understand which opportunities deserve your
                  attention.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                "Create your student profile",
                "Explore matching scholarships",
                "Analyze eligibility",
                "Identify missing requirements",
                "Prioritize the strongest opportunities",
                "Create your application plan",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 border border-indigo-50 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-100"
                >
                  <Check className="h-4 w-4 shrink-0 text-indigo-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TRACK */}
      {/* ========================================================= */}

      <section className="bg-slate-950 py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Cards */}
            <div className="order-2 lg:order-1 grid gap-4 sm:grid-cols-2">
              {trackSteps.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-sm
            transition-all duration-300
            hover:-translate-y-2
            hover:border-blue-400/30
            hover:bg-white/6
            hover:shadow-2xl
            hover:shadow-blue-950/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition-all duration-300
                group-hover:bg-blue-500/20
                group-hover:text-blue-300">
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-sm font-semibold text-slate-600 group-hover:bg-blue-500/20
                group-hover:text-blue-300 p-0.5 rounded-md">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mt-5 font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                <ChartNoAxesColumn className="h-6 w-6" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                Stage 02
              </p>

              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                Track everything in one place
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-400">
                Once you have identified the scholarships you want to pursue,
                organization becomes the priority. ScholarX helps you keep
                track of applications, deadlines, documents, and progress from
                one dashboard.
              </p>

              <NavLink
                to="/dashboard"
                className="group mt-7 inline-flex items-center gap-2 font-semibold text-blue-400 transition hover:text-blue-300"
              >
                Open Your Dashboard
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </NavLink>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* TRACK CHECKLIST */}
      {/* ========================================================= */}

      <section className="bg-slate-950 pb-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-white/4 p-8 lg:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ListChecks className="h-5 w-5" />
              </div>

              <h3 className="font-semibold text-white">
                Your tracking checklist
              </h3>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Scholarship saved",
                "Deadline recorded",
                "Eligibility reviewed",
                "Documents prepared",
                "Application started",
                "Application submitted",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-300 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-white/20"
                >
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SUBMIT */}
      {/* ========================================================= */}

      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Content */}
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
                <FileCheck2 className="h-6 w-6" />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Stage 03
              </p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Submit with confidence
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-600">
                The final stage is about making sure nothing has been missed.
                Review your requirements, prepare your documents, complete
                your checklist, and submit before the deadline.
              </p>

              <NavLink
                to="/aiChatBot"
                className="group mt-7 inline-flex items-center gap-2 font-semibold text-emerald-600 transition hover:text-emerald-700"
              >
                Get Submission Assistance
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </NavLink>
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {submitSteps.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="group flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600">
                          STEP {index + 1}
                        </span>

                        <h3 className="font-semibold text-slate-900">
                          {item.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
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
      {/* WHAT TO PREPARE */}
      {/* ========================================================= */}

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Before You Start
            </span>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Prepare the basics
            </h2>

            <p className="mt-4 text-slate-600">
              Having your information ready makes the ScholarX process faster
              and more accurate.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: GraduationCap,
                title: "Academic Profile",
                text: "Grades, degree, institution and academic background.",
              },
              {
                icon: FileText,
                title: "Documents",
                text: "Transcripts, certificates and other supporting documents.",
              },
              {
                icon: Target,
                title: "Study Goals",
                text: "Preferred countries, programs and career direction.",
              },
              {
                icon: ClipboardCheck,
                title: "Application Details",
                text: "Test scores, experience and scholarship-specific information.",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-100"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:text-white group-hover:bg-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* COMMON MISTAKES */}
      {/* ========================================================= */}

      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                Avoid Common Problems
              </span>

              <h2 className="mt-4 text-3xl font-bold text-slate-900">
                A good application starts with good preparation.
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                Many scholarship applications fail because of avoidable
                mistakes rather than a lack of potential.
              </p>
            </div>

            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
              <div className="space-y-3">
                {mistakes.map((mistake) => (
                  <div
                    key={mistake}
                    className="flex items-start gap-3 rounded-xl shadow-sm border border-red-50 bg-white px-4 py-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-red-100"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span className="text-sm text-slate-700">{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* COMPLETE FLOW */}
      {/* ========================================================= */}

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
              Complete Workflow
            </span>

            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Your scholarship journey at a glance
            </h2>
          </div>

          <div className="relative mt-14">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 hidden h-0.5 w-[calc(100%-3rem)] bg-slate-200 md:block" />

            <div className="relative grid gap-10 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Plan",
                  text: "Discover and analyze opportunities that match your profile.",
                  icon: CalendarCheck,
                },
                {
                  number: "02",
                  title: "Track",
                  text: "Organize deadlines, documents and application progress.",
                  icon: ChartNoAxesColumn,
                },
                {
                  number: "03",
                  title: "Submit",
                  text: "Complete every requirement and submit before the deadline.",
                  icon: FileCheck2,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="text-center">
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-slate-50 bg-indigo-600 text-white shadow-lg">
                      <Icon className="h-6 w-6" />
                    </div>

                    <span className="mt-5 block text-xs font-bold tracking-widest text-indigo-600">
                      {item.number}
                    </span>

                    <h3 className="mt-2 text-xl font-semibold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FINAL CTA */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden bg-slate-950 py-20">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
            <Sparkles className="h-6 w-6" />
          </div>

          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Ready to start your scholarship journey?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
            Stop searching, tracking, and preparing applications manually.
            Let ScholarX guide you through the process from planning to
            submission.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <NavLink
              to="/eligibility-analysis"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-indigo-500"
            >
              Start with ScholarX
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </NavLink>

            <NavLink
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3.5 font-semibold text-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-500 hover:bg-slate-800"
            >
              Go to Dashboard
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LearnMoreAboutWholeProcess;