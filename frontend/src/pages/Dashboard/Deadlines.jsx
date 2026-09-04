import {
    AlertCircle,
    ArrowRight,
    Award,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Filter,
    Globe2,
    GraduationCap,
    Search,
    Timer,
    XCircle,
} from "lucide-react";
import {
    NavLink,
} from "react-router";
import {
    useMemo,
    useState,
} from "react";

import opportunities from "../../data/opportunities.json";

/* ========================================================= */
/* Constants */
/* ========================================================= */

const CATEGORY_OPTIONS = [
    "All",
    "Scholarship",
    "Internship",
    "Competition",
    "Exchange Program",
    "Fellowship",
    "Conference",
    "Hackathon",
];

const RANGE_OPTIONS = [
    {
        value: "all",
        label: "All upcoming",
    },
    {
        value: "7",
        label: "Next 7 days",
    },
    {
        value: "30",
        label: "Next 30 days",
    },
    {
        value: "90",
        label: "Next 90 days",
    },
    {
        value: "180",
        label: "Next 6 months",
    },
];

/* ========================================================= */
/* Helpers */
/* ========================================================= */

function parseDeadline(deadline) {
    if (!deadline) {
        return null;
    }

    const date = new Date(
        `${deadline}T23:59:59`
    );

    return Number.isNaN(date.getTime())
        ? null
        : date;
}

function getDaysRemaining(deadline) {
    const deadlineDate =
        parseDeadline(deadline);

    if (!deadlineDate) {
        return null;
    }

    const now = new Date();

    const difference =
        deadlineDate.getTime() -
        now.getTime();

    return Math.ceil(
        difference /
            (1000 * 60 * 60 * 24)
    );
}

function formatDeadline(deadline) {
    const date =
        parseDeadline(deadline);

    if (!date) {
        return "Deadline unavailable";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}

function formatMonth(deadline) {
    const date =
        parseDeadline(deadline);

    if (!date) {
        return "Other";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        }
    );
}

function getUrgency(days) {
    if (days === null) {
        return {
            label: "Unknown",
            className:
                "border-slate-200 bg-slate-50 text-slate-500",
            iconClass:
                "text-slate-400",
        };
    }

    if (days < 0) {
        return {
            label: "Closed",
            className:
                "border-rose-200 bg-rose-50 text-rose-600",
            iconClass:
                "text-rose-500",
        };
    }

    if (days <= 7) {
        return {
            label: "Due soon",
            className:
                "border-rose-200 bg-rose-50 text-rose-600",
            iconClass:
                "text-rose-500",
        };
    }

    if (days <= 30) {
        return {
            label: "Upcoming",
            className:
                "border-amber-200 bg-amber-50 text-amber-600",
            iconClass:
                "text-amber-500",
        };
    }

    if (days <= 90) {
        return {
            label: "Plan ahead",
            className:
                "border-sky-200 bg-sky-50 text-sky-600",
            iconClass:
                "text-sky-500",
        };
    }

    return {
        label: "Later",
        className:
            "border-slate-200 bg-slate-50 text-slate-500",
        iconClass:
            "text-slate-400",
    };
}

function getDeadlineText(days) {
    if (days === null) {
        return "Deadline not specified";
    }

    if (days < 0) {
        return "Deadline passed";
    }

    if (days === 0) {
        return "Due today";
    }

    if (days === 1) {
        return "1 day left";
    }

    return `${days} days left`;
}

function getDeadlineProgress(days) {
    if (days === null || days < 0) {
        return 0;
    }

    const maxDays = 365;

    const progress =
        ((maxDays - days) / maxDays) * 100;

    return Math.min(
        Math.max(progress, 5),
        100
    );
}

/* ========================================================= */
/* Small Components */
/* ========================================================= */

function StatCard({
    icon: Icon,
    label,
    value,
    description,
    iconClass = "text-sky-600",
    bgClass = "bg-sky-50",
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
            "
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                        {description}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${bgClass}
                        ${iconClass}
                    `}
                >
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function FilterSelect({
    value,
    onChange,
    children,
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="
                    h-10
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-3
                    pr-9
                    text-sm
                    font-medium
                    text-slate-700
                    outline-none
                    transition
                    focus:border-sky-400
                    focus:ring-4
                    focus:ring-sky-100
                "
            >
                {children}
            </select>

            <ChevronDown
                className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    text-slate-400
                "
            />
        </div>
    );
}

function DeadlineBadge({
    days,
}) {
    const urgency =
        getUrgency(days);

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                px-2.5
                py-1
                text-[10px]
                font-bold
                ${urgency.className}
            `}
        >
            <Clock3
                className={`
                    h-3
                    w-3
                    ${urgency.iconClass}
                `}
            />

            {getDeadlineText(days)}
        </span>
    );
}

/* ========================================================= */
/* Deadline Card */
/* ========================================================= */

function DeadlineCard({
    opportunity,
}) {
    const days =
        getDaysRemaining(
            opportunity.deadline
        );

    const urgency =
        getUrgency(days);

    const progress =
        getDeadlineProgress(days);

    const degrees =
        Array.isArray(
            opportunity.degree
        )
            ? opportunity.degree.join(
                  ", "
              )
            : opportunity.degree ||
              "Not specified";

    return (
        <div
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-sky-200
                hover:shadow-lg
            "
        >
            {/* ================================================= */}
            {/* Top Header */}
            {/* ================================================= */}

            <div
                className="
                    border-b
                    border-slate-100
                    bg-linear-to-br
                    from-sky-50/80
                    via-white
                    to-blue-50/60
                    p-4
                "
            >
                <div className="flex items-start justify-between gap-3">
                    {/* Category */}
                    <span
                        className="
                            inline-flex
                            items-center
                            rounded-full
                            border
                            border-sky-200
                            bg-white
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            text-sky-600
                            shadow-sm
                        "
                    >
                        {opportunity.category}
                    </span>

                    {/* Deadline badge */}
                    <DeadlineBadge
                        days={days}
                    />
                </div>

                {/* Title */}
                <div className="mt-4">
                    <h3
                        className="
                            line-clamp-2
                            text-base
                            font-bold
                            leading-6
                            text-slate-900
                            transition-colors
                            group-hover:text-sky-600
                        "
                    >
                        {opportunity.title}
                    </h3>

                    <p className="mt-1.5 text-xs font-medium text-slate-400">
                        {opportunity.provider ||
                            "Provider not specified"}
                    </p>
                </div>
            </div>

            {/* ================================================= */}
            {/* Content */}
            {/* ================================================= */}

            <div className="p-4">
                {/* ================================================= */}
                {/* Deadline */}
                {/* ================================================= */}

                <div
                    className={`
                        rounded-xl
                        border
                        p-3
                        ${urgency.className}
                    `}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white/70
                                "
                            >
                                <CalendarDays className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">
                                <p className="text-[9px] font-bold uppercase tracking-wider opacity-70">
                                    Application Deadline
                                </p>

                                <p className="mt-0.5 text-sm font-bold">
                                    {formatDeadline(
                                        opportunity.deadline
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 text-right">
                            <p className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                                Remaining
                            </p>

                            <p className="mt-0.5 text-sm font-bold">
                                {days >= 0
                                    ? `${days}d`
                                    : "Closed"}
                            </p>
                        </div>
                    </div>

                    {/* Progress */}
                    {days >= 0 && (
                        <div className="mt-3">
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-current
                                        transition-all
                                    "
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* ================================================= */}
                {/* Information */}
                {/* ================================================= */}

                <div className="mt-4 grid grid-cols-2 gap-2">
                    {/* Country */}
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <Globe2 className="h-3.5 w-3.5" />

                            <span className="text-[9px] font-bold uppercase tracking-wide">
                                Country
                            </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {opportunity.country ||
                                "Not specified"}
                        </p>
                    </div>

                    {/* Degree */}
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <GraduationCap className="h-3.5 w-3.5" />

                            <span className="text-[9px] font-bold uppercase tracking-wide">
                                Degree
                            </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {degrees}
                        </p>
                    </div>

                    {/* Funding */}
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <Award className="h-3.5 w-3.5" />

                            <span className="text-[9px] font-bold uppercase tracking-wide">
                                Funding
                            </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {opportunity.funding ||
                                "Not specified"}
                        </p>
                    </div>

                    {/* Application Fee */}
                    <div className="rounded-xl bg-slate-50 p-2.5">
                        <div className="flex items-center gap-1.5 text-slate-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />

                            <span className="text-[9px] font-bold uppercase tracking-wide">
                                Application Fee
                            </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                            {opportunity.applicationFee ||
                                "Not specified"}
                        </p>
                    </div>
                </div>

                {/* ================================================= */}
                {/* Action */}
                {/* ================================================= */}

                <NavLink
                    to={`/opportunities/${opportunity.slug}`}
                    className="
                        mt-4
                        flex
                        h-10
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-sky-500
                        text-xs
                        font-bold
                        text-white
                        shadow-sm
                        shadow-sky-200
                        transition
                        hover:bg-sky-600
                        hover:shadow-md
                    "
                >
                    View Opportunity

                    <ArrowRight
                        className="
                            h-4
                            w-4
                            transition-transform
                            group-hover:translate-x-0.5
                        "
                    />
                </NavLink>
            </div>
        </div>
    );
}

/* ========================================================= */
/* Empty State */
/* ========================================================= */

function EmptyState({
    hasFilters,
    onClear,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-dashed
                border-slate-300
                bg-white
                px-6
                py-16
                text-center
            "
        >
            <div
                className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-slate-100
                    text-slate-400
                "
            >
                <CalendarDays className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
                No deadlines found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                There are no opportunities matching
                your current search and filter
                settings.
            </p>

            {hasFilters && (
                <button
                    type="button"
                    onClick={onClear}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-slate-700
                        shadow-sm
                        transition
                        hover:border-sky-200
                        hover:bg-sky-50
                        hover:text-sky-600
                    "
                >
                    <XCircle className="h-4 w-4" />
                    Clear Filters
                </button>
            )}
        </div>
    );
}

/* ========================================================= */
/* Main Page */
/* ========================================================= */

export default function Deadlines() {
    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("All");

    const [range, setRange] =
        useState("all");

    const [showFilters, setShowFilters] =
        useState(false);

    /* ----------------------------------------------------- */
    /* Prepare deadline data */
    /* ----------------------------------------------------- */

    const deadlineOpportunities =
        useMemo(() => {
            return (opportunities || [])
                .map((opportunity) => ({
                    ...opportunity,
                    deadlineDate:
                        parseDeadline(
                            opportunity.deadline
                        ),
                    daysRemaining:
                        getDaysRemaining(
                            opportunity.deadline
                        ),
                }))
                .filter(
                    (opportunity) =>
                        opportunity.deadlineDate
                )
                .filter(
                    (opportunity) =>
                        opportunity.daysRemaining >=
                        0
                )
                .sort(
                    (a, b) =>
                        a.deadlineDate -
                        b.deadlineDate
                );
        }, []);

    /* ----------------------------------------------------- */
    /* Statistics */
    /* ----------------------------------------------------- */

    const statistics =
        useMemo(() => {
            const total =
                deadlineOpportunities.length;

            const next7 =
                deadlineOpportunities.filter(
                    (item) =>
                        item.daysRemaining <=
                        7
                ).length;

            const next30 =
                deadlineOpportunities.filter(
                    (item) =>
                        item.daysRemaining <=
                        30
                ).length;

            const next90 =
                deadlineOpportunities.filter(
                    (item) =>
                        item.daysRemaining <=
                        90
                ).length;

            return {
                total,
                next7,
                next30,
                next90,
            };
        }, [
            deadlineOpportunities,
        ]);

    /* ----------------------------------------------------- */
    /* Filtered opportunities */
    /* ----------------------------------------------------- */

    const filteredOpportunities =
        useMemo(() => {
            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return deadlineOpportunities.filter(
                (opportunity) => {
                    const matchesSearch =
                        !normalizedSearch ||
                        opportunity.title
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        opportunity.provider
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        opportunity.country
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        opportunity.category
                            ?.toLowerCase()
                            .includes(
                                normalizedSearch
                            ) ||
                        opportunity.tags?.some(
                            (tag) =>
                                tag
                                    .toLowerCase()
                                    .includes(
                                        normalizedSearch
                                    )
                        );

                    const matchesCategory =
                        category ===
                            "All" ||
                        opportunity.category ===
                            category;

                    const matchesRange =
                        range === "all" ||
                        opportunity.daysRemaining <=
                            Number(range);

                    return (
                        matchesSearch &&
                        matchesCategory &&
                        matchesRange
                    );
                }
            );
        }, [
            deadlineOpportunities,
            search,
            category,
            range,
        ]);

    /* ----------------------------------------------------- */
    /* Group by month */
    /* ----------------------------------------------------- */

    const groupedOpportunities =
        useMemo(() => {
            return filteredOpportunities.reduce(
                (groups, opportunity) => {
                    const month =
                        formatMonth(
                            opportunity.deadline
                        );

                    if (!groups[month]) {
                        groups[month] = [];
                    }

                    groups[month].push(
                        opportunity
                    );

                    return groups;
                },
                {}
            );
        }, [
            filteredOpportunities,
        ]);

    const hasFilters =
        search.trim() ||
        category !== "All" ||
        range !== "all";

    const clearFilters = () => {
        setSearch("");
        setCategory("All");
        setRange("all");
    };

    return (
        <div className="min-h-full">
            {/* ================================================= */}
            {/* Header */}
            {/* ================================================= */}

            <section
                className="
                    relative
                    mb-7
                    overflow-hidden
                    rounded-3xl
                    border
                    border-sky-100
                    bg-linear-to-br
                    from-sky-50
                    via-white
                    to-blue-50
                    p-5
                    sm:p-7
                "
            >
                {/* Decorative shapes */}
                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-20
                        h-52
                        w-52
                        rounded-full
                        bg-sky-200/30
                        blur-2xl
                    "
                />

                <div
                    className="
                        pointer-events-none
                        absolute
                        -bottom-20
                        right-20
                        h-44
                        w-44
                        rounded-full
                        bg-blue-200/20
                        blur-2xl
                    "
                />

                <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                    <div className="max-w-2xl">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-sky-600 shadow-sm">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Deadline Tracker
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Never miss an{" "}
                            <span className="text-sky-500">
                                opportunity deadline
                            </span>
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Keep track of upcoming
                            scholarships, internships,
                            competitions and other
                            opportunities in one place.
                        </p>
                    </div>

                    {/* Quick urgency */}
                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-white
                            bg-white/80
                            p-3
                            shadow-sm
                            backdrop-blur
                        "
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                            <AlertCircle className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Due soon
                            </p>

                            <p className="text-lg font-bold text-slate-900">
                                {
                                    statistics.next7
                                }
                            </p>

                            <p className="text-[10px] text-slate-400">
                                within 7 days
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================================================= */}
            {/* Statistics */}
            {/* ================================================= */}

            <section className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    icon={CalendarDays}
                    label="Total Upcoming"
                    value={
                        statistics.total
                    }
                    description="All available deadlines"
                    iconClass="text-sky-600"
                    bgClass="bg-sky-50"
                />

                <StatCard
                    icon={AlertCircle}
                    label="Due in 7 Days"
                    value={
                        statistics.next7
                    }
                    description="Requires immediate attention"
                    iconClass="text-rose-600"
                    bgClass="bg-rose-50"
                />

                <StatCard
                    icon={Clock3}
                    label="Due in 30 Days"
                    value={
                        statistics.next30
                    }
                    description="Plan your applications"
                    iconClass="text-amber-600"
                    bgClass="bg-amber-50"
                />

                <StatCard
                    icon={Timer}
                    label="Due in 90 Days"
                    value={
                        statistics.next90
                    }
                    description="Good time to prepare"
                    iconClass="text-blue-600"
                    bgClass="bg-blue-50"
                />
            </section>

            {/* ================================================= */}
            {/* Toolbar */}
            {/* ================================================= */}

            <section
                className="
                    mb-7
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-3
                    shadow-sm
                "
            >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            className="
                                pointer-events-none
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search opportunities, providers, countries..."
                            className="
                                h-10
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-9
                                pr-4
                                text-sm
                                text-slate-700
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-sky-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-sky-100
                            "
                        />
                    </div>

                    {/* Desktop filters */}
                    <div className="hidden items-center gap-2 lg:flex">
                        <FilterSelect
                            value={
                                category
                            }
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                        >
                            {CATEGORY_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={
                                            option
                                        }
                                        value={
                                            option
                                        }
                                    >
                                        {option ===
                                        "All"
                                            ? "All categories"
                                            : option}
                                    </option>
                                )
                            )}
                        </FilterSelect>

                        <FilterSelect
                            value={range}
                            onChange={(event) =>
                                setRange(
                                    event.target.value
                                )
                            }
                        >
                            {RANGE_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                )
                            )}
                        </FilterSelect>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="
                                    h-10
                                    rounded-xl
                                    px-3
                                    text-xs
                                    font-bold
                                    text-slate-500
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-800
                                "
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Mobile filter button */}
                    <button
                        type="button"
                        onClick={() =>
                            setShowFilters(
                                (previous) =>
                                    !previous
                            )
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            text-xs
                            font-bold
                            text-slate-700
                            lg:hidden
                        "
                    >
                        <Filter className="h-4 w-4" />

                        Filters

                        {hasFilters && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 text-[9px] text-white">
                                !
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile filters */}
                {showFilters && (
                    <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:hidden">
                        <FilterSelect
                            value={
                                category
                            }
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                        >
                            {CATEGORY_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={
                                            option
                                        }
                                        value={
                                            option
                                        }
                                    >
                                        {option ===
                                        "All"
                                            ? "All categories"
                                            : option}
                                    </option>
                                )
                            )}
                        </FilterSelect>

                        <FilterSelect
                            value={range}
                            onChange={(event) =>
                                setRange(
                                    event.target.value
                                )
                            }
                        >
                            {RANGE_OPTIONS.map(
                                (option) => (
                                    <option
                                        key={
                                            option.value
                                        }
                                        value={
                                            option.value
                                        }
                                    >
                                        {
                                            option.label
                                        }
                                    </option>
                                )
                            )}
                        </FilterSelect>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="
                                    h-10
                                    rounded-xl
                                    bg-slate-100
                                    text-xs
                                    font-bold
                                    text-slate-600
                                    sm:col-span-2
                                "
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* ================================================= */}
            {/* Result heading */}
            {/* ================================================= */}

            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-900">
                        Upcoming Deadlines
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                        Showing{" "}
                        <span className="font-bold text-slate-600">
                            {
                                filteredOpportunities.length
                            }
                        </span>{" "}
                        of{" "}
                        <span className="font-bold text-slate-600">
                            {
                                deadlineOpportunities.length
                            }
                        </span>{" "}
                        upcoming opportunities
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CalendarDays className="h-4 w-4" />
                    Sorted by nearest deadline
                </div>
            </div>

            {/* ================================================= */}
            {/* Deadline Groups */}
            {/* ================================================= */}

            {filteredOpportunities.length ===
            0 ? (
                <EmptyState
                    hasFilters={hasFilters}
                    onClear={
                        clearFilters
                    }
                />
            ) : (
                <div className="space-y-8">
                    {Object.entries(
                        groupedOpportunities
                    ).map(
                        ([
                            month,
                            monthOpportunities,
                        ]) => (
                            <section
                                key={month}
                            >
                                {/* Month heading */}
                                <div className="mb-4 flex items-center gap-3">
                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-sky-50
                                            text-sky-600
                                        "
                                    >
                                        <CalendarDays className="h-4 w-4" />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">
                                            {
                                                month
                                            }
                                        </h3>

                                        <p className="text-[10px] font-medium text-slate-400">
                                            {
                                                monthOpportunities.length
                                            }{" "}
                                            {monthOpportunities.length ===
                                            1
                                                ? "opportunity"
                                                : "opportunities"}
                                        </p>
                                    </div>

                                    <div className="h-px flex-1 bg-slate-100" />
                                </div>

                                {/* Cards */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {monthOpportunities.map(
                                        (
                                            opportunity
                                        ) => (
                                            <DeadlineCard
                                                key={
                                                    opportunity.id
                                                }
                                                opportunity={
                                                    opportunity
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </section>
                        )
                    )}
                </div>
            )}

            {/* ================================================= */}
            {/* Footer note */}
            {/* ================================================= */}

            {filteredOpportunities.length >
                0 && (
                <div
                    className="
                        mt-8
                        flex
                        items-start
                        gap-3
                        rounded-2xl
                        border
                        border-sky-100
                        bg-sky-50/60
                        p-4
                    "
                >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-500 shadow-sm">
                        <CheckCircle2 className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-xs font-bold text-slate-700">
                            Stay ahead of your deadlines
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Deadlines shown here are
                            automatically loaded from
                            the ScholarX opportunity
                            database. Always verify the
                            final deadline on the official
                            opportunity website before
                            submitting an application.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}