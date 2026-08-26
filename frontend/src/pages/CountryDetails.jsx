import { useParams, NavLink } from "react-router";
import { countries } from "../data/countries";
import { ArrowRight, BadgeCheck, BadgeDollarSign, BookOpen, BriefcaseBusiness, Building2, CalendarCheck, ChevronRight, CircleAlert, CircleCheckBig, FileCheck2, Files, GraduationCap, House, Info, Languages, MapPin, ShieldCheck, Sparkles, Stamp, TrendingUp, University, WalletCards } from "lucide-react";

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

                <div className="relative mx-auto max-w-7xl px-6 py-20 lg:py-25">
                    <div className="max-w-3xl text-white">

                        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
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
                                to="/eligibility-analysis"
                                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500"
                            ><BadgeCheck size={18} />
                                Check My Eligibility
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </NavLink>

                            <a
                                href="#universities"
                                className="group inline-flex items-center gap-2 rounded-xl text-white border border-white/30 bg-white/10 px-6 py-3.5 font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
                            >
                                Explore Universities
                                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </a>
                        </div>

                    </div>
                </div>
            </section>

            {/* facts bar */}
            <section className="relative z-10 mx-auto -mt-12 max-w-7xl px-6">
                <div className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-4">

                    <div className="p-6 text-center hover:bg-slate-50">
                        <p className="text-sm text-slate-500">
                            Tuition Fees
                        </p>

                        <div className="mt-1 flex items-center justify-center gap-3">
                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    Bachelor's
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-900">
                                    {country.tuition.bachelors}
                                </p>
                            </div>

                            <div className="h-10 w-px bg-slate-200" />

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    Master's
                                </p>
                                <p className="mt-1 text-sm font-bold text-slate-900">
                                    {country.tuition.masters}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-slate-200 p-6 text-center md:border-l hover:bg-slate-50">
                        <p className="text-sm text-slate-500">
                            Main Intakes
                        </p>

                        <p className="mt-5 md:mt-3 font-bold text-slate-900">
                            {country.intakes.join(" • ")}
                        </p>
                    </div>

                    <div className="border-slate-200 p-6 text-center md:border-l hover:bg-slate-50">
                        <p className="text-sm text-slate-500">
                            Student Work
                        </p>

                        <p className="mt-3 font-bold text-slate-900">
                            {country.workRights}
                        </p>
                    </div>

                    <div className="border-slate-200 p-6 text-center md:border-l hover:bg-slate-50">
                        <p className="text-sm text-slate-500">
                            Popular Fields
                        </p>

                        <p className="mt-3 font-bold text-slate-900">
                            {country.topFields.length}+
                        </p>
                    </div>

                </div>
            </section>

            {/* Why choose this country */}
            <section className="mx-auto max-w-7xl px-6 py-24">

                {/* Section heading */}
                <div className="max-w-3xl">

                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-blue-600" />

                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                            Why {country.name}?
                        </span>
                    </div>

                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                        More than a degree.
                        <span className="text-blue-600">
                            {" "}A future.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                        Discover the opportunities that make {country.name} an
                        attractive destination for international students — from
                        quality education to career growth and global exposure.
                    </p>

                </div>


                {/* Opportunities */}
                <div className="mt-12 grid gap-5 md:grid-cols-2">

                    {country.pros.map((item, index) => (
                        <div
                            key={item}
                            className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                        >

                            {/* Background decoration */}
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                            <div className="relative flex items-start gap-4">

                                {/* Icon */}
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                    <BadgeCheck size={21} strokeWidth={2.2} />
                                </div>

                                <div>
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Opportunity {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <p className="mt-1.5 text-[15px] font-semibold leading-6 text-slate-800">
                                        {item}
                                    </p>
                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </section>

            {/* Cost of studying */}
            <section className="relative overflow-hidden bg-slate-50 py-24">

                {/* Decorative background */}
                <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
                <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6">

                    {/* Heading */}
                    <div className="max-w-3xl">

                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-amber-500" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-amber-600">
                                Study costs
                            </span>
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                            Plan your budget
                            <span className="text-amber-500">
                                {" "}before you apply.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                            Get a realistic picture of tuition and living expenses
                            so you can choose a destination that fits your budget.
                        </p>

                    </div>


                    {/* Cost cards */}
                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Bachelor's */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                    <GraduationCap size={21} />
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                    / year
                                </span>

                            </div>

                            <p className="mt-6 text-sm font-medium text-slate-500">
                                Bachelor's Tuition
                            </p>

                            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                {country.tuition.bachelors}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Estimated annual range
                            </p>

                        </div>


                        {/* Master's */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <GraduationCap size={21} />
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                    / year
                                </span>

                            </div>

                            <p className="mt-6 text-sm font-medium text-slate-500">
                                Master's Tuition
                            </p>

                            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                {country.tuition.masters}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Estimated annual range
                            </p>

                        </div>


                        {/* Living */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                    <WalletCards size={21} />
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                    / month
                                </span>

                            </div>

                            <p className="mt-6 text-sm font-medium text-slate-500">
                                Living Expenses
                            </p>

                            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                {country.livingCost.monthly}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Food, transport & daily expenses
                            </p>

                        </div>


                        {/* Accommodation */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                            <div className="flex items-center justify-between">

                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                                    <House size={21} />
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                    / month
                                </span>

                            </div>

                            <p className="mt-6 text-sm font-medium text-slate-500">
                                Accommodation
                            </p>

                            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                {country.livingCost.accommodation}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Typical student accommodation
                            </p>

                        </div>

                    </div>


                    {/* Bottom note */}
                    <div className="group mt-8 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 ">

                    <div className="mt-0.5 text-amber-600 rounded-full group-hover:bg-amber-600 group-hover:text-white transition-all
duration-500
group-hover:scale-110">
    <Info
                            size={18}
                            className="shrink-0"
                        />
                    </div>

                        <p className="text-sm leading-6 text-amber-900/80">
                            Costs are estimated ranges and can vary significantly
                            depending on the university, city, lifestyle and
                            accommodation type.
                        </p>

                    </div>

                </div>
            </section>

            {/* Admission requirements */}
            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">

                    {/* Left content */}
                    <div className="lg:sticky lg:top-28">

                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-violet-600" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-violet-600">
                                Admission
                            </span>
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                            Know what you need
                            <span className="text-violet-600">
                                {" "}before applying.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 md:text-lg">
                            Every university has its own criteria, but understanding
                            the common requirements can help you prepare your
                            application with confidence.
                        </p>

                        {/* Small visual card */}
                        <div className="mt-8 rounded-3xl bg-linear-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-lg">

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                                <FileCheck2 size={22} />
                            </div>

                            <h3 className="mt-5 text-lg font-bold">
                                Prepare your application
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-violet-100">
                                Having your academic records, language score and
                                supporting documents ready can make your application
                                process much smoother.
                            </p>

                        </div>

                    </div>


                    {/* Requirements */}
                    <div className="space-y-5">

                        {/* Academic */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-lg md:p-7">

                            <div className="flex items-start gap-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 transition group-hover:bg-violet-600 group-hover:text-white">
                                    <GraduationCap size={22} />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-3">

                                        <h3 className="text-lg font-bold text-slate-900">
                                            Academic Requirements
                                        </h3>

                                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold text-violet-600">
                                            Education
                                        </span>

                                    </div>

                                    <p className="mt-3 text-[15px] leading-7 text-slate-600">
                                        {country.admission.academic}
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* English */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg md:p-7">

                            <div className="flex items-start gap-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                                    <Languages size={22} />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-3">

                                        <h3 className="text-lg font-bold text-slate-900">
                                            English Requirements
                                        </h3>

                                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
                                            Language
                                        </span>

                                    </div>

                                    <p className="mt-3 text-[15px] leading-7 text-slate-600">
                                        {country.admission.english}
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* Documents */}
                        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-lg md:p-7">

                            <div className="flex items-start gap-5">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                                    <Files size={22} />
                                </div>

                                <div className="min-w-0">

                                    <div className="flex flex-wrap items-center gap-3">

                                        <h3 className="text-lg font-bold text-slate-900">
                                            Required Documents
                                        </h3>

                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600">
                                            Checklist
                                        </span>

                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-2.5">

                                        {country.admission.documents.map(
                                            (document) => (
                                                <span
                                                    key={document}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                                                >
                                                    {document}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Top universities */}
            <section
                id="universities"
                className="relative overflow-hidden bg-slate-50 py-24"
            >
                {/* Decorative background */}
                <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6">

                    {/* Heading */}
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div className="max-w-3xl">

                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-px w-8 bg-blue-600" />

                                <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
                                    Universities
                                </span>
                            </div>

                            <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                                Find your university
                                <span className="text-blue-600">
                                    {" "}in {country.name}
                                </span>
                            </h2>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                                Explore some of the leading universities and institutions
                                where international students can build their academic
                                and professional future.
                            </p>

                        </div>

                        <button className="group flex shrink-0 items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700">
                            View all universities

                            <ArrowRight
                                size={18}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </button>

                    </div>


                    {/* University cards */}
                    <div className="mt-12 grid gap-6 md:grid-cols-2">

                        {country.universities.map((university, index) => (
                            <div
                                key={university.name}
                                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                            >
                                {/* Background decoration */}
                                <div className="absolute z-0 -right-10 -top-10 h-28 w-28 rounded-full bg-blue-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                                {/* Header */}
                                <div className="z-10 relative flex items-start justify-between gap-4">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition duration-300 group-hover:bg-blue-600 group-hover:text-white">
                                            <University size={22} />
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                University {String(index + 1).padStart(2, "0")}
                                            </p>

                                            <h3 className="mt-1 text-xl font-bold text-slate-900">
                                                {university.name}
                                            </h3>

                                            <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                                                <MapPin size={14} />
                                                {university.location}
                                            </div>
                                        </div>

                                    </div>

                                    <span className="shrink-0 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                                        {university.ranking}
                                    </span>

                                </div>


                                {/* Details */}
                                <div className="mt-7 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">

                                    <div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <BadgeDollarSign size={16} />
                                            <p className="text-xs font-semibold uppercase tracking-wider">
                                                Tuition
                                            </p>
                                        </div>

                                        <p className="mt-2 font-bold text-slate-900">
                                            {university.tuition}
                                        </p>
                                    </div>


                                    <div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <BookOpen size={16} />
                                            <p className="text-xs font-semibold uppercase tracking-wider">
                                                Popular Programs
                                            </p>
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {university.popularPrograms.map((program) => (
                                                <span
                                                    key={program}
                                                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                                                >
                                                    {program}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))}

                    </div>

                </div>
            </section>

            {/* Scholarships */}
            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="max-w-3xl">

                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-emerald-600" />

                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
                            Funding opportunities
                        </span>
                    </div>

                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                        Make your education
                        <span className="text-emerald-600">
                            {" "}more affordable.
                        </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                        Explore scholarships and financial support opportunities that
                        can help reduce the overall cost of studying in {country.name}.
                    </p>

                </div>


                <div className="mt-12 grid gap-6 md:grid-cols-2">

                    {country.scholarships.map((scholarship) => (
                        <div
                            key={scholarship.name}
                            className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                        >

                            {/* Decorative circle */}
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-50 transition duration-300 group-hover:scale-125" />


                            {/* Top */}
                            <div className="relative flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                        <BadgeDollarSign size={21} />
                                    </div>

                                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                        {scholarship.type}
                                    </span>

                                </div>

                                <span className="text-lg font-bold text-emerald-600">
                                    {scholarship.amount}
                                </span>

                            </div>


                            {/* Content */}
                            <div className="relative mt-7">

                                <h3 className="text-xl font-bold leading-snug text-slate-900">
                                    {scholarship.name}
                                </h3>

                                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                    <Building2 size={15} />
                                    <span>
                                        Offered by {scholarship.provider}
                                    </span>
                                </div>

                            </div>


                            {/* Bottom */}
                            <div className="relative mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-sm font-medium text-emerald-600">
                                <CircleCheckBig size={17} />
                                Financial support available
                            </div>

                        </div>
                    ))}

                </div>

            </section>

            {/* Visa & work */}
            <section className="relative overflow-hidden bg-slate-950 py-24 text-white">

                {/* Background decoration */}
                <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
                <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6">

                    <div className="grid gap-8 lg:grid-cols-2">

                        {/* VISA */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:p-10">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                                <Stamp size={23} />
                            </div>

                            <div className="mt-6">

                                <span className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
                                    Student visa
                                </span>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                                    Understand your visa requirements.
                                </h2>

                                <p className="mt-4 leading-7 text-slate-400">
                                    Make sure you understand the key financial,
                                    insurance and visa requirements before starting
                                    your application.
                                </p>

                            </div>


                            <div className="mt-8 space-y-3">

                                {/* Visa type */}
                                <div className="rounded-2xl border border-white/10 bg-white/4 p-5 transition hover:bg-white/[0.07]">

                                    <div className="flex items-center gap-3">
                                        <FileCheck2
                                            size={18}
                                            className="text-blue-400"
                                        />

                                        <p className="text-sm text-slate-400">
                                            Visa Type
                                        </p>
                                    </div>

                                    <p className="mt-2 font-semibold text-white">
                                        {country.visa.name}
                                    </p>

                                </div>


                                {/* Financial */}
                                <div className="rounded-2xl border border-white/10 bg-white/4 p-5 transition hover:bg-white/[0.07]">

                                    <div className="flex items-center gap-3">
                                        <WalletCards
                                            size={18}
                                            className="text-emerald-400"
                                        />

                                        <p className="text-sm text-slate-400">
                                            Financial Requirement
                                        </p>
                                    </div>

                                    <p className="mt-2 font-semibold text-white">
                                        {country.visa.financialProof}
                                    </p>

                                </div>


                                {/* Insurance */}
                                <div className="rounded-2xl border border-white/10 bg-white/4 p-5 transition hover:bg-white/[0.07]">

                                    <div className="flex items-center gap-3">
                                        <ShieldCheck
                                            size={18}
                                            className="text-violet-400"
                                        />

                                        <p className="text-sm text-slate-400">
                                            Health Insurance
                                        </p>
                                    </div>

                                    <p className="mt-2 font-semibold text-white">
                                        {country.visa.healthInsurance}
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* WORK */}
                        <div className="rounded-3xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/10 to-blue-500/5 p-8 md:p-10">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                <BriefcaseBusiness size={23} />
                            </div>

                            <div className="mt-6">

                                <span className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-400">
                                    Work opportunities
                                </span>

                                <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                                    Study, work and gain experience.
                                </h2>

                                <p className="mt-4 leading-7 text-slate-400">
                                    Understand your work rights and how studying in
                                    {` ${country.name}`} could support your longer-term
                                    career plans.
                                </p>

                            </div>


                            {/* Stats */}
                            <div className="mt-8 grid grid-cols-2 gap-4">

                                <div className="rounded-2xl border border-white/10 bg-white/4 p-5 transition hover:bg-white/[0.07]">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Work Rights
                                    </p>

                                    <p className="mt-3 text-lg font-bold text-white">
                                        {country.workRights}
                                    </p>
                                </div>


                                <div className="rounded-2xl border border-white/10 bg-white/4 p-5 transition hover:bg-white/[0.07]">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Typical Student Wage
                                    </p>

                                    <p className="mt-3 text-lg font-bold text-white">
                                        {country.studentWage}
                                    </p>
                                </div>

                            </div>


                            {/* Post study */}
                            <div className="mt-5 rounded-2xl border border-white/10 bg-white/4 p-6 transition hover:bg-white/[0.07]">

                                <div className="flex items-center gap-3">
                                    <TrendingUp
                                        size={19}
                                        className="text-emerald-400"
                                    />

                                    <p className="text-sm font-semibold text-slate-300">
                                        Post-study opportunities
                                    </p>
                                </div>

                                <p className="mt-3 leading-7 text-slate-300">
                                    {country.postStudyWork}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

            {/* Pros & Cons */}
            <section className="mx-auto max-w-7xl px-6 py-24">

                {/* Heading */}
                <div className="max-w-3xl">

                    <div className="mb-4 flex items-center gap-3">
                        <span className="h-px w-8 bg-indigo-600" />

                        <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                            Make an informed decision
                        </span>
                    </div>

                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                        Is {country.name}
                        <span className="text-indigo-600">
                            {" "}right for you?
                        </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                        Every destination has advantages and trade-offs. Consider
                        both sides before deciding where you want to build your
                        international education journey.
                    </p>

                </div>


                {/* Pros / Cons */}
                <div className="mt-12 grid gap-6 lg:grid-cols-2">

                    {/* PROS */}
                    <div className="overflow-hidden rounded-3xl border border-indigo-200 bg-white shadow-sm">

                        {/* Header */}
                        <div className="flex items-center gap-4 bg-indigo-50 px-7 py-6">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
                                <CircleCheckBig size={23} />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                                    Advantages
                                </p>

                                <h3 className="mt-1 text-xl font-bold text-slate-900">
                                    Why students choose {country.name}
                                </h3>
                            </div>

                        </div>


                        {/* List */}
                        <div className="divide-y divide-slate-100">

                            {country.pros.map((item, index) => (
                                <div
                                    key={item}
                                    className="flex gap-4 px-7 py-5 transition hover:bg-indigo-50/40"
                                >

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                                        {index + 1}
                                    </div>

                                    <p className="text-[15px] font-medium leading-6 text-slate-700">
                                        {item}
                                    </p>

                                </div>
                            ))}

                        </div>

                    </div>


                    {/* CONS */}
                    <div className="overflow-hidden rounded-3xl border border-rose-200 bg-white shadow-sm">

                        {/* Header */}
                        <div className="flex items-center gap-4 bg-rose-50 px-7 py-6">

                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-600 shadow-sm">
                                <CircleAlert size={23} />
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-rose-600">
                                    Things to consider
                                </p>

                                <h3 className="mt-1 text-xl font-bold text-slate-900">
                                    Before you make your decision
                                </h3>
                            </div>

                        </div>


                        {/* List */}
                        <div className="divide-y divide-slate-100">

                            {country.cons.map((item, index) => (
                                <div
                                    key={item}
                                    className="flex gap-4 px-7 py-5 transition hover:bg-rose-50/40"
                                >

                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">
                                        {index + 1}
                                    </div>

                                    <p className="text-[15px] font-medium leading-6 text-slate-700">
                                        {item}
                                    </p>

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
                            <NavLink to="/book-consultation" className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <CalendarCheck size={18} />
                                    Book Consultation
                                </span>
                            </NavLink>

                            <NavLink to="/eligibility-analysis" className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <BadgeCheck size={18} />
                                    Check My Eligibility
                                </span>
                            </NavLink>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default CountryDetails;