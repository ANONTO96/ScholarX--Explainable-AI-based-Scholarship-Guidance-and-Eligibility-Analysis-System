
import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  GraduationCap,
  PlusCircle,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    {
      label: "Overview",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Manage Scholarships",
      path: "/admin/scholarships",
      icon: GraduationCap,
    },
    {
      label: "Add Scholarship",
      path: "/admin/scholarships/create",
      icon: PlusCircle,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-sky-100 bg-white">
      {/* Brand */}
      <div className="flex h-20 items-center gap-3 border-b border-sky-100 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 shadow-lg shadow-sky-200">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            Scholar<span className="text-sky-600">X</span>
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Administration
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        {navItems.map(({ label, path, icon: Icon, end }) => (
          <NavLink
            key={path}
            to={path}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-sky-50 text-sky-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-sky-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={19} />
                <span className="flex-1">{label}</span>
                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-600" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="space-y-2 border-t border-sky-100 p-4">
        <div className="flex items-center gap-2 rounded-xl bg-sky-50 p-3">
          <ShieldCheck size={18} className="shrink-0 text-sky-600" />
          <div>
            <p className="text-xs font-semibold text-slate-700">
              Admin workspace
            </p>
            <p className="text-xs text-slate-500">
              ScholarX management
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-sky-700"
        >
          <ArrowLeft size={18} />
          Back to website
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
