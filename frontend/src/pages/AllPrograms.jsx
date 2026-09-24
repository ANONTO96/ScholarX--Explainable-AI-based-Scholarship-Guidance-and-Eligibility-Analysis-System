import { useState } from "react";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageSquareText,
  Search,
  Sparkles,
} from "lucide-react";
import programs from "../data/programs.json"
import universities from "../data/universities.json";
import opportunities from "../data/opportunities.json";
import ProgramCard from "../components/ReusableComp/discover/ProgramCard";
import UniversityCard from "../components/ReusableComp/discover/UniversityCard";
import OpportunityCard from "../components/ReusableComp/discover/OpportunityCard";
import { NavLink, useParams } from "react-router";
import { useChatbot } from "../context/AiChatbot/useChatbot";


const AllPrograms = () => {
  const { openChatbot } = useChatbot();
  const { type } = useParams();

  const activeTab = type || "programs";
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const cardsPerPage = 12;
  // data according to active tab
  const data =
    activeTab === "programs"
      ? programs
      : activeTab === "universities"
        ? universities
        : opportunities;

  const filterOptions =
    activeTab === "programs"
      ? [...new Set(programs.map((program) => program.category).filter(Boolean))]
      : [...new Set(data.map((item) => item.country).filter(Boolean))];

  const filtered = data.filter((item) => {
    const text = [
      item.title,
      item.name,
      item.country,
      item.city,
      item.provider,
      item.category,
      item.type,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (activeTab === "programs"
        ? item.category === filter
        : item.country === filter);

    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / cardsPerPage);

  const startIndex = (currentPage - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;

  const paginatedData = filtered.slice(startIndex, endIndex);


  return (
    <section className="relative bg-slate-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 pt-40">

        {/* Hero */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold flex flex-col mx-auto">
            Discover <span>Global Education</span>
          </h1>

          <p className="mt-4 text-gray-600">
            Browse Programs, Universities and Scholarships worldwide and choose the best that fits you most.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                activeTab === "programs"
                  ? "Search programs..."
                  : activeTab === "universities"
                    ? "Search universities..."
                    : "Search opportunities..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-white/90 py-4 pl-14 pr-5 text-slate-700 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {/* Filter */}
          <div className="relative sm:w-64">
            <Filter
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
            />

            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none rounded-2xl border border-slate-200 bg-white/90 py-4 pl-11 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all cursor-pointer focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="all">
                {activeTab === "programs"
                  ? "All Program Types"
                  : "All Countries"}
              </option>

              {filterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-2 sm:gap-4 mt-14">

          <NavLink
            to="/programs"
            onClick={() => {
              setFilter("all");
              setSearch("");
              setCurrentPage(1);
            }}
            className={`px-4 sm:px-6 py-3 flex flex-col items-center rounded-full transition ${activeTab === "programs"
                ? "bg-sky-500 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            {programs.length} <span>Programs</span>
          </NavLink>

          <NavLink
            to="/universities"
            onClick={() => {
              setFilter("all");
              setSearch("");
              setCurrentPage(1);
            }}
            className={`px-6 py-3 flex flex-col items-center rounded-full transition ${activeTab === "universities"
                ? "bg-sky-500 text-white"
                : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            {universities.length} <span>Universities</span>
          </NavLink>

          <NavLink
            to="/opportunities"
            onClick={() => {
              setFilter("all");
              setSearch("");
              setCurrentPage(1);
            }}
            className={`px-6 py-3 flex flex-col items-center rounded-full transition ${activeTab === "opportunities"
              ? "bg-sky-500 text-white"
              : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            {opportunities.length} <span>Opportunities</span>
          </NavLink>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">

          {/* for program card */}
          {activeTab === "programs" &&
            paginatedData.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
              />
            ))}
          {/* for university card */}
          {activeTab === "universities" &&
            paginatedData.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
              />
            ))}
          {/* for opportunity card */}
          {activeTab === "opportunities" &&
            paginatedData.map((opportunity) => (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}

        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">

            {/* Previous */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${currentPage === 1
                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-10 min-w-10 rounded-xl px-3 text-sm font-medium transition-all ${currentPage === page
                    ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                    }`}
                >
                  {page}
                </button>
              )
            )}

            {/* Next */}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${currentPage === totalPages
                ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-300"
                : "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-600"
                }`}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

      </div>

      {/* CTA Banner */}
      <div className="max-w-7xl mx-auto sm:px-6 pb-20">
        <div className="relative mt-14 overflow-hidden sm:rounded-3xl bg-linear-to-r from-blue-600 to-indigo-700 p-6 lg:p-8 text-white shadow-2xl">

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
      </div>
    </section>
  );
};

export default AllPrograms;