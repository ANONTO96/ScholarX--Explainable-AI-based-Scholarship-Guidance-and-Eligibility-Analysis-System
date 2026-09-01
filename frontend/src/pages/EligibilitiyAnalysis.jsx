import {
    AlertCircle,
    ArrowRight,
    Award,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
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

    english: {
        test: "IELTS",
        score: 7.0,
    },

    nationality: "Bangladesh",

    age: 25,

    annualBudget: {
        amount: 50000,
        currency: "USD",
    },

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

    // Optional profile information
    partnerUniversities: [],
    gdscMember: false,
    innovationProjects: [],
    universityTeam: false,
};


/* ========================================================= */
/* CONFIGURATION                                             */
/* ========================================================= */

const REQUIREMENT_WEIGHTS = {
    nationality: 10,
    internationalStudent: 7,
    studyLevel: 10,
    fieldOfStudy: 10,
    academicPerformance: 12,
    english: 10,
    age: 5,
    workExperience: 5,
    studyDestination: 7,
    achievements: 5,
    leadership: 4,
    communityService: 3,
    researchExperience: 5,
    isStudent: 6,
    partnerUniversity: 4,
    gdsc: 3,
    innovationProject: 4,
    universityTeam: 3,
    admission: 2,
    annualBudget: 7,
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
    if (Array.isArray(value)) {
        return value;
    }

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return [];
    }

    return [value];
}


/* ========================================================= */
/* LABELS                                                    */
/* ========================================================= */

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
/* REQUIREMENT CLASSIFICATION                                */
/* ========================================================= */

function isMandatoryRequirement(rule) {
    if (
        !rule ||
        typeof rule !== "object"
    ) {
        return false;
    }

    if (rule.mandatory === true) {
        return true;
    }

    if (rule.mandatory === false) {
        return false;
    }

    if (rule.preferred === true) {
        return false;
    }

    if (rule.required === false) {
        return false;
    }

    if (rule.required === true) {
        return true;
    }

    return false;
}


function getRequirementCategory(rule) {
    return isMandatoryRequirement(rule)
        ? "mandatory"
        : "preferred";
}


function getWeight(key) {
    return (
        REQUIREMENT_WEIGHTS[key] ??
        3
    );
}


/* ========================================================= */
/* RESULT HELPERS                                            */
/* ========================================================= */

function createResult({
    type,
    key,
    requirement,
    detail,
    label = requirement,
    weight,
    category = "preferred",
    affectsScore = true,
}) {
    return {
        type,
        key,
        requirement,
        label,
        detail,
        weight:
            Number.isFinite(weight)
                ? weight
                : getWeight(key),
        category,
        affectsScore,
    };
}


/*
    There are only 3 canonical requirement states:

        pass
        review
        fail

    A requirement that cannot be automatically confirmed
    is treated as REVIEW rather than creating a fourth state.
*/

function createReviewResult({
    key,
    requirement,
    detail,
    label,
    category,
    weight,
}) {
    return createResult({
        type: "review",
        key,
        requirement,
        detail,
        label,
        weight:
            weight ??
            getWeight(key),
        category,
        affectsScore: true,
    });
}


/* ========================================================= */
/* NUMERIC HELPER                                            */
/* ========================================================= */

function getNumber(rule, keys) {
    for (const key of keys) {
        const value =
            rule?.[key];

        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {
            const number =
                Number(value);

            if (
                Number.isFinite(number)
            ) {
                return number;
            }
        }
    }

    return null;
}


/* ========================================================= */
/* BUILD REQUIREMENT SET                                     */
/* ========================================================= */

function buildRequirementSet(
    opportunity
) {
    const eligibility =
        opportunity?.eligibility ||
        {};

    const requirements = [];

    Object.entries(
        eligibility
    ).forEach(([key, rule]) => {
        if (
            key ===
            "additionalRequirements"
        ) {
            return;
        }

        if (
            rule === null ||
            rule === undefined
        ) {
            return;
        }

        requirements.push({
            key,
            rule,
            requirement:
                getRequirementLabel(
                    key
                ),
            category:
                getRequirementCategory(
                    rule
                ),
            source: "eligibility",
        });
    });


    const additional =
        Array.isArray(
            eligibility.additionalRequirements
        )
            ? eligibility.additionalRequirements
            : [];

    additional.forEach(
        (rule, index) => {
            if (
                !rule ||
                typeof rule !== "object"
            ) {
                return;
            }

            const key =
                rule.type ||
                `additionalRequirement${index}`;

            const requirement =
                rule.label ||
                "Additional requirement";

            requirements.push({
                key,
                rule,
                requirement,
                category:
                    getRequirementCategory(
                        rule
                    ),
                source: "additional",
            });
        }
    );

    return requirements;
}


/* ========================================================= */
/* NATIONALITY                                               */
/* ========================================================= */

function evaluateNationality(
    rule,
    requirement,
    category
) {
    const countries =
        toArray(
            rule?.countries
        )
            .map(normalize)
            .filter(Boolean);

    if (
        countries.length === 0
    ) {
        return createReviewResult({
            key: "nationality",
            requirement,
            category,
            detail:
                "The opportunity does not provide a specific eligible-country list, so nationality eligibility requires manual verification.",
        });
    }

    const studentNationality =
        normalize(
            studentProfile.nationality
        );

    const matched =
        countries.includes(
            studentNationality
        );

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "nationality",

        requirement,

        category,

        label:
            `Eligible nationalities: ${toArray(
                rule.countries
            ).join(", ")}`,

        detail: matched
            ? `${studentProfile.nationality} is eligible for this opportunity.`
            : `${studentProfile.nationality} is not included in the eligible nationalities.`,
    });
}


/* ========================================================= */
/* INTERNATIONAL STUDENT                                     */
/* ========================================================= */

function evaluateInternationalStudent(
    rule,
    requirement,
    category
) {
    const matched =
        studentProfile.internationalStudent ===
        true;

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "internationalStudent",

        requirement,

        category,

        detail: matched
            ? "Your profile indicates that you are an international student."
            : "This opportunity requires international student status, but your profile does not currently indicate it.",
    });
}


/* ========================================================= */
/* STUDY LEVEL                                               */
/* ========================================================= */

function evaluateStudyLevel(
    rule,
    requirement,
    category
) {
    const allowedLevels =
        toArray(
            rule?.values
        )
            .map(normalize)
            .filter(Boolean);

    if (
        allowedLevels.length === 0
    ) {
        return createReviewResult({
            key: "studyLevel",
            requirement,
            category,
            detail:
                "No specific study level is provided in the opportunity data, so this criterion requires manual verification.",
        });
    }

    const currentLevel =
        normalize(
            studentProfile.studyLevel
        );

    const matched =
        allowedLevels.includes(
            currentLevel
        );

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "studyLevel",

        requirement,

        category,

        label:
            `Required level: ${toArray(
                rule.values
            ).join(", ")}`,

        detail: matched
            ? `Your current study level is ${studentProfile.studyLevel}, which matches the eligible level.`
            : `Your current study level is ${studentProfile.studyLevel}, while this opportunity accepts ${toArray(
                rule.values
            ).join(", ")}.`,
    });
}


/* ========================================================= */
/* FIELD OF STUDY                                            */
/* ========================================================= */

function evaluateFieldOfStudy(
    rule,
    requirement,
    category
) {
    const allowedFields =
        toArray(
            rule?.values
        )
            .map(normalize)
            .filter(Boolean);

    if (
        allowedFields.length === 0
    ) {
        return createReviewResult({
            key: "fieldOfStudy",
            requirement,
            category,
            detail:
                "No specific field-of-study restriction is stated for this opportunity, so this criterion requires manual verification.",
        });
    }

    const currentField =
        normalize(
            studentProfile.fieldOfStudy
        );

    if (
        allowedFields.includes(
            currentField
        )
    ) {
        return createResult({
            type: "pass",
            key: "fieldOfStudy",
            requirement,
            category,
            label:
                `Eligible fields: ${toArray(
                    rule.values
                ).join(", ")}`,
            detail:
                `${studentProfile.fieldOfStudy} exactly matches an eligible field.`,
        });
    }

    const relatedGroups = [
        [
            "computer science",
            "computer science and engineering",
            "computer engineering",
            "software engineering",
            "information technology",
            "information and communication technology",
            "information systems",
            "computing",
        ],

        [
            "electrical engineering",
            "electronics engineering",
            "electrical and electronic engineering",
        ],

        [
            "business",
            "business administration",
            "management",
            "commerce",
        ],

        [
            "economics",
            "economic studies",
        ],
    ];

    const relatedMatch =
        allowedFields.some(
            (allowedField) =>
                relatedGroups.some(
                    (group) =>
                        group.includes(
                            currentField
                        ) &&
                        group.includes(
                            allowedField
                        )
                )
        );

    if (
        relatedMatch
    ) {
        return createResult({
            type: "pass",
            key: "fieldOfStudy",
            requirement,
            category,
            label:
                `Eligible fields: ${toArray(
                    rule.values
                ).join(", ")}`,
            detail:
                `${studentProfile.fieldOfStudy} is considered compatible with an eligible related field.`,
        });
    }

    return createResult({
        type: "fail",
        key: "fieldOfStudy",
        requirement,
        category,
        label:
            `Eligible fields: ${toArray(
                rule.values
            ).join(", ")}`,
        detail:
            `Your field is ${studentProfile.fieldOfStudy}, but this opportunity accepts ${toArray(
                rule.values
            ).join(", ")}.`,
    });
}


/* ========================================================= */
/* ACADEMIC PERFORMANCE                                      */
/* ========================================================= */

function evaluateAcademicPerformance(
    rule,
    requirement,
    category
) {
    const studentGPA =
        Number(
            studentProfile.academicPerformance
        );

    if (
        !Number.isFinite(
            studentGPA
        )
    ) {
        return createReviewResult({
            key: "academicPerformance",
            requirement,
            category,
            detail:
                "Your CGPA is not available in a valid numeric format.",
        });
    }

    const minimum =
        getNumber(
            rule,
            [
                "minimumGPA",
            ]
        );

    if (
        minimum === null
    ) {
        return createReviewResult({
            key: "academicPerformance",
            requirement,
            category,
            detail:
                `Your CGPA is ${studentGPA.toFixed(
                    2
                )}, but no specific minimum CGPA is provided for automatic comparison.`,
        });
    }

    const matched =
        studentGPA >= minimum;

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "academicPerformance",

        requirement,

        category,

        label:
            `Minimum CGPA: ${minimum}+`,

        detail: matched
            ? `Your CGPA is ${studentGPA.toFixed(
                2
            )}, which meets the minimum CGPA of ${minimum}.`
            : `Your CGPA is ${studentGPA.toFixed(
                2
            )}, which is below the required minimum CGPA of ${minimum}.`,
    });
}


/* ========================================================= */
/* ENGLISH                                                   */
/* ========================================================= */

function evaluateEnglish(
    rule,
    requirement,
    category
) {
    const studentTest =
        normalize(
            studentProfile
                .english
                ?.test
        );

    const studentScore =
        Number(
            studentProfile
                .english
                ?.score
        );

    if (
        !studentTest ||
        !Number.isFinite(
            studentScore
        )
    ) {
        return createReviewResult({
            key: "english",
            requirement,
            category,
            detail:
                "Your English test type or score is missing or invalid.",
        });
    }

    const minimum =
        getNumber(
            rule,
            [
                "minimum",
                "minimumScore",
                "minScore",
            ]
        );

    if (
        minimum === null
    ) {
        return createReviewResult({
            key: "english",
            requirement,
            category,
            detail:
                `Your ${studentProfile.english.test} score is ${studentScore}, but no specific minimum score is available for automatic comparison.`,
        });
    }

    const requiredTest =
        normalize(
            rule?.test
        );

    if (
        requiredTest &&
        requiredTest !==
            studentTest
    ) {
        return createResult({
            type: "fail",
            key: "english",
            requirement,
            category,
            label:
                `${rule.test} ${minimum}+`,
            detail:
                `This opportunity specifies ${rule.test}, while your profile lists ${studentProfile.english.test}.`,
        });
    }

    const matched =
        studentScore >= minimum;

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "english",

        requirement,

        category,

        label:
            `${
                rule?.test ||
                studentProfile
                    .english
                    ?.test ||
                "English"
            } ${minimum}+`,

        detail: matched
            ? `Your ${studentProfile.english.test} score is ${studentScore}, which meets the minimum of ${minimum}.`
            : `Your ${studentProfile.english.test} score is ${studentScore}, which is below the required minimum of ${minimum}.`,
    });
}


/* ========================================================= */
/* AGE                                                       */
/* ========================================================= */

function evaluateAge(
    rule,
    requirement,
    category
) {
    const age =
        Number(
            studentProfile.age
        );

    if (
        !Number.isFinite(age)
    ) {
        return createReviewResult({
            key: "age",
            requirement,
            category,
            detail:
                "Your age is not available in a valid numeric format.",
        });
    }

    const minimum =
        getNumber(
            rule,
            [
                "minimum",
                "min",
            ]
        );

    const maximum =
        getNumber(
            rule,
            [
                "maximum",
                "max",
            ]
        );

    if (
        minimum === null &&
        maximum === null
    ) {
        return createReviewResult({
            key: "age",
            requirement,
            category,
            detail:
                "No specific age restriction is stated for this opportunity, so the age criterion requires manual verification.",
        });
    }

    const meetsMinimum =
        minimum === null ||
        age >= minimum;

    const meetsMaximum =
        maximum === null ||
        age <= maximum;

    const matched =
        meetsMinimum &&
        meetsMaximum;

    let range;

    if (
        minimum !== null &&
        maximum !== null
    ) {
        range =
            `${minimum}–${maximum}`;
    } else if (
        minimum !== null
    ) {
        range =
            `${minimum}+`;
    } else {
        range =
            `up to ${maximum}`;
    }

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "age",

        requirement,

        category,

        label:
            `Age ${range}`,

        detail: matched
            ? `Your age is ${age}, which falls within the eligible range.`
            : `Your age is ${age}, while the eligible range is ${range}.`,
    });
}


/* ========================================================= */
/* WORK EXPERIENCE                                           */
/* ========================================================= */

function evaluateWorkExperience(
    rule,
    requirement,
    category
) {
    const currentMonths =
        Number(
            studentProfile.workExperienceMonths
        );

    if (
        !Number.isFinite(
            currentMonths
        )
    ) {
        return createReviewResult({
            key: "workExperience",
            requirement,
            category,
            detail:
                "Your work experience information is unavailable or invalid.",
        });
    }

    const minimum =
        getNumber(
            rule,
            [
                "minimumMonths",
                "minimum",
                "minMonths",
            ]
        );

    if (
        minimum === null
    ) {
        return createReviewResult({
            key: "workExperience",
            requirement,
            category,
            detail:
                `Your profile contains ${currentMonths} months of work experience, but this opportunity does not specify a machine-readable minimum.`,
        });
    }

    const matched =
        currentMonths >= minimum;

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "workExperience",

        requirement,

        category,

        label:
            `${minimum} months minimum`,

        detail: matched
            ? `You have ${currentMonths} months of experience, meeting the minimum requirement of ${minimum} months.`
            : `You have ${currentMonths} months of experience, but at least ${minimum} months are required.`,
    });
}


/* ========================================================= */
/* STUDY DESTINATION                                         */
/* ========================================================= */

function evaluateStudyDestination(
    rule,
    requirement,
    category
) {
    const destination =
        normalize(
            studentProfile.studyDestination
        );

    const allowed =
        toArray(
            rule?.countries ??
            rule?.destinations ??
            rule?.values
        )
            .map(normalize)
            .filter(Boolean);

    if (
        allowed.length ===
        0
    ) {
        return createReviewResult({
            key: "studyDestination",
            requirement,
            category,
            detail:
                "No specific study-destination restriction is provided, so this criterion requires manual verification.",
        });
    }

    const matched =
        allowed.includes(
            destination
        );

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "studyDestination",

        requirement,

        category,

        label:
            `Eligible destinations: ${toArray(
                rule?.countries ??
                rule?.destinations ??
                rule?.values
            ).join(", ")}`,

        detail: matched
            ? `${studentProfile.studyDestination} is an eligible study destination.`
            : `${studentProfile.studyDestination} is not listed among the eligible destinations.`,
    });
}


/* ========================================================= */
/* ACHIEVEMENTS                                              */
/* ========================================================= */

function evaluateAchievements(
    rule,
    requirement,
    category
) {
    const studentAchievements =
        toArray(
            studentProfile.achievements
        )
            .map(normalize)
            .filter(Boolean);

    const requiredAchievements =
        toArray(
            rule?.items ??
            rule?.achievements ??
            rule?.requiredAchievements ??
            rule?.values
        )
            .map(normalize)
            .filter(Boolean);

    if (
        requiredAchievements.length ===
        0
    ) {
        if (
            studentAchievements.length >
            0
        ) {
            return createResult({
                type: "pass",
                key: "achievements",
                requirement,
                category,
                detail:
                    `Your profile contains relevant achievements: ${studentProfile.achievements.join(
                        ", "
                    )}.`,
            });
        }

        return createResult({
            type: "fail",
            key: "achievements",
            requirement,
            category,
            detail:
                category ===
                "mandatory"
                    ? "This opportunity requires evidence of achievements, but none are currently listed in your profile."
                    : "No achievements are currently listed in your profile. This may reduce competitiveness but does not automatically make you ineligible.",
        });
    }

    const matchedAchievements =
        requiredAchievements.filter(
            (required) =>
                studentAchievements.some(
                    (achievement) =>
                        achievement ===
                            required ||
                        achievement.includes(
                            required
                        ) ||
                        required.includes(
                            achievement
                        )
                )
        );

    const requiredCount =
        Math.max(
            1,
            Number(
                rule?.minimumCount ??
                rule?.minCount ??
                1
            )
        );

    const matched =
        matchedAchievements.length >=
        requiredCount;

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "achievements",

        requirement,

        category,

        label:
            `Relevant: ${requiredAchievements.join(
                ", "
            )}`,

        detail: matched
            ? `Your profile includes relevant achievement(s): ${matchedAchievements.join(
                ", "
            )}.`
            : `Your listed achievements do not currently match the stated achievement criteria.`,
    });
}


/* ========================================================= */
/* BOOLEAN REQUIREMENTS                                      */
/* ========================================================= */

function evaluateBooleanRule(
    studentValue,
    rule,
    requirement,
    label,
    key,
    category
) {
    if (
        typeof studentValue !==
        "boolean"
    ) {
        return createReviewResult({
            key,
            requirement,
            category,
            detail:
                `Your profile does not contain enough information to verify ${label.toLowerCase()}.`,
        });
    }

    const matched =
        studentValue === true;

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key,

        requirement,

        category,

        detail: matched
            ? `Your profile meets the ${label.toLowerCase()} criterion.`
            : category ===
                "mandatory"
                ? `${label} is a mandatory requirement, but your current profile does not show it.`
                : `${label} is a preferred criterion that is not currently shown in your profile. This lowers your competitive fit but does not automatically make you ineligible.`,
    });
}


/* ========================================================= */
/* PARTNER UNIVERSITY                                        */
/* ========================================================= */

function evaluatePartnerUniversity(
    rule,
    requirement,
    category
) {
    const studentUniversities =
        toArray(
            studentProfile.partnerUniversities
        )
            .map(normalize)
            .filter(Boolean);

    const requiredUniversities =
        toArray(
            rule?.universities ??
            rule?.partnerUniversities ??
            rule?.names
        )
            .map(normalize)
            .filter(Boolean);

    if (
        requiredUniversities.length ===
        0
    ) {
        return createReviewResult({
            key: "partnerUniversity",
            requirement,
            category,
            detail:
                "Partner-university eligibility depends on institutional agreements and cannot be confirmed from the current profile.",
        });
    }

    const matched =
        requiredUniversities.some(
            (required) =>
                studentUniversities.some(
                    (university) =>
                        university ===
                            required ||
                        university.includes(
                            required
                        ) ||
                        required.includes(
                            university
                        )
                )
        );

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "partnerUniversity",

        requirement,

        category,

        label:
            `Eligible universities: ${requiredUniversities.join(
                ", "
            )}`,

        detail: matched
            ? "Your university information matches an eligible partner university."
            : category ===
                "mandatory"
                ? "Your university is not currently listed as an eligible partner university."
                : "Your university is not currently listed as an eligible partner university. This may reduce competitiveness but does not automatically make you ineligible.",
    });
}


/* ========================================================= */
/* GDSC                                                      */
/* ========================================================= */

function evaluateGDSC(
    rule,
    requirement,
    category
) {
    return evaluateBooleanRule(
        studentProfile.gdscMember,
        rule,
        requirement,
        "GDSC membership",
        "gdsc",
        category
    );
}


/* ========================================================= */
/* INNOVATION PROJECT                                        */
/* ========================================================= */

function evaluateInnovationProject(
    rule,
    requirement,
    category
) {
    const projects =
        toArray(
            studentProfile.innovationProjects
        )
            .map(normalize)
            .filter(Boolean);

    const requiredTypes =
        toArray(
            rule?.types ??
            rule?.projects ??
            rule?.requiredTypes ??
            rule?.values
        )
            .map(normalize)
            .filter(Boolean);

    if (
        requiredTypes.length ===
        0
    ) {
        const hasProject =
            projects.length >
            0;

        return createResult({
            type: hasProject
                ? "pass"
                : "fail",

            key: "innovationProject",

            requirement,

            category,

            detail: hasProject
                ? "Your profile includes an innovation project."
                : category ===
                    "mandatory"
                    ? "An innovation project is required, but none is currently listed in your profile."
                    : "No innovation project is currently listed. This may reduce competitiveness but does not automatically make you ineligible.",
        });
    }

    const matched =
        requiredTypes.some(
            (requiredProject) =>
                projects.some(
                    (project) =>
                        project ===
                            requiredProject ||
                        project.includes(
                            requiredProject
                        ) ||
                        requiredProject.includes(
                            project
                        )
                )
        );

    return createResult({
        type: matched
            ? "pass"
            : "fail",

        key: "innovationProject",

        requirement,

        category,

        detail: matched
            ? "Your profile includes a relevant innovation project."
            : "Your listed projects do not currently match the required innovation project criteria.",
    });
}


/* ========================================================= */
/* UNIVERSITY TEAM                                           */
/* ========================================================= */

function evaluateUniversityTeam(
    rule,
    requirement,
    category
) {
    return evaluateBooleanRule(
        studentProfile.universityTeam,
        rule,
        requirement,
        "qualified university team membership",
        "universityTeam",
        category
    );
}


/* ========================================================= */
/* ADMISSION                                                 */
/* ========================================================= */

function evaluateAdmission(
    rule,
    requirement,
    category
) {
    return createReviewResult({
        key: "admission",
        requirement,
        category,
        detail:
            rule?.description ||
            "Admission cannot be confirmed from the current profile alone. University application, offer, course and document requirements may require manual verification.",
    });
}


/* ========================================================= */
/* ANNUAL BUDGET                                             */
/* ========================================================= */

function evaluateAnnualBudget(
    rule,
    requirement,
    category
) {
    const budget =
        Number(
            studentProfile
                .annualBudget
                ?.amount
        );

    const currency =
        normalize(
            studentProfile
                .annualBudget
                ?.currency
        );

    if (
        !Number.isFinite(
            budget
        ) ||
        !currency
    ) {
        return createReviewResult({
            key: "annualBudget",
            requirement,
            category,
            detail:
                "Your annual budget is not available in a valid amount/currency format.",
        });
    }

    const minimum =
        getNumber(
            rule,
            [
                "minimum",
                "minimumAmount",
            ]
        );

    const maximum =
        getNumber(
            rule,
            [
                "maximum",
                "maximumAmount",
            ]
        );

    const requiredCurrency =
        normalize(
            rule?.currency
        );

    if (
        requiredCurrency &&
        requiredCurrency !==
            currency
    ) {
        return createReviewResult({
            key: "annualBudget",
            requirement,
            category,
            detail:
                `Your stated budget is ${budget.toLocaleString()} ${studentProfile.annualBudget.currency}, while the opportunity uses ${rule.currency}. Currency conversion is required before financial compatibility can be determined.`,
        });
    }

    if (
        minimum === null &&
        maximum === null
    ) {
        return createReviewResult({
            key: "annualBudget",
            requirement,
            category,
            detail:
                `Your annual budget is ${budget.toLocaleString()} ${studentProfile.annualBudget.currency}, but the opportunity does not provide enough structured financial information for automatic comparison.`,
        });
    }

    if (
        maximum !== null &&
        budget >= maximum
    ) {
        return createResult({
            type: "pass",
            key: "annualBudget",
            requirement,
            category,
            detail:
                `Your annual budget of ${budget.toLocaleString()} ${studentProfile.annualBudget.currency} covers the stated upper financial estimate of ${maximum.toLocaleString()}.`,
        });
    }

    if (
        minimum !== null &&
        budget >= minimum
    ) {
        return createReviewResult({
            key: "annualBudget",
            requirement,
            category,
            detail:
                `Your annual budget of ${budget.toLocaleString()} ${studentProfile.annualBudget.currency} appears sufficient for the lower financial estimate but may not cover the upper end of the stated cost.`,
        });
    }

    if (
        minimum !== null &&
        budget < minimum
    ) {
        return createResult({
            type: "fail",
            key: "annualBudget",
            requirement,
            category,
            detail:
                `Your annual budget of ${budget.toLocaleString()} ${studentProfile.annualBudget.currency} is below the stated minimum financial estimate of ${minimum.toLocaleString()}.`,
        });
    }

    return createReviewResult({
        key: "annualBudget",
        requirement,
        category,
        detail:
            "Financial compatibility requires manual verification.",
    });
}


/* ========================================================= */
/* ADDITIONAL REQUIREMENTS                                   */
/* ========================================================= */

function evaluateAdditionalRequirement(
    item
) {
    const {
        key,
        rule,
        requirement,
        category,
    } = item;

    switch (key) {

        /* ----------------------------------------- */
        /* Profile-checkable additional requirements */
        /* ----------------------------------------- */

        case "partnerUniversity":
            return evaluatePartnerUniversity(
                rule,
                requirement,
                category
            );


        case "gdsc":
            return evaluateGDSC(
                rule,
                requirement,
                category
            );


        case "innovationProject":
            return evaluateInnovationProject(
                rule,
                requirement,
                category
            );


        case "qualifiedUniversityTeam":
            return evaluateUniversityTeam(
                rule,
                requirement,
                category
            );


        case "universityTeam":
            return evaluateUniversityTeam(
                rule,
                requirement,
                category
            );


        case "studentTeam":
            return evaluateInnovationProject(
                {
                    ...rule,
                },
                requirement,
                category
            );


        case "studentStatus":
            return evaluateBooleanRule(
                studentProfile.isStudent,
                rule,
                requirement,
                "student status",
                "isStudent",
                category
            );


        /* ----------------------------------------- */
        /* Manual/program-specific requirements */
        /* ----------------------------------------- */

        case "admission":
        case "eligibleCourse":
        case "universityAdmission":
        case "undergraduateEligibility":
        case "undergraduateDegree":
        case "academicYear":
        case "programSpecific":
        case "countryProgram":
        case "countryEligibility":
        case "nomination":
        case "returnHome":
        case "developmentImpact":
        case "englishBand":
        case "jobSpecific":
        case "delegateOrScholarship":
        case "enrollment":
        case "teamQualification":
        case "competitionTrack":
        case "projectSubmission":

            return createReviewResult({
                key,
                requirement,
                category,
                detail:
                    rule?.description ||
                    "This requirement requires manual verification because it cannot be reliably determined from the current student profile.",
            });


        /* ----------------------------------------- */
        /* Informational / open participation        */
        /* ----------------------------------------- */

        case "openParticipation":
            return createReviewResult({
                key,
                requirement,
                category,
                detail:
                    rule?.description ||
                    "This opportunity is broadly open to participants. Manual verification is recommended to confirm how this criterion applies to your application.",
            });


        /* ----------------------------------------- */
        /* Unknown additional criterion              */
        /* ----------------------------------------- */

        default:
            return createReviewResult({
                key,
                requirement,
                category,
                detail:
                    rule?.description ||
                    "This additional requirement requires manual verification.",
            });
    }
}


/* ========================================================= */
/* MAIN REQUIREMENT EVALUATOR                                */
/* ========================================================= */

function evaluateRequirement(
    item
) {
    const {
        key,
        rule,
        requirement,
        category,
        source,
    } = item;


    /*
        `opportunity` was removed because it was
        never used by this function.
    */

    if (
        source ===
        "additional"
    ) {
        return evaluateAdditionalRequirement(
            item
        );
    }


    switch (key) {

        case "nationality":
            return evaluateNationality(
                rule,
                requirement,
                category
            );


        case "internationalStudent":
            return evaluateInternationalStudent(
                rule,
                requirement,
                category
            );


        case "studyLevel":
            return evaluateStudyLevel(
                rule,
                requirement,
                category
            );


        case "fieldOfStudy":
            return evaluateFieldOfStudy(
                rule,
                requirement,
                category
            );


        case "academicPerformance":
            return evaluateAcademicPerformance(
                rule,
                requirement,
                category
            );


        case "english":
            return evaluateEnglish(
                rule,
                requirement,
                category
            );


        case "age":
            return evaluateAge(
                rule,
                requirement,
                category
            );


        case "workExperience":
            return evaluateWorkExperience(
                rule,
                requirement,
                category
            );


        case "studyDestination":
            return evaluateStudyDestination(
                rule,
                requirement,
                category
            );


        case "achievements":
            return evaluateAchievements(
                rule,
                requirement,
                category
            );


        case "researchExperience":
            return evaluateBooleanRule(
                studentProfile.researchExperience,
                rule,
                requirement,
                "research experience",
                "researchExperience",
                category
            );


        case "leadership":
            return evaluateBooleanRule(
                studentProfile.leadershipExperience,
                rule,
                requirement,
                "leadership experience",
                "leadership",
                category
            );


        case "communityService":
            return evaluateBooleanRule(
                studentProfile.communityService,
                rule,
                requirement,
                "community service",
                "communityService",
                category
            );


        case "isStudent":
            return evaluateBooleanRule(
                studentProfile.isStudent,
                rule,
                requirement,
                "current student status",
                "isStudent",
                category
            );


        case "partnerUniversity":
            return evaluatePartnerUniversity(
                rule,
                requirement,
                category
            );


        case "gdsc":
            return evaluateGDSC(
                rule,
                requirement,
                category
            );


        case "innovationProject":
            return evaluateInnovationProject(
                rule,
                requirement,
                category
            );


        case "universityTeam":
            return evaluateUniversityTeam(
                rule,
                requirement,
                category
            );


        case "admission":
            return evaluateAdmission(
                rule,
                requirement,
                category
            );


        case "annualBudget":
            return evaluateAnnualBudget(
                rule,
                requirement,
                category
            );


        default:
            return createReviewResult({
                key,
                requirement,
                category,
                detail:
                    rule?.description ||
                    "This eligibility criterion is not currently supported by the automatic evaluator and requires manual verification.",
            });
    }
}


/* ========================================================= */
/* SCORE CALCULATION                                         */
/* ========================================================= */

function calculateFitScore(
    results
) {
    const scored =
        results.filter(
            (item) =>
                item.affectsScore !==
                    false &&
                item.weight > 0
        );

    const mandatory =
        scored.filter(
            (item) =>
                item.category ===
                "mandatory"
        );

    const preferred =
        scored.filter(
            (item) =>
                item.category ===
                "preferred"
        );

    const mandatoryTotal =
        mandatory.reduce(
            (sum, item) =>
                sum + item.weight,
            0
        );

    const mandatoryEarned =
        mandatory.reduce(
            (sum, item) => {

                if (
                    item.type ===
                    "pass"
                ) {
                    return (
                        sum + item.weight
                    );
                }

                if (
                    item.type ===
                    "review"
                ) {
                    return (
                        sum +
                        item.weight *
                            0.5
                    );
                }

                return sum;
            },
            0
        );

    const preferredTotal =
        preferred.reduce(
            (sum, item) =>
                sum + item.weight,
            0
        );

    const preferredEarned =
        preferred.reduce(
            (sum, item) => {

                if (
                    item.type ===
                    "pass"
                ) {
                    return (
                        sum + item.weight
                    );
                }

                if (
                    item.type ===
                    "review"
                ) {
                    return (
                        sum +
                        item.weight *
                            0.5
                    );
                }

                return sum;
            },
            0
        );

    let score = 0;

    if (
        mandatoryTotal > 0 &&
        preferredTotal > 0
    ) {
        const mandatoryScore =
            (mandatoryEarned /
                mandatoryTotal) *
            70;

        const preferredScore =
            (preferredEarned /
                preferredTotal) *
            30;

        score =
            mandatoryScore +
            preferredScore;
    }

    else if (
        mandatoryTotal > 0
    ) {
        score =
            (mandatoryEarned /
                mandatoryTotal) *
            100;
    }

    else if (
        preferredTotal > 0
    ) {
        score =
            (preferredEarned /
                preferredTotal) *
            100;
    }

    return Math.round(
        Math.max(
            0,
            Math.min(
                100,
                score
            )
        )
    );
}


/* ========================================================= */
/* ANALYZE ONE OPPORTUNITY                                   */
/* ========================================================= */

function analyzeOpportunity(
    opportunity
) {
    const requirements =
        buildRequirementSet(
            opportunity
        );


    /*
        THIS is the canonical evaluated
        requirement array.

        Every item has:

            type
            key
            requirement
            label
            detail
            weight
            category

        This is what the breakdown MUST use.
    */

    const results =
        requirements.map(
            (item) =>
                evaluateRequirement(
                    item
                )
        );


    /*
        Every requirement now has exactly
        one of these states:

            pass
            review
            fail
    */

    const assessedResults =
        results;


    const scoredResults =
        results.filter(
            (item) =>
                item.affectsScore !==
                    false &&
                item.weight > 0
        );


    const mandatoryResults =
        assessedResults.filter(
            (item) =>
                item.category ===
                "mandatory"
        );


    const preferredResults =
        assessedResults.filter(
            (item) =>
                item.category ===
                "preferred"
        );


    const passedRequirements =
        assessedResults.filter(
            (item) =>
                item.type ===
                "pass"
        );


    const reviewRequirements =
        assessedResults.filter(
            (item) =>
                item.type ===
                "review"
        );


    const failedRequirements =
        assessedResults.filter(
            (item) =>
                item.type ===
                "fail"
        );


    /*
        ONLY mandatory failures are actual
        eligibility blockers.
    */

    const mandatoryFailures =
        mandatoryResults.filter(
            (item) =>
                item.type ===
                "fail"
        );


    const mandatoryReviews =
        mandatoryResults.filter(
            (item) =>
                item.type ===
                "review"
        );


    const preferredFailures =
        preferredResults.filter(
            (item) =>
                item.type ===
                "fail"
        );


    const score =
        calculateFitScore(
            results
        );


    /* ===================================================== */
    /* STATUS                                                */
    /* ===================================================== */

    let status;


    /*
        1. Any mandatory failure
           => Not Eligible
    */

    if (
        mandatoryFailures.length >
        0
    ) {
        status =
            "not-eligible";
    }


    /*
        2. Mandatory uncertainty
           => Review
    */

    else if (
        mandatoryReviews.length >
        0
    ) {
        status =
            "review";
    }


    /*
        3. Strong fit
    */

    else if (
        score >= 85
    ) {
        status =
            "strong";
    }


    /*
        4. Potentially eligible but not
           strong enough yet.
    */

    else {
        status =
            "review";
    }


    /* ===================================================== */
    /* STATUS REASON                                         */
    /* ===================================================== */

    let statusReason;


    if (
        mandatoryFailures.length >
        0
    ) {
        const firstFailure =
            mandatoryFailures[0];

        statusReason =
            `${mandatoryFailures.length} mandatory requirement${
                mandatoryFailures.length >
                1
                    ? "s"
                    : ""
            } ${
                mandatoryFailures.length >
                1
                    ? "do"
                    : "does"
            } not currently match your profile. ${
                firstFailure.requirement
            } is one of the blocking criteria.`;
    }


    else if (
        mandatoryReviews.length >
        0
    ) {
        statusReason =
            `${mandatoryReviews.length} mandatory requirement${
                mandatoryReviews.length >
                1
                    ? "s"
                    : ""
            } require${
                mandatoryReviews.length >
                1
                    ? ""
                    : "s"
            } manual verification before eligibility can be confirmed.`;
    }


    else if (
        score >= 85
    ) {
        statusReason =
            "Your profile satisfies the mandatory requirements and has a strong overall fit for this opportunity.";
    }


    else if (
        preferredFailures.length >
        0
    ) {
        statusReason =
            "You appear potentially eligible, but some preferred criteria are not currently met. These affect competitiveness rather than basic eligibility.";
    }


    else {
        statusReason =
            "You appear potentially eligible, but some criteria require verification or your profile fit could be stronger.";
    }


    return {
        ...opportunity,

        analysis: {
            score,

            status,

            statusReason,

            /*
                CRITICAL FIX:
                Use `results`, not `requirements`.

                `requirements` = raw definitions
                `results`      = evaluated statuses
            */
            requirements: results,

            passedRequirements,

            reviewRequirements,

            failedRequirements,

            mandatoryRequirements:
                mandatoryResults,

            preferredRequirements:
                preferredResults,

            mandatoryFailures,

            mandatoryReviews,

            preferredFailures,

            /*
                Kept for compatibility.
                There is no longer a real
                "not-assessed" state.
            */
            notAssessedRequirements: [],

            passedCount:
                passedRequirements.length,

            reviewCount:
                reviewRequirements.length,

            failedCount:
                failedRequirements.length,

            mandatoryPassedCount:
                mandatoryResults.filter(
                    (item) =>
                        item.type ===
                        "pass"
                ).length,

            mandatoryReviewCount:
                mandatoryReviews.length,

            mandatoryFailedCount:
                mandatoryFailures.length,

            preferredPassedCount:
                preferredResults.filter(
                    (item) =>
                        item.type ===
                        "pass"
                ).length,

            preferredReviewCount:
                preferredResults.filter(
                    (item) =>
                        item.type ===
                        "review"
                ).length,

            preferredFailedCount:
                preferredFailures.length,

            notAssessedCount:
                0,

            assessedCount:
                scoredResults.length,

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
            "Your profile meets the mandatory requirements and aligns strongly with this opportunity.",

        icon:
            CheckCircle2,

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
            "You may be eligible, but some criteria need verification or your profile could be more competitive.",

        icon:
            AlertCircle,

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
            "At least one mandatory requirement does not currently match your profile.",

        icon:
            XCircle,

        badge:
            "bg-rose-50 text-rose-700 border-rose-200",

        iconBox:
            "bg-rose-50 text-rose-600",

        score:
            "text-rose-600",
    },
};


/* ========================================================= */
/* REQUIREMENT CATEGORY BADGE                                */
/* ========================================================= */

function RequirementCategoryBadge({
    category,
}) {
    return (
        <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                category ===
                "mandatory"
                    ? "bg-sky-50 text-sky-600"
                    : "bg-violet-50 text-violet-600"
            }`}
        >
            {category ===
            "mandatory"
                ? "Mandatory"
                : "Preferred"}
        </span>
    );
}


/* ========================================================= */
/* OPPORTUNITY CARD                                          */
/* ========================================================= */

function OpportunityCard({
    opportunity,
}) {
    const [open, setOpen] =
        useState(false);


    const config =
        statusConfig[
            opportunity
                .analysis
                .status
        ];


    const StatusIcon =
        config.icon;


    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-sky-200 hover:shadow-xl">

            {/* ===================================================== */}
            {/* MAIN CARD                                              */}
            {/* ===================================================== */}

            <div className="group p-6 sm:p-7">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                    {/* Opportunity info */}

                    <div className="flex gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 transition-all group-hover:bg-sky-600 group-hover:text-white">

                            <Award
                                size={26}
                            />

                        </div>


                        <div>

                            <div className="flex flex-wrap items-center gap-2">

                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500">
                                    {
                                        opportunity.category
                                    }
                                </span>


                                {opportunity.featured && (
                                    <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-600">
                                        Featured
                                    </span>
                                )}

                            </div>


                            <h3 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">
                                {
                                    opportunity.title
                                }
                            </h3>


                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {
                                    opportunity.provider
                                }
                            </p>


                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">

                                <span className="inline-flex items-center gap-1.5">

                                    <Globe2
                                        size={14}
                                    />

                                    {
                                        opportunity.country
                                    }

                                </span>


                                <span className="inline-flex items-center gap-1.5">

                                    <GraduationCap
                                        size={14}
                                    />

                                    {opportunity.degree?.join(
                                        ", "
                                    )}

                                </span>


                                <span className="inline-flex items-center gap-1.5">

                                    <Sparkles
                                        size={14}
                                    />

                                    {
                                        opportunity.funding
                                    }

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
                                {
                                    opportunity
                                        .analysis
                                        .score
                                }
                                %
                            </span>

                        </div>


                        <div
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${config.badge}`}
                        >

                            <StatusIcon
                                size={14}
                            />

                            {
                                config.label
                            }

                        </div>

                    </div>

                </div>


                {/* Description */}

                <p className="mt-5 max-w-3xl text-sm leading-6 text-slate-500">
                    {
                        config.description
                    }
                </p>


                {/* Status reason */}

                <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">

                    <p className="text-xs font-semibold leading-5 text-slate-600">
                        {
                            opportunity
                                .analysis
                                .statusReason
                        }
                    </p>

                </div>


                {/* Quick stats */}

                <div className="mt-6 grid grid-cols-3 divide-x rounded-2xl border border-slate-100 bg-slate-50">

                    <div className="p-4 text-center">

                        <p className="text-lg font-black text-emerald-600">
                            {
                                opportunity
                                    .analysis
                                    .passedCount
                            }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Passed
                        </p>

                    </div>


                    <div className="p-4 text-center">

                        <p className="text-lg font-black text-amber-500">
                            {
                                opportunity
                                    .analysis
                                    .reviewCount
                            }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Review
                        </p>

                    </div>


                    <div className="p-4 text-center">

                        <p className="text-lg font-black text-rose-500">
                            {
                                opportunity
                                    .analysis
                                    .failedCount
                            }
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-slate-400">
                            Not met
                        </p>

                    </div>

                </div>


                {/* Mandatory / Preferred summary */}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">

                        <div className="flex items-center justify-between">

                            <span className="text-xs font-bold text-sky-700">
                                Mandatory
                            </span>


                            <span className="text-sm font-black text-sky-700">
                                {
                                    opportunity
                                        .analysis
                                        .mandatoryPassedCount
                                }
                                /
                                {
                                    opportunity
                                        .analysis
                                        .mandatoryRequirements
                                        .length
                                }
                            </span>

                        </div>


                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            These determine actual eligibility.
                        </p>

                    </div>


                    <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-4">

                        <div className="flex items-center justify-between">

                            <span className="text-xs font-bold text-violet-700">
                                Preferred
                            </span>


                            <span className="text-sm font-black text-violet-700">
                                {
                                    opportunity
                                        .analysis
                                        .preferredPassedCount
                                }
                                /
                                {
                                    opportunity
                                        .analysis
                                        .preferredRequirements
                                        .length
                                }
                            </span>

                        </div>


                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                            These influence competitiveness, not automatic eligibility.
                        </p>

                    </div>

                </div>


                {/* Expand */}

                <button
                    type="button"
                    onClick={() =>
                        setOpen(
                            (
                                value
                            ) =>
                                !value
                        )
                    }
                    className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-sky-200 hover:bg-sky-50/30"
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

                        <p className="text-sm font-bold uppercase tracking-wider text-sky-600">
                            Requirement breakdown
                        </p>


                        <h4 className="mt-1 text-xl font-black text-slate-950">
                            How your profile compares
                        </h4>


                        <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500">
                            Mandatory requirements determine eligibility. Preferred requirements influence competitiveness without automatically disqualifying you.
                        </p>

                    </div>


                    <div className="space-y-3">

                        {opportunity
                            .analysis
                            .requirements
                            .map(
                                (
                                    item,
                                    index
                                ) => {

                                    /*
                                        IMPORTANT:

                                        `item` now comes from
                                        `analysis.requirements`,
                                        which is `results`.

                                        Therefore the same
                                        status used by the
                                        stats is displayed here.
                                    */

                                    const passed =
                                        item.type ===
                                        "pass";


                                    const failed =
                                        item.type ===
                                        "fail";


                                    const review =
                                        item.type ===
                                        "review";


                                    const statusLabel =
                                        passed
                                            ? "Passed"
                                            : failed
                                                ? "Not met"
                                                : review
                                                    ? "Review"
                                                    : "Review";


                                    return (
                                        <div
                                            key={`${item.key}-${index}`}
                                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 transition-all duration-300"
                                        >

                                            <div className="flex gap-3">

                                                {/* Status icon */}

                                                <div
                                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                                                        passed
                                                            ? "bg-emerald-50 text-emerald-600"
                                                            : failed
                                                                ? "bg-rose-50 text-rose-600"
                                                                : review
                                                                    ? "bg-amber-50 text-amber-600"
                                                                    : "bg-amber-50 text-amber-600"
                                                    }`}
                                                >

                                                    {passed ? (
                                                        <CheckCircle2
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    ) : failed ? (
                                                        <XCircle
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    ) : (
                                                        <AlertCircle
                                                            size={
                                                                16
                                                            }
                                                        />
                                                    )}

                                                </div>


                                                {/* Content */}

                                                <div className="min-w-0 flex-1">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        <p className="font-bold text-slate-900">
                                                            {
                                                                item.requirement
                                                            }
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
                                                            {
                                                                statusLabel
                                                            }
                                                        </span>


                                                        <RequirementCategoryBadge
                                                            category={
                                                                item.category
                                                            }
                                                        />

                                                    </div>


                                                    <p className="mt-2 text-xs font-semibold leading-5 text-slate-700">
                                                        {
                                                            item.detail
                                                        }
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                    </div>


                    {/* Score explanation */}

                    <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-5">

                        <div className="flex items-start gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm">

                                <Target
                                    size={18}
                                />

                            </div>


                            <div>

                                <p className="text-sm font-black text-sky-900">
                                    How your score works
                                </p>


                                <p className="mt-1 text-xs leading-5 text-slate-600">
                                    Mandatory eligibility criteria account for 70% of the fit score and determine whether you can qualify. Preferred criteria account for 30% and measure how competitive your profile is. Missing a preferred criterion does not automatically make you ineligible.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* CTA */}

                    {opportunity.website && (
                        <div className="mt-6 flex flex-wrap gap-3">

                            <a
                                href={
                                    opportunity.website
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 rounded-xl border border-[#3A2C2C] bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-[2px_3px_0px_0px_#3A2C2C] transition hover:translate-y-0.5
               hover:shadow-[1px_2px_0px_0px_#3A2C2C]"
                            >

                                View official opportunity

                                <ArrowRight
                                    size={
                                        16
                                    }
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

    const [
        activeFilter,
        setActiveFilter,
    ] = useState("all");


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

    const counts =
        useMemo(() => {

            return {
                strong:
                    analyzedOpportunities.filter(
                        (item) =>
                            item
                                .analysis
                                .status ===
                            "strong"
                    ).length,

                review:
                    analyzedOpportunities.filter(
                        (item) =>
                            item
                                .analysis
                                .status ===
                            "review"
                    ).length,

                notEligible:
                    analyzedOpportunities.filter(
                        (item) =>
                            item
                                .analysis
                                .status ===
                            "not-eligible"
                    ).length,
            };

        }, [
            analyzedOpportunities,
        ]);


    /* ========================================================= */
    /* FILTER                                                    */
    /* ========================================================= */

    const filteredOpportunities =
        useMemo(() => {

            if (
                activeFilter ===
                "all"
            ) {
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
            {/* HERO                                                   */}
            {/* ===================================================== */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-[#e5f3ff]">

                <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />

                <div className="absolute -right-32 -top-20 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />


                <div className="absolute right-[20%] top-20 rotate-12 text-blue-200">
                    <Sparkles
                        size={70}
                        strokeWidth={1.5}
                    />
                </div>


                <div className="absolute bottom-32 left-[8%] rotate-12 text-blue-200">
                    <Target
                        size={75}
                        strokeWidth={1.2}
                    />
                </div>


                <div className="absolute bottom-10 right-[8%] text-sky-200">
                    <GraduationCap
                        size={80}
                        strokeWidth={1.2}
                    />
                </div>


                <div className="relative z-10 mx-auto max-w-7xl px-6 pt-40 pb-20 sm:px-8 lg:px-10">

                    <div className="mx-auto max-w-4xl text-center">

                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm">

                            <Target
                                size={16}
                            />

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
                            ScholarX compares your student profile against available opportunities and separates actual eligibility from competitive profile fit.
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

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 transition-all group-hover:bg-sky-600 group-hover:text-white">

                                    <UserRoundCheck
                                        size={22}
                                    />

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
                                    `GPA ${studentProfile.academicPerformance.toFixed(
                                        2
                                    )}`,

                                    studentProfile.studyLevel,

                                    studentProfile.fieldOfStudy,

                                    studentProfile.studyDestination,

                                    `${
                                        studentProfile
                                            .english
                                            ?.test ??
                                        "English"
                                    } ${
                                        studentProfile
                                            .english
                                            ?.score ??
                                        "N/A"
                                    }`,

                                    studentProfile.nationality,

                                    `Age ${studentProfile.age}`,
                                ].map(
                                    (
                                        item
                                    ) => (
                                        <span
                                            key={
                                                item
                                            }
                                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                                        >
                                            {
                                                item
                                            }
                                        </span>
                                    )
                                )}

                            </div>

                        </div>


                        <div className="flex items-center border-t border-slate-100 bg-sky-50/50 p-6 lg:border-l lg:border-t-0">

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
                            setActiveFilter(
                                "strong"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                            activeFilter ===
                            "strong"
                                ? "border-emerald-300 bg-emerald-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-lg"
                        }`}
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                                <CheckCircle2
                                    size={22}
                                />

                            </div>


                            <span className="text-3xl font-black text-emerald-600">
                                {
                                    counts.strong
                                }
                            </span>

                        </div>


                        <p className="mt-5 font-black">
                            Strong Fit
                        </p>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Opportunities where your profile aligns strongly.
                        </p>

                    </button>


                    {/* Review */}

                    <button
                        type="button"
                        onClick={() =>
                            setActiveFilter(
                                "review"
                            )
                        }
                        className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                            activeFilter ===
                            "review"
                                ? "border-amber-300 bg-amber-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-amber-200 hover:shadow-lg"
                        }`}
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                                <AlertCircle
                                    size={22}
                                />

                            </div>


                            <span className="text-3xl font-black text-amber-500">
                                {
                                    counts.review
                                }
                            </span>

                        </div>


                        <p className="mt-5 font-black">
                            Review
                        </p>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Potential opportunities with criteria to verify or strengthen.
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
                        className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-xl ${
                            activeFilter ===
                            "not-eligible"
                                ? "border-rose-300 bg-rose-50 shadow-lg"
                                : "border-slate-200 bg-white hover:border-rose-200 hover:shadow-lg"
                        }`}
                    >

                        <div className="flex items-center justify-between">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600">

                                <XCircle
                                    size={22}
                                />

                            </div>


                            <span className="text-3xl font-black text-rose-500">
                                {
                                    counts.notEligible
                                }
                            </span>

                        </div>


                        <p className="mt-5 font-black">
                            Not Eligible
                        </p>


                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Opportunities with mandatory requirements you do not currently meet.
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

                            <span className="h-px w-8 bg-sky-600" />

                            <span className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">
                                Your results
                            </span>

                        </div>


                        <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                            Opportunities for your profile
                        </h2>


                        <p className="mt-3 max-w-2xl leading-7 text-slate-500">
                            Each opportunity is evaluated using mandatory eligibility requirements and preferred profile factors so that competitive weaknesses are not mistaken for hard ineligibility.
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setActiveFilter(
                                "all"
                            )
                        }
                        className={`inline-flex w-fit items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                            activeFilter ===
                            "all"
                                ? "border-sky-200 bg-sky-50 text-sky-600"
                                : "border-slate-200 bg-white text-slate-600 hover:border-sky-200"
                        }`}
                    >

                        <Award
                            size={16}
                        />

                        All opportunities

                    </button>

                </div>


                <div className="mt-10 space-y-5">

                    {filteredOpportunities.length >
                    0 ? (

                        filteredOpportunities.map(
                            (
                                opportunity
                            ) => (
                                <OpportunityCard
                                    key={
                                        opportunity.id
                                    }
                                    opportunity={
                                        opportunity
                                    }
                                />
                            )
                        )

                    ) : (

                        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">

                            <CircleAlert
                                size={
                                    35
                                }
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

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">

                        <Sparkles
                            size={23}
                        />

                    </div>


                    <h2 className="mt-5 text-2xl font-black">
                        Your result is a guidance tool
                    </h2>


                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
                        ScholarX uses the information available in your profile and the eligibility information available for each opportunity. Always verify the latest requirements on the official scholarship or program website before applying.
                    </p>

                </div>

            </section>


            {/* ===================================================== */}
            {/* CTA                                                     */}
            {/* ===================================================== */}

            <section className="mx-auto max-w-7xl bg-white px-6 pb-12 sm:px-8">

                <div className="relative overflow-hidden rounded-3xl bg-slate-950">

                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-600/20 blur-3xl" />

                    <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />


                    <div className="relative z-10 mx-auto max-w-4xl px-6 py-20 text-center sm:px-8">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sky-300">

                            <Sparkles
                                size={27}
                            />

                        </div>


                        <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Keep your profile up to date
                        </h2>


                        <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-400">
                            New achievements, test scores, experience and academic results can change which opportunities are right for you.
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
