import {
    ArrowRight,
    CalendarCheck,
    Check,
    CheckCircle2,
    Clock3,
    GraduationCap,
    Headphones,
    MessageCircleMore,
    ShieldCheck,
    Sparkles,
    UserRound,
    Video,
} from "lucide-react";
import { useState } from "react";

const consultationTypes = [
    {
        id: "study",
        title: "Study Abroad Guidance",
        desc: "Find the right country, university, and program.",
        icon: GraduationCap,
    },
    {
        id: "scholarship",
        title: "Scholarship Guidance",
        desc: "Understand scholarships and your eligibility.",
        icon: Sparkles,
    },
    {
        id: "application",
        title: "Application Support",
        desc: "Get help planning your application journey.",
        icon: Headphones,
    },
];

const dates = [
    { day: "Sun", date: "23", month: "Aug" },
    { day: "Mon", date: "24", month: "Aug" },
    { day: "Tue", date: "25", month: "Aug" },
    { day: "Wed", date: "26", month: "Aug" },
    { day: "Thu", date: "27", month: "Aug" },

];

const timeSlots = [
    "10:00 AM",
    "11:30 AM",
    "01:00 PM",
    "03:00 PM",
    "04:30 PM",
    "06:00 PM",
];

const benefits = [
    "Personalized guidance from an education expert",
    "Get clarity on countries, universities & programs",
    "Discuss scholarships and eligibility",
    "Create a practical study-abroad roadmap",
];

export default function BookConsultation() {
    const [consultationType, setConsultationType] = useState("study");
    const [selectedDate, setSelectedDate] = useState("25");
    const [selectedTime, setSelectedTime] = useState("11:30 AM");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({
            consultationType,
            selectedDate,
            selectedTime,
            ...formData,
        });

        // Connect your booking API here
    };

    return (
        <main className="min-h-screen bg-slate-50">
            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden bg-slate-950">
                {/* Decorative background */}
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />

                <div className="absolute -bottom-40 right-0 h-125 w-125 rounded-full bg-violet-600/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
                    <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
                        {/* Hero content */}
                        <div>
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-indigo-300 backdrop-blur">
                                <CalendarCheck size={16} />
                                <span>Book a Consultation</span>
                            </div>

                            <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Your study abroad journey,
                                <span className="block bg-linear-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                                    planned with confidence.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
                                Talk to a ScholarX education expert and get personalized
                                guidance on countries, universities, scholarships, programs,
                                and your next steps.
                            </p>

                            {/* Trust row */}
                            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-300">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={18}
                                        className="text-emerald-400"
                                    />
                                    Expert guidance
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={18}
                                        className="text-emerald-400"
                                    />
                                    Personalized advice
                                </div>

                                <div className="flex items-center gap-2">
                                    <CheckCircle2
                                        size={18}
                                        className="text-emerald-400"
                                    />
                                    1-on-1 consultation
                                </div>
                            </div>
                        </div>

                        {/* Hero floating card */}
                        <div className="relative">
                            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-indigo-500/20 blur-2xl" />

                            <div className="relative rounded-3xl border border-white/10 bg-white/6 p-6 shadow-2xl backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                                        <UserRound size={26} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-400">
                                            Your consultation
                                        </p>

                                        <h3 className="mt-1 font-bold text-white">
                                            With a ScholarX Expert
                                        </h3>
                                    </div>
                                </div>

                                <div className="my-6 h-px bg-white/10" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <Clock3
                                            size={18}
                                            className="text-indigo-400"
                                        />
                                        30–45 minute session
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <Video
                                            size={18}
                                            className="text-indigo-400"
                                        />
                                        Online video consultation
                                    </div>

                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <MessageCircleMore
                                            size={18}
                                            className="text-indigo-400"
                                        />
                                        Personalized discussion
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* BENEFITS BAR */}
            {/* ========================================================= */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4">

                        {benefits.map((benefit) => (
                            <div
                                key={benefit}
                                className="group flex items-center gap-4 px-5 py-7 transition-colors duration-300 hover:bg-slate-50 lg:px-7"
                            >

                                {/* Icon */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-50 group-hover:text-indigo-600">
                                    <Check
                                        size={18}
                                        strokeWidth={2.5}
                                    />
                                </div>

                                {/* Text */}
                                <p className="text-sm font-semibold leading-5 text-slate-700">
                                    {benefit}
                                </p>
                            </div>
                        ))}

                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* BOOKING SECTION */}
            {/* ========================================================= */}

            <section className="relative py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-12 max-w-2xl">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-px w-8 bg-indigo-600" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                                Let's get started
                            </span>
                        </div>

                        <h2 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
                            Book your
                            <span className="text-indigo-600">
                                {" "}consultation.
                            </span>
                        </h2>

                        <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 md:text-lg">
                            Tell us a little about yourself, choose what you need help
                            with, and select a convenient time.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                            {/* ================================================= */}
                            {/* MAIN FORM */}
                            {/* ================================================= */}

                            <div className="space-y-8">
                                {/* Consultation type */}
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                    <div className="mb-6">
                                        <p className="text-lg font-bold text-slate-950">
                                            What can we help you with?
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Choose the area you'd like to discuss.
                                        </p>
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3">
                                        {consultationTypes.map((item) => {
                                            const Icon = item.icon;
                                            const active =
                                                consultationType === item.id;

                                            return (
                                                <button
                                                    type="button"
                                                    key={item.id}
                                                    onClick={() =>
                                                        setConsultationType(item.id)
                                                    }
                                                    className={`group rounded-2xl border p-5 text-left transition-all duration-200 ${active
                                                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/10"
                                                        : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50"
                                                        }`}
                                                >
                                                    <div
                                                        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${active
                                                            ? "bg-indigo-600 text-white"
                                                            : "bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                                                            }`}
                                                    >
                                                        <Icon size={21} />
                                                    </div>

                                                    <h3 className="font-bold text-slate-900">
                                                        {item.title}
                                                    </h3>

                                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                                        {item.desc}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Personal details */}
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                    <div className="mb-6">
                                        <p className="text-lg font-bold text-slate-950">
                                            Your details
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            We'll use these details to confirm your consultation.
                                        </p>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Full name
                                            </label>

                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="Your full name"
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Email address
                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Phone number
                                            </label>

                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+880 1XXX XXXXXX"
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                            />
                                        </div>

                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-slate-700">
                                                Preferred study destination
                                            </label>

                                            <select
                                                name="country"
                                                value={formData.country}
                                                onChange={handleChange}
                                                required
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                            >
                                                <option value="">
                                                    Select a country
                                                </option>
                                                <option value="Australia">Australia</option>
                                                <option value="Canada">Canada</option>
                                                <option value="UK">United Kingdom</option>
                                                <option value="USA">United States</option>
                                                <option value="Germany">Germany</option>
                                                <option value="China">China</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                                            Anything you'd like to discuss?
                                            <span className="ml-1 font-normal text-slate-400">
                                                (optional)
                                            </span>
                                        </label>

                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Tell us about your study plans, concerns, or questions..."
                                            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                        />
                                    </div>
                                </div>

                                {/* Date & time */}
                                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                    <div className="mb-7">
                                        <p className="text-lg font-bold text-slate-950">
                                            Choose a date & time
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Select a convenient time for your consultation.
                                        </p>
                                    </div>

                                    {/* Dates */}
                                    <div className="mb-8">
                                        <p className="mb-3 text-sm font-bold text-slate-700">
                                            Available dates
                                        </p>

                                        <div className="grid grid-cols-5 gap-2 sm:gap-3">
                                            {dates.map((item) => {
                                                const active = selectedDate === item.date;

                                                return (
                                                    <button
                                                        type="button"
                                                        key={item.date}
                                                        onClick={() =>
                                                            setSelectedDate(item.date)
                                                        }
                                                        className={`rounded-2xl border px-2 py-4 text-center transition ${active
                                                            ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                                                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-indigo-50"
                                                            }`}
                                                    >
                                                        <p className="text-xs font-semibold opacity-70">
                                                            {item.day}
                                                        </p>

                                                        <p className="mt-1 text-xl font-black">
                                                            {item.date}
                                                        </p>

                                                        <p className="mt-1 text-xs opacity-70">
                                                            {item.month}
                                                        </p>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Time slots */}
                                    <div>
                                        <p className="mb-3 text-sm font-bold text-slate-700">
                                            Available time
                                        </p>

                                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                            {timeSlots.map((time) => {
                                                const active = selectedTime === time;

                                                return (
                                                    <button
                                                        type="button"
                                                        key={time}
                                                        onClick={() =>
                                                            setSelectedTime(time)
                                                        }
                                                        className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${active
                                                            ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
                                                            }`}
                                                    >
                                                        <Clock3 size={16} />
                                                        {time}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ================================================= */}
                            {/* BOOKING SUMMARY */}
                            {/* ================================================= */}

                            <aside className="lg:sticky lg:top-24 lg:self-start">
                                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40">
                                    {/* Summary header */}
                                    <div className="bg-slate-950 p-6">
                                        <p className="text-sm font-semibold text-indigo-300">
                                            Consultation summary
                                        </p>

                                        <h3 className="mt-2 text-2xl font-black text-white">
                                            You're almost there.
                                        </h3>
                                    </div>

                                    <div className="p-6">
                                        {/* Selected consultation */}
                                        <div className="rounded-2xl bg-slate-50 p-4">
                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                                Consultation
                                            </p>

                                            <p className="mt-2 font-bold text-slate-900">
                                                {
                                                    consultationTypes.find(
                                                        (item) =>
                                                            item.id === consultationType
                                                    )?.title
                                                }
                                            </p>
                                        </div>

                                        <div className="my-5 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                    <CalendarCheck size={18} />
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Date
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                                                        {selectedDate} August 2026
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                    <Clock3 size={18} />
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Time
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                                                        {selectedTime}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                                    <Video size={18} />
                                                </div>

                                                <div>
                                                    <p className="text-xs text-slate-400">
                                                        Meeting
                                                    </p>

                                                    <p className="mt-0.5 text-sm font-bold text-slate-800">
                                                        Online consultation
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="my-6 h-px bg-slate-200" />

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                                        >
                                            Confirm Consultation
                                            <ArrowRight
                                                size={18}
                                                className="transition-transform group-hover:translate-x-1"
                                            />
                                        </button>

                                        <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-400">
                                            <ShieldCheck size={14} />
                                            Your information is kept private and secure.
                                        </p>
                                    </div>
                                </div>

                                {/* Need help */}
                                <div className="mt-5 rounded-2xl border border-slate-200 bg-white hover:scale-101 hover:shadow-md hover:border hover:border-green-100 transition-all p-5">
                                    <div className="group flex items-start gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                                            <MessageCircleMore size={19} />
                                        </div>

                                        <div>
                                            <p className="font-bold text-slate-900">
                                                Need help choosing?
                                            </p>

                                            <p className="mt-1 text-sm leading-5 text-slate-500">
                                                Chat with our support team before booking.
                                            </p>

                                            <a
                                                href="https://wa.me/8801XXXXXXXXX"
                                                className="mt-3 inline-flex items-center gap-1 group-hover:gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                                            >
                                                Chat on WhatsApp
                                                <ArrowRight size={14} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </form>
                </div>
            </section>
        </main>
    );
}