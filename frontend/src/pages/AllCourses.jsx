import { useState } from "react";
import { Search } from "lucide-react";
import programs from "../data/courses.json"
import universities from "../data/universities.json";
import opportunities from "../data/opportunities.json";
import ProgramCard from "../components/discover/ProgramCard";
import UniversityCard from "../components/discover/UniversityCard";
import OpportunityCard from "../components/discover/OpportunityCard";

const AllCourses = () => {
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
    <section className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 py-10">

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
        <div className="relative max-w-3xl mx-auto mt-10">
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
        <div className="flex justify-center gap-4 mt-8">

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

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">

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

      </div>
    </section>
  );
};

export default AllCourses;