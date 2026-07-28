import {
    Search, GraduationCap, BadgeDollarSign,
    CalendarDays,
    BriefcaseBusiness, ArrowRight, MessageCircleMore, PhoneCall,
    Mail,
    Plane
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router";
import usa from "../assets/usa.avif"
import uk from "../assets/uk.avif"
import canada from "../assets/canada.avif"
import australia from "../assets/australia.avif"
import germany from "../assets/germany.avif"
import france from "../assets/france.avif"
import ireland from "../assets/ireland.avif"
import netherlands from "../assets/netherlands.avif"
import sweden from "../assets/sweden.avif"
import newzealand from "../assets/newzealand.avif"
import switzerland from "../assets/switzerland.avif"
import japan from "../assets/japan.avif"
import southkorea from "../assets/southkorea.avif"
import singapore from "../assets/singapore.avif"
import italy from "../assets/italy.avif"
import malaysia from "../assets/malaysia.avif";

const countries = [
    {
        id: 1,
        name: "United States",
        slug: "usa",
        image: usa,
        tuition: {
            bachelors: "$20k–$50k/year",
            masters: "$22k–$55k/year",
        },
        intakes: ["Fall", "Spring"],
        workRights: "Up to 20 hrs/week",
        topFields: ["Computer Science", "Business", "Engineering"],
    },
    {
        id: 2,
        name: "United Kingdom",
        slug: "uk",
        image: uk,
        tuition: {
            bachelors: "$18k–$40k/year",
            masters: "$20k–$45k/year",
        },
        intakes: ["September", "January"],
        workRights: "Up to 20 hrs/week",
        topFields: ["Business", "Law", "Computer Science"],
    },
    {
        id: 3,
        name: "Canada",
        slug: "canada",
        image: canada,
        tuition: {
            bachelors: "$15k–$35k/year",
            masters: "$12k–$30k/year",
        },
        intakes: ["Fall", "Winter", "Summer"],
        workRights: "Up to 24 hrs/week",
        topFields: ["Computer Science", "Engineering", "Health Sciences"],
    },
    {
        id: 4,
        name: "Australia",
        slug: "australia",
        image: australia,
        tuition: {
            bachelors: "$22k–$40k/year",
            masters: "$24k–$45k/year",
        },
        intakes: ["February", "July"],
        workRights: "Up to 48 hrs/fortnight",
        topFields: ["Nursing", "Engineering", "IT"],
    },
    {
        id: 5,
        name: "Germany",
        slug: "germany",
        image: germany,
        tuition: {
            bachelors: "Free–$8k/year",
            masters: "Free–$10k/year",
        },
        intakes: ["Winter", "Summer"],
        workRights: "140 full or 280 half days/year",
        topFields: ["Engineering", "Computer Science", "Automotive"],
    },
    {
        id: 6,
        name: "France",
        slug: "france",
        image: france,
        tuition: {
            bachelors: "$3k–$12k/year",
            masters: "$4k–$18k/year",
        },
        intakes: ["September", "January"],
        workRights: "Up to 964 hrs/year",
        topFields: ["Business", "Fashion", "Hospitality"],
    },
    {
        id: 7,
        name: "Ireland",
        slug: "ireland",
        image: ireland,
        tuition: {
            bachelors: "$12k–$28k/year",
            masters: "$14k–$32k/year",
        },
        intakes: ["September", "January"],
        workRights: "Up to 20 hrs/week",
        topFields: ["Computer Science", "Business", "Pharmaceutical Science"],
    },
    {
        id: 8,
        name: "Netherlands",
        slug: "netherlands",
        image: netherlands,
        tuition: {
            bachelors: "$10k–$20k/year",
            masters: "$12k–$24k/year",
        },
        intakes: ["September", "February"],
        workRights: "16 hrs/week (permit required)",
        topFields: ["Engineering", "Business", "Agriculture"],
    },
    {
        id: 9,
        name: "Sweden",
        slug: "sweden",
        image: sweden,
        tuition: {
            bachelors: "$8k–$18k/year",
            masters: "$10k–$22k/year",
        },
        intakes: ["Autumn", "Spring"],
        workRights: "No official hourly limit",
        topFields: ["Sustainability", "Engineering", "IT"],
    },
    {
        id: 10,
        name: "New Zealand",
        slug: "new-zealand",
        image: newzealand,
        tuition: {
            bachelors: "$18k–$32k/year",
            masters: "$20k–$35k/year",
        },
        intakes: ["February", "July"],
        workRights: "Up to 20 hrs/week",
        topFields: ["Agriculture", "Business", "Engineering"],
    },
    {
        id: 11,
        name: "Switzerland",
        slug: "switzerland",
        image: switzerland,
        tuition: {
            bachelors: "$2k–$15k/year",
            masters: "$3k–$18k/year",
        },
        intakes: ["September", "February"],
        workRights: "15 hrs/week",
        topFields: ["Hospitality", "Finance", "Engineering"],
    },
    {
        id: 12,
        name: "Italy",
        slug: "italy",
        image: italy,
        tuition: {
            bachelors: "$2k–$12k/year",
            masters: "$3k–$16k/year",
        },
        intakes: ["September", "February"],
        workRights: "20 hrs/week",
        topFields: ["Architecture", "Fashion", "Engineering"],
    },
    {
        id: 13,
        name: "South Korea",
        slug: "south-korea",
        image: southkorea,
        tuition: {
            bachelors: "$5k–$15k/year",
            masters: "$6k–$18k/year",
        },
        intakes: ["March", "September"],
        workRights: "Up to 20 hrs/week",
        topFields: ["Computer Science", "AI", "Electronics"],
    },
    {
        id: 14,
        name: "Singapore",
        slug: "singapore",
        image: singapore,
        tuition: {
            bachelors: "$18k–$35k/year",
            masters: "$20k–$40k/year",
        },
        intakes: ["August", "January"],
        workRights: "Up to 16 hrs/week",
        topFields: ["Business", "Finance", "Computer Science"],
    },
    {
        id: 15,
        name: "Japan",
        slug: "japan",
        image: japan,
        tuition: {
            bachelors: "$5k–$12k/year",
            masters: "$6k–$15k/year",
        },
        intakes: ["April", "October"],
        workRights: "Up to 28 hrs/week",
        topFields: ["Robotics", "Engineering", "Computer Science"],
    },
    {
        id: 16,
        name: "Malaysia",
        slug: "malaysia",
        image: malaysia,
        tuition: {
            bachelors: "$3k–$10k/year",
            masters: "$4k–$12k/year",
        },
        intakes: ["February", "July", "September"],
        workRights: "Up to 20 hrs/week (subject to visa conditions)",
        topFields: ["Medicine", "Engineering", "Business"],
    },
];

export default function AllCountries() {
    const [search, setSearch] = useState("");

    const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <section className="bg-gray-50">

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

                    <p className="mt-5 text-gray-600 text-lg leading-8">
                        Search your preferred country and discover top
                        universities, scholarships, and academic programs
                        tailored to your future.
                    </p>

                </div>

                {/* Search */}

                <div className="max-w-xl mx-auto mt-10 relative">

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

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-16">
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

                <div className="mt-24">
  <div className="relative overflow-hidden rounded-4xl bg-linear-to-r from-indigo-50 via-sky-50 to-violet-50 border border-indigo-100 p-8 lg:p-12">

    {/* background circles */}

    <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl"></div>

    <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>

    <div className="relative">

      <span className="inline-flex rounded-full bg-primary/10 text-sky-600 px-4 py-2 text-sm font-semibold">
        Free Expert Consultation
      </span>

      <h2 className="mt-5 text-4xl font-bold">
        Need help choosing the right destination?
      </h2>

      <p className="mt-4 text-slate-600 max-w-3xl leading-8">
        Our experienced education consultants can help you shortlist
        universities, compare tuition fees, discover scholarships,
        prepare your application and guide you through the visa process.
      </p>

      {/* Service cards */}

      <div className="grid md:grid-cols-3 gap-5 mt-10">

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex gap-2">
            <GraduationCap className="text-primary mb-2" size={28}/>
          <h3 className="font-bold">
            University Selection
          </h3>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Find universities that match your profile and goals.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex gap-2">
            <BadgeDollarSign className="text-amber-500 mb-2" size={28}/>
          <h3 className="font-bold">
            Scholarship Guidance
          </h3>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Discover funding opportunities and tuition savings.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex gap-2">
            <Plane className="text-sky-500 mb-2" size={28}/>
          <h3 className="font-bold">
            Visa Assistance
          </h3>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Get support with documentation and visa preparation.
          </p>
        </div>

      </div>

      {/* Contact */}

      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {/* for call */}
        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">
          <PhoneCall className="text-primary" size={20}/>
          <div>
            <p className="text-xs text-slate-500">Call Us</p>
            <p className="font-semibold">+880 17XXXXXXXX</p>
          </div>
        </div>
        {/* for whatsapp */}
        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">
          <MessageCircleMore className="text-green-600" size={20}/>
          <div>
            <p className="text-xs text-slate-500">WhatsApp</p>
            <p className="font-semibold">Chat with an Expert</p>
          </div>
        </div>
        {/* for mail */}
        <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-sm">
          <Mail className="text-red-500" size={20}/>
          <div>
            <p className="text-xs text-slate-500">Email</p>
            <p className="font-semibold">support@scholarx.com</p>
          </div>
        </div>

      </div>

    </div>

  </div>
</div>

            </div>
        </section>
    );
}