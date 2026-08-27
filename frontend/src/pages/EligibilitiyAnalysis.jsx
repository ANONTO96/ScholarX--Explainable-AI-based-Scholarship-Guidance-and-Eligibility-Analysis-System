import {
    AlertCircle,
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    CircleHelp,
    GraduationCap,
    Globe2,
    Sparkles,
    Target,
    UserRoundCheck,
    XCircle,
} from "lucide-react";
import { NavLink } from "react-router";
import { useMemo, useState } from "react";

import opportunities from "../data/opportunities.json";

/* ========================================================= */
/* STUDENT PROFILE                                           */
/* ========================================================= */

const studentProfile = {
    academicPerformance: 3.5,

    // Current level of study
    studyLevel: "Master",

    // Degrees already completed
    completedDegrees: ["Bachelor"],

    fieldOfStudy: "Computer Science",

    studyDestination: "Australia",

    englishScore: 7.0,

    nationality: "Bangladesh",

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

    // Optional profile information for special requirements
    partnerUniversities: [],
    gdscMember: false,
    innovationProjects: [],
    universityTeam: false,
};


/* ========================================================= */
/* HELPERS                                                   */
/* ========================================================= */

function normalize(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[’']/g, "")
        .replace(/\s+/g, " ");
}

function toArray(value) {
    if (Array.isArray(value)) return value;

    if (value === undefined || value === null || value === "") {
        return [];
    }

    return [value];
}

function getRequirementLabel(key) {
    const labels = {
        nationality: "Nationality eligibility",
        internationalStudent: "International student status",
        studyLevel: "Study level",
        fieldOfStudy: "Field of study",
        academicPerformance: "Academic performance",
        english: "English proficiency",
        age: "Age requirement",
        workExperience: "Work experience",
        researchExperience: "Research experience",
        achievements: "Achievements / extracurriculars",
        leadership: "Leadership experience",
        communityService: "Community service",
        studyDestination: "Study destination",
        isStudent: "Current student status",
        admission: "Admission requirement",
        partnerUniversity: "Partner university",
        gdsc: "GDSC membership",
        innovationProject: "Innovation project",
        universityTeam: "Qualified university team",
        annualBudget: "Annual budget",
    };

    return labels[key] || key;
}


/* ========================================================= */
/* RESULT HELPERS                                            */
/* ========================================================= */

function createResult({
    type,
    requirement,
    detail,
    label = requirement,
    weight = 1,
    affectsScore = true,
}) {
    return {
        type,
        requirement,
        label,
        detail,
        weight,
        affectsScore,
    };
}

function notAssessedRequirement(requirement, detail) {
    return createResult({
        type: "not-assessed",
        requirement,
        detail,
        weight: 0,
        affectsScore: false,
    });
}


/* ========================================================= */
/* BUILD REQUIREMENT SET                                     */
/* ========================================================= */

function buildRequirementSet(opportunity) {
    const eligibility = opportunity?.eligibility || {};

    return Object.entries(eligibility)
        .filter(([, rule]) => rule !== null && rule !== undefined)
        .map(([key, rule]) => ({
            key,
            rule,
            requirement: getRequirementLabel(key),
            assessed: true,
            source: "explicit",
        }));
}


/* ========================================================= */
/* NATIONALITY                                               */
/* ========================================================= */

function evaluateNationality(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Nationality is not a mandatory criterion for this opportunity."
        );
    }

    const nationality = normalize(studentProfile.nationality);

    const countries = toArray(rule.countries)
        .map(normalize)
        .filter(Boolean);

    if (countries.length === 0) {
        return createResult({
            type: "review",
            requirement,
            detail: "Eligible nationality information requires manual verification.",
            weight: 4,
        });
    }

    const matched = countries.includes(nationality);

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        detail: matched
            ? `${studentProfile.nationality} is included among the eligible nationalities.`
            : `${studentProfile.nationality} is not included among the eligible nationalities.`,
        weight: 4,
    });
}


/* ========================================================= */
/* INTERNATIONAL STUDENT                                     */
/* ========================================================= */

function evaluateInternationalStudent(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "International student status is not mandatory for this opportunity."
        );
    }

    const matched =
        studentProfile.internationalStudent === true;

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        detail: matched
            ? "Your profile indicates that you are an international student."
            : "This opportunity requires international student status.",
        weight: 3,
    });
}


/* ========================================================= */
/* STUDY LEVEL                                               */
/* ========================================================= */

function evaluateStudyLevel(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Study level is not mandatory for this opportunity."
        );
    }

    const currentLevel = normalize(studentProfile.studyLevel);

    const allowedLevels = toArray(rule.levels)
        .map(normalize)
        .filter(Boolean);

    if (allowedLevels.length === 0) {
        return createResult({
            type: "review",
            requirement,
            detail: "Required study level information requires manual verification.",
            weight: 4,
        });
    }

    const matched = allowedLevels.includes(currentLevel);

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `Required level: ${toArray(rule.levels).join(", ")}`,
        detail: matched
            ? `Your current study level is ${studentProfile.studyLevel}.`
            : `Your current study level is ${studentProfile.studyLevel}, while this opportunity requires ${toArray(rule.levels).join(", ")}.`,
        weight: 4,
    });
}


/* ========================================================= */
/* FIELD OF STUDY                                            */
/* ========================================================= */

function evaluateFieldOfStudy(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Field of study is not mandatory for this opportunity."
        );
    }

    const currentField = normalize(studentProfile.fieldOfStudy);

    const allowedFields = toArray(rule.fields)
        .map(normalize)
        .filter(Boolean);

    if (allowedFields.length === 0) {
        return createResult({
            type: "review",
            requirement,
            detail: "Eligible fields require manual verification.",
            weight: 4,
        });
    }

    const matched = allowedFields.some(
        (field) =>
            currentField.includes(field) ||
            field.includes(currentField)
    );

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `Eligible fields: ${toArray(rule.fields).join(", ")}`,
        detail: matched
            ? `${studentProfile.fieldOfStudy} matches the eligible fields.`
            : `Your field is ${studentProfile.fieldOfStudy}, but this opportunity is intended for ${toArray(rule.fields).join(", ")}.`,
        weight: 4,
    });
}


/* ========================================================= */
/* ACADEMIC PERFORMANCE                                      */
/* ========================================================= */

function evaluateAcademicPerformance(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Academic performance is not mandatory for this opportunity."
        );
    }

    const minimum = Number(rule.minimumGPA);

    if (!Number.isFinite(minimum)) {
        return createResult({
            type: "review",
            requirement,
            detail: `Your GPA is ${studentProfile.academicPerformance}. The minimum GPA requires verification.`,
            weight: 5,
        });
    }

    const studentGPA =
        Number(studentProfile.academicPerformance);

    const matched = studentGPA >= minimum;

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `Minimum GPA ${minimum}+`,
        detail: matched
            ? `Your GPA is ${studentGPA.toFixed(2)}, which meets the minimum GPA of ${minimum}.`
            : `Your GPA is ${studentGPA.toFixed(2)}, which is below the required minimum of ${minimum}.`,
        weight: 5,
    });
}


/* ========================================================= */
/* ENGLISH                                                   */
/* ========================================================= */

function evaluateEnglish(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "English proficiency is not mandatory for this opportunity."
        );
    }

    const minimum = Number(rule.minimumScore);
    const studentScore =
        Number(studentProfile.englishScore);

    if (!Number.isFinite(minimum)) {
        return createResult({
            type: "review",
            requirement,
            detail: `Your English test score is ${studentScore}. The minimum score requires verification.`,
            weight: 4,
        });
    }

    const matched = studentScore >= minimum;

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `${rule.test || "English"} ${minimum}+`,
        detail: matched
            ? `Your ${rule.test || "English"} score is ${studentScore}, meeting the minimum of ${minimum}.`
            : `Your ${rule.test || "English"} score is ${studentScore}, below the required minimum of ${minimum}.`,
        weight: 4,
    });
}


/* ========================================================= */
/* AGE                                                       */
/* ========================================================= */

function evaluateAge(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Age is not mandatory for this opportunity."
        );
    }

    const age = Number(studentProfile.age);

    const minimum =
        rule.min !== undefined
            ? Number(rule.min)
            : 0;

    const maximum =
        rule.max !== undefined
            ? Number(rule.max)
            : Infinity;

    if (
        !Number.isFinite(minimum) &&
        !Number.isFinite(maximum)
    ) {
        return createResult({
            type: "review",
            requirement,
            detail: "Age requirement requires manual verification.",
            weight: 3,
        });
    }

    const matched =
        age >= minimum &&
        age <= maximum;

    const range =
        Number.isFinite(maximum)
            ? `${minimum}–${maximum}`
            : `${minimum}+`;

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `Age ${range}`,
        detail: matched
            ? `Your age is ${age}, which falls within the eligible range.`
            : `Your age is ${age}, while the eligible range is ${range}.`,
        weight: 3,
    });
}


/* ========================================================= */
/* WORK EXPERIENCE                                           */
/* ========================================================= */

function evaluateWorkExperience(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Work experience is not mandatory for this opportunity."
        );
    }

    const currentMonths =
        Number(studentProfile.workExperienceMonths);

    const minimumMonths =
        Number(rule.minimumMonths ?? 0);

    if (!Number.isFinite(minimumMonths)) {
        return createResult({
            type: "review",
            requirement,
            detail: `You have ${currentMonths} months of experience, but the minimum requirement requires verification.`,
            weight: 3,
        });
    }

    const matched =
        currentMonths >= minimumMonths;

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `${minimumMonths} months minimum`,
        detail: matched
            ? `You have ${currentMonths} months of experience, meeting the minimum requirement of ${minimumMonths} months.`
            : `You have ${currentMonths} months of experience, but at least ${minimumMonths} months are required.`,
        weight: 3,
    });
}


/* ========================================================= */
/* STUDY DESTINATION                                         */
/* ========================================================= */

function evaluateStudyDestination(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Study destination is not mandatory for this opportunity."
        );
    }

    const destination =
        normalize(studentProfile.studyDestination);

    const allowedDestinations = toArray(
        rule.countries || rule.destinations
    )
        .map(normalize)
        .filter(Boolean);

    if (allowedDestinations.length === 0) {
        return createResult({
            type: "review",
            requirement,
            detail: "Eligible study destinations require manual verification.",
            weight: 3,
        });
    }

    const matched = allowedDestinations.includes(destination);

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `Eligible destinations: ${toArray(
            rule.countries || rule.destinations
        ).join(", ")}`,
        detail: matched
            ? `${studentProfile.studyDestination} is an eligible study destination.`
            : `${studentProfile.studyDestination} is not listed among the eligible study destinations.`,
        weight: 3,
    });
}


/* ========================================================= */
/* ACHIEVEMENTS                                              */
/* ========================================================= */

function evaluateAchievements(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Specific achievements are not mandatory for this opportunity."
        );
    }

    const studentAchievements =
        studentProfile.achievements.map(normalize);

    const requiredAchievements = toArray(
        rule.items ||
        rule.achievements ||
        rule.requiredAchievements
    )
        .map(normalize)
        .filter(Boolean);

    if (requiredAchievements.length === 0) {
        return createResult({
            type: "review",
            requirement,
            detail: "Achievement requirements require manual verification.",
            weight: 3,
        });
    }

    const matchedAchievements =
        requiredAchievements.filter((required) =>
            studentAchievements.some(
                (achievement) =>
                    achievement.includes(required) ||
                    required.includes(achievement)
            )
        );

    const matched =
        matchedAchievements.length > 0;

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `Required: ${requiredAchievements.join(", ")}`,
        detail: matched
            ? `Your profile includes a relevant achievement: ${matchedAchievements.join(", ")}.`
            : `None of your listed achievements match the required achievements.`,
        weight: 3,
    });
}


/* ========================================================= */
/* BOOLEAN REQUIREMENTS                                      */
/* ========================================================= */

function evaluateBooleanRule(
    studentValue,
    rule,
    requirement,
    label
) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            `${label} is not mandatory for this opportunity.`
        );
    }

    const matched = studentValue === true;

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        detail: matched
            ? `Your profile meets the ${label.toLowerCase()} requirement.`
            : `${label} is required, but your current profile does not show it.`,
        weight: 3,
    });
}


/* ========================================================= */
/* PARTNER UNIVERSITY                                        */
/* ========================================================= */

function evaluatePartnerUniversity(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Partner university affiliation is not mandatory."
        );
    }

    const studentUniversities =
        studentProfile.partnerUniversities.map(normalize);

    const requiredUniversities = toArray(
        rule.universities ||
        rule.partnerUniversities ||
        rule.names
    )
        .map(normalize)
        .filter(Boolean);

    if (requiredUniversities.length === 0) {
        return createResult({
            type: "review",
            requirement,
            detail: "Partner university information requires manual verification.",
            weight: 3,
        });
    }

    const matched = requiredUniversities.some(
        (required) =>
            studentUniversities.some(
                (university) =>
                    university.includes(required) ||
                    required.includes(university)
            )
    );

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        label: `Eligible universities: ${requiredUniversities.join(", ")}`,
        detail: matched
            ? "Your university information matches an eligible partner university."
            : "Your university is not currently listed as an eligible partner university.",
        weight: 3,
    });
}


/* ========================================================= */
/* GDSC                                                     */
/* ========================================================= */

function evaluateGDSC(rule, requirement) {
    return evaluateBooleanRule(
        studentProfile.gdscMember,
        rule,
        requirement,
        "GDSC membership"
    );
}


/* ========================================================= */
/* INNOVATION PROJECT                                        */
/* ========================================================= */

function evaluateInnovationProject(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "An innovation project is not mandatory for this opportunity."
        );
    }

    const projects =
        studentProfile.innovationProjects || [];

    const required =
        toArray(
            rule.types ||
            rule.projects ||
            rule.requiredTypes
        )
            .map(normalize)
            .filter(Boolean);

    // If the opportunity only says that an innovation
    // project is required, simply check whether one exists.
    if (required.length === 0) {
        const hasProject = projects.length > 0;

        return createResult({
            type: hasProject ? "pass" : "fail",
            requirement,
            detail: hasProject
                ? "Your profile includes an innovation project."
                : "An innovation project is required, but none is listed in your profile.",
            weight: 3,
        });
    }

    const normalizedProjects =
        projects.map(normalize);

    const matched = required.some(
        (requiredProject) =>
            normalizedProjects.some(
                (project) =>
                    project.includes(requiredProject) ||
                    requiredProject.includes(project)
            )
    );

    return createResult({
        type: matched ? "pass" : "fail",
        requirement,
        detail: matched
            ? "Your profile includes a relevant innovation project."
            : "Your listed projects do not currently match the required innovation project criteria.",
        weight: 3,
    });
}


/* ========================================================= */
/* UNIVERSITY TEAM                                           */
/* ========================================================= */

function evaluateUniversityTeam(rule, requirement) {
    return evaluateBooleanRule(
        studentProfile.universityTeam,
        rule,
        requirement,
        "Qualified university team membership"
    );
}


/* ========================================================= */
/* ADMISSION                                                 */
/* ========================================================= */

function evaluateAdmission(rule, requirement,) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Admission requirements are not mandatory for this opportunity."
        );
    }

    /*
        Admission requirements often contain information that
        cannot be reliably verified from a student profile alone.

        Therefore we deliberately mark these as REVIEW rather
        than pretending the student passes or fails.
    */

    return createResult({
        type: "review",
        requirement,
        detail:
            "Admission requirements may require document, university, or application-level verification.",
        weight: 2,
    });
}


/* ========================================================= */
/* ANNUAL BUDGET                                             */
/* ========================================================= */

function evaluateAnnualBudget(rule, requirement) {
    if (rule.required === false) {
        return notAssessedRequirement(
            requirement,
            "Budget compatibility is not mandatory for this opportunity."
        );
    }

    const budget =
        Number(studentProfile.annualBudget);

    const minimum =
        rule.minimum !== undefined
            ? Number(rule.minimum)
            : null;

    const maximum =
        rule.maximum !== undefined
            ? Number(rule.maximum)
            : null;

    /*
        If the opportunity provides a maximum expected cost,
        student's budget must be at least that amount.

        If it provides a minimum, verify against it.
    */

    if (
        !Number.isFinite(minimum) &&
        !Number.isFinite(maximum)
    ) {
        return createResult({
            type: "review",
            requirement,
            detail:
                "Budget information requires manual verification.",
            weight: 2,
        });
    }

    let matched = true;

    if (Number.isFinite(maximum)) {
        matched = budget >= maximum;
    }

    if (Number.isFinite(minimum)) {
        matched = matched && budget >= minimum;
    }

    return createResult({
        type: matched ? "pass" : "review",
        requirement,
        detail: matched
            ? `Your annual budget of ${budget.toLocaleString()} is compatible with the stated financial requirement.`
            : `Your annual budget of ${budget.toLocaleString()} may not fully cover the stated financial requirement.`,
        weight: 2,
    });
}


/* ========================================================= */
/* MAIN REQUIREMENT EVALUATOR                                */
/* ========================================================= */

function evaluateRequirement(item, opportunity) {
    const {
        key,
        rule,
        requirement,
    } = item;

    switch (key) {
        case "nationality":
            return evaluateNationality(
                rule,
                requirement
            );

        case "internationalStudent":
            return evaluateInternationalStudent(
                rule,
                requirement
            );

        case "studyLevel":
            return evaluateStudyLevel(
                rule,
                requirement
            );

        case "fieldOfStudy":
            return evaluateFieldOfStudy(
                rule,
                requirement
            );

        case "academicPerformance":
            return evaluateAcademicPerformance(
                rule,
                requirement
            );

        case "english":
            return evaluateEnglish(
                rule,
                requirement
            );

        case "age":
            return evaluateAge(
                rule,
                requirement
            );

        case "workExperience":
            return evaluateWorkExperience(
                rule,
                requirement
            );

        case "studyDestination":
            return evaluateStudyDestination(
                rule,
                requirement
            );

        case "achievements":
            return evaluateAchievements(
                rule,
                requirement
            );

        case "researchExperience":
            return evaluateBooleanRule(
                studentProfile.researchExperience,
                rule,
                requirement,
                "Research experience"
            );

        case "leadership":
            return evaluateBooleanRule(
                studentProfile.leadershipExperience,
                rule,
                requirement,
                "Leadership experience"
            );

        case "communityService":
            return evaluateBooleanRule(
                studentProfile.communityService,
                rule,
                requirement,
                "Community service"
            );

        case "isStudent":
            return evaluateBooleanRule(
                studentProfile.isStudent,
                rule,
                requirement,
                "Current student status"
            );

        case "partnerUniversity":
            return evaluatePartnerUniversity(
                rule,
                requirement
            );

        case "gdsc":
            return evaluateGDSC(
                rule,
                requirement
            );

        case "innovationProject":
            return evaluateInnovationProject(
                rule,
                requirement
            );

        case "universityTeam":
            return evaluateUniversityTeam(
                rule,
                requirement
            );

        case "admission":
            return evaluateAdmission(
                rule,
                requirement,
                opportunity
            );

        case "annualBudget":
            return evaluateAnnualBudget(
                rule,
                requirement
            );

        default:
            return createResult({
                type: "review",
                requirement,
                detail:
                    "This eligibility criterion requires manual verification.",
                weight: 2,
            });
    }
}


/* ========================================================= */
/* ANALYZE ONE OPPORTUNITY                                   */
/* ========================================================= */

function analyzeOpportunity(opportunity) {
    const requirements =
        buildRequirementSet(opportunity);

    const results = requirements.map((item) =>
        evaluateRequirement(
            item,
            opportunity
        )
    );

    const assessedResults =
        results.filter(
            (item) =>
                item.type !== "not-assessed"
        );

    const scoredResults =
        results.filter(
            (item) =>
                item.affectsScore !== false &&
                item.weight > 0
        );

    const passedRequirements =
        assessedResults.filter(
            (item) =>
                item.type === "pass"
        );

    const reviewRequirements =
        assessedResults.filter(
            (item) =>
                item.type === "review"
        );

    const failedRequirements =
        assessedResults.filter(
            (item) =>
                item.type === "fail"
        );

    const notAssessedRequirements =
        results.filter(
            (item) =>
                item.type === "not-assessed"
        );

    const totalWeight =
        scoredResults.reduce(
            (sum, item) =>
                sum + item.weight,
            0
        );

    const passedWeight =
        passedRequirements.reduce(
            (sum, item) =>
                sum + item.weight,
            0
        );

    const reviewWeight =
        reviewRequirements.reduce(
            (sum, item) =>
                sum + item.weight,
            0
        );

    /*
        Review requirements contribute 50%.
        Failed requirements contribute 0%.
    */

    const score =
        totalWeight > 0
            ? Math.round(
                (
                    passedWeight +
                    reviewWeight * 0.5
                ) /
                totalWeight *
                100
            )
            : 0;

    /*
        A hard failure always means Not Eligible.

        Otherwise:
        85+  = Strong Fit
        40-84 = Review
        <40 = Not Eligible
    */

    let status;

    if (failedRequirements.length > 0) {
        status = "not-eligible";
    } else if (score >= 85) {
        status = "strong";
    } else if (score >= 40) {
        status = "review";
    } else {
        status = "not-eligible";
    }

    return {
        ...opportunity,

        analysis: {
            score,
            status,

            requirements: results,

            passedRequirements,
            reviewRequirements,
            failedRequirements,
            notAssessedRequirements,

            passedCount:
                passedRequirements.length,

            reviewCount:
                reviewRequirements.length,

            failedCount:
                failedRequirements.length,

            notAssessedCount:
                notAssessedRequirements.length,

            // Number of actual scored requirements
            assessedCount:
                scoredResults.length,

            // Number of requirements that were actually
            // evaluated regardless of scoring
            evaluatedCount:
                assessedResults.length,

            totalRequirements:
                results.length,
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
        iconBox:
            "bg-emerald-50 text-emerald-600",
        score:
            "text-emerald-600",
    },

    review: {
        label: "Review",
        description:
            "Your profile has potential, but some requirements need to be verified.",
        icon: AlertCircle,
        badge:
            "bg-amber-50 text-amber-700 border-amber-200",
        iconBox:
            "bg-amber-50 text-amber-600",
        score:
            "text-amber-600",
    },

    "not-eligible": {
        label: "Not Eligible",
        description:
            "At least one important requirement does not currently match your profile.",
        icon: XCircle,
        badge:
            "bg-rose-50 text-rose-700 border-rose-200",
        iconBox:
            "bg-rose-50 text-rose-600",
        score:
            "text-rose-600",
    },
};


/* ========================================================= */
/* OPPORTUNITY CARD                                          */
/* ========================================================= */

function OpportunityCard({ opportunity }) {
    const [open, setOpen] =
        useState(false);

    const config =
        statusConfig[
            opportunity.analysis.status
        ];

    const StatusIcon =
        config.icon;

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-xl">

            {/* ===================================================== */}
            {/* MAIN CARD                                              */}
            {/* ===================================================== */}

            <div className="group p-6 sm:p-7">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* Opportunity information */}

                    <div className="flex gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
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


                {/* ================================================= */}
                {/* QUICK STATS                                        */}
                {/* ================================================= */}

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


                {opportunity.analysis.notAssessedCount > 0 && (
                    <p className="mt-3 text-center text-xs text-slate-400">
                        {opportunity.analysis.notAssessedCount} optional or
                        unspecified profile checks were not used in the score.
                    </p>
                )}


                {/* ================================================= */}
                {/* EXPAND BUTTON                                      */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        setOpen((value) => !value)
                    }
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
                            open
                                ? "rotate-180"
                                : ""
                        }`}
                    />

                </button>

            </div>


            {/* ===================================================== */}
            {/* REQUIREMENT BREAKDOWN                                 */}
            {/* ===================================================== */}

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

                                const notAssessed =
                                    item.type === "not-assessed";

                                return (
                                    <div
                                        key={`${item.requirement}-${index}`}
                                        className="rounded-2xl border border-slate-200 bg-white p-4"
                                    >

                                        <div className="flex gap-3">

                                            {/* Status icon */}

                                            <div
                                                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                    passed
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : failed
                                                            ? "bg-rose-50 text-rose-600"
                                                            : notAssessed
                                                                ? "bg-slate-100 text-slate-400"
                                                                : "bg-amber-50 text-amber-600"
                                                }`}
                                            >

                                                {passed ? (
                                                    <CheckCircle2 size={16} />
                                                ) : failed ? (
                                                    <XCircle size={16} />
                                                ) : notAssessed ? (
                                                    <CircleHelp size={16} />
                                                ) : (
                                                    <AlertCircle size={16} />
                                                )}

                                            </div>


                                            {/* Content */}

                                            <div className="min-w-0 flex-1">

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
                                                                    : notAssessed
                                                                        ? "bg-slate-100 text-slate-500"
                                                                        : "bg-amber-50 text-amber-600"
                                                        }`}
                                                    >
                                                        {passed
                                                            ? "Passed"
                                                            : failed
                                                                ? "Not met"
                                                                : notAssessed
                                                                    ? "Not specified"
                                                                    : "Review"}
                                                    </span>

                                                </div>


                                                <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
                                                    {item.detail}
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>


                    {/* ================================================= */}
                    {/* CTA                                                 */}
                    {/* ================================================= */}

                    {opportunity.website && (
                        <div className="mt-6 flex flex-wrap gap-3">

                            <a
                                href={opportunity.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition hover:-translate-y-0.5"
                            >
                                View official opportunity

                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </a>

                        </div>
                    )}

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

    const analyzedOpportunities =
        useMemo(
            () =>
                opportunities.map(
                    analyzeOpportunity
                ),
            []
        );


    /* ========================================================= */
    /* COUNTS                                                    */
    /* ========================================================= */

    const counts = useMemo(() => {

        return {
            strong:
                analyzedOpportunities.filter(
                    (item) =>
                        item.analysis.status ===
                        "strong"
                ).length,

            review:
                analyzedOpportunities.filter(
                    (item) =>
                        item.analysis.status ===
                        "review"
                ).length,

            notEligible:
                analyzedOpportunities.filter(
                    (item) =>
                        item.analysis.status ===
                        "not-eligible"
                ).length,
        };

    }, [analyzedOpportunities]);


    /* ========================================================= */
    /* FILTER                                                    */
    /* ========================================================= */

    const filteredOpportunities =
        useMemo(() => {

            if (activeFilter === "all") {
                return analyzedOpportunities;
            }

            return analyzedOpportunities.filter(
                (item) =>
                    item.analysis.status ===
                    activeFilter
            );

        }, [
            activeFilter,
            analyzedOpportunities,
        ]);


    return (
        <div className="min-h-screen bg-[#eef7ff] text-slate-900">

            {/* ===================================================== */}
            {/* HERO                                                    */}
            {/* ===================================================== */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-[#e5f3ff]">

                <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

                <div className="absolute right-[20%] top-20 rotate-12 text-blue-200">
                    <Sparkles
                        size={70}
                        strokeWidth={1.5}
                    />
                </div>

                <div className="absolute bottom-12 left-[8%] rotate-12 text-blue-200">
                    <Target
                        size={75}
                        strokeWidth={1.2}
                    />
                </div>

                <div className="absolute bottom-10 right-[8%] text-indigo-200">
                    <GraduationCap
                        size={80}
                        strokeWidth={1.2}
                    />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">

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


            {/* ===================================================== */}
            {/* PROFILE SUMMARY                                        */}
            {/* ===================================================== */}

            <section className="relative z-20 mx-auto -mt-10 max-w-6xl px-6">

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

                    <div className="grid lg:grid-cols-[1fr_auto]">

                        <div className="group p-6 sm:p-7">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-all group-hover:bg-indigo-600 group-hover:text-white">
                                    <UserRoundCheck size={22} />
                                </div>

                                <div>

                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Your Academic Profile
                                    </p>

                                    <h2 className="text-xl font-black">
                                        Computer Science Student
                                    </h2>

                                </div>

                            </div>


                            <div className="mt-5 flex flex-wrap gap-2">

                                {[
                                    `GPA ${studentProfile.academicPerformance.toFixed(2)}`,
                                    studentProfile.studyLevel,
                                    studentProfile.fieldOfStudy,
                                    studentProfile.studyDestination,
                                    `IELTS ${studentProfile.englishScore}`,
                                    studentProfile.nationality,
                                    `Age ${studentProfile.age}`,
                                ].map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                                    >
                                        {item}
                                    </span>
                                ))}

                            </div>

                        </div>


                        <div className="flex items-center border-t border-slate-100 bg-indigo-50/50 p-6 lg:border-l lg:border-t-0">

                            <NavLink
                                to="/profile"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition-all hover:translate-y-0.5 hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >
                                Update profile

                                <ArrowRight
                                    className="transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </NavLink>

                        </div>

                    </div>

                </div>

            </section>


            {/* ===================================================== */}
            {/* RESULT SUMMARY                                         */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl px-6 pt-16 sm:px-8 lg:px-10">

                <div className="grid gap-4 sm:grid-cols-3">

                    {/* Strong */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveFilter("strong")
                        }
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
                        type="button"
                        onClick={() =>
                            setActiveFilter("review")
                        }
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
                        type="button"
                        onClick={() =>
                            setActiveFilter(
                                "not-eligible"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all ${
                            activeFilter ===
                            "not-eligible"
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


            {/* ===================================================== */}
            {/* OPPORTUNITIES                                          */}
            {/* ===================================================== */}

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
                        type="button"
                        onClick={() =>
                            setActiveFilter("all")
                        }
                        className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                            activeFilter === "all"
                                ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                        }`}
                    >
                        <Award size={16} />
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


            {/* ===================================================== */}
            {/* DISCLAIMER                                             */}
            {/* ===================================================== */}

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


            {/* ===================================================== */}
            {/* CTA                                                     */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl bg-white px-6 pb-12 sm:px-8">

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