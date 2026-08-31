import {
    ArrowRight,
    CalendarCheck,
    Mail,
    MapPin,
    MessageCircleMore,
    MessageSquareText,
    PhoneCall,
    Sparkles,
    User,
} from "lucide-react";
import { NavLink } from "react-router";
import { useChatbot } from "../context/AiChatbot/useChatbot";

const Contact = () => {
    const { openChatbot } = useChatbot();
    return (
        <section className="bg-gray-50 pt-40 pb-20">
            {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
      </div>

            <div className="mx-auto max-w-7xl px-6">

                {/* CTA Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-10 text-white shadow-2xl">

                    <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute -bottom-12 left-20 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl"></div>

                    <div className="relative flex flex-col items-center justify-between gap-8 lg:flex-row">

                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur">
                                <Sparkles size={16} />
                                ScholarX Support
                            </div>

                            <h2 className="text-4xl font-bold">
                                Need Help Planning Your Study Abroad Journey?
                            </h2>

                            <p className="mt-4 text-blue-100 leading-relaxed">
                                Whether you're choosing a university, applying for scholarships,
                                or preparing your visa documents, our consultants are here to
                                guide you every step of the way.
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

                            <button type="button" onClick={openChatbot} className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-semibold backdrop-blur hover:-translate-y-1
hover:shadow-xl
active:translate-y-0
transition-all
duration-300">
                                <span className="flex items-center gap-2">
                                    <MessageSquareText size={18} />
                                    Chat with AI
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}

                <div className="mt-20">

                    {/* Form */}

                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg lg:col-span-3">

                        <h3 className="text-3xl font-bold">
                            Send us a Message
                        </h3>

                        <p className="mt-2 text-slate-500">
                            Fill out the form below and our team will get back to you within
                            24 hours.
                        </p>

                        <form className="mt-8 space-y-6">

                            <div className="grid gap-6 md:grid-cols-2">

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-4 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-sky-600"
                                    />
                                </div>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-4 text-slate-400"
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none transition focus:border-sky-600"
                                    />
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="Subject"
                                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
                            />

                            <textarea
                                rows="6"
                                placeholder="Tell us how we can help..."
                                className="w-full rounded-xl border border-slate-300 p-4 outline-none transition focus:border-sky-600"
                            ></textarea>

                            <button className="inline-flex group items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:scale-104 hover:bg-blue-700">
                                Send Message
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </button>
                        </form>
                    </div>

                    {/* Contact Card */}

                    <div className="rounded-3xl mt-16 border border-white/60 bg-white/70 backdrop-blur-xl p-8 shadow-xl">
                        <div className="flex flex-col items-center justify-center gap-3 mb-8">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                                Let's Connect
                            </h3>
                            <p className="text-gray-600">
                                Our team is always ready to help you.
                            </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">

                            {/* Phone */}

                            <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg">
                                <div className="flex items-start gap-4">

                                    <div className="rounded-xl bg-primary/10 p-3">
                                        <PhoneCall className="text-primary" size={22} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Call Us
                                        </p>

                                        <h4 className="mt-1 font-semibold text-lg">
                                            +880 17XXXXXXXX
                                        </h4>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Sun - Thu • 9:00 AM - 6:00 PM
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* WhatsApp */}

                            <a href="https://wa.me/8801XXXXXXXXX"
                            target="_blank"
  rel="noopener noreferrer" className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg">
                                <div className="flex items-start gap-4">

                                    <div className="rounded-xl bg-green-100 p-3">
                                        <MessageCircleMore className="text-green-600" size={22} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            WhatsApp
                                        </p>

                                        <h4 className="mt-1 font-semibold text-lg">
                                            Chat with an Expert
                                        </h4>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Average reply within 10 minutes
                                        </p>
                                    </div>

                                </div>
                            </a>

                            {/* Email */}

                            <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-300 hover:shadow-lg">
                                <div className="flex items-start gap-4">

                                    <div className="rounded-xl bg-red-100 p-3">
                                        <Mail className="text-red-500" size={22} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Email Us
                                        </p>

                                        <h4 className="mt-1 font-semibold text-lg">
                                            support@scholarx.com
                                        </h4>

                                        <p className="mt-2 text-sm text-slate-500">
                                            We'll respond within 24 hours
                                        </p>
                                    </div>

                                </div>
                            </div>

                            {/* Office */}

                            <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg">
                                <div className="flex items-start gap-4">

                                    <div className="rounded-xl bg-sky-100 p-3">
                                        <MapPin className="text-sky-600" size={22} />
                                    </div>

                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Office
                                        </p>

                                        <h4 className="mt-1 font-semibold text-lg">
                                            Dhaka, Bangladesh
                                        </h4>

                                        <p className="mt-2 text-sm text-slate-500">
                                            Available for in-person consultations
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>

                        {/* Bottom Trust Bar */}

                        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-linear-to-r from-primary to-sky-600 px-6 py-5 text-white">

                            <div>
                                <h4 className="font-semibold text-lg">
                                    Ready to start your study abroad journey?
                                </h4>

                                <p className="text-white/80 text-sm mt-1">
                                    Get personalized guidance from ScholarX experts.
                                </p>
                            </div>

                            <NavLink to="/book-consultation" className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:scale-104">
                                Book Consultation
                            </NavLink>

                        </div>

                    </div>
                </div>

                {/* Bottom Stats */}

                <div className="mt-16 grid gap-6 md:grid-cols-3">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                        <h3 className="text-3xl font-bold text-blue-600">
                            24h
                        </h3>

                        <p className="mt-2 text-slate-600">
                            Average Response Time
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                        <h3 className="text-3xl font-bold text-blue-600">
                            5000+
                        </h3>

                        <p className="mt-2 text-slate-600">
                            Students Assisted
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-xl">
                        <h3 className="text-3xl font-bold text-blue-600">
                            100+
                        </h3>

                        <p className="mt-2 text-slate-600">
                            Partner Universities
                        </p>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default Contact;