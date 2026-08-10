import { useState } from "react";
import { CalendarCheck, MessageSquareText, Search, Sparkles } from "lucide-react";
import programs from "../data/programs.json"
import universities from "../data/universities.json";
import opportunities from "../data/opportunities.json";
import ProgramCard from "../components/ReusableComp/discover/ProgramCard";
import UniversityCard from "../components/ReusableComp/discover/UniversityCard";
import OpportunityCard from "../components/ReusableComp/discover/OpportunityCard";

const AllPrograms = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [search, setSearch] = useState("");
// data according to active tab
  const data =
    activeTab === "programs"
      ? programs
      : activeTab === "universities"
        ? universities
        : opportunities;

  const filtered = data.filter((item) => {
    const text = [
      item.title,
      item.name,
      item.country,
      item.city,
      item.provider,
      item.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <section className="relative bg-slate-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-5 py-20">

        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold flex flex-col mx-auto">
            Discover <span>Global Education</span>
          </h1>

          <p className="mt-4 text-gray-600">
            Browse Programs, Universities and Scholarships worldwide and choose the best that fits you most.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-3xl mx-auto mt-8">
          <Search
            size={20}
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeTab === "programs"
                ? "Search programs..."
                : activeTab === "universities"
                  ? "Search universities..."
                  : "Search opportunities..."
            }
            className="w-full rounded-2xl border bg-white py-4 pl-14 pr-5 outline-none focus:border-sky-500"
          />
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 mt-14">

          <button
            onClick={() => setActiveTab("programs")}
            className={`px-6 py-3 rounded-full transition ${activeTab === "programs"
              ? "bg-sky-500 text-white"
              : "bg-white"
              }`}
          >
            {programs.length} Programs
          </button>

          <button
            onClick={() => setActiveTab("universities")}
            className={`px-6 py-3 rounded-full transition ${activeTab === "universities"
              ? "bg-sky-500 text-white"
              : "bg-white"
              }`}
          >
            {universities.length} Universities
          </button>

          <button
            onClick={() => setActiveTab("opportunities")}
            className={`px-6 py-3 rounded-full transition ${activeTab === "opportunities"
              ? "bg-sky-500 text-white"
              : "bg-white"
              }`}
          >
            {opportunities.length} Opportunities
          </button>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">

          {/* for program card */}
          {activeTab === "programs" &&
            filtered.map((program) => (
              <ProgramCard program={program}></ProgramCard>
            ))}
          {/* for university card */}
          {activeTab === "universities" &&
            filtered.map((university) => (
              <UniversityCard university={university}></UniversityCard>
            ))}
          {/* for opportunity card */}
          {activeTab === "opportunities" &&
            filtered.map((opportunity) => ( 
              <OpportunityCard opportunity={opportunity}></OpportunityCard>
            ))}

        </div>

        {/* CTA Banner */}
                <div className="relative mt-14 overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-10 text-white shadow-2xl">

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
                                    <MessageSquareText size={18} />
                                    Chat with AI
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

      </div>
    </section>
  );
};

export default AllPrograms;