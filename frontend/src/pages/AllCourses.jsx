import { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import programs from "../data/courses.json"
import universities from "../data/universities.json";
import opportunities from "../data/opportunities.json";
import { NavLink } from "react-router";

const AllCourses = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [search, setSearch] = useState("");

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
      <div className="max-w-7xl mx-auto px-4 py-10">

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
            className="w-full rounded-2xl border bg-white py-4 pl-14 pr-5 outline-none focus:border-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 mt-8">

          <button
            onClick={() => setActiveTab("programs")}
            className={`px-6 py-3 rounded-full transition ${activeTab === "programs"
              ? "bg-sky-600 text-white"
              : "bg-white"
              }`}
          >
            {programs.length} Programs
          </button>

          <button
            onClick={() => setActiveTab("universities")}
            className={`px-6 py-3 rounded-full transition ${activeTab === "universities"
              ? "bg-sky-600 text-white"
              : "bg-white"
              }`}
          >
            {universities.length} Universities
          </button>

          <button
            onClick={() => setActiveTab("opportunities")}
            className={`px-6 py-3 rounded-full transition ${activeTab === "opportunities"
              ? "bg-sky-600 text-white"
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
              // program card
              <div
                key={program.id}
                className="rounded-3xl bg-white p-5 border border-gray-200 hover:border-sky-200 hover:shadow-xl hover:scale-101 transition-all"
              >
                <div className="flex gap-4">

                  <img
                    src={program.image}
                    className="w-28 h-28 rounded-xl object-cover"
                  />

                  <div className="flex-1">

                    <div className="flex justify-between">

                      <div>

                        <h2 className="text-2xl font-semibold">
                          {program.name}
                        </h2>

                        <p className="text-gray-500 mt-1">
                          {program.topCountries.slice(0, 3).join(" • ")}

{program.topCountries.length > 3 && (
  <span className="text-sky-600">
    {" "}+{program.topCountries.length - 3} more
  </span>
)}
                        </p>

                      </div>

                    </div>

                    <div className="flex flex-wrap gap-2 mt-5">

                      {program.degrees?.map((degree) => (
                        <span
                          key={degree}
                          className="rounded-full bg-blue-100 px-3 py-1 text-sm"
                        >
                          {degree}
                        </span>
                      ))}

                    </div>

                    <div className="flex gap-6 mt-5 text-sm text-gray-600">

                      <span>
                        🎓 {program.universitiesCount} Universities
                      </span>

                      <span>
                        💰 {program.scholarshipsCount} Scholarships
                      </span>

                    </div>

                    <NavLink
                    to=""
                        className="group flex items-center gap-2 mt-2 font-semibold text-gray-900 hover:text-blue-500 transition"
                    >
                Learn More
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </NavLink>

                  </div>

                </div>

              </div>
            ))}
          {/* for university card */}
          {activeTab === "universities" &&
            filtered.map((university) => (
              // University Card
              <div className="rounded-3xl bg-white p-6 border">

                <img
                  src={university.image}
                  className="w-full h-52 rounded-xl object-cover"
                />

                <h2 className="text-2xl font-bold mt-5">
                  {university.name}
                </h2>

                <p className="text-gray-500">
                  {university.city}, {university.country}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  {university.popularPrograms.map(program => (
                    <span
                      key={program}
                      className="bg-blue-100 rounded-full px-3 py-1"
                    >
                      {program}
                    </span>
                  ))}

                </div>

                <div className="mt-5 space-y-2">

                  <p>🏆 QS #{university.qsRanking}</p>

                  <p>💰 {university.tuition}</p>

                  <p>🎓 {university.programsCount} Programs</p>

                  <p>🎁 {university.scholarshipsCount} Scholarships</p>

                </div>

              </div>
            ))}
          {/* for opportunity card */}
          {activeTab === "opportunities" &&
            filtered.map((opportunity) => (
              // Opportunity Card
              <div className="rounded-3xl bg-white p-6 border">

                <img
                  src={opportunity.image}
                  className="w-full h-52 rounded-xl object-cover"
                />

                <div className="flex justify-between mt-4">

                  <h2 className="text-xl font-bold">

                    {opportunity.title}

                  </h2>

                  <span className="text-blue-600">

                    {opportunity.category}

                  </span>

                </div>

                <p className="text-gray-500 mt-2">

                  {opportunity.provider}

                </p>

                <div className="mt-5">

                  <p>📍 {opportunity.country}</p>

                  <p>💰 {opportunity.funding}</p>

                  <p>📅 {opportunity.deadline}</p>

                </div>

              </div>
            ))}

        </div>

      </div>
    </section>
  );
};

export default AllCourses;