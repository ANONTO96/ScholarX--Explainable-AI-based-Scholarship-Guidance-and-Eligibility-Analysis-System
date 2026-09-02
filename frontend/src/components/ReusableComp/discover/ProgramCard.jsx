import {
    ArrowRight,
    GraduationCap,
    Globe2,
    Landmark,
    Sparkles,
} from "lucide-react";
import { NavLink } from "react-router";

const ProgramCard = ({ program }) => {
    return (
        <div
            key={program.id}
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

            {/* Decorative glow */}
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

                {/* Header */}
                <div className="flex items-start justify-between gap-4">

                    <div className="flex items-start gap-3">

                        {/* Program Icon */}
                        <div
                            className="
                                flex h-12 w-12 shrink-0
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
                            <GraduationCap className="h-6 w-6" />
                        </div>

                        <div>
                            <h2
                                className="
                                    text-xl font-bold
                                    tracking-tight
                                    text-gray-900
                                    transition-colors
                                    group-hover:text-sky-700
                                "
                            >
                                {program.name}
                            </h2>

                            <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                                <Globe2 className="h-3.5 w-3.5 text-sky-500" />

                                <span>
                                    {program.topCountries
                                        ?.slice(0, 3)
                                        .join(" • ")}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Explore badge */}
                    <div
                        className="
                            hidden sm:flex
                            items-center gap-1
                            rounded-full
                            border border-sky-100
                            bg-sky-50
                            px-3 py-1.5
                            text-xs font-semibold
                            text-sky-600
                        "
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        Explore
                    </div>

                </div>

                {/* More countries */}
                {program.topCountries?.length > 3 && (
                    <p className="mt-2 pl-15 text-xs font-medium text-sky-600">
                        +{program.topCountries.length - 3} more countries
                    </p>
                )}

                {/* Divider */}
                <div className="my-5 h-px bg-gray-100" />

                {/* Degree badges */}
                <div>
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Available Degrees
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {program.degrees?.map((degree) => (
                            <span
                                key={degree}
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
                                {degree}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Statistics */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                    <div
                        className="
                            rounded-2xl
                            border border-gray-100
                            bg-gray-50/70
                            p-3.5
                            transition-colors
                            group-hover:border-sky-100
                            group-hover:bg-sky-50/40
                        "
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                <Landmark className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-lg font-bold leading-none text-gray-900">
                                    {program.universitiesCount}
                                </p>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    Universities
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="
                            rounded-2xl
                            border border-gray-100
                            bg-gray-50/70
                            p-3.5
                            transition-colors
                            group-hover:border-sky-100
                            group-hover:bg-sky-50/40
                        "
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                <GraduationCap className="h-4 w-4" />
                            </div>

                            <div>
                                <p className="text-lg font-bold leading-none text-gray-900">
                                    {program.scholarshipsCount}
                                </p>

                                <p className="mt-1 text-[11px] text-gray-500">
                                    Scholarships
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* CTA */}
                <NavLink
                    to={`/programDetails/${program.slug}`}
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
                    <span>Explore Program</span>

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

export default ProgramCard;
