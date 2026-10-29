
import { useLocation, useNavigate } from "react-router";
import { ArrowUpRight, Bell, Menu } from "lucide-react";

const AdminNavbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitles = {
    "/admin": "Dashboard Overview",
    "/admin/scholarships": "Manage Scholarships",
    "/admin/scholarships/create": "Add Scholarship",
  };

  const title =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/admin/scholarships/")
      ? "Edit Scholarship"
      : "Admin Dashboard");

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-sky-100 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-sky-50 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
            {title}
          </h2>
          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your ScholarX platform
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative rounded-xl border border-slate-100 p-2.5 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50"
        >
          <Bell size={19} />
        </button>

        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        <button
          type="button"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
        >
          <span className="hidden sm:inline">Visit website</span>
          <ArrowUpRight size={17} />
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
