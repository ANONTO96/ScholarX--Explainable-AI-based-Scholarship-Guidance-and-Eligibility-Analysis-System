import { useEffect, useMemo, useState } from "react";
import { Filter, GraduationCap, Search } from "lucide-react";
import ScholarshipCard from "../components/scholarships/ScholarshipCard";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const CARDS_PER_PAGE = 12;

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchScholarships = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/api/scholarships/`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load scholarships (HTTP ${response.status}).`
          );
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("The API returned an unexpected response.");
        }

        setScholarships(result.data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Scholarship fetch error:", err);
          setError(
            err.message ||
              "Unable to load scholarships. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchScholarships();

    return () => controller.abort();
  }, []);

  const countries = useMemo(() => {
    return [
      ...new Set(
        scholarships
          .map((scholarship) => scholarship.country?.trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [scholarships]);

  const filteredScholarships = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scholarships.filter((scholarship) => {
      const title = scholarship.title || "";
      const country = scholarship.country || "";

      const matchesSearch =
        title.toLowerCase().includes(query) ||
        country.toLowerCase().includes(query);

      const matchesCountry =
        countryFilter === "all" ||
        country.trim() === countryFilter;

      return matchesSearch && matchesCountry;
    });
  }, [scholarships, search, countryFilter]);

  const totalPages = Math.ceil(
    filteredScholarships.length / CARDS_PER_PAGE
  );

  const paginatedScholarships = filteredScholarships.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handleCountryChange = (event) => {
    setCountryFilter(event.target.value);
    setCurrentPage(1);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-20 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute right-0 top-96 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:pt-40">
        {/* Heading */}
        <div className="text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-sky-700 shadow-sm">
            <GraduationCap size={18} />
            Scholarship Discovery
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            All Scholarship Programs
          </h1>

          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-600">
            Explore scholarship opportunities across countries and find
            options that fit your study abroad plans.
          </p>
        </div>

        {/* Search and country filter */}
        <div className="mx-auto mt-9 flex max-w-4xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search scholarships or countries..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-5 text-slate-700 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div className="relative sm:w-64">
            <Filter
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sky-500"
            />

            <select
              value={countryFilter}
              onChange={handleCountryChange}
              className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white py-4 pl-11 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="all">All Countries</option>

              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-800">
            {loading
              ? "Loading scholarships..."
              : `${filteredScholarships.length} ${
                  filteredScholarships.length === 1
                    ? "scholarship"
                    : "scholarships"
                } found`}
          </h2>

          {!loading && !error && (
            <span className="text-sm text-slate-500">
              From {scholarships.length} total records
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div
            className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            aria-label="Loading scholarships"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center"
          >
            <p className="font-semibold text-red-700">
              Could not load scholarships
            </p>
            <p className="mt-2 text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Scholarship cards */}
        {!loading && !error && filteredScholarships.length > 0 && (
          <>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) => Math.max(page - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-medium ${
                      currentPage === page
                        ? "bg-sky-500 text-white"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-sky-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(page + 1, totalPages)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && !error && filteredScholarships.length === 0 && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <GraduationCap
              size={40}
              className="mx-auto text-slate-300"
            />

            <h3 className="mt-4 text-xl font-semibold text-slate-800">
              No scholarships found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try another search term or select a different country.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCountryFilter("all");
                setCurrentPage(1);
              }}
              className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllScholarships;