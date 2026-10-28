
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  Globe,
  LoaderCircle,
  Save,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const emptyForm = {
  scholarship_title: "",
  country: "",
  last_date_to_apply: "",
  official_website: "",
  bd_ambassy_website: "",
  scholarship_type: "",
  cities: "",
  keywords: "",
};

const initialRelatedData = {
  programs: "[]",
  documents: "[]",
  coverage: "[]",
  contacts: "[]",
};

const relatedHelp = {
  programs: `[
  {
    "program": "Master's",
    "duration": "2 years",
    "study_language": ["English"]
  }
]`,
  documents: `[
  {
    "document_name": "Passport",
    "requirement": "Valid passport",
    "condition_text": null,
    "mandatory": true,
    "source_sentence": null
  }
]`,
  coverage: `[
  {
    "benefit_type": "Tuition",
    "description": "Full tuition coverage",
    "program": null,
    "amount": null,
    "currency": null,
    "period": null,
    "coverage": "Full",
    "applicability": null
  }
]`,
  contacts: `[
  {
    "contact_type": "Official website",
    "value": "https://example.com"
  }
]`,
};

const CreateScholarship = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(emptyForm);
  const [relatedData, setRelatedData] = useState(initialRelatedData);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleRelatedChange = (event) => {
    const { name, value } = event.target;
    setRelatedData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!API_BASE_URL) {
      toast.error("VITE_API_BASE_URL is not configured.");
      return;
    }

    if (!formData.scholarship_title.trim()) {
      toast.error("Scholarship title is required.");
      return;
    }

    let relatedPayload;

    try {
      relatedPayload = {
        programs: JSON.parse(relatedData.programs),
        documents: JSON.parse(relatedData.documents),
        coverage: JSON.parse(relatedData.coverage),
        contacts: JSON.parse(relatedData.contacts),
      };

      for (const [key, value] of Object.entries(relatedPayload)) {
        if (!Array.isArray(value)) {
          throw new Error(`${key} must be a JSON array.`);
        }
      }
    } catch (error) {
      toast.error(`Invalid related data: ${error.message}`);
      return;
    }

    const payload = {
      scholarship_title: formData.scholarship_title.trim(),
      country: formData.country.trim() || null,
      last_date_to_apply: formData.last_date_to_apply || null,
      official_website: formData.official_website.trim() || null,
      bd_ambassy_website: formData.bd_ambassy_website.trim() || null,
      scholarship_type: formData.scholarship_type.trim() || null,
      cities: formData.cities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      keywords: formData.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      ...relatedPayload,
    };

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/scholarships/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = result.detail;
        const message =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((item) => item.msg).join(", ")
              : result.message || `Request failed (${response.status}).`;

        throw new Error(message);
      }

      toast.success("Scholarship created successfully.");
      navigate("/admin/scholarships");
    } catch (error) {
      toast.error(error.message || "Unable to create scholarship.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100";

  const labelClass = "text-sm font-semibold text-slate-700";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          to="/admin/scholarships"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to scholarships
        </Link>

        <h1 className="mt-4 text-2xl font-bold text-slate-800">
          Add Scholarship
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add scholarship details and related records.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
              <Globe size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Basic Information</h2>
              <p className="mt-1 text-sm text-slate-500">
                General details, deadline, and official links.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>
              Scholarship title *
              <input
                name="scholarship_title"
                value={formData.scholarship_title}
                onChange={handleChange}
                required
                maxLength={255}
                className={inputClass}
                placeholder="Chinese Government Scholarship"
              />
            </label>

            <label className={labelClass}>
              Country
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={inputClass}
                placeholder="China"
              />
            </label>

            <label className={labelClass}>
              Scholarship type
              <input
                name="scholarship_type"
                value={formData.scholarship_type}
                onChange={handleChange}
                className={inputClass}
                placeholder="Government, University, etc."
              />
            </label>

            <label className={labelClass}>
              Application deadline
              <input
                type="date"
                name="last_date_to_apply"
                value={formData.last_date_to_apply}
                onChange={handleChange}
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Cities
              <input
                name="cities"
                value={formData.cities}
                onChange={handleChange}
                className={inputClass}
                placeholder="Beijing, Shanghai"
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Separate values with commas.
              </span>
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Keywords
              <input
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                className={inputClass}
                placeholder="Fully funded, Master's, Engineering"
              />
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Separate values with commas.
              </span>
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Official scholarship website
              <input
                type="url"
                name="official_website"
                value={formData.official_website}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.com"
              />
            </label>

            <label className={`${labelClass} sm:col-span-2`}>
              Bangladesh embassy website
              <input
                type="url"
                name="bd_ambassy_website"
                value={formData.bd_ambassy_website}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://example.gov.bd"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <FileText size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">Related Records</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter valid JSON arrays using the examples as a guide.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {Object.entries(relatedHelp).map(([key, example]) => (
              <label key={key} className={`block ${labelClass}`}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
                <textarea
                  name={key}
                  value={relatedData[key]}
                  onChange={handleRelatedChange}
                  rows={7}
                  spellCheck={false}
                  className={`${inputClass} resize-y font-mono text-xs`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setRelatedData((current) => ({
                      ...current,
                      [key]: example,
                    }))
                  }
                  className="mt-2 text-xs font-semibold text-sky-700 hover:text-indigo-700"
                >
                  Restore example
                </button>
              </label>
            ))}
          </div>
        </section>

        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/admin/scholarships")}
            disabled={saving}
            className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {saving ? "Saving..." : "Save Scholarship"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateScholarship;
