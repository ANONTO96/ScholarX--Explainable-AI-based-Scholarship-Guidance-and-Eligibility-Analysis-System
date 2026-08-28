import {
    CheckCircle2,
    ChevronRight,
    Cookie,
    Database,
    FileText,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import { Link } from "react-router";

const sections = [
    { id: "overview", label: "Overview" },
    { id: "information", label: "Information We Collect" },
    { id: "usage", label: "How We Use Information" },
    { id: "sharing", label: "Information Sharing" },
    { id: "security", label: "Data Security" },
    { id: "cookies", label: "Cookies & Tracking" },
    { id: "rights", label: "Your Privacy Rights" },
    { id: "retention", label: "Data Retention" },
    { id: "children", label: "Children's Privacy" },
    { id: "changes", label: "Policy Changes" },
    { id: "contact", label: "Contact Us" },
];

const highlights = [
    {
        icon: ShieldCheck,
        title: "Privacy First",
        description:
            "We collect and use information only for legitimate ScholarX services and improvements.",
    },
    {
        icon: LockKeyhole,
        title: "Secure by Design",
        description:
            "We use appropriate technical and organizational measures to protect your information.",
    },
    {
        icon: UserRound,
        title: "You Stay in Control",
        description:
            "You can request access, correction, or deletion of your personal information.",
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

export default function PrivacyPolicy() {
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

                <div className="relative mx-auto max-w-7xl px-6 pt-40 pb-20 lg:px-8 lg:py-24">

                    <div className="max-w-4xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300">
                            <ShieldCheck size={16} />
                            Your privacy matters
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Privacy{" "}
                            <span className="bg-linear-to-r from-sky-300 to-indigo-300 bg-clip-text text-transparent">
                                Policy
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
                            At ScholarX, we believe students should have clear
                            control over their personal information. This policy
                            explains what information we collect, why we use it,
                            and the choices available to you.
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
            {/* PRIVACY HIGHLIGHTS */}
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
                                    Have a privacy question?
                                </p>

                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    Our team is happy to help with privacy
                                    requests.
                                </p>

                                <a
                                    href="mailto:privacy@scholarx.com"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                                >
                                    Contact privacy team
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
                            {/* Overview */}
                            <section id="overview" className="scroll-mt-8">
                                <SectionTitle
                                    number="01"
                                    title="Overview"
                                    description="This Privacy Policy explains how ScholarX handles information when you use our website, applications, scholarship discovery tools, eligibility analysis features, AI-powered guidance, and related services."
                                />

                                <div className="space-y-4 text-[15px] leading-7 text-slate-600">
                                    <p>
                                        ScholarX is an AI-powered scholarship
                                        guidance and eligibility analysis
                                        platform designed to help students
                                        discover educational opportunities,
                                        understand eligibility requirements,
                                        and make more informed decisions.
                                    </p>

                                    <p>
                                        By using ScholarX, you acknowledge that
                                        you have read and understood this
                                        Privacy Policy. If you do not agree
                                        with our practices, please discontinue
                                        use of the services.
                                    </p>

                                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                        <p className="text-sm leading-6 text-amber-900">
                                            <strong>Important:</strong> ScholarX
                                            provides educational guidance and
                                            eligibility insights. Information
                                            shown through our platform should
                                            be independently verified with the
                                            relevant university, scholarship
                                            provider, government authority, or
                                            official institution before making
                                            an application or financial
                                            decision.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Information We Collect */}
                            <section
                                id="information"
                                className="scroll-mt-8"
                            >
                                <SectionTitle
                                    number="02"
                                    title="Information We Collect"
                                    description="We may collect information that you provide directly, information generated through your use of ScholarX, and limited technical information required to operate our services."
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="mb-3 flex items-center gap-2">
                                            <UserRound
                                                size={18}
                                                className="text-sky-600"
                                            />
                                            <h3 className="font-bold text-slate-900">
                                                Account Information
                                            </h3>
                                        </div>

                                        <ul className="space-y-2 text-sm leading-6 text-slate-600">
                                            <li>
                                                • Name and email address
                                            </li>
                                            <li>
                                                • Account credentials and
                                                authentication information
                                            </li>
                                            <li>
                                                • Profile preferences
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Database
                                                size={18}
                                                className="text-sky-600"
                                            />
                                            <h3 className="font-bold text-slate-900">
                                                Academic Information
                                            </h3>
                                        </div>

                                        <ul className="space-y-2 text-sm leading-6 text-slate-600">
                                            <li>
                                                • Academic qualifications
                                            </li>
                                            <li>
                                                • GPA, grades, and study level
                                            </li>
                                            <li>
                                                • Field of study and academic
                                                interests
                                            </li>
                                            <li>
                                                • English-language test
                                                information
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="mb-3 flex items-center gap-2">
                                            <FileText
                                                size={18}
                                                className="text-sky-600"
                                            />
                                            <h3 className="font-bold text-slate-900">
                                                Eligibility Information
                                            </h3>
                                        </div>

                                        <ul className="space-y-2 text-sm leading-6 text-slate-600">
                                            <li>
                                                • Nationality and study
                                                destination
                                            </li>
                                            <li>
                                                • Work experience
                                            </li>
                                            <li>
                                                • Achievements and activities
                                            </li>
                                            <li>
                                                • Research or leadership
                                                experience
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Database
                                                size={18}
                                                className="text-sky-600"
                                            />
                                            <h3 className="font-bold text-slate-900">
                                                Technical Information
                                            </h3>
                                        </div>

                                        <ul className="space-y-2 text-sm leading-6 text-slate-600">
                                            <li>
                                                • Browser and device
                                                information
                                            </li>
                                            <li>
                                                • IP address and general
                                                technical logs
                                            </li>
                                            <li>
                                                • Pages and features accessed
                                            </li>
                                            <li>
                                                • Error and performance data
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Usage */}
                            <section id="usage" className="scroll-mt-8">
                                <SectionTitle
                                    number="03"
                                    title="How We Use Information"
                                    description="ScholarX uses collected information to provide, maintain, personalize, and improve our services."
                                />

                                <div className="space-y-3">
                                    {[
                                        "Create and manage your ScholarX account.",
                                        "Analyze your profile against scholarship and educational opportunity requirements.",
                                        "Provide personalized scholarship recommendations and eligibility insights.",
                                        "Improve the accuracy, usability, and performance of our platform.",
                                        "Communicate with you about your account, services, support requests, or important updates.",
                                        "Detect, investigate, and prevent fraud, abuse, security incidents, or unauthorized activity.",
                                        "Understand general usage patterns so we can improve ScholarX.",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-start gap-3 rounded-xl shadow-sm border border-slate-100 p-4 hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <CheckCircle2
                                                size={18}
                                                className="mt-0.5 shrink-0 text-emerald-500"
                                            />

                                            <p className="text-sm leading-6 text-slate-600">
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Sharing */}
                            <section id="sharing" className="scroll-mt-8">
                                <SectionTitle
                                    number="04"
                                    title="Information Sharing"
                                    description="We do not sell your personal information. Information may be shared only when necessary to operate ScholarX, provide requested services, or comply with applicable obligations."
                                />

                                <div className="space-y-5 text-[15px] leading-7 text-slate-600">
                                    <p>
                                        We may use trusted service providers
                                        that process information on our behalf,
                                        such as infrastructure, authentication,
                                        analytics, communication, or security
                                        providers. These providers are expected
                                        to handle information according to
                                        applicable contractual and security
                                        requirements.
                                    </p>

                                    <p>
                                        We may also disclose information when
                                        reasonably necessary to comply with
                                        legal obligations, enforce our terms,
                                        protect the rights or safety of users,
                                        or investigate security and fraud
                                        incidents.
                                    </p>

                                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                                        <div className="flex gap-3">
                                            <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" />

                                            <div>
                                                <h3 className="font-bold text-emerald-900">
                                                    We do not sell your personal
                                                    information
                                                </h3>

                                                <p className="mt-1 text-sm leading-6 text-emerald-800">
                                                    ScholarX does not sell
                                                    personal information to
                                                    advertisers or data brokers.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Security */}
                            <section id="security" className="scroll-mt-8">
                                <SectionTitle
                                    number="05"
                                    title="Data Security"
                                    description="We take reasonable measures to protect your information from unauthorized access, alteration, disclosure, or destruction."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    Depending on the nature of the information
                                    and the services involved, security
                                    measures may include access controls,
                                    authentication mechanisms, encrypted
                                    connections, secure infrastructure,
                                    monitoring, and regular maintenance of our
                                    systems.
                                </p>

                                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <p className="text-sm leading-6 text-slate-600">
                                        While we take security seriously, no
                                        internet-based service can guarantee
                                        absolute security. You should use a
                                        strong, unique password and avoid
                                        sharing your account credentials with
                                        others.
                                    </p>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Cookies */}
                            <section id="cookies" className="scroll-mt-8">
                                <SectionTitle
                                    number="06"
                                    title="Cookies & Tracking"
                                    description="ScholarX may use cookies and similar technologies to provide essential functionality and understand how users interact with the platform."
                                />

                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-200/50">
                                        <Cookie
                                            size={20}
                                            className="mb-4 h-6 w-6 p-0.5 text-sky-600 rounded-xl bg-sky-100 border border-sky-50 group-hover:text-white group-hover:bg-sky-600 transition-all duration-300"
                                        />
                                        
                                        <h3 className="font-bold text-slate-900">
                                            Essential
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Required for authentication,
                                            security, and core functionality.
                                        </p>
                                    </div>

                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-200/50">
                                        <Database
                                            size={20}
                                            className="mb-4 h-6 w-6 p-0.5 text-sky-600 rounded-xl bg-sky-100 border border-sky-50 group-hover:text-white group-hover:bg-sky-600 transition-all duration-300"
                                        />
                                        <h3 className="font-bold text-slate-900">
                                            Analytics
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Helps us understand platform usage
                                            and improve performance.
                                        </p>
                                    </div>

                                    <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg hover:shadow-slate-200/50">
                                        <UserRound
                                            size={20}
                                            className="mb-4 h-6 w-6 p-0.5 text-sky-600 rounded-xl bg-sky-100 border border-sky-50 group-hover:text-white group-hover:bg-sky-600 transition-all duration-300"
                                        />
                                        <h3 className="font-bold text-slate-900">
                                            Preferences
                                        </h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">
                                            Helps remember selected settings
                                            and preferences.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Rights */}
                            <section id="rights" className="scroll-mt-8">
                                <SectionTitle
                                    number="07"
                                    title="Your Privacy Rights"
                                    description="Depending on your location and applicable law, you may have rights concerning your personal information."
                                />

                                <div className="space-y-3">
                                    {[
                                        [
                                            "Access",
                                            "Request information about the personal data we hold about you.",
                                        ],
                                        [
                                            "Correction",
                                            "Request correction of inaccurate or incomplete information.",
                                        ],
                                        [
                                            "Deletion",
                                            "Request deletion of personal information where legally permitted.",
                                        ],
                                        [
                                            "Restriction",
                                            "Request that certain processing of your information be restricted.",
                                        ],
                                        [
                                            "Objection",
                                            "Object to certain uses of your information where applicable.",
                                        ],
                                    ].map(([title, description]) => (
                                        <div
                                            key={title}
                                            className="rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-xl hover:border-slate-200 hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <h3 className="font-bold text-slate-900">
                                                {title}
                                            </h3>

                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {description}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <p className="mt-5 text-sm leading-6 text-slate-500">
                                    To submit a privacy request, contact us
                                    using the information provided in the
                                    Contact Us section below. We may need to
                                    verify your identity before fulfilling a
                                    request.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Retention */}
                            <section id="retention" className="scroll-mt-8">
                                <SectionTitle
                                    number="08"
                                    title="Data Retention"
                                    description="We retain information only for as long as reasonably necessary for the purposes described in this policy."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    Retention periods may depend on the type of
                                    information, how it is used, legal or
                                    operational requirements, and whether it is
                                    necessary to maintain records related to
                                    security, disputes, or legitimate business
                                    purposes.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Children */}
                            <section id="children" className="scroll-mt-8">
                                <SectionTitle
                                    number="09"
                                    title="Children's Privacy"
                                    description="ScholarX is intended for students and educational users. We do not knowingly collect personal information from children in circumstances where such collection is prohibited by applicable law."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    If you believe a child has provided personal
                                    information to ScholarX without appropriate
                                    authorization, please contact us so that we
                                    can review the situation and take
                                    appropriate action.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Changes */}
                            <section id="changes" className="scroll-mt-8">
                                <SectionTitle
                                    number="10"
                                    title="Policy Changes"
                                    description="We may update this Privacy Policy from time to time."
                                />

                                <p className="text-[15px] leading-7 text-slate-600">
                                    When we make material changes, we may update
                                    the effective date shown at the beginning
                                    of this policy and, where appropriate,
                                    provide additional notice through the
                                    ScholarX platform or other communication
                                    channels.
                                </p>
                            </section>

                            <div className="my-12 border-t border-slate-100" />

                            {/* Contact */}
                            <section id="contact" className="scroll-mt-8">
                                <SectionTitle
                                    number="11"
                                    title="Contact Us"
                                    description="If you have questions about this Privacy Policy, your personal information, or a privacy request, please contact the ScholarX team."
                                />

                                <div className="rounded-2xl bg-slate-950 p-6 sm:p-7">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <Mail
                                                    size={18}
                                                    className="text-sky-400"
                                                />

                                                <h3 className="font-bold text-white">
                                                    Privacy & Support
                                                </h3>
                                            </div>

                                            <p className="mt-2 text-sm leading-6 text-slate-400">
                                                For privacy-related questions
                                                or requests, contact our team.
                                            </p>
                                        </div>

                                        <a
                                            href="mailto:privacy@scholarx.com"
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-sky-400 hover:shadow-lg hover:shadow-sky-500/20"
                                        >
                                            <Mail size={16} />
                                            privacy@scholarx.com
                                        </a>
                                    </div>
                                </div>
                            </section>

                            {/* Bottom notice */}
                            <div className="mt-12 border-t border-slate-100 pt-8">
                                <p className="text-center text-xs leading-5 text-slate-400">
                                    This Privacy Policy is provided for
                                    informational purposes and should be
                                    reviewed and adapted to the actual data
                                    practices, legal requirements, and
                                    operational structure of ScholarX.
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
                                <ShieldCheck size={18} />
                                <span className="text-sm font-bold">
                                    Privacy you can understand
                                </span>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Have questions about your data?
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-400">
                                Our support team can help you understand how
                                ScholarX handles your information.
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