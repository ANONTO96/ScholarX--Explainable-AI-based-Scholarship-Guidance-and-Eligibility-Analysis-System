import {
    ArrowRight,
    CalendarDays,
    CircleDollarSign,
    Globe2,
    Landmark,
    Sparkles,
} from "lucide-react";
import { NavLink } from "react-router";

const OpportunityCard = ({ opportunity }) => {
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

                    {/* Opportunity Icon + Title */}
                    <div className="flex min-w-0 items-start gap-3">

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
                            <Sparkles className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">

                            <h2
                                className="
                                    line-clamp-2
                                    text-xl font-bold
                                    leading-snug
                                    tracking-tight
                                    text-gray-900
                                    transition-colors
                                    group-hover:text-sky-700
                                "
                            >
                                {opportunity.title}
                            </h2>

                            <div className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
                                <Landmark className="h-3.5 w-3.5 shrink-0 text-sky-500" />

                                <span className="truncate">
                                    {opportunity.provider}
                                </span>
                            </div>

                        </div>
                    </div>

                    {/* Category */}
                    <span
                        className="
                            hidden sm:block
                            shrink-0
                            rounded-full
                            border border-sky-100
                            bg-sky-50
                            px-3 py-1.5
                            text-xs font-semibold
                            text-sky-700
                        "
                    >
                        {opportunity.category}
                    </span>

                </div>

                {/* Mobile category */}
                <span
                    className="
                        mt-3 inline-flex sm:hidden
                        rounded-full
                        border border-sky-100
                        bg-sky-50
                        px-3 py-1.5
                        text-xs font-semibold
                        text-sky-700
                    "
                >
                    {opportunity.category}
                </span>

                {/* Divider */}
                <div className="my-5 h-px bg-gray-100" />

                {/* Location */}
                <div
                    className="
                        flex items-center gap-3
                        rounded-2xl
                        border border-gray-100
                        bg-gray-50/70
                        px-4 py-3
                        transition-all duration-300
                        group-hover:border-sky-100
                        group-hover:bg-sky-50/40
                    "
                >
                    <div
                        className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-xl
                            bg-white
                            text-sky-600
                            shadow-sm
                        "
                    >
                        <Globe2 className="h-4 w-4" />
                    </div>

                    <div>
                        <p className="text-[11px] text-gray-400">
                            Study Destination
                        </p>

                        <p className="text-sm font-semibold text-gray-800">
                            {opportunity.country}
                        </p>
                    </div>
                </div>

                {/* Funding + Deadline */}
                <div className="mt-3 grid grid-cols-2 gap-3">

                    {/* Funding */}
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
                                    flex h-9 w-9 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-white
                                    text-emerald-600
                                    shadow-sm
                                "
                            >
                                <CircleDollarSign className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">

                                <p className="text-[11px] text-gray-500">
                                    Funding
                                </p>

                                <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                                    {opportunity.funding}
                                </p>

                            </div>
                        </div>
                    </div>

                    {/* Deadline */}
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
                                    flex h-9 w-9 shrink-0
                                    items-center justify-center
                                    rounded-xl
                                    bg-white
                                    text-orange-500
                                    shadow-sm
                                "
                            >
                                <CalendarDays className="h-4 w-4" />
                            </div>

                            <div className="min-w-0">

                                <p className="text-[11px] text-gray-500">
                                    Deadline
                                </p>

                                <p className="mt-0.5 truncate text-sm font-bold text-gray-900">
                                    {opportunity.deadline}
                                </p>

                            </div>
                        </div>
                    </div>

                </div>

                {/* CTA */}
                <NavLink
                    to={`/opportunityDetails/${opportunity.slug}`}
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
                    <span>View Opportunity</span>

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

export default OpportunityCard;
