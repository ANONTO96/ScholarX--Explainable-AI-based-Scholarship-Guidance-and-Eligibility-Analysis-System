import {
    AlertTriangle,
    ArrowRight,
    Compass,
    GraduationCap,
    Headphones,
    Home,
} from "lucide-react";
import { Link, NavLink } from "react-router";

const ErrorPage = () => {
    return (
        <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">

            {/* ========================================================= */}
            {/* BACKGROUND */}
            {/* ========================================================= */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl" />

                <div className="absolute -right-40 top-1/3 h-125 w-125 rounded-full bg-indigo-200/25 blur-3xl" />

                <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
            </div>

            {/* ========================================================= */}
            {/* MAIN */}
            {/* ========================================================= */}
            <main className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-6 md:px-8">

                <div className="grid w-full items-center justify-items-center gap-4 lg:grid-cols-2 lg:gap-20">

                    {/* ================================================= */}
                    {/* LEFT CONTENT */}
                    {/* ================================================= */}
                    <div className="w-full max-w-xl text-center lg:text-left">

                        {/* Badge */}
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600">
                            <AlertTriangle size={16} />
                            Page not found
                        </div>

                        {/* 404 */}
                        <h1
                            className="
                                text-[70px]
                                font-black
                                leading-none
                                tracking-[-0.06em]
                                text-transparent
                                bg-linear-to-br
                                from-sky-500
                                via-blue-600
                                to-indigo-600
                                bg-clip-text
                                sm:text-[90px]
                            "
                        >
                            404
                        </h1>

                        {/* Heading */}
                        <h2 className="mt-2 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
                            Looks like you took
                            <span className="block text-sky-600">
                                a wrong turn.
                            </span>
                        </h2>

                        {/* Description */}
                        <p className="mt-3 text-base leading-7 text-slate-600 sm:text-lg">
                            The page you're looking for doesn't exist, has been
                            moved, or the link may be incorrect. Don't worry —
                            we'll help you get back on track.
                        </p>

                        {/* Buttons */}
                        <div className="mt-4 flex flex-col gap-3 sm:flex-row justify-center lg:justify-start">

                            {/* Home */}
                            <Link
                                to="/"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-sky-600
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-white
                                    shadow-lg
                                    shadow-sky-500/20
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:bg-sky-700
                                    hover:shadow-xl
                                "
                            >
                                <Home size={17} />

                                Go to Homepage

                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                            {/* Programs */}
                            <Link
                                to="/programs"
                                className="
                                    group
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-300
                                    bg-white
                                    px-6
                                    py-3.5
                                    text-sm
                                    font-bold
                                    text-slate-800
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-0.5
                                    hover:border-sky-300
                                    hover:text-sky-600
                                    hover:shadow-md
                                "
                            >
                                <Compass size={17} />

                                Explore Programs

                                <ArrowRight
                                    size={17}
                                    className="transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </Link>

                        </div>
                    </div>

                    {/* ================================================= */}
                    {/* RIGHT SIDE */}
                    {/* ================================================= */}
                    <div className="relative flex w-full items-center justify-center">

                        {/* Background circle */}
                        <div
                            className="
                                absolute
                                h-80
                                w-80
                                rounded-full
                                bg-linear-to-br
                                from-sky-100
                                via-blue-100
                                to-indigo-100
                                blur-sm
                                sm:h-105
                                sm:w-105
                            "
                        />

                        {/* Decorative circles */}
                        <div className="absolute left-[15%] top-[15%] h-4 w-4 rounded-full bg-sky-400/50" />

                        <div className="absolute right-[15%] top-[25%] h-6 w-6 rounded-full bg-indigo-400/30" />

                        <div className="absolute bottom-[18%] left-[20%] h-5 w-5 rounded-full bg-blue-400/30" />

                        {/* Main Card */}
                        <div
                            className="
                                relative
                                z-10
                                w-full
                                max-w-md
                                rounded-4xl
                                border
                                border-white
                                bg-white/80
                                p-6
                                shadow-[0_25px_70px_rgba(15,23,42,0.12)]
                                backdrop-blur-xl
                                sm:p-8
                            "
                        >

                            {/* Icon */}
                            <div className="flex justify-center">
                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        lg:h-20
                                        lg:w-20
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        bg-sky-50
                                        text-sky-600
                                        shadow-inner
                                    "
                                >
                                    <Compass
                                        size={32}
                                        strokeWidth={1.6}
                                    />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="mt-7 text-center">

                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-500">
                                    Lost in your journey?
                                </p>

                                <h3 className="mt-3 text-2xl font-black text-slate-900 sm:text-3xl">
                                    Let's get you back
                                    <span className="block">
                                        on the right path.
                                    </span>
                                </h3>

                                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-slate-500">
                                    Explore scholarships, universities, and
                                    programs to continue your study abroad
                                    journey with ScholarX.
                                </p>

                            </div>

                            {/* Small stats */}
                            <div className="mt-8 grid grid-cols-3 gap-3">

                                <NavLink to="/programs" className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                        <GraduationCap size={19} />
                                    </div>

                                    <p className="mt-2 text-xs font-semibold text-slate-600">
                                        Programs
                                    </p>
                                </NavLink>

                                <NavLink to="/countries" className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                        <Compass size={19} />
                                    </div>

                                    <p className="mt-2 text-xs font-semibold text-slate-600">
                                        Countries
                                    </p>
                                </NavLink>

                                <NavLink to="/support" className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-center">
                                    <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">
                                        <Headphones size={19} />
                                    </div>

                                    <p className="mt-2 text-xs font-semibold text-slate-600">
                                        Support
                                    </p>
                                </NavLink>

                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ErrorPage;