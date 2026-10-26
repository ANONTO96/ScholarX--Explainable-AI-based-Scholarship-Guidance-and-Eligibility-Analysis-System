import { CalendarDays, ExternalLink, MapPin, GraduationCap } from "lucide-react";

const ScholarshipCard = ({ scholarship }) => {
  const {
    title,
    country,
    last_date_to_apply,
    official_website,
  } = scholarship;

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl">
      {/* Card Header */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <GraduationCap size={25} />
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Scholarship
        </span>
      </div>

      {/* Scholarship Information */}
      <h2 className="text-xl font-semibold leading-snug text-slate-800 transition-colors group-hover:text-sky-600">
        {title || "Untitled Scholarship"}
      </h2>

      <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <MapPin size={17} className="shrink-0 text-sky-500" />
        <span>{country || "Country not specified"}</span>
      </div>

      <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
        <CalendarDays size={17} className="mt-0.5 shrink-0 text-sky-500" />
        <div>
          <p className="text-xs text-slate-400">Application deadline</p>
          <p className="mt-1 font-medium text-slate-700">
            {last_date_to_apply || "Deadline not specified"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-3 pt-6">
        {official_website ? (
          <a
            href={official_website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            Official Website
            <ExternalLink size={16} />
          </a>
        ) : (
          <span className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm text-slate-500">
            Website unavailable
          </span>
        )}
      </div>
    </article>
  );
};

export default ScholarshipCard;