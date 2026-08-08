import { useParams, NavLink } from "react-router";
import { countries } from "../data/countries";
import { BadgeCheck, CalendarCheck, Sparkles } from "lucide-react";

const CountryDetails = () => {
    const { slug } = useParams();

    const country = countries.find(
        (item) => item.slug === slug
    );

    if (!country) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">
                        Country Not Found
                    </h1>

                    <p className="mt-3 text-slate-500">
                        The destination you're looking for doesn't exist.
                    </p>

                    <NavLink
                        to="/countries"
                        className="inline-block mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold"
                    >
                        Explore Countries
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
            </div>
            {/* country content */}
            <section className="relative overflow-hidden">
                <img
                    src={country.image}
                    alt={country.name}
                    className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/70 to-slate-900/30" />

                <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
                    <div className="max-w-3xl text-white">

                        <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                            Study Abroad Destination
                        </span>

                        <h1 className="mt-6 text-5xl font-bold tracking-tight lg:text-7xl">
                            Study in {country.name}
                        </h1>

                        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                            {country.tagline}
                        </p>

                        <p className="mt-5 max-w-2xl leading-7 text-slate-300">
                            {country.overview}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <NavLink
                                to="/eligibility"
                                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-700 transition-all duration-300 hover:-translate-y-2"
                            >
                                Check My Eligibility
                            </NavLink>

                            <a
                                href="#universities"
                                className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
                            >
                                Explore Universities
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* facts bar */}
            <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-6">
                <div className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-4">

                    <div className="p-6 text-center">
                        <p className="text-sm text-slate-500">
                            Tuition
                        </p>

                        <p className="mt-2 font-bold text-slate-900">
                            {country.tuition.bachelors}
                        </p>
                    </div>

                    <div className="border-slate-200 p-6 text-center md:border-l">
                        <p className="text-sm text-slate-500">
                            Main Intakes
                        </p>

                        <p className="mt-2 font-bold text-slate-900">
                            {country.intakes.join(" • ")}
                        </p>
                    </div>

                    <div className="border-slate-200 p-6 text-center md:border-l">
                        <p className="text-sm text-slate-500">
                            Student Work
                        </p>

                        <p className="mt-2 font-bold text-slate-900">
                            {country.workRights}
                        </p>
                    </div>

                    <div className="border-slate-200 p-6 text-center md:border-l">
                        <p className="text-sm text-slate-500">
                            Popular Fields
                        </p>

                        <p className="mt-2 font-bold text-slate-900">
                            {country.topFields.length}+
                        </p>
                    </div>

                </div>
            </section>

            {/* opportunities */}
            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                        Why choose {country.name}?
                    </span>

                    <h2 className="mt-3 text-4xl font-bold tracking-tight">
                        Is {country.name} the right destination for you?
                    </h2>

                    <p className="mt-4 text-slate-600">
                        Before choosing a destination, consider education quality,
                        affordability, career opportunities and your long-term goals.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">

                    {country.pros.map((item) => (
                        <div
                            key={item}
                            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-6"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                ✓
                            </div>

                            <p className="font-medium text-slate-800">
                                {item}
                            </p>
                        </div>
                    ))}

                </div>
            </section>

            {/* tuition fee */}
            <section className="bg-slate-50 py-20">
                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-2xl">
                        <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
                            Cost of studying
                        </span>

                        <h2 className="mt-3 text-4xl font-bold">
                            Understand your potential budget
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Bachelor's Tuition
                            </p>

                            <p className="mt-3 text-2xl font-bold">
                                {country.tuition.bachelors}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Per year
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Master's Tuition
                            </p>

                            <p className="mt-3 text-2xl font-bold">
                                {country.tuition.masters}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Per year
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Monthly Living Cost
                            </p>

                            <p className="mt-3 text-2xl font-bold">
                                {country.livingCost.monthly}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Accommodation
                            </p>

                            <p className="mt-3 text-2xl font-bold">
                                {country.livingCost.accommodation}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Per month
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* admission requirements */}
            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid gap-12 lg:grid-cols-2">

                    <div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-violet-600">
                            Admission
                        </span>

                        <h2 className="mt-3 text-4xl font-bold">
                            What do you need to study here?
                        </h2>

                        <p className="mt-5 leading-7 text-slate-600">
                            Requirements vary by university and program, but these
                            are some of the common requirements students should
                            prepare for.
                        </p>
                    </div>

                    <div className="space-y-4">

                        <div className="rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold">
                                Academic Requirements
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {country.admission.academic}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold">
                                English Requirements
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {country.admission.english}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 p-6">
                            <h3 className="font-bold">
                                Required Documents
                            </h3>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {country.admission.documents.map((document) => (
                                    <span
                                        key={document}
                                        className="rounded-full bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                                    >
                                        {document}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

            </section>

            {/* top universities info */}
            <section
                id="universities"
                className="bg-slate-50 py-20"
            >
                <div className="mx-auto max-w-7xl px-6">

                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

                        <div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Universities
                            </span>

                            <h2 className="mt-3 text-4xl font-bold">
                                Top universities in {country.name}
                            </h2>
                        </div>

                        <button className="font-semibold text-blue-600">
                            View all universities →
                        </button>

                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-2">

                        {country.universities.map((university) => (
                            <div
                                key={university.name}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            {university.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {university.location}
                                        </p>
                                    </div>

                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {university.ranking}
                                    </span>

                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Tuition
                                        </p>

                                        <p className="mt-1 font-semibold">
                                            {university.tuition}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Popular Programs
                                        </p>

                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {university.popularPrograms.map(
                                                (program) => (
                                                    <span
                                                        key={program}
                                                        className="text-xs text-slate-700"
                                                    >
                                                        {program}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* scholarship info */}
            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                        Funding opportunities
                    </span>

                    <h2 className="mt-3 text-4xl font-bold">
                        Scholarships for international students
                    </h2>

                    <p className="mt-4 text-slate-600">
                        Explore funding opportunities that can help reduce
                        the cost of studying in {country.name}.
                    </p>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">

                    {country.scholarships.map((scholarship) => (
                        <div
                            key={scholarship.name}
                            className="rounded-3xl border border-slate-200 p-6 transition hover:shadow-lg"
                        >

                            <div className="flex items-center justify-between">
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {scholarship.type}
                                </span>

                                <span className="text-sm font-semibold text-emerald-600">
                                    {scholarship.amount}
                                </span>
                            </div>

                            <h3 className="mt-5 text-xl font-bold">
                                {scholarship.name}
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Offered by {scholarship.provider}
                            </p>

                        </div>
                    ))}

                </div>

            </section>

            {/* visa and work info */}
            <section className="bg-slate-950 py-20 text-white">
                <div className="mx-auto max-w-7xl px-6">

                    <div className="grid gap-10 lg:grid-cols-2">

                        {/* Visa */}
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                Student visa
                            </span>

                            <h2 className="mt-3 text-4xl font-bold">
                                What you need to know about the visa
                            </h2>

                            <div className="mt-8 space-y-4">

                                <div className="rounded-2xl bg-white/5 p-5">
                                    <p className="text-sm text-slate-400">
                                        Visa Type
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {country.visa.name}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-5">
                                    <p className="text-sm text-slate-400">
                                        Financial Requirement
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {country.visa.financialProof}
                                    </p>
                                </div>

                                <div className="rounded-2xl bg-white/5 p-5">
                                    <p className="text-sm text-slate-400">
                                        Health Insurance
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {country.visa.healthInsurance}
                                    </p>
                                </div>

                            </div>
                        </div>

                        {/* Work */}
                        <div>
                            <span className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
                                Work opportunities
                            </span>

                            <h2 className="mt-3 text-4xl font-bold">
                                Study, work and build experience
                            </h2>

                            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-8">

                                <p className="text-slate-300">
                                    International students can work while studying,
                                    subject to the conditions of their student visa.
                                </p>

                                <div className="mt-8 grid grid-cols-2 gap-6">

                                    <div>
                                        <p className="text-sm text-slate-400">
                                            Work Rights
                                        </p>

                                        <p className="mt-2 text-xl font-bold">
                                            {country.workRights}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">
                                            Typical Student Wage
                                        </p>

                                        <p className="mt-2 text-xl font-bold">
                                            {country.studentWage}
                                        </p>
                                    </div>

                                </div>

                                <div className="mt-8 border-t border-white/10 pt-6">
                                    <p className="text-sm text-slate-400">
                                        Post-study opportunities
                                    </p>

                                    <p className="mt-2 leading-7 text-slate-200">
                                        {country.postStudyWork}
                                    </p>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* pros and cons */}
            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid gap-8 md:grid-cols-2">

                    {/* Pros */}
                    <div className="rounded-3xl bg-emerald-50 p-8">

                        <h3 className="text-2xl font-bold text-emerald-900">
                            Why students choose {country.name}
                        </h3>

                        <div className="mt-6 space-y-4">
                            {country.pros.map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-3"
                                >
                                    <span className="text-emerald-600">
                                        ✓
                                    </span>

                                    <span className="text-emerald-950">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Cons */}
                    <div className="rounded-3xl bg-rose-50 p-8">

                        <h3 className="text-2xl font-bold text-rose-900">
                            Things to consider
                        </h3>

                        <div className="mt-6 space-y-4">
                            {country.cons.map((item) => (
                                <div
                                    key={item}
                                    className="flex gap-3"
                                >
                                    <span className="text-rose-600">
                                        !
                                    </span>

                                    <span className="text-rose-950">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>

            </section>

            {/* CTA banner */}
            <section className="mx-auto max-w-7xl px-6 pb-20">

                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-10 text-white shadow-2xl">

                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-12 left-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>

                    <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">

                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
                                <Sparkles size={16} />
                                Not sure yet?
                            </div>

                            <h2 className="text-4xl font-bold">
                                Find out if {country.name} is right for you.
                            </h2>

                            <p className="mt-4 text-blue-100 leading-relaxed">
                                Tell ScholarX about your academic background, budget and study goals. We'll help you understand your eligibility and explore suitable opportunities.
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-blue-100">

    <div className="flex items-center gap-2">
        ✓ Free Consultation
    </div>

    <div className="flex items-center gap-2">
        ✓ Response within 24 hours
    </div>

    <div className="flex items-center gap-2">
        ✓ Trusted by Students
    </div>

</div>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <CalendarCheck size={18} />
                                    Book Consultation
                                </span>
                            </button>

                            <button className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <BadgeCheck size={18} />
                                    Check My Eligibility
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default CountryDetails;