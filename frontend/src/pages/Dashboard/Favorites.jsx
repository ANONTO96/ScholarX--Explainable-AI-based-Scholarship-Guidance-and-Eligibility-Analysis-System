import {
    ArrowRight,
    Award,
    CheckCircle2,
    Clock3,
    Globe2,
    Heart,
    Search,
    Sparkles,
    Target,
    Trash2,
    XCircle,
    CircleAlert,
} from "lucide-react";
import { NavLink } from "react-router";
import { useMemo, useState } from "react";

import opportunities from "../../data/opportunities";
import { studentProfile } from "../../data/studentProfile";
import { analyzeOpportunity } from "../../utils/eligibility";

import {
    getFavorites,
    removeFavorite,
} from "../../utils/favorites";


/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function formatDate(date) {
    if (!date) {
        return "Not specified";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Not specified";
    }

    return parsed.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}


function getDaysLeft(date) {
    if (!date) {
        return null;
    }

    const deadline = new Date(date);

    if (Number.isNaN(deadline.getTime())) {
        return null;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    return Math.ceil(
        (
            deadline.getTime() -
            today.getTime()
        ) /
            (1000 * 60 * 60 * 24)
    );
}


function getDeadlineLabel(date) {
    const days = getDaysLeft(date);

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


/* ========================================================= */
/* STATUS CONFIG                                             */
/* ========================================================= */

const STATUS_CONFIG = {
    strong: {
        label: "Strong Match",
        icon: CheckCircle2,
        badge:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        iconBg:
            "bg-emerald-100 text-emerald-600",
    },

    review: {
        label: "Needs Review",
        icon: CircleAlert,
        badge:
            "border-amber-200 bg-amber-50 text-amber-700",
        iconBg:
            "bg-amber-100 text-amber-600",
    },

    "not-eligible": {
        label: "Not Eligible",
        icon: XCircle,
        badge:
            "border-rose-200 bg-rose-50 text-rose-700",
        iconBg:
            "bg-rose-100 text-rose-600",
    },
};


/* ========================================================= */
/* MATCH SCORE                                               */
/* ========================================================= */

function MatchScore({ score }) {
    const radius = 25;

    const circumference =
        2 * Math.PI * radius;

    const safeScore = Math.min(
        Math.max(
            Number(score) || 0,
            0
        ),
        100
    );

    const offset =
        circumference -
        (safeScore / 100) *
            circumference;

    let scoreClass =
        "text-rose-500";

    if (safeScore >= 85) {
        scoreClass =
            "text-emerald-500";
    } else if (safeScore >= 60) {
        scoreClass =
            "text-amber-500";
    }

    return (
        <div className="relative h-20 w-20 shrink-0">
            <svg
                className="h-20 w-20 -rotate-90"
                viewBox="0 0 60 60"
            >
                <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    className="text-slate-100"
                />

                <circle
                    cx="30"
                    cy="30"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray={
                        circumference
                    }
                    strokeDashoffset={
                        offset
                    }
                    className={
                        scoreClass
                    }
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-slate-900">
                    {safeScore}%
                </span>

                <span className="text-[8px] font-semibold uppercase tracking-wide text-slate-400">
                    Match
                </span>
            </div>
        </div>
    );
}


/* ========================================================= */
/* INFO ITEM                                                 */
/* ========================================================= */

function InfoItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">
            <div className="flex items-center gap-1.5 text-slate-400">
                <Icon className="h-3.5 w-3.5" />

                <span className="text-[10px] font-semibold uppercase tracking-wide">
                    {label}
                </span>
            </div>

            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                {value}
            </p>
        </div>
    );
}


/* ========================================================= */
/* FAVORITE CARD                                             */
/* ========================================================= */

function FavoriteCard({
    item,
    onRemove,
}) {
    const {
        opportunity,
        analysis,
    } = item;

    const status =
        analysis?.status || "review";

    const config =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.review;

    const StatusIcon = config.icon;

    const title =
        opportunity.title ||
        opportunity.name ||
        "Scholarship Opportunity";

    const provider =
        opportunity.provider ||
        opportunity.organization ||
        "Scholarship Provider";

    const degree = Array.isArray(
        opportunity.degree
    )
        ? opportunity.degree.join(", ")
        : opportunity.degree || "Not specified";

    const deadline =
        opportunity.deadline;

    const daysLeft =
        getDaysLeft(deadline);

    const opportunityPath =
        opportunity.slug
            ? `/opportunities/${opportunity.slug}`
            : `/opportunities/${opportunity.id}`;

    return (
        <article
            className="
                group
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-sky-200
                hover:shadow-md
            "
        >
            <div className="p-4 sm:p-5">

                {/* =================================================
                    TOP SECTION
                ================================================= */}

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">

                    {/* =================================================
                        SCHOLARSHIP IDENTITY
                    ================================================= */}

                    <div className="min-w-0 flex-1">

                        <div className="flex items-start gap-3">

                            {/* Scholarship Icon */}

                            <div
                                className="
                                    flex h-11 w-11
                                    shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-sky-50
                                    text-sky-600
                                "
                            >
                                <Award className="h-5 w-5" />
                            </div>

                            {/* Title */}

                            <div className="min-w-0 flex-1">

                                <div className="flex flex-wrap items-center gap-2">

                                    <h3
                                        className="
                                            text-base
                                            font-bold
                                            leading-tight
                                            text-slate-900
                                            sm:text-lg
                                        "
                                    >
                                        {title}
                                    </h3>

                                    {/* Status badge */}

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            gap-1
                                            rounded-full
                                            border
                                            px-2
                                            py-1
                                            text-[9px]
                                            font-bold
                                            ${config.badge}
                                        `}
                                    >
                                        <StatusIcon className="h-3 w-3" />

                                        {config.label}
                                    </span>

                                </div>

                                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                                    {provider}
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            SCHOLARSHIP INFORMATION
                        ================================================= */}

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-2
                                gap-2
                                sm:grid-cols-4
                            "
                        >

                            <InfoItem
                                icon={Globe2}
                                label="Country"
                                value={
                                    opportunity.country ||
                                    "Not specified"
                                }
                            />

                            <InfoItem
                                icon={Award}
                                label="Funding"
                                value={
                                    opportunity.funding ||
                                    "Not specified"
                                }
                            />

                            <InfoItem
                                icon={Target}
                                label="Degree"
                                value={degree}
                            />

                            <InfoItem
                                icon={Clock3}
                                label="Deadline"
                                value={
                                    formatDate(deadline)
                                }
                            />

                        </div>

                    </div>


                    {/* =================================================
                        MATCH SCORE
                    ================================================= */}

                    <div
                        className="
                            flex
                            shrink-0
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-sky-100
                            bg-sky-50/50
                            px-3
                            py-2.5
                        "
                    >

                        <MatchScore
                            score={
                                analysis?.score
                            }
                        />

                        <div className="hidden min-w-20 sm:block lg:hidden xl:block">

                            <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500">
                                Profile Match
                            </p>

                            <p className="mt-1 text-xs font-medium leading-4 text-slate-500">
                                Based on your eligibility profile
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    ANALYSIS SUMMARY
                ================================================= */}

                <div
                    className="
                        mt-4
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        border-t
                        border-slate-100
                        pt-4
                    "
                >

                    {/* Passed */}

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-emerald-50
                            px-2.5
                            py-1.5
                            text-emerald-700
                        "
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />

                        <span className="text-[11px] font-semibold">
                            {analysis?.passedCount ?? 0} Passed
                        </span>
                    </div>


                    {/* Review */}

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-amber-50
                            px-2.5
                            py-1.5
                            text-amber-700
                        "
                    >
                        <CircleAlert className="h-3.5 w-3.5" />

                        <span className="text-[11px] font-semibold">
                            {analysis?.reviewCount ?? 0} Review
                        </span>
                    </div>


                    {/* Failed */}

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            bg-rose-50
                            px-2.5
                            py-1.5
                            text-rose-700
                        "
                    >
                        <XCircle className="h-3.5 w-3.5" />

                        <span className="text-[11px] font-semibold">
                            {analysis?.failedCount ?? 0} Failed
                        </span>
                    </div>


                    {/* Deadline */}

                    {daysLeft !== null && (
                        <div
                            className={`
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-lg
                                px-2.5
                                py-1.5
                                ${
                                    daysLeft <= 14 &&
                                    daysLeft >= 0
                                        ? "bg-rose-50 text-rose-600"
                                        : "bg-slate-50 text-slate-500"
                                }
                            `}
                        >
                            <Clock3 className="h-3.5 w-3.5" />

                            <span className="text-[11px] font-semibold">
                                {getDeadlineLabel(
                                    deadline
                                )}
                            </span>
                        </div>
                    )}


                    {/* Flexible spacer */}

                    <div className="hidden flex-1 sm:block" />


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="flex w-full items-center gap-2 sm:w-auto">

                        <NavLink
                            to={
                                opportunityPath
                            }
                            className="
                                inline-flex
                                flex-1
                                items-center
                                justify-center
                                gap-1.5
                                rounded-xl
                                bg-sky-500
                                px-4
                                py-2.5
                                text-xs
                                font-semibold
                                text-white
                                transition
                                hover:bg-sky-600
                                sm:flex-none
                            "
                        >
                            View Scholarship

                            <ArrowRight className="h-3.5 w-3.5" />
                        </NavLink>


                        <NavLink
                            to={`/dashboard/eligibility?opportunity=${opportunity.id}`}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-1.5
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3.5
                                py-2.5
                                text-xs
                                font-semibold
                                text-slate-700
                                transition
                                hover:border-sky-200
                                hover:bg-sky-50
                                hover:text-sky-600
                            "
                        >
                            <Target className="h-3.5 w-3.5" />

                            <span className="hidden sm:inline">
                                Eligibility
                            </span>
                        </NavLink>


                        <button
                            type="button"
                            onClick={() =>
                                onRemove(
                                    opportunity.id
                                )
                            }
                            className="
                                inline-flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                text-slate-400
                                transition
                                hover:border-rose-200
                                hover:bg-rose-50
                                hover:text-rose-600
                            "
                            title="Remove from favorites"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>

                    </div>

                </div>

            </div>
        </article>
    );
}



/* ========================================================= */
/* EMPTY STATE                                               */
/* ========================================================= */

function EmptyFavorites() {
    return (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-400">
                <Heart
                    className="h-9 w-9"
                    fill="currentColor"
                />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900">
                No favorite scholarships yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Save scholarships you are interested in from the Matches page. Your favorite opportunities will appear here.
            </p>

            <NavLink
                to="/dashboard/matches"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition hover:bg-sky-600"
            >
                Find Scholarships

                <ArrowRight className="h-4 w-4" />
            </NavLink>

        </div>
    );
}


/* ========================================================= */
/* MAIN FAVORITES PAGE                                       */
/* ========================================================= */

export default function Favorites() {

    const [
        favorites,
        setFavorites,
    ] = useState(() =>
        getFavorites()
    );

    const [
        search,
        setSearch,
    ] = useState("");


    /* =====================================================
       GET FAVORITE OPPORTUNITIES
    ===================================================== */

    const favoriteMatches =
        useMemo(() => {

            const favoriteSet =
                new Set(
                    favorites
                );

            return (
                opportunities || []
            )
                .filter(
                    (opportunity) =>
                        favoriteSet.has(
                            opportunity.id
                        )
                )
                .map(
                    (opportunity) => {

                        const evaluated =
                            analyzeOpportunity(
                                opportunity,
                                studentProfile
                            );

                        return {
                            opportunity,
                            analysis:
                                evaluated.analysis,
                        };
                    }
                );

        }, [favorites]);


    /* =====================================================
       SEARCH
    ===================================================== */

    const filteredFavorites =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            if (!query) {
                return favoriteMatches;
            }

            return favoriteMatches.filter(
                ({
                    opportunity,
                }) => {

                    const title =
                        String(
                            opportunity.title ||
                                opportunity.name ||
                                ""
                        ).toLowerCase();

                    const provider =
                        String(
                            opportunity.provider ||
                                opportunity.organization ||
                                ""
                        ).toLowerCase();

                    const country =
                        String(
                            opportunity.country ||
                                ""
                        ).toLowerCase();

                    return (
                        title.includes(
                            query
                        ) ||
                        provider.includes(
                            query
                        ) ||
                        country.includes(
                            query
                        )
                    );
                }
            );

        }, [
            favoriteMatches,
            search,
        ]);


    /* =====================================================
       REMOVE FAVORITE
    ===================================================== */

    const handleRemove =
        (id) => {

            const updated =
                removeFavorite(id);

            setFavorites(
                updated
            );
        };


    /* =====================================================
       STATS
    ===================================================== */

    const strongCount =
        favoriteMatches.filter(
            ({ analysis }) =>
                analysis?.status ===
                "strong"
        ).length;

    const reviewCount =
        favoriteMatches.filter(
            ({ analysis }) =>
                analysis?.status ===
                "review"
        ).length;

    const notEligibleCount =
        favoriteMatches.filter(
            ({ analysis }) =>
                analysis?.status ===
                "not-eligible"
        ).length;


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div className="min-h-screen bg-slate-50/70">

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                {/* =================================================
                    HEADER
                ================================================= */}

                <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-sky-500 via-blue-600 to-indigo-600 p-6 text-white shadow-xl shadow-sky-100 sm:p-8">

                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

                    <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />


                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div className="max-w-2xl">

                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">

                                <Heart
                                    className="h-4 w-4"
                                    fill="currentColor"
                                />

                                <span className="text-xs font-semibold">
                                    Saved Opportunities
                                </span>

                            </div>


                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                                Your favorite scholarships
                            </h1>


                            <p className="mt-3 max-w-xl text-sm leading-6 text-sky-50 sm:text-base">
                                Keep track of the scholarships you are most interested in and quickly review their eligibility and match scores.
                            </p>

                        </div>


                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">

    {/* Saved */}
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur">

        <p className="text-2xl font-bold">
            {favoriteMatches.length}
        </p>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-sky-100">
            Saved
        </p>

    </div>


    {/* Strong */}
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur">

        <p className="text-2xl font-bold">
            {strongCount}
        </p>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-sky-100">
            Strong
        </p>

    </div>


    {/* Review */}
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur">

        <p className="text-2xl font-bold">
            {reviewCount}
        </p>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-sky-100">
            Review
        </p>

    </div>


    {/* Not Eligible */}
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-center backdrop-blur">

        <p className="text-2xl font-bold">
            {notEligibleCount}
        </p>

        <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-sky-100">
            Not Eligible
        </p>

    </div>

</div>

                    </div>

                </section>


                {/* =================================================
                    SEARCH
                ================================================= */}

                {favoriteMatches.length > 0 && (
                    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                        <div className="relative">

                            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search your favorite scholarships..."
                                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                            />

                        </div>

                    </section>
                )}


                {/* =================================================
                    RESULT HEADER
                ================================================= */}

                {favoriteMatches.length > 0 && (
                    <div className="mt-7 flex items-end justify-between">

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Saved Scholarships
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Showing{" "}
                                <span className="font-semibold text-slate-700">
                                    {
                                        filteredFavorites.length
                                    }
                                </span>{" "}
                                saved opportunities
                            </p>

                        </div>

                    </div>
                )}


                {/* =================================================
                    FAVORITE CARDS
                ================================================= */}

                <section className="mt-4 space-y-4">

                    {filteredFavorites.length >
                    0 ? (

                        filteredFavorites.map(
                            (item) => (

                                <FavoriteCard
                                    key={
                                        item
                                            .opportunity
                                            .id
                                    }
                                    item={
                                        item
                                    }
                                    onRemove={
                                        handleRemove
                                    }
                                />

                            )
                        )

                    ) : favoriteMatches.length ===
                      0 ? (

                        <EmptyFavorites />

                    ) : (

                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">

                                <Search className="h-7 w-7" />

                            </div>

                            <h3 className="mt-5 text-lg font-bold text-slate-900">
                                No favorites found
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                                Try searching with a different scholarship name, provider, or country.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="mt-5 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                            >
                                Clear Search
                            </button>

                        </div>

                    )}

                </section>


                {/* =================================================
                    FOOTER NOTE
                ================================================= */}

                {favoriteMatches.length > 0 && (
                    <div className="mt-6 flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4">

                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sky-500">

                            <Sparkles className="h-4 w-4" />

                        </div>

                        <div>

                            <p className="text-sm font-semibold text-sky-900">
                                Keep your shortlist focused
                            </p>

                            <p className="mt-1 text-xs leading-5 text-sky-700">
                                Your match score and eligibility status are always calculated using the same ScholarX eligibility engine. Removing a favorite does not affect your eligibility analysis.
                            </p>

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}