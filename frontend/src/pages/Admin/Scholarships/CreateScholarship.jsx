
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  FileText,
  Globe,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialForm = {
  scholarship_title: "",
  country: "",
  last_date_to_apply: "",
  official_website: "",
  bd_ambassy_website: "",
  sections: [{ section_title: "", content: "" }],
};

const CreateScholarship = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSectionChange = (index, field, value) => {
    setFormData((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) =>
        sectionIndex === index
          ? { ...section, [field]: value }
          : section
      ),
    }));
  };

  const addSection = () => {
    setFormData((current) => ({
      ...current,
      sections: [
        ...current.sections,
        { section_title: "", content: "" },
      ],
    }));
  };

  const removeSection = (index) => {
    setFormData((current) => ({
      ...current,
      sections: current.sections.filter(
        (_, sectionIndex) => sectionIndex !== index
      ),
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

    const sections = formData.sections.map((section) => ({
      section_title: section.section_title.trim(),
      content: section.content.trim(),
    }));

    if (
      sections.some(
        (section) => !section.section_title || !section.content
      )
    ) {
      toast.error("Complete or remove every empty content section.");
      return;
    }

    const payload = {
      scholarship_title: title,
      country: formData.country.trim() || null,
      last_date_to_apply: formData.last_date_to_apply || null,
      official_website: formData.official_website.trim() || null,
      bd_ambassy_website: formData.bd_ambassy_website.trim() || null,
      sections,
    };

    setSaving(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/admin/scholarships/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add your existing authentication header here if required.
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof result.detail === "string"
            ? result.detail
            : result.message || "Failed to create scholarship.";

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
      {/* Heading */}
      <div>
        <Link
          to="/admin/scholarships"
          className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-indigo-700"
        >
          <ArrowLeft size={17} />
          Back to scholarships
        </Link>

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-slate-800">
            Add Scholarship
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter the opportunity details and information students need.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic information */}
        <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
            <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
              <Globe size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                Basic Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                General scholarship details and official links.
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
                placeholder="e.g. Chinese Government Scholarship"
                className={inputClass}
              />
            </label>

            <label className={labelClass}>
              Country
              <input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. China"
                className={inputClass}
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

            <label className={`${labelClass} sm:col-span-2`}>
              Official scholarship website
              <input
                type="url"
                name="official_website"
                value={formData.official_website}
                onChange={handleChange}
                placeholder="https://example.edu/scholarships"
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

        {/* Content sections */}
        <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FileText size={21} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">
                  Scholarship Content
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Add sections such as overview, benefits, or application process.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-2 rounded-xl border border-sky-200 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              <Plus size={16} />
              Add section
            </button>
          </div>

          <div className="mt-6 space-y-5">
            {formData.sections.map((section, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-slate-700">
                    Section {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    disabled={formData.sections.length === 1}
                    title="Remove section"
                    aria-label={`Remove section ${index + 1}`}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <label className={labelClass}>
                  Section title *
                  <input
                    value={section.section_title}
                    onChange={(event) =>
                      handleSectionChange(
                        index,
                        "section_title",
                        event.target.value
                      )
                    }
                    required
                    maxLength={255}
                    placeholder="e.g. Scholarship Benefits"
                    className={inputClass}
                  />
                </label>

                <label className={`${labelClass} mt-4 block`}>
                  Content *
                  <textarea
                    value={section.content}
                    onChange={(event) =>
                      handleSectionChange(
                        index,
                        "content",
                        event.target.value
                      )
                    }
                    required
                    rows={5}
                    placeholder="Describe the scholarship information..."
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </div>
            ))}
          </div>
        </section>

        {/* Form actions */}
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
