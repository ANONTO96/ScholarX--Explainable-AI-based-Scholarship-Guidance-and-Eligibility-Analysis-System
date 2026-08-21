import {
    AlertCircle,
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    GraduationCap,
    Globe2,
    Search,
    Sparkles,
    Target,
    UserRoundCheck,
    XCircle,
} from "lucide-react";
import { NavLink } from "react-router";
import { useMemo, useState } from "react";

// CHANGE THIS IMPORT TO YOUR ACTUAL OPPORTUNITY DATA PATH
import opportunities from "../data/opportunities.json";

/* ========================================================= */
/* STUDENT PROFILE                                           */
/* ========================================================= */

const studentProfile = {
    academicPerformance: 3.5,
    studyLevel: "Bachelor",
    fieldOfStudy: "Computer Science",
    studyDestination: "Australia",
    englishScore: 7.0,
    nationality: "Bangladeshi",
    age: 25,
    annualBudget: 50000,
    workExperienceMonths: 6,
    achievements: [
        "Hackathon Winner",
        "Programming",
        "Technology",
    ],
    leadershipExperience: false,
    communityService: false,
    researchExperience: false,
    internationalStudent: true,
    isStudent: true,
};

/* ========================================================= */
/* NORMALIZE TEXT                                            */
/* ========================================================= */

const normalize = (value = "") =>
    value
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

/* ========================================================= */
/* ELIGIBILITY RULE ENGINE                                   */
/* ========================================================= */

/*
    Your current opportunity data stores eligibility as strings.

    Example:

    "International Students"
    "Bachelor's Degree"
    "Strong Academic Record"
    "Leadership"
    "Work Experience"

    This function interprets those strings against the student profile.

    IMPORTANT:
    This is a rule-based prototype.
    Later, these rules should ideally be backed by structured
    fields in your database.
*/

function evaluateRequirement(requirement, opportunity) {
    const req = normalize(requirement);

    /* ----------------------------------------------------- */
    /* INTERNATIONAL / NATIONALITY                           */
    /* ----------------------------------------------------- */

    if (
        req.includes("international student") ||
        req.includes("international students")
    ) {
        return {
            type: "pass",
            label: "International student requirement met",
            detail: studentProfile.nationality,
            weight: 2,
        };
    }

    if (
        req.includes("eligible countries") ||
        req.includes("citizens of eligible countries")
    ) {
        /*
            Your current dataset doesn't specify the actual
            country list, so this cannot be definitively verified.
        */
        return {
            type: "review",
            label: "Country eligibility needs verification",
            detail: studentProfile.nationality,
            weight: 2,
        };
    }

    if (req.includes("commonwealth citizen")) {
        /*
            Bangladesh is a Commonwealth member, so this can
            reasonably be treated as a pass for the prototype.
        */
        return {
            type: "pass",
            label: "Commonwealth nationality",
            detail: "Bangladesh",
            weight: 3,
        };
    }

    /* ----------------------------------------------------- */
    /* DEGREE / STUDY LEVEL                                  */
    /* ----------------------------------------------------- */

    if (
        req.includes("bachelor degree") ||
        req.includes("bachelors degree")
    ) {
        const matched =
            studentProfile.studyLevel === "Bachelor" ||
            studentProfile.studyLevel === "Master";

        return {
            type: matched ? "pass" : "fail",
            label: "Bachelor's degree requirement",
            detail: matched
                ? "Current study level is compatible"
                : "Bachelor's degree required",
            weight: 3,
        };
    }

    if (req.includes("doctoral student")) {
        const matched = studentProfile.studyLevel === "PhD";

        return {
            type: matched ? "pass" : "fail",
            label: "Doctoral study requirement",
            detail: matched
                ? "PhD"
                : "Current level is not doctoral",
            weight: 5,
        };
    }

    if (req.includes("master")) {
        const matched = opportunity.degree?.some(
            (degree) => normalize(degree) === "master"
        );

        return {
            type: matched ? "pass" : "review",
            label: "Master's level opportunity",
            detail: matched
                ? "Master's is offered"
                : "Study-level compatibility needs review",
            weight: 3,
        };
    }

    /* ----------------------------------------------------- */
    /* ACADEMIC PERFORMANCE                                  */
    /* ----------------------------------------------------- */

    if (
        req.includes("strong academic") ||
        req.includes("outstanding academic")
    ) {
        if (studentProfile.academicPerformance >= 3.5) {
            return {
                type: "pass",
                label: "Strong academic profile",
                detail: `GPA ${studentProfile.academicPerformance} / 4.00`,
                weight: 4,
            };
        }

        if (studentProfile.academicPerformance >= 3.0) {
            return {
                type: "review",
                label: "Academic profile may need review",
                detail: `GPA ${studentProfile.academicPerformance} / 4.00`,
                weight: 4,
            };
        }

        return {
            type: "fail",
            label: "Academic requirement may not be met",
            detail: `GPA ${studentProfile.academicPerformance} / 4.00`,
            weight: 5,
        };
    }

    /* ----------------------------------------------------- */
    /* ENGLISH / IELTS                                       */
    /* ----------------------------------------------------- */

    if (req.includes("ielts")) {
        const match = requirement.match(/(\d+(?:\.\d+)?)/);

        if (!match) {
            return {
                type: "review",
                label: "IELTS requirement needs verification",
                detail: `IELTS ${studentProfile.englishScore}`,
                weight: 2,
            };
        }

        const minimum = Number(match[1]);

        if (studentProfile.englishScore >= minimum) {
            return {
                type: "pass",
                label: `IELTS ${minimum}+ required`,
                detail: `IELTS ${studentProfile.englishScore}`,
                weight: 3,
            };
        }

        return {
            type: "fail",
            label: `IELTS ${minimum}+ required`,
            detail: `IELTS ${studentProfile.englishScore}`,
            weight: 5,
        };
    }

    /* ----------------------------------------------------- */
    /* WORK EXPERIENCE                                      */
    /* ----------------------------------------------------- */

    if (req.includes("work experience")) {
        if (studentProfile.workExperienceMonths >= 12) {
            return {
                type: "pass",
                label: "Work experience",
                detail: `${studentProfile.workExperienceMonths} months`,
                weight: 3,
            };
        }

        return {
            type: "review",
            label: "Work experience",
            detail: `${studentProfile.workExperienceMonths} months — verify the required amount`,
            weight: 3,
        };
    }

    /* ----------------------------------------------------- */
    /* LEADERSHIP                                            */
    /* ----------------------------------------------------- */

    if (
        req.includes("leadership") ||
        req.includes("leadership potential")
    ) {
        if (studentProfile.leadershipExperience) {
            return {
                type: "pass",
                label: "Leadership experience",
                detail: "Profile contains leadership experience",
                weight: 3,
            };
        }

        return {
            type: "review",
            label: "Leadership",
            detail: "Leadership experience is not currently listed",
            weight: 3,
        };
    }

    /* ----------------------------------------------------- */
    /* COMMUNITY SERVICE                                     */
    /* ----------------------------------------------------- */

    if (req.includes("community service")) {
        if (studentProfile.communityService) {
            return {
                type: "pass",
                label: "Community service",
                detail: "Community service found",
                weight: 2,
            };
        }

        return {
            type: "review",
            label: "Community service",
            detail: "No community service listed",
            weight: 2,
        };
    }

    /* ----------------------------------------------------- */
    /* COMPUTER SCIENCE                                      */
    /* ----------------------------------------------------- */

    if (
        req.includes("computer science student") ||
        req.includes("computer science students")
    ) {
        const matched = normalize(
            studentProfile.fieldOfStudy
        ).includes("computer science");

        return {
            type: matched ? "pass" : "fail",
            label: "Computer Science background",
            detail: studentProfile.fieldOfStudy,
            weight: 4,
        };
    }

    /* ----------------------------------------------------- */
    /* ICT                                                   */
    /* ----------------------------------------------------- */

    if (req.includes("ict student") || req.includes("ict students")) {
        const matched =
            normalize(studentProfile.fieldOfStudy).includes("computer") ||
            normalize(studentProfile.fieldOfStudy).includes("information") ||
            normalize(studentProfile.fieldOfStudy).includes("ict");

        return {
            type: matched ? "pass" : "fail",
            label: "ICT background",
            detail: studentProfile.fieldOfStudy,
            weight: 3,
        };
    }

    /* ----------------------------------------------------- */
    /* STUDENT                                               */
    /* ----------------------------------------------------- */

    if (req === "student" || req.includes("student team")) {
        return {
            type: studentProfile.isStudent ? "pass" : "fail",
            label: "Student requirement",
            detail: studentProfile.isStudent
                ? "Current student"
                : "Not currently listed as a student",
            weight: 2,
        };
    }

    /* ----------------------------------------------------- */
    /* AGE                                                   */
    /* ----------------------------------------------------- */

    if (req.includes("age 18 35")) {
        const matched =
            studentProfile.age >= 18 &&
            studentProfile.age <= 35;

        return {
            type: matched ? "pass" : "fail",
            label: "Age requirement",
            detail: `${studentProfile.age} years`,
            weight: 3,
        };
    }

    /* ----------------------------------------------------- */
    /* YOUNG LEADERS                                        */
    /* ----------------------------------------------------- */

    if (req.includes("young leader")) {
        const matched =
            studentProfile.age >= 18 &&
            studentProfile.age <= 35;

        return {
            type: matched ? "pass" : "review",
            label: "Young leader requirement",
            detail: `${studentProfile.age} years`,
            weight: 2,
        };
    }

    /* ----------------------------------------------------- */
    /* OPEN TO EVERYONE                                      */
    /* ----------------------------------------------------- */

    if (req.includes("open to everyone")) {
        return {
            type: "pass",
            label: "Open eligibility",
            detail: "No restrictive eligibility listed",
            weight: 1,
        };
    }

    /* ----------------------------------------------------- */
    /* ADMISSION TO CAMBRIDGE                                */
    /* ----------------------------------------------------- */

    if (req.includes("admission to cambridge")) {
        return {
            type: "review",
            label: "Cambridge admission",
            detail: "Admission status cannot be verified here",
            weight: 5,
        };
    }

    /* ----------------------------------------------------- */
    /* PARTNER UNIVERSITY                                    */
    /* ----------------------------------------------------- */

    if (req.includes("partner university")) {
        return {
            type: "review",
            label: "Partner university requirement",
            detail: "Partner status needs verification",
            weight: 4,
        };
    }

    /* ----------------------------------------------------- */
    /* GOOGLE DEVELOPER STUDENT CLUBS                        */
    /* ----------------------------------------------------- */

    if (req.includes("google developer student clubs")) {
        return {
            type: "review",
            label: "GDSC membership",
            detail: "Membership is not listed in the profile",
            weight: 4,
        };
    }

    /* ----------------------------------------------------- */
    /* INNOVATION PROJECT                                    */
    /* ----------------------------------------------------- */

    if (req.includes("innovation project")) {
        const hasProject =
            studentProfile.achievements.length > 0;

        return {
            type: hasProject ? "pass" : "review",
            label: "Innovation project",
            detail: hasProject
                ? "Relevant achievement listed"
                : "Project not listed",
            weight: 3,
        };
    }

    /* ----------------------------------------------------- */
    /* QUALIFIED UNIVERSITY TEAMS                            */
    /* ----------------------------------------------------- */

    if (req.includes("qualified university teams")) {
        return {
            type: "review",
            label: "Qualified university team",
            detail: "Team qualification needs verification",
            weight: 5,
        };
    }

    /* ----------------------------------------------------- */
    /* DEFAULT                                               */
    /* ----------------------------------------------------- */

    return {
        type: "review",
        label: requirement,
        detail: "Requirement needs verification",
        weight: 2,
    };
}

/* ========================================================= */
/* ANALYZE ONE OPPORTUNITY                                   */
/* ========================================================= */

function analyzeOpportunity(opportunity) {
    const requirements = opportunity.eligibility || [];

    const results = requirements.map((requirement) => ({
        requirement,
        ...evaluateRequirement(requirement, opportunity),
    }));

    const totalWeight = results.reduce(
        (sum, item) => sum + item.weight,
        0
    );

    const passedWeight = results
        .filter((item) => item.type === "pass")
        .reduce((sum, item) => sum + item.weight, 0);

    const failedRequirements = results.filter(
        (item) => item.type === "fail"
    );

    const reviewRequirements = results.filter(
        (item) => item.type === "review"
    );

    const score =
        totalWeight === 0
            ? 100
            : Math.round((passedWeight / totalWeight) * 100);

    /*
        Classification:

        Strong Fit:
        - No failed requirements
        - Most requirements passed
        - Score >= 75

        Review:
        - No hard failure OR limited uncertainty
        - Some requirements need verification

        Not Eligible:
        - At least one hard requirement clearly failed
    */

    let status = "review";

    if (failedRequirements.length > 0) {
        status = "not-eligible";
    } else if (
        score >= 75 &&
        reviewRequirements.length === 0
    ) {
        status = "strong";
    }

    return {
        ...opportunity,
        analysis: {
            score,
            status,
            requirements: results,
            passedCount: results.filter(
                (item) => item.type === "pass"
            ).length,
            reviewCount: reviewRequirements.length,
            failedCount: failedRequirements.length,
        },
    };
}

/* ========================================================= */
/* STATUS CONFIG                                             */
/* ========================================================= */

const statusConfig = {
    strong: {
        label: "Strong Fit",
        description:
            "Your profile meets the major requirements for this opportunity.",
        icon: CheckCircle2,
        badge:
            "bg-emerald-50 text-emerald-700 border-emerald-200",
        iconBox: "bg-emerald-50 text-emerald-600",
        score: "text-emerald-600",
    },

    review: {
        label: "Review",
        description:
            "Your profile has potential, but some requirements need to be verified.",
        icon: AlertCircle,
        badge:
            "bg-amber-50 text-amber-700 border-amber-200",
        iconBox: "bg-amber-50 text-amber-600",
        score: "text-amber-600",
    },

    "not-eligible": {
        label: "Not Eligible",
        description:
            "At least one important requirement does not currently match your profile.",
        icon: XCircle,
        badge:
            "bg-rose-50 text-rose-700 border-rose-200",
        iconBox: "bg-rose-50 text-rose-600",
        score: "text-rose-600",
    },
};

/* ========================================================= */
/* OPPORTUNITY CARD                                          */
/* ========================================================= */

function OpportunityCard({ opportunity }) {
    const [open, setOpen] = useState(false);

    const config =
        statusConfig[opportunity.analysis.status];

    const StatusIcon = config.icon;

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl">
            {/* Main card */}
            <div className="p-6 sm:p-7">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    {/* Opportunity info */}
                    <div className="flex gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <Award size={26} />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                                    {opportunity.category}
                                </span>

                                {opportunity.featured && (
                                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <h3 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
                                {opportunity.title}
                            </h3>

                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {opportunity.provider}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                                <span className="inline-flex items-center gap-1.5">
                                    <Globe2 size={14} />
                                    {opportunity.country}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <GraduationCap size={14} />
                                    {opportunity.degree?.join(", ")}
                                </span>

                                <span className="inline-flex items-center gap-1.5">
                                    <Sparkles size={14} />
                                    {opportunity.funding}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                        <div
                            className={`flex h-14 w-14 items-center justify-center rounded-full border-4 ${config.badge}`}
                        >
                            <span
                                className={`text-sm font-black ${config.score}`}
                            >
                                {opportunity.analysis.score}%
                            </span>
                        </div>

                        <div
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.badge}`}
                        >
                            <StatusIcon size={14} />
                            {config.label}
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">
                    {config.description}
                </p>

                {/* Quick stats */}
                <div className="mt-6 grid grid-cols-3 divide-x rounded-2xl border border-slate-100 bg-slate-50">
                    <div className="p-4 text-center">
                        <p className="text-lg font-black text-emerald-600">
                            {opportunity.analysis.passedCount}
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Passed
                        </p>
                    </div>

                    <div className="p-4 text-center">
                        <p className="text-lg font-black text-amber-500">
                            {opportunity.analysis.reviewCount}
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Review
                        </p>
                    </div>

                    <div className="p-4 text-center">
                        <p className="text-lg font-black text-rose-500">
                            {opportunity.analysis.failedCount}
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Failed
                        </p>
                    </div>
                </div>

                {/* Expand button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/30"
                >
                    <span>
                        {open
                            ? "Hide requirement analysis"
                            : "See why you received this result"}
                    </span>

                    <ChevronDown
                        size={18}
                        className={`transition-transform ${
                            open ? "rotate-180" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Requirement breakdown */}
            {open && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 sm:p-7">
                    <div className="mb-5">
                        <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                            Requirement breakdown
                        </p>

                        <h4 className="mt-1 text-xl font-black text-slate-950">
                            How your profile compares
                        </h4>
                    </div>

                    <div className="space-y-3">
                        {opportunity.analysis.requirements.map(
                            (item, index) => {
                                const passed =
                                    item.type === "pass";

                                const failed =
                                    item.type === "fail";

                                return (
                                    <div
                                        key={`${item.requirement}-${index}`}
                                        className="rounded-2xl border border-slate-200 bg-white p-4"
                                    >
                                        <div className="flex gap-3">
                                            <div
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                    passed
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : failed
                                                        ? "bg-rose-50 text-rose-600"
                                                        : "bg-amber-50 text-amber-600"
                                                }`}
                                            >
                                                {passed ? (
                                                    <CheckCircle2
                                                        size={16}
                                                    />
                                                ) : failed ? (
                                                    <XCircle size={16} />
                                                ) : (
                                                    <AlertCircle
                                                        size={16}
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-bold text-slate-900">
                                                        {item.requirement}
                                                    </p>

                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                                            passed
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : failed
                                                                ? "bg-rose-50 text-rose-600"
                                                                : "bg-amber-50 text-amber-600"
                                                        }`}
                                                    >
                                                        {passed
                                                            ? "Passed"
                                                            : failed
                                                            ? "Not met"
                                                            : "Review"}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                                    {item.label}
                                                </p>

                                                <p className="mt-2 text-xs font-semibold text-slate-700">
                                                    {item.detail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>

                    {/* Opportunity CTA */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <a
                            href={opportunity.website}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition hover:-translate-y-0.5"
                        >
                            View official opportunity
                            <ArrowRight
                                size={16}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ========================================================= */
/* MAIN PAGE                                                 */
/* ========================================================= */

export default function EligibilityAnalysis() {
    const [activeFilter, setActiveFilter] =
        useState("all");

    const analyzedOpportunities = useMemo(
        () => opportunities.map(analyzeOpportunity),
        []
    );

    const counts = useMemo(() => {
        return {
            strong: analyzedOpportunities.filter(
                (item) =>
                    item.analysis.status === "strong"
            ).length,

            review: analyzedOpportunities.filter(
                (item) =>
                    item.analysis.status === "review"
            ).length,

            notEligible: analyzedOpportunities.filter(
                (item) =>
                    item.analysis.status ===
                    "not-eligible"
            ).length,
        };
    }, [analyzedOpportunities]);

    const filteredOpportunities = useMemo(() => {
        if (activeFilter === "all") {
            return analyzedOpportunities;
        }

        if (activeFilter === "not-eligible") {
            return analyzedOpportunities.filter(
                (item) =>
                    item.analysis.status ===
                    "not-eligible"
            );
        }

        return analyzedOpportunities.filter(
            (item) =>
                item.analysis.status === activeFilter
        );
    }, [activeFilter, analyzedOpportunities]);

    return (
        <div className="min-h-screen bg-[#eef7ff] text-slate-900">
            {/* ========================================================= */}
            {/* HERO                                                       */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-[#e5f3ff]">
                <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

                <div className="absolute right-[20%] top-20 rotate-12 text-blue-200">
                    <Sparkles size={70} strokeWidth={1.5} />
                </div>

                <div className="absolute bottom-12 left-[8%] rotate-12 text-blue-200">
                    <Target size={75} strokeWidth={1.2} />
                </div>

                <div className="absolute bottom-10 right-[8%] text-indigo-200">
                    <GraduationCap
                        size={80}
                        strokeWidth={1.2}
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm">
                            <Target size={16} />
                            Eligibility Analysis
                        </div>

                        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                            See which opportunities
                            <br />
                            <span className="text-indigo-600">
                                fit your profile
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                            ScholarX compares your student profile against
                            available opportunities and organizes them by how
                            closely they fit your eligibility.
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* PROFILE SUMMARY                                           */}
            {/* ========================================================= */}

            <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-6">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="grid lg:grid-cols-[1fr_auto]">
                        <div className="p-6 sm:p-7">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <UserRoundCheck size={22} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Analyzing profile
                                    </p>

                                    <h2 className="text-xl font-black">
                                        Computer Science Student
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                                {[
                                    "GPA 3.50",
                                    "Bachelor's",
                                    "Computer Science",
                                    "Australia",
                                    "IELTS 7.0",
                                    "Bangladeshi",
                                    "Age 25",
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center border-t border-slate-100 bg-indigo-50/50 p-6 lg:border-l lg:border-t-0">
                            <NavLink
                                to="/profile"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >
                                Update profile
                                <ArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* RESULT SUMMARY                                             */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 lg:px-10">
                <div className="grid gap-4 sm:grid-cols-3">
                    {/* Strong */}
                    <button
                        onClick={() => setActiveFilter("strong")}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                            activeFilter === "strong"
                                ? "border-emerald-300 bg-emerald-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2 size={22} />
                            </div>

                            <span className="text-3xl font-black text-emerald-600">
                                {counts.strong}
                            </span>
                        </div>

                        <p className="mt-5 font-black">
                            Strong Fit
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Opportunities where your profile aligns well.
                        </p>
                    </button>

                    {/* Review */}
                    <button
                        onClick={() => setActiveFilter("review")}
                        className={`rounded-2xl border p-5 text-left transition-all ${
                            activeFilter === "review"
                                ? "border-amber-300 bg-amber-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-lg"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <AlertCircle size={22} />
                            </div>

                            <span className="text-3xl font-black text-amber-500">
                                {counts.review}
                            </span>
                        </div>

                        <p className="mt-5 font-black">
                            Review
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Potential opportunities with criteria to verify.
                        </p>
                    </button>

                    {/* Not eligible */}
                    <button
                        onClick={() =>
                            setActiveFilter("not-eligible")
                        }
                        className={`rounded-2xl border p-5 text-left transition-all ${
                            activeFilter === "not-eligible"
                                ? "border-rose-300 bg-rose-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-rose-200 hover:shadow-lg"
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                <XCircle size={22} />
                            </div>

                            <span className="text-3xl font-black text-rose-500">
                                {counts.notEligible}
                            </span>
                        </div>

                        <p className="mt-5 font-black">
                            Not Eligible
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Opportunities with requirements you don't currently meet.
                        </p>
                    </button>
                </div>
            </section>

            {/* ========================================================= */}
            {/* OPPORTUNITIES                                             */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-px w-8 bg-indigo-600" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                                Your results
                            </span>
                        </div>

                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Opportunities for your profile
                        </h2>

                        <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                            Each opportunity is evaluated individually so you
                            can see where you are a strong fit, where you need
                            to review the requirements, and where you are not
                            currently eligible.
                        </p>
                    </div>

                    <button
                        onClick={() => setActiveFilter("all")}
                        className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                            activeFilter === "all"
                                ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                        }`}
                    >
                        <Search size={16} />
                        All opportunities
                    </button>
                </div>

                <div className="mt-10 space-y-5">
                    {filteredOpportunities.length > 0 ? (
                        filteredOpportunities.map(
                            (opportunity) => (
                                <OpportunityCard
                                    key={opportunity.id}
                                    opportunity={opportunity}
                                />
                            )
                        )
                    ) : (
                        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                            <CircleAlert
                                size={35}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 text-xl font-black">
                                No opportunities in this category
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Try viewing another eligibility category.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ========================================================= */}
            {/* DISCLAIMER / EXPLANATION                                  */}
            {/* ========================================================= */}

            <section className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-5xl px-6 py-16 text-center sm:px-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Sparkles size={23} />
                    </div>

                    <h2 className="mt-5 text-2xl font-black">
                        Your result is a guidance tool
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        ScholarX uses the information available in your
                        profile and the eligibility information available for
                        each opportunity. Always verify the latest requirements
                        on the official scholarship or program website before
                        applying.
                    </p>
                </div>
            </section>

            {/* ========================================================= */}
            {/* CTA                                                        */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 bg-white">
                <div className="relative overflow-hidden rounded-3xl bg-slate-950">
                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

                    <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />

                    <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center sm:px-8">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-indigo-300">
                            <Sparkles size={27} />
                        </div>

                        <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Keep your profile up to date
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
                            New achievements, test scores, experience and
                            academic results can change which opportunities
                            are right for you.
                        </p>

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            <NavLink
                                to="/profile"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-6 py-3 font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition-all hover:-translate-y-1"
                            >
                                Update my profile
                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </NavLink>

                            <NavLink
                                to="/learn-more-about-eligibility-analysis"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
                            >
                                Learn how it works
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}