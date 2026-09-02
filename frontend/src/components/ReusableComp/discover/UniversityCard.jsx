import {
    ArrowRight,
    Building2,
    GraduationCap,
    MapPin,
    Medal,
    Sparkles,
} from "lucide-react";
import { NavLink } from "react-router";

const UniversityCard = ({ university }) => {
    return (
        <div
            className="
                group relative overflow-hidden
                rounded-3xl
                border border-sky-100
                bg-white
                p-6
                shadow-[0_8px_30px_rgba(14,165,233,0.06)]
                transition-all duration-300
                hover:-translate-y-1
                hover:border-sky-200
                hover:shadow-[0_18px_45px_rgba(14,165,233,0.14)]
            "
        >

            {/* Decorative background glow */}
            <div
                className="
                    pointer-events-none
                    absolute -right-16 -top-16
                    h-36 w-36
                    rounded-full
                    bg-sky-100/60
                    blur-3xl
                    transition-all duration-500
                    group-hover:bg-sky-200/70
                "
            />

            <div className="relative z-10">

                {/* University Header */}
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-3">

                        {/* University Icon */}
                        <div
                            className="
                                flex h-14 w-14 shrink-0
                                items-center justify-center
                                rounded-2xl
                                border border-sky-100
                                bg-sky-50
                                text-sky-600
                                transition-all duration-300
                                group-hover:bg-sky-600
                                group-hover:text-white
                                group-hover:scale-105
                            "
                        >
                            <Building2 className="h-7 w-7" />
                        </div>

                        <div className="min-w-0">

                            <h2
                                className="
                                    text-xl font-bold
                                    tracking-tight
                                    text-gray-900
                                    transition-colors
                                    group-hover:text-sky-700
                                "
                            >
                                {university.name}
                            </h2>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-500" />

                                <span>
                                    {university.city}, {university.country}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Ranking Badge */}
                    <div
                        className="
                            hidden sm:flex shrink-0
                            items-center gap-1.5
                            rounded-full
                            border border-amber-100
                            bg-amber-50
                            px-3 py-1.5
                            text-xs font-bold
                            text-amber-700
                        "
                    >
                        <Medal className="h-3.5 w-3.5" />
                        #{university.qsRanking}
                    </div>

                </div>

                {/* Mobile ranking */}
                <div
                    className="
                        mt-3 flex sm:hidden
                        w-fit items-center gap-1.5
                        rounded-full
                        border border-amber-100
                        bg-amber-50
                        px-3 py-1.5
                        text-xs font-bold
                        text-amber-700
                    "
                >
                    <Medal className="h-3.5 w-3.5" />
                    QS Ranking #{university.qsRanking}
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-gray-100" />

                {/* Popular Programs */}
                <div>

                    <div className="mb-2.5 flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-sky-500" />

                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Popular Programs
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                        {university.popularPrograms
                            ?.slice(0, 4)
                            .map((program) => (
                                <span
                                    key={program}
                                    className="
                                        rounded-full
                                        border border-sky-100
                                        bg-sky-50
                                        px-3 py-1.5
                                        text-xs font-semibold
                                        text-sky-700
                                        transition-colors
                                        group-hover:border-sky-200
                                    "
                                >
                                    {program}
                                </span>
                            ))}

                        {university.popularPrograms?.length > 4 && (
                            <span
                                className="
                                    rounded-full
                                    border border-gray-100
                                    bg-gray-50
                                    px-3 py-1.5
                                    text-xs font-medium
                                    text-gray-500
                                "
                            >
                                +{university.popularPrograms.length - 4} more
                            </span>
                        )}

                    </div>
                </div>

                {/* University Stats */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                    {/* Tuition */}
                    <div
                        className="
                            rounded-2xl
                            border border-gray-100
                            bg-gray-50/70
                            p-3.5
                            transition-all duration-300
                            group-hover:border-sky-100
                            group-hover:bg-sky-50/40
                        "
                    >
                        <div className="flex items-start gap-2.5">

                            <div
                                className="
                                    flex h-8 w-8 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-white
                                    text-sky-600
                                    shadow-sm
                                "
                            >
                                <span className="text-sm font-bold">
                                    $
                                </span>
                            </div>

                            <div className="min-w-0">
                                <p className="text-[11px] text-gray-500">
                                    Tuition Fee
                                </p>

                                <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                                    {university.tuition}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Programs */}
                    <div
                        className="
                            rounded-2xl
                            border border-gray-100
                            bg-gray-50/70
                            p-3.5
                            transition-all duration-300
                            group-hover:border-sky-100
                            group-hover:bg-sky-50/40
                        "
                    >
                        <div className="flex items-start gap-2.5">

                            <div
                                className="
                                    flex h-8 w-8 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-white
                                    text-sky-600
                                    shadow-sm
                                "
                            >
                                <GraduationCap className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-[11px] text-gray-500">
                                    Programs
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-gray-900">
                                    {university.programsCount}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Scholarships */}
                    <div
                        className="
                            rounded-2xl
                            border border-gray-100
                            bg-gray-50/70
                            p-3.5
                            transition-all duration-300
                            group-hover:border-sky-100
                            group-hover:bg-sky-50/40
                        "
                    >
                        <div className="flex items-start gap-2.5">

                            <div
                                className="
                                    flex h-8 w-8 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-white
                                    text-sky-600
                                    shadow-sm
                                "
                            >
                                <Sparkles className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-[11px] text-gray-500">
                                    Scholarships
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-gray-900">
                                    {university.scholarshipsCount}
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* QS Ranking */}
                    <div
                        className="
                            rounded-2xl
                            border border-gray-100
                            bg-gray-50/70
                            p-3.5
                            transition-all duration-300
                            group-hover:border-sky-100
                            group-hover:bg-sky-50/40
                        "
                    >
                        <div className="flex items-start gap-2.5">

                            <div
                                className="
                                    flex h-8 w-8 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-white
                                    text-amber-600
                                    shadow-sm
                                "
                            >
                                <Medal className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-[11px] text-gray-500">
                                    QS Ranking
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-gray-900">
                                    #{university.qsRanking}
                                </p>
                            </div>

                        </div>
                    </div>

                </div>

                {/* CTA */}
                <NavLink
                    to={`/universityDetails/${university.slug}`}
                    className="
                        group/link
                        mt-5
                        flex w-full
                        items-center justify-between
                        rounded-2xl
                        border border-sky-100
                        bg-sky-50
                        px-4 py-3
                        text-sm font-semibold
                        text-sky-700
                        transition-all duration-300
                        hover:border-sky-200
                        hover:bg-sky-100
                        hover:text-sky-800
                    "
                >
                    <span>View University</span>

                    <span
                        className="
                            flex h-8 w-8
                            items-center justify-center
                            rounded-xl
                            bg-white
                            text-sky-600
                            shadow-sm
                            transition-transform duration-300
                            group-hover/link:translate-x-1
                        "
                    >
                        <ArrowRight className="h-4 w-4" />
                    </span>
                </NavLink>

            </div>
        </div>
    );
};

export default UniversityCard;
