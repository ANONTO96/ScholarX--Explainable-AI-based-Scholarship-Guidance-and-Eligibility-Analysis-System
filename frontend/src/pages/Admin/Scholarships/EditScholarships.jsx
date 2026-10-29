import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  AlertCircle,
  LoaderCircle,
  Save,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialForm = {
  scholarship_title: "",
  country: "",
  last_date_to_apply: "",
  official_website: "",
  bd_ambassy_website: "",
  scholarship_type: "",
  cities: [],
  keywords: [],
  programs: [],
  documents: [],
  coverage: [],
  contacts: [],
};

const parseList = (value) => {
  if (Array.isArray(value)) return value;

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const normalizeRecord = (result) => {
  const record = result.data ?? result.scholarship ?? result;

  return {
    scholarship_title:
      record.title ?? record.scholarship_title ?? "",
    country: record.country ?? "",
    last_date_to_apply: record.last_date_to_apply
      ? String(record.last_date_to_apply).slice(0, 10)
      : "",
    official_website: record.official_website ?? "",
    bd_ambassy_website: record.bd_ambassy_website ?? "",
    scholarship_type: record.scholarship_type ?? "",
    cities: parseList(record.cities),
    keywords: parseList(record.keywords),
    programs: Array.isArray(record.programs) ? record.programs : [],
    documents: Array.isArray(record.documents) ? record.documents : [],
    coverage: Array.isArray(record.coverage) ? record.coverage : [],
    contacts: Array.isArray(record.contacts) ? record.contacts : [],
  };
};

const EditScholarship = () => {
  const { scholarshipId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [originalData, setOriginalData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadScholarship = async () => {
      if (!API_BASE_URL) {
        if (!cancelled) {
          setError("API_BASE_URL is not configured.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/scholarships/${scholarshipId}`
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Scholarship not found. Check your backend GET-by-ID route."
              : `Unable to load scholarship (HTTP ${response.status}).`
          );
        }

        const result = await response.json();
        const form = normalizeRecord(result);

        if (!cancelled) {
          setFormData(form);
          setOriginalData(form);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load scholarship.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadScholarship();

    return () => {
      cancelled = true;
    };
  }, [scholarshipId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!API_BASE_URL) {
      toast.error("VITE_API_BASE_URL is not configured.");
      return;
    }

    const title = formData.scholarship_title.trim();

    if (!title) {
      toast.error("Scholarship title is required.");
      return;
    }

    const payload = {};

    const scalarFields = [
      "scholarship_title",
      "country",
      "last_date_to_apply",
      "official_website",
      "bd_ambassy_website",
      "scholarship_type",
    ];

    for (const field of scalarFields) {
      const value =
        field === "scholarship_title"
          ? title
          : formData[field].trim();

      if (value !== originalData[field]) {
        payload[field] = value || null;
      }
    }

    for (const field of ["cities", "keywords"]) {
      if (
        JSON.stringify(formData[field]) !==
        JSON.stringify(originalData[field])
      ) {
        payload[field] = formData[field];
      }
    }

    for (const field of [
      "programs",
      "documents",
      "coverage",
      "contacts",
    ]) {
      if (
        JSON.stringify(formData[field]) !==
        JSON.stringify(originalData[field])
      ) {
        let value = formData[field];

        if (typeof value === "string") {
          try {
            value = JSON.parse(value);
          } catch {
            toast.error(`${field} must contain valid JSON.`);
            return;
          }
        }

        if (!Array.isArray(value)) {
          toast.error(`${field} must be a JSON array.`);
          return;
        }

        payload[field] = value;
      }
    }

    if (Object.keys(payload).length === 0) {
      toast("No changes to save.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/scholarships/${scholarshipId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = result.detail;

        throw new Error(
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((item) => item.msg).join(", ")
              : result.message || "Failed to update scholarship."
        );
      }

      toast.success("Scholarship updated successfully.");
      navigate("/admin/scholarships");
    } catch (err) {
      toast.error(err.message || "Unable to update scholarship.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

  const labelClass = "text-sm font-semibold text-slate-700";

  const jsonFields = [
    {
      name: "programs",
      label: "Programs",
      description: "JSON array using your backend program schema.",
    },
    {
      name: "documents",
      label: "Required documents",
      description: "JSON array using your backend document schema.",
    },
    {
      name: "coverage",
      label: "Scholarship coverage",
      description: "JSON array using your backend coverage schema.",
    },
    {
      name: "contacts",
      label: "Contact information",
      description: "JSON array using your backend contact schema.",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-sky-100 bg-white">
        <LoaderCircle size={30} className="animate-spin text-sky-600" />
        <p className="mt-3 text-sm text-slate-500">
          Loading scholarship details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-white p-6">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 shrink-0 text-amber-600"
            size={22}
          />
          <div>
            <h1 className="font-bold text-slate-800">
              Could not load scholarship
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {error}
            </p>
          </div>
        </div>

        <Link
          to="/admin/scholarships"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-indigo-700"
        >
          <ArrowLeft size={16} />
          Back to scholarships
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          to="/admin/scholarships"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to scholarships
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-slate-800">
          Edit Scholarship
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the details for scholarship ID {scholarshipId}.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-7"
      >
        <section>
          <h2 className="text-lg font-bold text-slate-800">
            Basic information
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>
              Scholarship title *
              <input
                name="scholarship_title"
                value={formData.scholarship_title}
                onChange={handleChange}
                required
                maxLength={255}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Country
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Application deadline
              <input
                type="date"
                name="last_date_to_apply"
                value={formData.last_date_to_apply || ""}
                onChange={handleChange}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Scholarship type
              <input
                name="scholarship_type"
                value={formData.scholarship_type}
                onChange={handleChange}
                placeholder="e.g. Government, University"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Cities
              <input
                value={formData.cities.join(", ")}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    cities: event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="Beijing, Shanghai"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Separate cities with commas.
              </span>
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Keywords
              <input
                value={formData.keywords.join(", ")}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    keywords: event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  }))
                }
                placeholder="engineering, undergraduate, fully funded"
                className={inputClass}
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Separate keywords with commas.
              </span>
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Official scholarship website
              <input
                type="url"
                name="official_website"
                value={formData.official_website}
                onChange={handleChange}
                placeholder="https://example.com"
                className={inputClass}
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Bangladesh embassy website
              <input
                type="url"
                name="bd_ambassy_website"
                value={formData.bd_ambassy_website}
                onChange={handleChange}
                placeholder="https://example.gov.bd"
                className={inputClass}
              />
            </label>
          </div>
        </section>

        <section className="border-t border-slate-100 pt-5">
          <h2 className="text-lg font-bold text-slate-800">
            Related information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit these fields as JSON arrays. Only modified fields are sent
            to the backend.
          </p>

          <div className="mt-4 space-y-5">
            {jsonFields.map((field) => (
              <label key={field.name} className={`block ${labelClass}`}>
                {field.label}
                <textarea
                  rows={6}
                  value={
                    typeof formData[field.name] === "string"
                      ? formData[field.name]
                      : JSON.stringify(formData[field.name], null, 2)
                  }
                  onChange={(event) => {
                    const value = event.target.value;

                    setFormData((current) => ({
                      ...current,
                      [field.name]: value,
                    }));
                  }}
                  className={`${inputClass} font-mono text-xs`}
                  spellCheck={false}
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  {field.description}
                </span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-5 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/admin/scholarships")}
            disabled={saving}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditScholarship;