import {
    Search, GraduationCap, BadgeDollarSign,
    CalendarDays,
    BriefcaseBusiness, ArrowRight, MessageCircleMore,
    Mail,
    CalendarCheck,
    ShieldCheck,
    Headphones,
    Clock3,
    UserRound,
    Bot,
    Sparkles,
    Plane
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import { countries } from "../data/countries";

const stats = [
    {
        title: "Average Response",
        value: "< 10 min",
        icon: Clock3,
    },
    {
        title: "Students Helped",
        value: "5,000+",
        icon: Headphones,
    },
    {
        title: "Satisfaction",
        value: "98%",
        icon: ShieldCheck,
    },
];

const actions = [
    {
        title: "Chat on WhatsApp",
        desc: "Fastest way to reach us",
        icon: MessageCircleMore,
        color: "bg-green-500",
    },
    {
        title: "Email Support",
        desc: "Detailed questions & documents",
        icon: Mail,
        color: "bg-blue-500",
    },
    {
        title: "Book Consultation",
        desc: "Meet an education expert consultant",
        icon: CalendarCheck,
        color: "bg-violet-500",
    },
];

export default function AllCountries() {
    const [search, setSearch] = useState("");

    const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="bg-gray-50">

            {/* Background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
            </div>

            {/* HERO */}

            <div
                className="relative h-115 xl:h-125 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop)",
                }}
            >
                <div className="absolute inset-0 bg-linear-to-r from-[#0F172A]/85 via-[#1E3A8A]/60 to-[#2563EB]/40" />

                <div className="relative max-w-7xl mx-auto h-full flex items-center px-6">
                    <div className="max-w-3xl text-white">

                        <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/20 mb-4">
                            🌍 Study Abroad
                        </span>

                        <h1 className="text-4xl lg:text-6xl font-black leading-tight">
                            Explore Your
                            <span className="block text-cyan-300">
                                Dream Destination
                            </span>
                        </h1>

                        <p className="mt-4 text-lg text-gray-200 leading-8">
                            Compare universities, discover scholarships,
                            and find your perfect study destination across
                            the world's leading education hubs.
                        </p>

                        <div className="flex gap-5 mt-8">

                            <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-5">
                                <h2 className="text-3xl font-bold">16</h2>
                                <p className="text-gray-300">Countries</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-5">
                                <h2 className="text-3xl font-bold">300+</h2>
                                <p className="text-gray-300">Universities</p>
                            </div>

                            <div className="bg-white/10 backdrop-blur rounded-2xl px-6 py-5">
                                <h2 className="text-3xl font-bold">5000+</h2>
                                <p className="text-gray-300">Programs</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}

            <div className="max-w-7xl mx-auto px-6 py-20">

                {/* Heading */}

                <div className="text-center max-w-3xl mx-auto">

                    <h2 className="text-4xl font-semibold text-gray-900">
                        Popular Study Destinations
                    </h2>

                    <p className="mt-4 text-gray-600 text-lg leading-8">
                        Search your preferred country and discover top
                        universities, scholarships, and academic programs
                        tailored to your future.
                    </p>

                </div>

                {/* Search */}

                <div className="max-w-xl mx-auto mt-8 relative">

                    <Search
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search countries..."
                        className="w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-5 py-4 shadow-sm outline-none focus:ring-2 focus:ring-sky-500"
                    />

                </div>

                {/* Cards */}

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-14">
                    {filtered.map((country) => (
                        <div
                            key={country.id}
                            className="group overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 duration-300"
                        >
                            {/* Image */}
                            <div className="relative h-50 overflow-hidden">
                                <img
                                    src={country.image}
                                    alt={country.name}
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                />

                                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                                <div className="absolute bottom-5 left-5">
                                    <h3 className="text-2xl font-semibold text-white">
                                        {country.name}
                                    </h3>

                                    <p className="text-sm text-gray-200">
                                        Study Abroad Destination
                                    </p>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">

                                {/* Tuition */}
                                <div className="mb-3">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BadgeDollarSign
                                            size={18}
                                            className="text-amber-500"
                                        />
                                        <h4 className="font-semibold text-gray-800">
                                            Annual Tuition
                                        </h4>
                                    </div>

                                    <div className="rounded-xl bg-slate-50 p-3 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Bachelor's
                                            </span>

                                            <span className="font-semibold">
                                                {country.tuition.bachelors}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-slate-500">
                                                Master's
                                            </span>

                                            <span className="font-semibold">
                                                {country.tuition.masters}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}

                                <div className="space-y-3">

                                    <div className="flex items-start gap-3">
                                        <CalendarDays
                                            size={18}
                                            className="text-blue-600 mt-0.5"
                                        />

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Main Intakes
                                            </p>

                                            <p className="font-medium">
                                                {country.intakes.join(" • ")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <BriefcaseBusiness
                                            size={18}
                                            className="text-emerald-600 mt-0.5"
                                        />

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Part-time Work
                                            </p>

                                            <p className="font-medium">
                                                {country.workRights}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <GraduationCap
                                            size={18}
                                            className="text-violet-600 mt-0.5"
                                        />

                                        <div>
                                            <p className="text-sm text-slate-500">
                                                Popular Fields
                                            </p>

                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {country.topFields.map((field) => (
                                                    <span
                                                        key={field}
                                                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full"
                                                    >
                                                        {field}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Button */}

                                <NavLink
                                    to={`/countries/${country.slug}`}
                                    className="mt-6 flex items-center justify-between rounded-xl border border-gray-200 px-5 py-3 font-semibold transition-all duration-300 hover:bg-sky-500 hover:text-white"
                                >
                                    Explore Destination

                                    <ArrowRight
                                        size={18}
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    />
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </div>

                {/* help section */}

                <div className="mt-20">
                    <div className="mx-auto max-w-7xl">

                        <div className="mb-14 text-center">

                            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600">
                                Instant Support
                            </span>

                            <h2 className="mt-6 text-4xl font-extrabold">
                                Get Help Whenever You Need It
                            </h2>

                            <p className="mx-auto mt-4 max-w-2xl text-slate-500">
                                Whether you have questions about universities, scholarships,
                                visas or your ScholarX account, our consultants and AI assistant
                                are always ready to help.
                            </p>

                        </div>

                        <div className="relative overflow-hidden rounded-[36px] bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-7 shadow-2xl lg:p-14">

                            {/* Glow */}

                            <div className="absolute -right-24 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"></div>
                            <div className="absolute -left-24 bottom-0 h-60 w-60 rounded-full bg-cyan-300/10 blur-3xl"></div>

                            <div className="relative grid gap-10 lg:grid-cols-2">

                                {/* LEFT */}

                                <div>

                                    <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-white backdrop-blur">

                                        <Sparkles size={18} />

                                        Always Here For You

                                    </div>

                                    <h3 className="mt-6 text-4xl font-bold leading-tight text-white">

                                        Need help choosing the right destination?

                                    </h3>

                                    <p className="mt-4 max-w-lg leading-8 text-blue-100">

                                        Our experienced education consultants can help you shortlist universities, compare tuition fees, discover scholarships, prepare your application and guide you through the visa process.

                                    </p>

                                    <div className="mt-10 space-y-5">

                                        {actions.map((item) => {

                                            const Icon = item.icon;

                                            return (

                                                <button
                                                    key={item.title}
                                                    className="group flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/10 p-5 text-left text-white backdrop-blur transition hover:bg-white/20"
                                                >

                                                    <div className="flex items-center gap-5">

                                                        <div className={`${item.color} rounded-xl p-3 text-white`}>

                                                            <Icon size={24} />

                                                        </div>

                                                        <div>

                                                            <h4 className="font-semibold">

                                                                {item.title}

                                                            </h4>

                                                            <p className="text-sm text-blue-100">

                                                                {item.desc}

                                                            </p>

                                                        </div>

                                                    </div>

                                                    <ArrowRight
                                                        size={20}
                                                        className="transition group-hover:translate-x-1"
                                                    />

                                                </button>

                                            );

                                        })}

                                    </div>

                                </div>

                                {/* RIGHT */}

                                <div className="flex flex-col gap-6">

                                    {/* Consultant */}

                                    <div className="rounded-3xl border border-white/20 bg-white/10 p-7 backdrop-blur">

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-4">

                                                <div className="relative">

                                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-blue-600">

                                                        <UserRound size={32} />

                                                    </div>

                                                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500"></span>

                                                </div>

                                                <div>

                                                    <h4 className="text-xl font-bold text-white">

                                                        Education Consultant

                                                    </h4>

                                                    <p className="text-blue-100">

                                                        Available Now

                                                    </p>

                                                </div>

                                            </div>

                                            <div className="rounded-full inline-flex gap-1 bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300">

                                                ● <span>Online</span>

                                            </div>

                                        </div>

                                        <div className="mt-7 rounded-2xl bg-white/10 p-5">

                                            <p className="leading-7 text-blue-50">

                                                👋 Hello! Looking for the perfect university or scholarship?
                                                Our consultants usually reply within a few minutes.

                                            </p>
                                        </div>

                                        <button className="mt-6 w-full rounded-2xl bg-white py-4 font-semibold text-blue-700 transition hover:scale-102">

                                            Start Conversation

                                        </button>

                                    </div>

                                    {/* AI */}

                                    <div className="rounded-3xl border border-cyan-300/30 bg-linear-to-r from-cyan-400/20 to-blue-500/20 p-7 backdrop-blur">

                                        <div className="flex items-center gap-4">

                                            <div className="rounded-2xl bg-sky-400 p-3 text-white">

                                                <Bot size={28} />

                                            </div>

                                            <div>

                                                <h4 className="text-xl font-bold text-white">

                                                    ScholarX AI Assistant

                                                </h4>

                                                <p className="text-blue-100">

                                                    Available 24/7

                                                </p>

                                            </div>

                                        </div>

                                        <p className="mt-6 leading-7 text-blue-50">

                                            Get instant answers about eligibility, scholarships,
                                            universities and application requirements anytime.

                                        </p>

                                        <button className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3 font-semibold text-white transition hover:scale-104">

                                            Ask AI Assistant

                                            <ArrowRight size={18} />

                                        </button>

                                    </div>

                                </div>

                            </div>

                            {/* Service Cards */}

                                    <div className="mt-10 grid gap-4 sm:grid-cols-3">

                                        <div className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-blue-300/40 hover:bg-white/10">

                                            <div className="mb-4 inline-flex rounded-xl bg-blue-500/20 p-3 text-cyan-300">
                                                <GraduationCap size={24} />
                                            </div>

                                            <h4 className="font-semibold text-white">
                                                University Selection
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                                Find universities that perfectly match your profile and future goals.
                                            </p>

                                        </div>

                                        <div className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-amber-300/40 hover:bg-white/10">

                                            <div className="mb-4 inline-flex rounded-xl bg-amber-500/20 p-3 text-amber-300">
                                                <BadgeDollarSign size={24} />
                                            </div>

                                            <h4 className="font-semibold text-white">
                                                Scholarship Guidance
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                                Explore scholarships and funding opportunities to reduce tuition costs.
                                            </p>

                                        </div>

                                        <div className="group rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-cyan-300/40 hover:bg-white/10">

                                            <div className="mb-4 inline-flex rounded-xl bg-cyan-500/20 p-3 text-cyan-300">
                                                <Plane size={24} />
                                            </div>

                                            <h4 className="font-semibold text-white">
                                                Visa Assistance
                                            </h4>

                                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                                Complete support for documentation, interviews and visa preparation.
                                            </p>

                                        </div>

                                    </div>

                            {/* Bottom Stats */}

                            <div className="relative mt-12 grid gap-5 border-t border-white/15 pt-10 md:grid-cols-3">

                                {stats.map((item) => {

                                    const Icon = item.icon;

                                    return (

                                        <div
                                            key={item.title}
                                            className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-gray-400"
                                        >

                                            <div className="flex items-center gap-4">

                                                <div className="rounded-xl bg-white/15 p-3 text-white">

                                                    <Icon size={24} />

                                                </div>

                                                <div>

                                                    <p className="text-sm text-blue-100">

                                                        {item.title}

                                                    </p>

                                                    <h4 className="mt-1 text-3xl font-bold text-white">

                                                        {item.value}

                                                    </h4>

                                                </div>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}