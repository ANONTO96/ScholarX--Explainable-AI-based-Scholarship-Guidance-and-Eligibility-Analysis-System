
import { Link } from "react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Clock3,
  GraduationCap,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

const stats = [
  {
    label: "Total Scholarships",
    value: "—",
    description: "Scholarships in the database",
    icon: GraduationCap,
    color: "bg-sky-50 text-sky-600",
  },
  {
    label: "Active Opportunities",
    value: "—",
    description: "Currently available opportunities",
    icon: BookOpen,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    label: "Upcoming Deadlines",
    value: "—",
    description: "Scholarships closing soon",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  {
    label: "Admin Access",
    value: "Protected",
    description: "Administrative workspace",
    icon: ShieldCheck,
    color: "bg-emerald-50 text-emerald-600",
  },
];

const AdminOverview = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl bg-linear-to-r from-sky-600 via-sky-600 to-indigo-700 p-6 text-white shadow-sm sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
            <ShieldCheck size={14} />
            ScholarX Administration
          </span>

          <h1 className="mt-4 text-2xl font-bold sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-sky-50 sm:text-base">
            Manage scholarship information and keep opportunities accurate
            for students exploring their study-abroad options.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/admin/scholarships/create"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
            >
              <Plus size={17} />
              Add Scholarship
            </Link>

            <Link
              to="/admin/scholarships"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Manage Scholarships
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>

        <GraduationCap
          size={190}
          strokeWidth={0.8}
          className="absolute -bottom-12 -right-8 hidden text-white/10 sm:block"
        />
      </section>

      {/* Statistics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            Platform Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A snapshot of scholarship management.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, description, icon: Icon, color }) => (
            <article
              key={label}
              className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {label}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-slate-800">
                    {value}
                  </p>
                </div>

                <div className={`rounded-xl p-3 ${color}`}>
                  <Icon size={21} />
                </div>
              </div>

              <p className="mt-3 text-xs leading-5 text-slate-500">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Management actions */}
      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
              <GraduationCap size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                Scholarship Management
              </h2>
              <p className="text-sm text-slate-500">
                Maintain your scholarship catalogue.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/admin/scholarships"
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-sky-200 hover:bg-sky-50/60"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  View all scholarships
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Browse and update existing records.
                </p>
              </div>
              <ArrowUpRight size={18} className="text-sky-600" />
            </Link>

            <Link
              to="/admin/scholarships/create"
              className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:border-sky-200 hover:bg-sky-50/60"
            >
              <div>
                <p className="text-sm font-semibold text-slate-700">
                  Create a scholarship
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Add a new opportunity to ScholarX.
                </p>
              </div>
              <Plus size={18} className="text-sky-600" />
            </Link>
          </div>
        </article>

        <article className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
              <RefreshCw size={22} />
            </div>
            <div>
              <h2 className="font-bold text-slate-800">
                Data & Maintenance
              </h2>
              <p className="text-sm text-slate-500">
                Keep scholarship information reliable.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">
              Data accuracy matters
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review application deadlines, official links, and scholarship
              content before publishing updates for students.
            </p>
          </div>

          <Link
            to="/admin/scholarships"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 hover:text-indigo-700"
          >
            Review scholarship records
            <ArrowRight size={16} />
          </Link>
        </article>
      </section>

      {/* Recent activity placeholder */}
      <section className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-slate-800">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-500">
              Activity tracking can be added as the admin system grows.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            Not connected yet
          </span>
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center">
          <Clock3 size={25} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-600">
            No activity records available
          </p>
          <p className="mt-1 text-xs text-slate-400">
            An activity log can be implemented in a future backend update.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
