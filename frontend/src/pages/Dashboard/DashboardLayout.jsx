import {
  Bell,
  CalendarDays,
  ChevronRight,
  FileCheck2,
  FileText,
  GraduationCap,
  Heart,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Target,
  UserRound,
  X,
} from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { useState } from "react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "My Profile",
      path: "/dashboard/profile",
      icon: UserRound,
    },
    {
      label: "Matchmaking",
      path: "/dashboard/matches",
      icon: Target,
      badge: "12",
    },
    {
      label: "Favorites",
      path: "/dashboard/favorites",
      icon: Heart,
    },
    {
      label: "Applications",
      path: "/dashboard/applications",
      icon: FileCheck2,
    },
    {
      label: "Deadlines",
      path: "/dashboard/deadlines",
      icon: CalendarDays,
    },
    {
      label: "Documents",
      path: "/dashboard/documents",
      icon: FileText,
    },
    {
      label: "Eligibility Analysis",
      path: "/dashboard/eligibility",
      icon: GraduationCap,
    },
  ];

  const bottomNavigation = [
    {
      label: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f9fc] text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-72 flex-col
          border-r border-slate-200
          bg-white
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <NavLink
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 shadow-lg shadow-sky-200">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Scholar<span className="text-sky-500">X</span>
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Student Workspace
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `
                    group flex items-center gap-3
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-sky-50 text-sky-600 shadow-sm"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div
                        className={`
                          flex h-9 w-9 items-center justify-center rounded-lg
                          transition
                          ${
                            isActive
                              ? "bg-sky-500 text-white shadow-md shadow-sky-200"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          }
                        `}
                      >
                        <Icon className="h-4.5 w-4.5" />
                      </div>

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className={`
                            rounded-full px-2 py-0.5
                            text-[10px] font-bold
                            ${
                              isActive
                                ? "bg-sky-100 text-sky-600"
                                : "bg-slate-100 text-slate-500"
                            }
                          `}
                        >
                          {item.badge}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* AI Assistant Card */}
          <div className="mt-8 rounded-2xl bg-linear-to-br from-sky-500 to-cyan-500 p-5 text-white shadow-lg shadow-sky-100">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Sparkles className="h-5 w-5" />
            </div>

            <h3 className="text-sm font-bold">
              Need help?
            </h3>

            <p className="mt-1 text-xs leading-5 text-sky-50">
              Ask ScholarX AI about scholarships, eligibility,
              documents, or applications.
            </p>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-sky-600 transition hover:bg-sky-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask ScholarX
            </button>
          </div>

          {/* Bottom navigation */}
          <div className="mt-8 border-t border-slate-100 pt-5">
            {bottomNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3 rounded-xl px-3 py-3
                    text-sm font-medium transition
                    ${
                      isActive
                        ? "bg-sky-50 text-sky-600"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                    `
                  }
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User section */}
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-600">
              TA
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Student
              </p>

              <p className="truncate text-xs text-slate-400">
                Complete your profile
              </p>
            </div>

            <button
              type="button"
              className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-72">
        {/* Dashboard top bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Student Dashboard
              </p>

              <h2 className="text-lg font-bold text-slate-900">
                Your Scholarship Journey
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification */}
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-600"
            >
              <Bell className="h-4.5 w-4.5" />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
            </button>

            {/* Profile */}
            <button
              type="button"
              className="hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-1.5 sm:flex"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600">
                TA
              </div>

              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">
                  Student
                </p>
                <p className="text-[10px] text-slate-400">
                  My Account
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-5rem)] px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;