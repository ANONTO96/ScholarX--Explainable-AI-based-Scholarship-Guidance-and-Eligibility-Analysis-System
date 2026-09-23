import {
  ArrowRight,
  Award,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileCheck2,
  GraduationCap,
  Heart,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { NavLink } from "react-router";
import { useDashboard } from "../../context/Dashboard/useDashboard";

const DashboardOverview = () => {
  const {
    profileCompletion,
    matches: evaluatedMatches,
    matchStats,
    favorites,
    applications,
    deadlines: dashboardDeadlines,
    applicationStats,
  } = useDashboard();

  /*
   * =========================================================
   * Overview Data
   * =========================================================
   */

  // Top 3 matches from the centralized eligibility results
  const topMatches = [...evaluatedMatches]
    .sort((a, b) => {
      const scoreA =
        a.analysis?.score ??
        a.analysis?.matchScore ??
        0;

      const scoreB =
        b.analysis?.score ??
        b.analysis?.matchScore ??
        0;

      return scoreB - scoreA;
    })
    .slice(0, 3)
    .map(({ opportunity, analysis }) => ({
      id: opportunity.id,
      title: opportunity.title,
      provider:
        opportunity.provider ||
        opportunity.organization ||
        "Scholarship Provider",
      country:
        opportunity.country ||
        opportunity.destination ||
        "—",
      degree:
        opportunity.degree ||
        opportunity.studyLevel ||
        "—",
      funding:
        opportunity.funding ||
        opportunity.fundingType ||
        "Funding information unavailable",
      score:
        analysis?.score ??
        analysis?.matchScore ??
        0,
      deadline: opportunity.deadline,
    }));

  // Upcoming deadlines from the centralized provider
  const upcomingDeadlines = dashboardDeadlines
    .slice(0, 3)
    .map(({ opportunity, deadlineDate, daysRemaining }) => ({
      id: opportunity.id,
      title: opportunity.title,
      date: deadlineDate,
      daysRemaining,
    }));

  /*
   * =========================================================
   * Statistics
   * =========================================================
   */

  const deadlinesWithin30Days =
    dashboardDeadlines.filter(
      ({ daysRemaining }) =>
        daysRemaining >= 0 &&
        daysRemaining <= 30
    ).length;

  const stats = [
    {
      label: "Scholarship Matches",
      value: String(matchStats.strong).padStart(2, "0"),
      description: "Strong matches found",
      icon: Target,
      href: "/dashboard/matches",
    },
    {
      label: "Favorites",
      value: String(favorites.length).padStart(2, "0"),
      description: "Scholarships saved",
      icon: Heart,
      href: "/dashboard/favorites",
    },
    {
      label: "Applications",
      value: String(
        applicationStats?.active ??
        applications.filter(
          (app) =>
            app.status === "planning" ||
            app.status === "applying"
        ).length
      ).padStart(2, "0"),
      description: "Currently active",
      icon: FileCheck2,
      href: "/dashboard/applications",
    },
    {
      label: "Upcoming Deadlines",
      value: String(
        deadlinesWithin30Days
      ).padStart(2, "0"),
      description: "Within 30 days",
      icon: CalendarDays,
      href: "/dashboard/deadlines",
    },
  ];

  /*
   * =========================================================
   * Helpers
   * =========================================================
   */

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return "Deadline unavailable";
    }

    const date = new Date(
      `${deadline}T23:59:59`
    );

    if (Number.isNaN(date.getTime())) {
      return deadline;
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const getDeadlineMonth = (date) => {
    if (!date) {
      return "";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        month: "short",
      }
    );
  };

  const getDeadlineDay = (date) => {
    if (!date) {
      return "";
    }

    return date.toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
      }
    );
  };

  const getDaysLabel = (daysRemaining) => {
    if (daysRemaining === 0) {
      return "Due today";
    }

    if (daysRemaining === 1) {
      return "1 day left";
    }

    return `${daysRemaining} days left`;
  };

  return (
    <div className="mx-auto max-w-6xl py-6 lg:py-8 space-y-6">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-sky-500 via-sky-500 to-cyan-500 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Sparkles className="h-5 w-5" />
            </div>

            <span className="text-sm font-medium text-sky-50">
              Welcome back
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Your scholarship journey starts here.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-sky-50 sm:text-base">
            Track your matches, stay ahead of deadlines, and
            manage every step of your scholarship journey from
            one place.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <NavLink
              to="/dashboard/matches"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-sky-600 transition hover:bg-sky-50"
            >
              Explore Matches
              <ArrowRight className="h-4 w-4" />
            </NavLink>

            <NavLink
              to="/dashboard/profile"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Complete Profile
            </NavLink>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-white/5" />
      </section>

      {/* Profile completion */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-sky-50">
              <svg
                className="absolute h-14 w-14 -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-slate-100"
                />

                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${profileCompletion}, 100`}
                  className="text-sky-500"
                />
              </svg>

              <span className="relative z-10 text-sm font-bold text-sky-600">
                {profileCompletion.percentage}%
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Profile completion
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Complete your profile to improve your scholarship
                matches.
              </p>
            </div>
          </div>

          <NavLink
            to="/dashboard/profile"
            className="flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700"
          >
            Complete profile
            <ChevronRight className="h-4 w-4" />
          </NavLink>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-sky-500"
            style={{
              width: `${profileCompletion}%`,
            }}
          />
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <NavLink
              key={stat.label}
              to={stat.href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500 group-hover:text-white group-hover:bg-sky-600 group-hover:rotate-3 transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>

                <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-sky-500" />
              </div>

              <p className="mt-5 text-3xl font-bold tracking-tight text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {stat.label}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </NavLink>
          );
        })}
      </section>

      {/* Main grid */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Matchmaking */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5 sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-sky-500" />

                <h2 className="font-bold text-slate-900">
                  Your Top Matches
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Scholarships ranked by your profile compatibility
              </p>
            </div>

            <NavLink
              to="/dashboard/matches"
              className="text-xs font-bold text-sky-600 hover:text-sky-700"
            >
              View all
            </NavLink>
          </div>

          <div className="divide-y divide-slate-100">
            {topMatches.map((match) => (
              <div
                key={match.id}
                className="p-5 transition hover:bg-slate-50 sm:px-6"
              >
                <div className="flex gap-4">
                  <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500 sm:flex">
                    <Award className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {match.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400">
                          {match.provider} · {match.country} ·{" "}
                          {match.degree}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-start rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                        <TrendingUp className="h-3.5 w-3.5" />
                        {match.score}% match
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-600">
                        {match.funding}
                      </span>

                      <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-500">
                        <Clock3 className="h-3 w-3" />
                        {formatDeadline(match.deadline)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deadlines */}
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sky-500" />

                <h2 className="font-bold text-slate-900">
                  Upcoming Deadlines
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Don't miss your next opportunity
              </p>
            </div>

            <NavLink
              to="/dashboard/deadlines"
              className="text-xs font-bold text-sky-600"
            >
              View all
            </NavLink>
          </div>

          <div className="divide-y divide-slate-100">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex gap-4 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-sky-50">
                  <span className="text-[10px] font-bold uppercase text-sky-500">
                    {getDeadlineMonth(
                      deadline.date
                    )}
                  </span>

                  <span className="text-lg font-bold leading-none text-sky-700">
                    {getDeadlineDay(
                      deadline.date
                    )}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-slate-800">
                    {deadline.title}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 className="h-3 w-3" />
                    {getDaysLabel(
                      deadline.daysRemaining
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Bottom section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Eligibility */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-sky-500" />

                <h2 className="font-bold text-slate-900">
                  Eligibility Overview
                </h2>
              </div>

              <p className="mt-1 text-xs text-slate-400">
                Based on your latest profile analysis
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-lg font-bold text-emerald-600">
              {matchStats.total > 0
                ? Math.round(
                    (matchStats.strong /
                      matchStats.total) *
                      100
                  )
                : 0}
              %
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Strong matches found
              </span>

              <span className="font-bold text-emerald-600">
                {matchStats.strong}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Needs review
              </span>

              <span className="font-bold text-amber-500">
                {matchStats.review}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Not eligible
              </span>

              <span className="font-bold text-rose-500">
                {matchStats.notEligible}
              </span>
            </div>
          </div>

          <NavLink
            to="/eligibility-analysis"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            View Full Analysis
            <ArrowRight className="h-4 w-4" />
          </NavLink>
        </section>

        {/* Quick Actions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-sky-500" />

            <h2 className="font-bold text-slate-900">
              Quick Actions
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Continue where you left off
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <NavLink
              to="/dashboard/matches"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-500 group-hover:bg-white">
                <Target className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Find Scholarships
                </p>

                <p className="text-[11px] text-slate-400">
                  Explore your matches
                </p>
              </div>
            </NavLink>

            <NavLink
              to="/dashboard/documents"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-500 group-hover:bg-white">
                <FileCheck2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Check Documents
                </p>

                <p className="text-[11px] text-slate-400">
                  Review your checklist
                </p>
              </div>
            </NavLink>

            <NavLink
              to="/dashboard/favorites"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-500 group-hover:bg-white">
                <Bookmark className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Saved Scholarships
                </p>

                <p className="text-[11px] text-slate-400">
                  Review your favorites
                </p>
              </div>
            </NavLink>

            <NavLink
              to="/dashboard/applications"
              className="group flex items-center gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-sky-200 hover:bg-sky-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-500 group-hover:bg-white">
                <FileCheck2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-bold text-slate-800">
                  Track Applications
                </p>

                <p className="text-[11px] text-slate-400">
                  Check application progress
                </p>
              </div>
            </NavLink>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardOverview;