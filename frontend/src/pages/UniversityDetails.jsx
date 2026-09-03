import {
    ArrowRight,
    Award,
    BadgeCheck,
    BadgeDollarSign,
    Building2,
    CalendarDays,
    Check,
    CircleCheck,
    Globe2,
    GraduationCap,
    Languages,
    MapPin,
    Medal,
    Plane,
    ShieldCheck,
    TrendingUp,
    University,
    Users,
    WalletCards,
    Info,
    House,
} from "lucide-react";

import { NavLink, useParams } from "react-router";
import universities from "../data/universities.json";


const UniversityDetails = () => {
    const { slug } = useParams();

    const university = universities.find(
        (item) => item.slug === slug
    );

    // ---------------------------------------------------------
    // Prevent page crash if invalid university ID
    // ---------------------------------------------------------

    if (!university) {
        return (
            <div className="flex min-h-screen items-center justify-center px-6">
                <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                        <University size={30} />
                    </div>

                    <h1 className="mt-6 text-4xl font-bold text-slate-900">
                        University Not Found
                    </h1>

                    <p className="mt-3 text-slate-500">
                        The university you're looking for doesn't exist.
                    </p>

                    <NavLink
                        to="/universities"
                        className="
                            mt-6
                            inline-flex items-center gap-2
                            rounded-xl
                            bg-sky-600
                            px-6 py-3
                            font-semibold
                            text-white
                            shadow-lg shadow-sky-600/20
                            transition-all
                            hover:-translate-y-1
                            hover:bg-sky-500
                        "
                    >
                        Explore Universities
                        <ArrowRight size={18} />
                    </NavLink>

                </div>
            </div>
        );
    }


    // ---------------------------------------------------------
    // Safe fallback values
    // ---------------------------------------------------------

    const popularPrograms =
        university.popularPrograms || [];

    const programs =
        university.programs || popularPrograms;

    const admissionRequirements =
        university.requirements || {};

    const facilities =
        university.facilities || [];

    const scholarships =
        university.scholarships || [];

    const whyChoose =
        university.whyChoose || [];

    const additionalCosts =
        university.additionalCosts || [];

    const intakes =
        university.intakes || [];

    const workRights =
        university.workRights ||
        university.workRightsForStudents ||
        "Varies by country and visa conditions";

    const overview =
        university.overview ||
        university.description ||
        `${university.name} offers a range of academic opportunities for international students looking to study in ${university.city}, ${university.country}.`;

    const tuition =
        university.tuition || "Not specified";

    const ranking =
        university.qsRanking || "Not ranked";

    const programCount =
        university.programsCount ?? "—";

    const scholarshipCount =
        university.scholarshipsCount ?? "—";


    return (
        <div className="text-slate-900">

            {/* ========================================================= */}
            {/* BACKGROUND */}
            {/* ========================================================= */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div
                    className="
                        absolute
                        -left-40
                        -top-40
                        h-96 w-96
                        rounded-full
                        bg-sky-200/30
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        right-0
                        top-[35%]
                        h-96 w-96
                        rounded-full
                        bg-cyan-200/30
                        blur-3xl
                    "
                />

            </div>


            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden">

                <div
                    className="
                        relative
                        min-h-140
                        overflow-hidden
                        bg-linear-to-br
                        from-slate-950
                        via-sky-950
                        to-sky-800
                    "
                >

                    {/* Decorative circles */}

                    <div
                        className="
                            absolute
                            -left-32
                            -top-32
                            h-96 w-96
                            rounded-full
                            border
                            border-white/10
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-40
                            right-10
                            h-112.5 w-112.5
                            rounded-full
                            border
                            border-white/10
                        "
                    />

                    <div
                        className="
                            absolute
                            right-20
                            top-20
                            h-64 w-64
                            rounded-full
                            bg-sky-400/10
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            bottom-0
                            left-1/3
                            h-72 w-72
                            rounded-full
                            bg-cyan-400/10
                            blur-3xl
                        "
                    />


                    {/* Hero content */}

                    <div
                        className="
                            relative
                            mx-auto
                            flex
                            min-h-140
                            max-w-7xl
                            items-center
                            px-6
                            pt-40
                            pb-20
                        "
                    >

                        <div className="max-w-4xl text-white">

                            {/* University label */}

                            <div
                                className="
                                    mb-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-white/20
                                    bg-white/10
                                    px-4 py-2
                                    text-sm
                                    font-semibold
                                    backdrop-blur
                                "
                            >
                                <Building2 size={16} />

                                University
                            </div>


                            {/* Title */}

                            <h1
                                className="
                                    text-4xl
                                    font-black
                                    leading-tight
                                    sm:text-5xl
                                    lg:text-6xl
                                "
                            >
                                Discover

                                <span
                                    className="
                                        block
                                        bg-linear-to-r
                                        from-sky-300
                                        via-cyan-400
                                        to-sky-400
                                        bg-clip-text
                                        text-transparent
                                    "
                                >
                                    {university.name}
                                </span>
                            </h1>


                            {/* Location */}

                            <div
                                className="
                                    mt-5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-4
                                    text-slate-200
                                "
                            >

                                <div className="flex items-center gap-2">
                                    <MapPin
                                        size={18}
                                        className="text-sky-400"
                                    />

                                    <span>
                                        {university.city}, {university.country}
                                    </span>
                                </div>


                                <div className="hidden h-1 w-1 rounded-full bg-slate-500 sm:block" />


                                <div className="flex items-center gap-2">
                                    <Medal
                                        size={18}
                                        className="text-amber-400"
                                    />

                                    <span>
                                        QS Ranking #{ranking}
                                    </span>
                                </div>

                            </div>


                            {/* Description */}

                            <p
                                className="
                                    mt-6
                                    max-w-3xl
                                    text-lg
                                    leading-8
                                    text-slate-200
                                "
                            >
                                {overview}
                            </p>


                            {/* Popular programs */}

                            <div className="mt-8 flex flex-wrap gap-3">

                                {popularPrograms
                                    .slice(0, 5)
                                    .map((program) => (
                                        <span
                                            key={program}
                                            className="
                                                rounded-xl
                                                border
                                                border-white/20
                                                bg-white/10
                                                px-4 py-2
                                                text-sm
                                                font-semibold
                                                backdrop-blur
                                                transition-all
                                                duration-300
                                                hover:-translate-y-1
                                                hover:bg-white/20
                                            "
                                        >
                                            {program}
                                        </span>
                                    ))}

                            </div>


                            {/* CTA */}

                            <div className="mt-9 flex flex-wrap gap-4">

                                <NavLink
                                    to="/eligibility-analysis"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-sky-600
                                        px-6 py-3.5
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-sky-500/20
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:bg-sky-500
                                    "
                                >
                                    <BadgeCheck size={18} />

                                    Check My Eligibility

                                    <ArrowRight
                                        className="
                                            h-4 w-4
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />
                                </NavLink>


                                <NavLink
                                    to="/universities"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/30
                                        bg-white/10
                                        px-6 py-3.5
                                        font-semibold
                                        text-white
                                        backdrop-blur-sm
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:bg-white/20
                                    "
                                >
                                    Explore Universities

                                    <ArrowRight
                                        className="
                                            h-4 w-4
                                            transition-transform
                                            group-hover:translate-x-1
                                        "
                                    />
                                </NavLink>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* FACT BAR */}
            {/* ========================================================= */}

            <section
                className="
                    relative
                    z-10
                    mx-auto
                    -mt-10
                    max-w-7xl
                    px-6
                "
            >

                <div
                    className="
                        mx-auto
                        grid
                        w-[90%]
                        overflow-hidden
                        rounded-3xl
                        border
                        border-slate-200
                        bg-white
                        shadow-xl
                        sm:w-full
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    {/* Ranking */}

                    <div
                        className="
                            group
                            border-b
                            border-slate-100
                            p-6
                            transition
                            hover:bg-amber-50/50
                            sm:border-r
                            lg:border-b-0
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-amber-50
                                    text-amber-600
                                    transition
                                    group-hover:bg-amber-500
                                    group-hover:text-white
                                "
                            >
                                <Medal size={21} />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >
                                    QS Ranking
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    #{ranking}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Tuition */}

                    <div
                        className="
                            group
                            border-b
                            border-slate-100
                            p-6
                            transition
                            hover:bg-sky-50/50
                            sm:border-b-0
                            sm:border-r
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-50
                                    text-sky-600
                                    transition
                                    group-hover:bg-sky-600
                                    group-hover:text-white
                                "
                            >
                                <BadgeDollarSign size={21} />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >
                                    Tuition Fee
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {tuition}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Programs */}

                    <div
                        className="
                            group
                            border-b
                            border-slate-100
                            p-6
                            transition
                            hover:bg-blue-50/50
                            lg:border-b-0
                            lg:border-r
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-50
                                    text-blue-600
                                    transition
                                    group-hover:bg-blue-600
                                    group-hover:text-white
                                "
                            >
                                <GraduationCap size={21} />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >
                                    Programs
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {programCount}+
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Scholarships */}

                    <div
                        className="
                            group
                            p-6
                            transition
                            hover:bg-emerald-50/50
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-emerald-50
                                    text-emerald-600
                                    transition
                                    group-hover:bg-emerald-600
                                    group-hover:text-white
                                "
                            >
                                <WalletCards size={21} />
                            </div>

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-semibold
                                        uppercase
                                        tracking-wider
                                        text-slate-400
                                    "
                                >
                                    Scholarships
                                </p>

                                <p className="mt-1 font-bold text-slate-900">
                                    {scholarshipCount}+
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* ABOUT UNIVERSITY */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-20">

                <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">

                    <div className="max-w-3xl">

                        {/* Label */}

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-sky-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-sky-600
                                "
                            >
                                About the University
                            </span>

                        </div>


                        {/* Heading */}

                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            Study at{" "}

                            <span className="text-sky-600">
                                {university.name}.
                            </span>
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            {overview}
                        </p>


                        {/* Location */}

                        <div
                            className="
                                mt-8
                                flex
                                items-start
                                gap-4
                                rounded-3xl
                                border
                                border-sky-100
                                bg-sky-50/60
                                p-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-100
                                    text-sky-600
                                "
                            >
                                <MapPin size={21} />
                            </div>

                            <div>

                                <p className="text-sm font-bold text-slate-900">
                                    University Location
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {university.city}, {university.country}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* University Snapshot */}

                    <div
                        className="
                            relative
                            overflow-hidden
                            rounded-3xl
                            bg-linear-to-br
                            from-sky-600
                            via-sky-500
                            to-cyan-500
                            p-8
                            text-white
                            shadow-xl
                        "
                    >

                        <div
                            className="
                                absolute
                                -right-10
                                -top-10
                                h-32 w-32
                                rounded-full
                                bg-white/10
                            "
                        />

                        <div
                            className="
                                absolute
                                -bottom-12
                                -left-12
                                h-36 w-36
                                rounded-full
                                bg-white/5
                            "
                        />

                        <div className="relative">

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    uppercase
                                    tracking-wider
                                    text-sky-100
                                "
                            >
                                University Snapshot
                            </p>

                            <h3 className="mt-3 text-2xl font-bold">
                                Why students consider this university
                            </h3>


                            <div className="mt-7 space-y-4">

                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-white/15
                                        pb-4
                                    "
                                >
                                    <span className="text-sky-100">
                                        QS Ranking
                                    </span>

                                    <span className="font-bold">
                                        #{ranking}
                                    </span>
                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-white/15
                                        pb-4
                                    "
                                >
                                    <span className="text-sky-100">
                                        Programs
                                    </span>

                                    <span className="font-bold">
                                        {programCount}+
                                    </span>
                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-white/15
                                        pb-4
                                    "
                                >
                                    <span className="text-sky-100">
                                        Scholarships
                                    </span>

                                    <span className="font-bold">
                                        {scholarshipCount}+
                                    </span>
                                </div>


                                <div className="flex items-center justify-between">

                                    <span className="text-sky-100">
                                        Location
                                    </span>

                                    <span className="font-bold">
                                        {university.country}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* ACADEMIC PROGRAMS */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-blue-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-blue-600
                                "
                            >
                                Academic Programs
                            </span>

                        </div>


                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            Explore what you can{" "}

                            <span className="text-blue-600">
                                study.
                            </span>
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            Discover popular academic areas and programs
                            available at {university.name}.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        {programs.slice(0, 8).map((program, index) => (

                            <div
                                key={program}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-blue-200
                                    hover:shadow-xl
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-8
                                        -top-8
                                        h-24 w-24
                                        rounded-full
                                        bg-blue-50
                                        opacity-0
                                        transition
                                        duration-300
                                        group-hover:opacity-100
                                    "
                                />

                                <div className="relative">

                                    <div
                                        className="
                                            flex
                                            h-11 w-11
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-blue-50
                                            text-blue-600
                                            transition
                                            duration-300
                                            group-hover:bg-blue-600
                                            group-hover:text-white
                                        "
                                    >
                                        <GraduationCap size={21} />
                                    </div>


                                    <span
                                        className="
                                            mt-5
                                            block
                                            text-sm
                                            font-bold
                                            text-blue-600
                                        "
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </span>


                                    <h3 className="mt-2 font-bold text-slate-900">
                                        {program}
                                    </h3>


                                    <div
                                        className="
                                            mt-5
                                            h-1
                                            w-10
                                            rounded-full
                                            bg-blue-600
                                            transition-all
                                            duration-300
                                            group-hover:w-16
                                        "
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* ADMISSION */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr]">

                    <div>

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-violet-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-violet-600
                                "
                            >
                                Admission
                            </span>

                        </div>


                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            What do you need to{" "}

                            <span className="text-violet-600">
                                apply?
                            </span>
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            Prepare the key documents and qualifications
                            commonly required for admission.
                        </p>


                        {/* English */}

                        <div
                            className="
                                mt-8
                                rounded-3xl
                                bg-linear-to-br
                                from-violet-600
                                to-blue-700
                                p-7
                                text-white
                                shadow-xl
                            "
                        >

                            <div className="flex items-center gap-3">

                                <Languages size={25} />

                                <p className="font-semibold">
                                    English Requirement
                                </p>

                            </div>


                            <p className="mt-4 text-4xl font-black">
                                {university.ielts
                                    ? `IELTS ${university.ielts}`
                                    : "Varies"}
                            </p>


                            <p className="mt-2 text-sm text-violet-100">
                                English requirements may vary by program.
                            </p>

                        </div>


                        {/* Note */}

                        <div
                            className="
                                group
                                mt-6
                                flex
                                items-start
                                gap-4
                                rounded-3xl
                                border
                                border-blue-200
                                bg-blue-50/70
                                p-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-10 w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-100
                                    text-blue-600
                                    transition-all
                                    duration-500
                                    group-hover:scale-110
                                    group-hover:bg-blue-600
                                    group-hover:text-white
                                "
                            >
                                <Info size={20} />
                            </div>

                            <div>

                                <p className="text-sm font-bold text-slate-900">
                                    Good to know
                                </p>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {admissionRequirements.note ||
                                        "Admission requirements can differ depending on your chosen program and degree level."}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* Requirements */}

                    <div className="space-y-5">

                        {/* Academic */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-7
                                shadow-sm
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-11 w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-blue-50
                                        text-blue-600
                                    "
                                >
                                    <GraduationCap size={21} />
                                </div>

                                <h3 className="text-lg font-bold">
                                    Academic Requirements
                                </h3>

                            </div>


                            <p className="mt-4 leading-7 text-slate-600">
                                {admissionRequirements.academic ||
                                    "Applicants should meet the academic requirements specified by their selected program."}
                            </p>

                        </div>


                        {/* Background */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-7
                                shadow-sm
                            "
                        >

                            <h3 className="font-bold">
                                Recommended Background
                            </h3>


                            <div className="mt-5 grid gap-3 sm:grid-cols-2">

                                {(admissionRequirements.prerequisites || [
                                    "Relevant academic background",
                                    "Strong academic performance",
                                    "English proficiency",
                                    "Required supporting documents",
                                ]).map((item) => (

                                    <div
                                        key={item}
                                        className="
                                            group
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            border
                                            border-slate-100
                                            bg-slate-50
                                            p-3
                                            shadow-sm
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:shadow-lg
                                        "
                                    >

                                        <CircleCheck
                                            size={18}
                                            className="
                                                shrink-0
                                                text-blue-600
                                            "
                                        />

                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                                text-slate-700
                                            "
                                        >
                                            {item}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* Documents */}

                        <div
                            className="
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-7
                                shadow-sm
                            "
                        >

                            <h3 className="font-bold">
                                Required Documents
                            </h3>


                            <div className="mt-5 flex flex-wrap gap-2">

                                {(admissionRequirements.documents || [
                                    "Academic transcripts",
                                    "Certificate",
                                    "English test result",
                                    "Passport",
                                    "Statement of Purpose",
                                    "Recommendation letters",
                                ]).map((document) => (

                                    <span
                                        key={document}
                                        className="
                                            rounded-full
                                            border
                                            border-blue-50
                                            bg-blue-50
                                            px-3 py-2
                                            text-sm
                                            font-medium
                                            text-blue-700
                                            shadow-sm
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:shadow-lg
                                        "
                                    >
                                        {document}
                                    </span>

                                ))}

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* TUITION & COSTS */}
            {/* ========================================================= */}

            <section
                className="
                    relative
                    overflow-hidden
                    bg-slate-50
                    py-24
                "
            >

                <div
                    className="
                        absolute
                        -left-24
                        top-20
                        h-72 w-72
                        rounded-full
                        bg-amber-200/20
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -right-24
                        bottom-10
                        h-72 w-72
                        rounded-full
                        bg-sky-200/20
                        blur-3xl
                    "
                />


                <div className="relative mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-amber-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-amber-600
                                "
                            >
                                Cost of Study
                            </span>

                        </div>


                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            Understand your{" "}

                            <span className="text-amber-600">
                                investment.
                            </span>
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            Plan your study abroad budget by considering
                            tuition, living expenses and additional student
                            costs.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {/* Tuition */}

                        <div
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12 w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-amber-50
                                    text-amber-600
                                    transition-all
                                    duration-500
                                    group-hover:scale-110
                                    group-hover:bg-amber-600
                                    group-hover:text-white
                                "
                            >
                                <BadgeDollarSign size={22} />
                            </div>


                            <p className="mt-6 text-sm font-semibold text-slate-500">
                                Tuition Fee
                            </p>


                            <p className="mt-2 text-2xl font-black text-slate-900">
                                {tuition}
                            </p>


                            <p className="mt-2 text-sm text-slate-500">
                                Typical tuition information
                            </p>

                        </div>


                        {/* Living Cost */}
                        
                        <div className=" group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl " >
                            
                            <div className=" flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-all duration-500 group-hover:scale-110 group-hover:bg-sky-600 group-hover:text-white " >
                                 <House size={22} /> 
                                 </div> 
                                 <p className="mt-6 text-sm font-semibold text-slate-500">
                                    Living Costs
                                  </p>
                                 <p className="mt-2 text-2xl font-black text-slate-900">
                                    {university.livingCost || "Not specified"}
                                  </p>
                                 <p className="mt-2 text-sm text-slate-500">
                                    Estimated living expenses
                                  </p>
                        </div>



                        {/* Scholarships */}

                        <div
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12 w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-emerald-50
                                    text-emerald-600
                                    transition-all
                                    duration-500
                                    group-hover:scale-110
                                    group-hover:bg-emerald-600
                                    group-hover:text-white
                                "
                            >
                                <WalletCards size={22} />
                            </div>


                            <p className="mt-6 text-sm font-semibold text-slate-500">
                                Scholarship Availability
                            </p>


                            <p className="mt-2 text-2xl font-black text-slate-900">
                                {scholarshipCount}+
                            </p>


                            <p className="mt-2 text-sm text-slate-500">
                                Listed scholarship opportunities
                            </p>

                        </div>

                    </div>


                    {/* Additional Costs */}

                    <div
                        className="
                            mt-8
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-7
                        "
                    >

                        <h3 className="text-lg font-bold">
                            Additional expenses to plan for
                        </h3>


                        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                            {(additionalCosts.length
                                ? additionalCosts
                                : [
                                    "Accommodation",
                                    "Food and daily expenses",
                                    "Health insurance",
                                    "Transportation",
                                    "Visa expenses",
                                    "Study materials",
                                ]
                            ).map((cost) => (

                                <div
                                    key={cost}
                                    className="
                                        group
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-slate-100
                                        bg-slate-50
                                        px-4 py-3
                                        shadow-sm
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:shadow-lg
                                    "
                                >

                                    <Check
                                        size={18}
                                        className="text-emerald-600"
                                    />

                                    <span className="text-sm font-medium text-slate-700">
                                        {cost}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>


                    {/* Cost note */}

                    <div
                        className="
                            group
                            mt-6
                            flex
                            items-start
                            gap-4
                            rounded-3xl
                            border
                            border-amber-200
                            bg-amber-50/70
                            p-6
                        "
                    >

                        <div
                            className="
                                flex
                                h-10 w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-amber-100
                                text-amber-600
                                transition-all
                                duration-500
                                group-hover:scale-110
                                group-hover:bg-amber-600
                                group-hover:text-white
                            "
                        >
                            <Info size={20} />
                        </div>


                        <div>

                            <p className="text-sm font-bold text-slate-900">
                                Good to know
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                Actual costs vary depending on your program,
                                lifestyle, accommodation and study destination.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* CAMPUS & STUDENT LIFE */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr]">

                    <div>

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-emerald-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-emerald-600
                                "
                            >
                                Campus & Student Life
                            </span>

                        </div>


                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            More than just a{" "}

                            <span className="text-emerald-600">
                                classroom.
                            </span>
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            Explore the facilities, services and student
                            experiences that can shape your university life.
                        </p>


                        <div
                            className="
                                mt-8
                                rounded-3xl
                                bg-emerald-50
                                p-7
                            "
                        >

                            <div className="flex items-center gap-3 text-emerald-700">

                                <Users size={23} />

                                <span className="font-semibold">
                                    Student Experience
                                </span>

                            </div>


                            <p className="mt-3 text-3xl font-black text-emerald-800">
                                {university.studentCount || "International"}
                            </p>


                            <p className="mt-1 text-sm text-emerald-700">
                                Student community and campus experience
                            </p>

                        </div>

                    </div>


                    {/* Facilities */}

                    <div className="grid gap-4 sm:grid-cols-2">

                        {(facilities.length
                            ? facilities
                            : [
                                "Modern campus facilities",
                                "Library and research resources",
                                "Student support services",
                                "Clubs and societies",
                                "Sports and recreation",
                                "Career services",
                            ]
                        ).map((facility, index) => (

                            <div
                                key={facility}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-emerald-200
                                    hover:shadow-lg
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-8
                                        -top-8
                                        h-24 w-24
                                        rounded-full
                                        bg-emerald-50
                                        opacity-0
                                        transition
                                        group-hover:opacity-100
                                    "
                                />

                                <div className="relative">

                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            text-emerald-600
                                        "
                                    >
                                        FEATURE {String(index + 1).padStart(2, "0")}
                                    </span>


                                    <div
                                        className="
                                            mt-4
                                            flex
                                            h-10 w-10
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-emerald-50
                                            text-emerald-600
                                            transition
                                            duration-300
                                            group-hover:bg-emerald-600
                                            group-hover:text-white
                                        "
                                    >
                                        <Building2 size={18} />
                                    </div>


                                    <h3 className="mt-4 font-bold text-slate-900">
                                        {facility}
                                    </h3>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* INTERNATIONAL STUDENTS */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-sky-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-sky-600
                                "
                            >
                                International Students
                            </span>

                        </div>


                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            Prepare for your{" "}

                            <span className="text-sky-600">
                                study journey.
                            </span>
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            Understand key information international students
                            should consider before choosing this university.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                        {/* Intake */}

                        <div
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-sky-200
                                hover:shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-50
                                    text-sky-600
                                    transition
                                    group-hover:bg-sky-600
                                    group-hover:text-white
                                "
                            >
                                <CalendarDays size={21} />
                            </div>


                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Intakes
                            </p>


                            <p className="mt-2 font-bold text-slate-900">
                                {intakes.length
                                    ? intakes.join(" • ")
                                    : "Multiple intakes"}
                            </p>

                        </div>


                        {/* Work Rights */}

                        <div
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-blue-200
                                hover:shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-blue-50
                                    text-blue-600
                                    transition
                                    group-hover:bg-blue-600
                                    group-hover:text-white
                                "
                            >
                                <BriefcaseIcon />
                            </div>


                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Work Rights
                            </p>


                            <p className="mt-2 font-bold text-slate-900">
                                {workRights}
                            </p>

                        </div>


                        {/* Location */}

                        <div
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-cyan-200
                                hover:shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-cyan-50
                                    text-cyan-600
                                    transition
                                    group-hover:bg-cyan-600
                                    group-hover:text-white
                                "
                            >
                                <Globe2 size={21} />
                            </div>


                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                Destination
                            </p>


                            <p className="mt-2 font-bold text-slate-900">
                                {university.country}
                            </p>

                        </div>


                        {/* International */}

                        <div
                            className="
                                group
                                rounded-3xl
                                border
                                border-slate-200
                                bg-white
                                p-6
                                shadow-sm
                                transition-all
                                duration-300
                                hover:-translate-y-1
                                hover:border-violet-200
                                hover:shadow-xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-11 w-11
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-violet-50
                                    text-violet-600
                                    transition
                                    group-hover:bg-violet-600
                                    group-hover:text-white
                                "
                            >
                                <Plane size={21} />
                            </div>


                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">
                                International Students
                            </p>


                            <p className="mt-2 font-bold text-slate-900">
                                {university.internationalStudents ||
                                    "Welcomed"}
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* SCHOLARSHIPS */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-24">

                <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">

                    <div>

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-amber-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-amber-600
                                "
                            >
                                Scholarships
                            </span>

                        </div>


                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            Make your education{" "}

                            <span className="text-amber-600">
                                more affordable.
                            </span>
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            Explore scholarship opportunities that may help
                            reduce the cost of studying at {university.name}.
                        </p>


                        <div
                            className="
                                mt-8
                                rounded-3xl
                                bg-linear-to-br
                                from-amber-500
                                to-orange-600
                                p-7
                                text-white
                                shadow-xl
                            "
                        >

                            <div className="flex items-center gap-3">

                                <WalletCards size={25} />

                                <p className="font-semibold">
                                    Scholarship Opportunities
                                </p>

                            </div>


                            <p className="mt-4 text-4xl font-black">
                                {scholarshipCount}+
                            </p>


                            <p className="mt-2 text-sm text-amber-100">
                                Potential scholarship opportunities available.
                            </p>

                        </div>

                    </div>


                    <div className="grid gap-4 sm:grid-cols-2">

                        {(scholarships.length
                            ? scholarships
                            : [
                                "Merit-based scholarships",
                                "International student scholarships",
                                "Academic excellence awards",
                                "Need-based funding",
                            ]
                        ).map((scholarship, index) => (

                            <div
                                key={
                                    typeof scholarship === "string"
                                        ? scholarship
                                        : scholarship.name
                                }
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-6
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-lg
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-8
                                        -top-8
                                        h-24 w-24
                                        rounded-full
                                        bg-amber-50
                                        opacity-0
                                        transition
                                        group-hover:opacity-100
                                    "
                                />

                                <div className="relative">

                                    <div
                                        className="
                                            flex
                                            h-11 w-11
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-amber-50
                                            text-amber-600
                                            transition
                                            duration-300
                                            group-hover:bg-amber-600
                                            group-hover:text-white
                                        "
                                    >
                                        <Award size={19} />
                                    </div>


                                    <p
                                        className="
                                            mt-5
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-slate-400
                                        "
                                    >
                                        Option {String(index + 1).padStart(2, "0")}
                                    </p>


                                    <h3 className="mt-1 font-bold text-slate-900">
                                        {typeof scholarship === "string"
                                            ? scholarship
                                            : scholarship.name}
                                    </h3>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* WHY CHOOSE UNIVERSITY */}
            {/* ========================================================= */}

            <section className="bg-slate-50 py-24">

                <div className="mx-auto max-w-7xl px-6">

                    <div className="max-w-3xl">

                        <div className="mb-5 flex items-center gap-3">

                            <span className="h-px w-10 bg-sky-600" />

                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.2em]
                                    text-sky-600
                                "
                            >
                                Why Choose This University?
                            </span>

                        </div>


                        <h2
                            className="
                                text-4xl
                                font-extrabold
                                leading-tight
                                tracking-tight
                                text-slate-900
                                md:text-5xl
                            "
                        >
                            Is{" "}

                            <span className="text-sky-600">
                                {university.name}
                            </span>{" "}

                            right for you?
                        </h2>


                        <p
                            className="
                                mt-6
                                max-w-2xl
                                text-base
                                leading-8
                                text-slate-600
                                md:text-lg
                            "
                        >
                            Consider these advantages when deciding whether
                            this university aligns with your academic and
                            study-abroad goals.
                        </p>

                    </div>


                    <div className="mt-12 grid gap-6 md:grid-cols-2">

                        {(whyChoose.length
                            ? whyChoose
                            : [
                                "Strong academic opportunities",
                                "Wide range of study programs",
                                "Scholarship opportunities for students",
                                "Supportive international student environment",
                            ]
                        ).map((item) => (

                            <div
                                key={item}
                                className="
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-3xl
                                    border
                                    border-slate-200
                                    bg-white
                                    p-7
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    hover:-translate-y-1
                                    hover:border-sky-200
                                    hover:shadow-xl
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-10
                                        -top-10
                                        h-28 w-28
                                        rounded-full
                                        bg-sky-50
                                        opacity-0
                                        transition
                                        group-hover:opacity-100
                                    "
                                />


                                <div className="relative flex gap-4">

                                    <div
                                        className="
                                            flex
                                            h-11 w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-sky-50
                                            text-sky-600
                                            transition
                                            duration-300
                                            group-hover:bg-sky-600
                                            group-hover:text-white
                                        "
                                    >
                                        <Check size={21} />
                                    </div>


                                    <p
                                        className="
                                            pt-2
                                            font-semibold
                                            leading-6
                                            text-slate-800
                                        "
                                    >
                                        {item}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>


            {/* ========================================================= */}
            {/* FINAL CTA */}
            {/* ========================================================= */}

            <section className=" bg-slate-50 px-6 pb-20">
                <div className="relative overflow-hidden mx-auto max-w-308 rounded-3xl bg-linear-to-br from-slate-950
                        via-sky-950
                        to-sky-800 py-24">

                    {/* Decorative circles */}
                    <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full border border-white/10" />

                    <div className="absolute -bottom-40 right-10 h-112.5 w-112.5 rounded-full border border-white/10" />

                    <div className="relative mx-auto max-w-4xl px-6 text-center text-white">

                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
                            <ShieldCheck className="text-sky-400" size={28} />
                            <span className="inline-block text-sm font-bold uppercase tracking-wider text-sky-400">
                                Your Next Step
                            </span>
                        </div>

                        <h2 className="mt-3 text-4xl font-black tracking-tight">
                            Could {university.name} be your next destination?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-300">
                            Check your eligibility and discover whether your
                            academic background, English proficiency, budget
                            and study goals align with your plans.
                        </p>

                        <div className="mt-9 flex flex-wrap justify-center gap-4">

                            <NavLink to="/eligibility-analysis" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-sky-500">
                                <span className="flex items-center gap-2">
                                    <BadgeCheck size={18} />
                                    Check My Eligibility
                                </span>
                            </NavLink>

                            <NavLink to="/universities" className="group inline-flex items-center gap-2 rounded-xl text-white border border-white/30 bg-white/10 px-6 py-3.5 font-semibold backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:-translate-y-1">
                                <span className="flex items-center gap-2">
                                    Explore Other Universities
                                    <ArrowRight size={18} />
                                </span>
                            </NavLink>

                        </div>

                    </div>

                </div>
            </section>

        </div>
    );
};


// Small reusable icon component
const BriefcaseIcon = () => (
    <TrendingUp size={21} />
);


export default UniversityDetails;
