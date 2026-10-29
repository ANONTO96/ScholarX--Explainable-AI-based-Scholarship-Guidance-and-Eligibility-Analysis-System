
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AlertCircle,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Edit3,
  GraduationCap,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const PAGE_SIZE = 10;

const ManageScholarships = () => {
  const navigate = useNavigate();

  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchScholarships = useCallback(async () => {
    if (!API_BASE_URL) {
      setError(
        "VITE_API_BASE_URL is not configured in your frontend environment."
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/scholarships/`
      );

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const detail =
          typeof result?.detail === "string"
            ? result.detail
            : result?.message;

        throw new Error(
          detail ||
            (response.status === 404
              ? "The scholarship listing endpoint was not found."
              : `Failed to load scholarships (HTTP ${response.status}).`)
        );
      }

      const records = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.scholarships)
            ? result.scholarships
            : null;

      if (!records) {
        throw new Error(
          "Unexpected API response. Expected a scholarship array."
        );
      }

      setScholarships(records);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load scholarships. Check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {fetchScholarships();}, [fetchScholarships]);

  const countries = useMemo(
    () =>
      [...new Set(
        scholarships
          .map((item) => item.country)
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b)),
    [scholarships]
  );

  const scholarshipTypes = useMemo(
    () =>
      [...new Set(
        scholarships
          .map((item) => item.scholarship_type)
          .filter(Boolean)
      )].sort((a, b) => a.localeCompare(b)),
    [scholarships]
  );

  const filteredScholarships = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scholarships.filter((item) => {
      const searchableValues = [
        item.title,
        item.scholarship_title,
        item.country,
        item.scholarship_type,
        ...(Array.isArray(item.cities) ? item.cities : []),
        ...(Array.isArray(item.keywords) ? item.keywords : []),
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value ?? "").toLowerCase().includes(query)
        );

      const matchesCountry =
        countryFilter === "all" || item.country === countryFilter;

      const matchesType =
        typeFilter === "all" ||
        item.scholarship_type === typeFilter;

      return matchesSearch && matchesCountry && matchesType;
    });
  }, [scholarships, search, countryFilter, typeFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredScholarships.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const paginatedScholarships = filteredScholarships.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const formatDate = (value) => {
    if (!value) return "Not specified";

    // Avoid timezone shifts for date-only strings such as YYYY-MM-DD.
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(String(value));

    const date = dateOnly
      ? new Date(`${value}T00:00:00`)
      : new Date(value);

    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setCountryFilter("all");
    setTypeFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    countryFilter !== "all" ||
    typeFilter !== "all";

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Manage Scholarships
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Search, review, and update scholarship records.
          </p>
        </div>

        <Link
          to="/admin/scholarships/create"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
        >
          <Plus size={18} />
          Add Scholarship
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
            <GraduationCap size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">
              Total records loaded
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {loading ? "—" : scholarships.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <Search size={23} />
          </div>
          <div>
            <p className="text-sm text-slate-500">
              Matching records
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-800">
              {loading ? "—" : filteredScholarships.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <section className="rounded-2xl border border-sky-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search scholarships</span>
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, country, type, city, or keyword..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>

          <select
            value={countryFilter}
            onChange={(event) => {
              setCountryFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by country"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="all">All countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Filter by scholarship type"
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="all">All types</option>
            {scholarshipTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={fetchScholarships}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:text-indigo-700"
            >
              <X size={15} />
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Error state */}
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0 text-amber-600"
            />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Could not load scholarships
              </p>
              <p className="mt-1 text-sm text-amber-700">
                {error}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchScholarships}
            disabled={loading}
            className="shrink-0 rounded-lg border border-amber-300 px-3 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50"
          >
            Try again
          </button>
        </div>
      )}

      {/* Scholarship table */}
      <section className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-800">
              Scholarship Records
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {loading
                ? "Loading records..."
                : `${filteredScholarships.length} matching record(s)`}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-4">Scholarship</th>
                <th className="px-5 py-4">Country</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Deadline</th>
                <th className="px-5 py-4">Official website</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <RefreshCw
                      size={24}
                      className="mx-auto animate-spin text-sky-600"
                    />
                    <p className="mt-3 text-sm text-slate-500">
                      Loading scholarships...
                    </p>
                  </td>
                </tr>
              ) : paginatedScholarships.length > 0 ? (
                paginatedScholarships.map((item, index) => {
                  const id = item.id ?? item.scholarship_id;
                  const title =
                    item.title ??
                    item.scholarship_title ??
                    "Untitled scholarship";

                  return (
                    <tr
                      key={id ?? `${title}-${index}`}
                      className="transition hover:bg-sky-50/40"
                    >
                      <td className="px-5 py-4">
                        <p className="max-w-xs truncate text-sm font-semibold text-slate-800">
                          {title}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          ID: {id ?? "Not provided"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700">
                          {item.country || "Not specified"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {item.scholarship_type || "Not specified"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatDate(item.last_date_to_apply)}
                      </td>

                      <td className="px-5 py-4">
                        {item.official_website ? (
                          <a
                            href={item.official_website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-sky-700 hover:text-indigo-700"
                          >
                            Visit website
                            <ArrowUpRight size={14} />
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400">
                            Not provided
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          disabled={id == null}
                          onClick={() =>
                            navigate(`/admin/scholarships/${id}`)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Edit3 size={15} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center">
                    <GraduationCap
                      size={32}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 text-sm font-semibold text-slate-700">
                      {error
                        ? "Scholarship records are unavailable"
                        : "No scholarships found"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {error
                        ? "Resolve the API issue and try again."
                        : "Try another search or add a scholarship."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filteredScholarships.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
            <p className="text-sm text-slate-500">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(
                safePage * PAGE_SIZE,
                filteredScholarships.length
              )}{" "}
              of {filteredScholarships.length}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                aria-label="Previous page"
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="min-w-20 text-center text-sm font-medium text-slate-600">
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                aria-label="Next page"
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageScholarships;
