import {
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    FileCheck2,
    FileText,
    Gavel,
    LockKeyhole,
    Mail,
    Scale,
    ShieldCheck,
    UserCheck,
    XCircle,
} from "lucide-react";
import { Link } from "react-router";

const sections = [
    { id: "acceptance", label: "Acceptance of Terms" },
    { id: "services", label: "Our Services" },
    { id: "accounts", label: "User Accounts" },
    { id: "eligibility", label: "Eligibility Analysis" },
    { id: "ai", label: "AI-Powered Features" },
    { id: "scholarship", label: "Scholarship Information" },
    { id: "subscriptions", label: "Subscriptions & Payments" },
    { id: "acceptable-use", label: "Acceptable Use" },
    { id: "intellectual-property", label: "Intellectual Property" },
    { id: "third-party", label: "Third-Party Services" },
    { id: "disclaimer", label: "Disclaimers" },
    { id: "limitation", label: "Limitation of Liability" },
    { id: "termination", label: "Termination" },
    { id: "changes", label: "Changes to Terms" },
    { id: "contact", label: "Contact Us" },
];

const highlights = [
    {
        icon: FileCheck2,
        title: "Use Responsibly",
        description:
            "Use ScholarX honestly and provide accurate information when creating your profile.",
    },
    {
        icon: Scale,
        title: "Guidance, Not Guarantees",
        description:
            "ScholarX provides educational guidance and does not guarantee admission or scholarship awards.",
    },
    {
        icon: ShieldCheck,
        title: "Your Responsibility",
        description:
            "Always verify requirements, deadlines, and application information with official sources.",
    },
];

function SectionTitle({ number, title, description }) {
    return (
        <div className="mb-6">
            <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-50 text-xs font-bold text-sky-600">
                    {number}
                </span>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                    {title}
                </h2>
            </div>

            {description && (
                <p className="max-w-3xl text-[15px] leading-7 text-slate-600">
                    {description}
                </p>
            )}
        </div>
    );
}

function InfoCard({ icon: Icon, title, description }) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-200/50">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-colors duration-300 group-hover:bg-sky-600 group-hover:text-white">
                <Icon size={20} />
            </div>

            <h3 className="mb-2 font-bold text-slate-900">
                {title}
            </h3>

            <p className="text-sm leading-6 text-slate-600">
                {description}
            </p>
        </div>
    );
}

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}
            <section className="relative overflow-hidden bg-slate-950">
                {/* Decorative background */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

                    <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div
                        className="absolute inset-0 opacity-[0.035]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
                            backgroundSize: "42px 42px",
                        }}
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 lg:px-8">

                    <div className="max-w-4xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
                            <FileText size={16} />
                            Terms & conditions
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Terms of{" "}
                            <span className="bg-linear-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
                                Service
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                            These terms explain the rules for using ScholarX,
                            including our scholarship discovery tools,
                            eligibility analysis, AI-powered guidance, and
                            related services.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                            <span>
                                Effective date:{" "}
                                <strong className="text-slate-300">
                                    August 28, 2026
                                </strong>
                            </span>

                            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />

                            <span>
                                Last updated:{" "}
                                <strong className="text-slate-300">
                                    August 28, 2026
                                </strong>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* HIGHLIGHTS */}
            {/* ========================================================= */}
            <section className="relative z-10 -mt-8">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-3">
                        {highlights.map((item) => (
                            <InfoCard
                                key={item.title}
                                icon={item.icon}
                                title={item.title}
                                description={item.description}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* CONTENT */}
            {/* ========================================================= */}
            <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
                    {/* ================================================= */}
                    {/* SIDEBAR */}
                    {/* ================================================= */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-8">
                            <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                                On this page
                            </p>

                            <nav className="space-y-1">
                                {sections.map((section) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-white hover:text-sky-600 hover:shadow-sm"
                                    >
                                        <span>{section.label}</span>

                                        <ChevronRight
                                            size={14}
                                            className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                                        />
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-4">
                                <Mail
                                    size={18}
                                    className="mb-3 text-sky-600"
                                />

                                <p className="text-sm font-bold text-slate-900">
                                    Questions about our terms?
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    Contact the ScholarX team if you need
                                    clarification.
                                </p>

                                <a
                                    href="mailto:legal@scholarx.com"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                                >
                                    Contact us
                                    <ChevronRight size={13} />
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* ================================================= */}
                    {/* DOCUMENT */}
                    {/* ================================================= */}
                    <article className="min-w-0">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-12">
                            {/* ================================================= */}
                            {/* 01 ACCEPTANCE */}
                            {/* ================================================= */}
                            <section
                                id="acceptance"
                                className="scroll-mt-8"
                            >
                                <SectionTitle
                                    number="01"
                                    title="Acceptance of Terms"
                                    description="By accessing or using ScholarX, you agree to comply with these Terms of Service."
                                />

                                <div className="space-y-4 text-[15px] leading-7 text-slate-600">
                                    <p>
                                        These Terms of Service ("Terms") govern
                                        your access to and use of the ScholarX
                                        website, applications, features, and
                                        services.
                                    </p>

                                    <p>
                                        By creating an account, accessing the
                                        platform, or using any ScholarX
                                        service, you acknowledge that you have
                                        read, understood, and agree to be bound
                                        by these Terms.
                                    </p>

                                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" />

                                            <p className="text-sm leading-6 text-amber-900">
                                                If you do not agree to these
                                                Terms, you should not access or
                                                use ScholarX.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 02 SERVICES */}
                            {/* ================================================= */}
                            <section id="services" className="scroll-mt-8">
                                <SectionTitle
                                    number="02"
                                    title="Our Services"
                                    description="ScholarX provides technology-enabled educational guidance and scholarship discovery services."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    ScholarX may provide features including
                                    scholarship discovery, educational
                                    opportunity browsing, student profile
                                    management, eligibility analysis,
                                    personalized recommendations, AI-powered
                                    guidance, application planning, and related
                                    educational resources.
                                </p>

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {[
                                        "Scholarship discovery",
                                        "Eligibility analysis",
                                        "Student profile management",
                                        "Personalized recommendations",
                                        "AI-powered educational guidance",
                                        "Application planning tools",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center gap-3 rounded-xl border border-slate-100 p-4 shadow-sm hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <CheckCircle2
                                                size={17}
                                                className="shrink-0 text-emerald-500"
                                            />

                                            <span className="text-sm font-medium text-slate-700">
                                                {item}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 03 ACCOUNTS */}
                            {/* ================================================= */}
                            <section id="accounts" className="scroll-mt-8">
                                <SectionTitle
                                    number="03"
                                    title="User Accounts"
                                    description="Some ScholarX features may require you to create an account."
                                />

                                <div className="space-y-5 text-[15px] leading-7 text-slate-600">
                                    <p>
                                        You are responsible for providing
                                        accurate and reasonably up-to-date
                                        information when creating and managing
                                        your account.
                                    </p>

                                    <p>
                                        You are responsible for maintaining the
                                        confidentiality of your login
                                        credentials and for activity conducted
                                        through your account.
                                    </p>

                                    <p>
                                        You should notify ScholarX promptly if
                                        you believe your account has been
                                        accessed without authorization.
                                    </p>
                                </div>

                                <div className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-5">
                                    <div className="flex gap-3">
                                        <UserCheck className="mt-0.5 shrink-0 text-sky-600" />

                                        <div>
                                            <h3 className="font-bold text-slate-900">
                                                Keep your information accurate
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                Eligibility recommendations are
                                                only as useful as the
                                                information provided in your
                                                profile.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 04 ELIGIBILITY */}
                            {/* ================================================= */}
                            <section id="eligibility" className="scroll-mt-8">
                                <SectionTitle
                                    number="04"
                                    title="Eligibility Analysis"
                                    description="ScholarX may compare information in your student profile against available scholarship or educational opportunity requirements."
                                />

                                <div className="space-y-4 text-[15px] leading-7 text-slate-600">
                                    <p>
                                        Eligibility results may be generated
                                        using rules, criteria, profile
                                        information, scholarship data, and
                                        other factors available to ScholarX.
                                    </p>

                                    <p>
                                        Results may be categorized or presented
                                        as eligible, potentially eligible,
                                        requiring review, or not eligible.
                                    </p>

                                    <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="mt-0.5 shrink-0 text-rose-500" />

                                            <div>
                                                <h3 className="font-bold text-rose-900">
                                                    Eligibility results are not
                                                    guarantees
                                                </h3>

                                                <p className="mt-1 text-sm leading-6 text-rose-800">
                                                    A ScholarX eligibility
                                                    result does not constitute
                                                    an admission decision,
                                                    scholarship award, visa
                                                    decision, or official
                                                    determination by a
                                                    university or scholarship
                                                    provider.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 05 AI */}
                            {/* ================================================= */}
                            <section id="ai" className="scroll-mt-8">
                                <SectionTitle
                                    number="05"
                                    title="AI-Powered Features"
                                    description="ScholarX may use artificial intelligence, machine learning, natural language processing, or automated rules to provide educational guidance."
                                />

                                <div className="space-y-4 text-[15px] leading-7 text-slate-600">
                                    <p>
                                        AI-generated recommendations and
                                        explanations are provided to assist
                                        your research and decision-making.
                                    </p>

                                    <p>
                                        AI systems can produce inaccurate,
                                        incomplete, outdated, or inappropriate
                                        information. You should independently
                                        verify important information before
                                        relying on it.
                                    </p>

                                    <p>
                                        You should not treat AI-generated
                                        information as professional legal,
                                        immigration, financial, academic
                                        admission, or other professional
                                        advice.
                                    </p>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 06 SCHOLARSHIP INFORMATION */}
                            {/* ================================================= */}
                            <section id="scholarship" className="scroll-mt-8">
                                <SectionTitle
                                    number="06"
                                    title="Scholarship Information"
                                    description="Scholarship and educational opportunity information may come from universities, organizations, government sources, public websites, or other data sources."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    Although we aim to provide useful and
                                    accurate information, ScholarX does not
                                    guarantee that scholarship requirements,
                                    deadlines, funding amounts, eligibility
                                    criteria, application links, or other
                                    information will always be complete,
                                    accurate, or current.
                                </p>

                                <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                                    <h3 className="font-bold text-slate-900">
                                        Always verify with the official source
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        Before submitting an application, verify
                                        all requirements, deadlines, documents,
                                        fees, funding conditions, and
                                        application procedures directly with
                                        the relevant institution or scholarship
                                        provider.
                                    </p>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 07 SUBSCRIPTIONS */}
                            {/* ================================================= */}
                            <section id="subscriptions" className="scroll-mt-8">
                                <SectionTitle
                                    number="07"
                                    title="Subscriptions & Payments"
                                    description="Certain ScholarX features may be offered through free or paid plans."
                                />

                                <div className="space-y-4 text-[15px] leading-7 text-slate-600">
                                    <p>
                                        Where paid plans are available, pricing
                                        and included features will be
                                        displayed before purchase.
                                    </p>

                                    <p>
                                        You agree to provide accurate billing
                                        information and authorize the
                                        applicable payment provider to process
                                        charges associated with your selected
                                        plan.
                                    </p>

                                    <p>
                                        Subscription terms, renewal policies,
                                        refunds, cancellations, taxes, and
                                        payment processing conditions may vary
                                        depending on the plan and payment
                                        method.
                                    </p>
                                </div>

                                <div className="mt-5 rounded-2xl border border-slate-200 p-5">
                                    <h3 className="font-bold text-slate-900">
                                        Free access
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                        ScholarX may offer certain features at
                                        no cost. We reserve the right to
                                        modify, limit, or discontinue free
                                        features at any time, subject to
                                        applicable law.
                                    </p>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 08 ACCEPTABLE USE */}
                            {/* ================================================= */}
                            <section id="acceptable-use" className="scroll-mt-8">
                                <SectionTitle
                                    number="08"
                                    title="Acceptable Use"
                                    description="You agree to use ScholarX lawfully and responsibly."
                                />

                                <div className="space-y-3">
                                    {[
                                        "Provide accurate information when using ScholarX.",
                                        "Use the platform only for legitimate educational and scholarship-related purposes.",
                                        "Do not attempt to gain unauthorized access to accounts, systems, or data.",
                                        "Do not interfere with or disrupt the operation of the platform.",
                                        "Do not use automated methods to abuse, scrape, overload, or circumvent platform restrictions.",
                                        "Do not upload malicious software, harmful code, or content intended to compromise our systems.",
                                        "Do not impersonate another person or misrepresent your affiliation with an institution.",
                                        "Do not use ScholarX to violate applicable laws or third-party rights.",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-start gap-3 rounded-xl border border-slate-100 p-4 shadow-sm hover:border-red-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <XCircle
                                                size={18}
                                                className="mt-0.5 shrink-0 text-rose-400"
                                            />

                                            <p className="text-sm leading-6 text-slate-600">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 09 INTELLECTUAL PROPERTY */}
                            {/* ================================================= */}
                            <section
                                id="intellectual-property"
                                className="scroll-mt-8"
                            >
                                <SectionTitle
                                    number="09"
                                    title="Intellectual Property"
                                    description="ScholarX and its underlying technology, branding, design, software, and original content are protected by applicable intellectual property laws."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    Unless otherwise stated, ScholarX owns or
                                    has appropriate rights to the platform's
                                    software, interface design, trademarks,
                                    logos, graphics, original text, and other
                                    proprietary materials.
                                </p>

                                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                                    You may use ScholarX content for personal,
                                    non-commercial educational purposes in
                                    accordance with these Terms. You may not
                                    reproduce, distribute, modify, sell, or
                                    commercially exploit proprietary ScholarX
                                    materials without appropriate permission.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 10 THIRD PARTY */}
                            {/* ================================================= */}
                            <section id="third-party" className="scroll-mt-8">
                                <SectionTitle
                                    number="10"
                                    title="Third-Party Services"
                                    description="ScholarX may integrate with or link to services operated by third parties."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    Third-party services may include
                                    authentication providers, payment
                                    processors, analytics services, cloud
                                    infrastructure, communication platforms,
                                    universities, scholarship providers, and
                                    external websites.
                                </p>

                                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                                    Third-party services are governed by their
                                    own terms and privacy policies. ScholarX
                                    does not control and is not responsible for
                                    the availability, accuracy, security, or
                                    practices of independent third-party
                                    services.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 11 DISCLAIMER */}
                            {/* ================================================= */}
                            <section id="disclaimer" className="scroll-mt-8">
                                <SectionTitle
                                    number="11"
                                    title="Disclaimers"
                                    description="ScholarX is an educational technology platform and should not be treated as an official decision-making authority."
                                />

                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                                    <div className="flex gap-4">
                                        <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" />

                                        <div className="space-y-4 text-sm leading-6 text-amber-900">
                                            <p>
                                                ScholarX does not guarantee
                                                admission to any university,
                                                receipt of any scholarship,
                                                approval of a visa, or any
                                                other educational outcome.
                                            </p>

                                            <p>
                                                Information available through
                                                ScholarX may change without
                                                notice. Scholarship providers
                                                and educational institutions
                                                may change eligibility
                                                criteria, deadlines, funding,
                                                or application procedures.
                                            </p>

                                            <p>
                                                You are responsible for
                                                verifying important information
                                                with the relevant official
                                                institution before taking
                                                action.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 12 LIMITATION */}
                            {/* ================================================= */}
                            <section id="limitation" className="scroll-mt-8">
                                <SectionTitle
                                    number="12"
                                    title="Limitation of Liability"
                                    description="To the extent permitted by applicable law, ScholarX is not responsible for losses arising from reliance on information or services provided through the platform."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    This includes, where legally permitted,
                                    losses arising from inaccurate or outdated
                                    scholarship information, missed deadlines,
                                    eligibility decisions, admission outcomes,
                                    application outcomes, service
                                    interruptions, third-party services, or
                                    reliance on AI-generated information.
                                </p>

                                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                                    Nothing in these Terms is intended to
                                    exclude or limit liability where doing so
                                    would be prohibited by applicable law.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 13 TERMINATION */}
                            {/* ================================================= */}
                            <section id="termination" className="scroll-mt-8">
                                <SectionTitle
                                    number="13"
                                    title="Termination"
                                    description="You may stop using ScholarX at any time."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    ScholarX may suspend or terminate access to
                                    an account or service where reasonably
                                    necessary, including in cases of suspected
                                    abuse, security risks, violations of these
                                    Terms, or legal requirements.
                                </p>

                                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                                    Where appropriate, we may provide notice
                                    before taking action. Certain provisions of
                                    these Terms may continue to apply after
                                    termination where their nature requires
                                    continued effect.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 14 CHANGES */}
                            {/* ================================================= */}
                            <section id="changes" className="scroll-mt-8">
                                <SectionTitle
                                    number="14"
                                    title="Changes to Terms"
                                    description="We may update these Terms from time to time as ScholarX evolves."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    When changes are made, we may update the
                                    effective date displayed at the beginning
                                    of this page. Material changes may also be
                                    communicated through the ScholarX platform
                                    or other appropriate channels.
                                </p>

                                <p className="mt-4 text-[15px] leading-7 text-slate-600">
                                    Continued use of ScholarX after updated
                                    Terms become effective constitutes
                                    acceptance of the revised Terms, to the
                                    extent permitted by applicable law.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* ================================================= */}
                            {/* 15 CONTACT */}
                            {/* ================================================= */}
                            <section id="contact" className="scroll-mt-8">
                                <SectionTitle
                                    number="15"
                                    title="Contact Us"
                                    description="If you have questions about these Terms or need clarification about ScholarX services, contact our team."
                                />

                                <div className="rounded-2xl bg-slate-950 p-6 sm:p-7">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Gavel
                                                    size={18}
                                                    className="text-sky-400"
                                                />

                                                <h3 className="font-bold text-white">
                                                    Legal & Support
                                                </h3>
                                            </div>

                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                Questions about these Terms?
                                                Our team is here to help.
                                            </p>
                                        </div>

                                        <a
                                            href="mailto:legal@scholarx.com"
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20"
                                        >
                                            <Mail size={16} />
                                            legal@scholarx.com
                                        </a>
                                    </div>
                                </div>
                            </section>

                            {/* ================================================= */}
                            {/* FINAL NOTE */}
                            {/* ================================================= */}
                            <div className="mt-12 border-t border-slate-100 pt-8">
                                <p className="text-center text-xs leading-5 text-slate-400">
                                    These Terms of Service are provided as a
                                    product-oriented starting point and should
                                    be reviewed by a qualified legal
                                    professional before being adopted as the
                                    final terms governing ScholarX.
                                </p>
                            </div>
                        </div>
                    </article>
                </div>
            </section>

            {/* ========================================================= */}
            {/* FINAL CTA */}
            {/* ========================================================= */}
            <section className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                    <div className="flex flex-col gap-6 rounded-3xl bg-slate-950 p-7 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-xl">
                            <div className="mb-3 flex items-center gap-2 text-sky-400">
                                <LockKeyhole size={18} />

                                <span className="text-sm font-bold">
                                    Need assistance?
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Have a question about ScholarX?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Visit our support center if you need help with
                                your account, services, or platform features.
                            </p>
                        </div>

                        <Link
                            to="/support"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition-all hover:bg-slate-100"
                        >
                            Visit Support
                            <ChevronRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}