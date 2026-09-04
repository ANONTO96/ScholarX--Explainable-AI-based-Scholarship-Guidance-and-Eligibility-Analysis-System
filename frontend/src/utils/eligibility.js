/* ========================================================= */
/*  NORMALIZATION                                            */
/* ========================================================= */

function normalizeStudentProfile(profile = {}) {
    return {
        // =========================================
        // PERSONAL
        // =========================================
        name: profile.personal?.name ?? "",
        email: profile.personal?.email ?? "",
        nationality: profile.personal?.nationality ?? "",
        age: profile.personal?.age ?? null,

        // =========================================
        // ACADEMIC
        // =========================================
        studyLevel: profile.academic?.studyLevel ?? "",

        completedDegrees:
            profile.academic?.completedDegrees ?? [],

        fieldOfStudy:
            profile.academic?.fieldOfStudy ?? "",

        academicPerformance:
            profile.academic?.academicPerformance ?? null,

        // =========================================
        // ENGLISH
        // =========================================
        english: {
            test: profile.english?.test ?? "",
            score: profile.english?.score ?? null,
        },

        // =========================================
        // PREFERENCES
        // =========================================
        studyDestination:
            profile.preferences?.studyDestination ?? "",

        annualBudget: {
            amount:
                profile.preferences?.annualBudget?.amount ?? null,

            currency:
                profile.preferences?.annualBudget?.currency ?? "",
        },

        // =========================================
        // EXPERIENCE
        // =========================================
        workExperienceMonths:
            profile.experience?.workExperienceMonths ?? null,

        achievements:
            profile.experience?.achievements ?? [],

        leadershipExperience:
            profile.experience?.leadershipExperience ?? false,

        communityService:
            profile.experience?.communityService ?? false,

        researchExperience:
            profile.experience?.researchExperience ?? false,

        // =========================================
        // ADDITIONAL
        // =========================================
        internationalStudent:
            profile.additional?.internationalStudent ?? false,

        isStudent:
            profile.additional?.isStudent ?? false,

        partnerUniversities:
            profile.additional?.partnerUniversities ?? [],

        gdscMember:
            profile.additional?.gdscMember ?? false,

        innovationProjects:
            profile.additional?.innovationProjects ?? [],

        universityTeam:
            profile.additional?.universityTeam ?? false,
    };
}

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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    category,
    studentProfile
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
    item, studentProfile
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
                category,
                studentProfile
            );


        case "gdsc":
            return evaluateGDSC(
                rule,
                requirement,
                category,
                studentProfile

            );


        case "innovationProject":
            return evaluateInnovationProject(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "qualifiedUniversityTeam":
            return evaluateUniversityTeam(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "universityTeam":
            return evaluateUniversityTeam(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "studentTeam":
            return evaluateInnovationProject(
                {
                    ...rule,
                },
                requirement,
                category,
                studentProfile
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
    item, studentProfile
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
            item, studentProfile
        );
    }


    switch (key) {

        case "nationality":
            return evaluateNationality(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "internationalStudent":
            return evaluateInternationalStudent(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "studyLevel":
            return evaluateStudyLevel(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "fieldOfStudy":
            return evaluateFieldOfStudy(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "academicPerformance":
            return evaluateAcademicPerformance(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "english":
            return evaluateEnglish(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "age":
            return evaluateAge(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "workExperience":
            return evaluateWorkExperience(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "studyDestination":
            return evaluateStudyDestination(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "achievements":
            return evaluateAchievements(
                rule,
                requirement,
                category,
                studentProfile
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
                category,
                studentProfile
            );


        case "gdsc":
            return evaluateGDSC(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "innovationProject":
            return evaluateInnovationProject(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "universityTeam":
            return evaluateUniversityTeam(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "admission":
            return evaluateAdmission(
                rule,
                requirement,
                category,
                studentProfile
            );


        case "annualBudget":
            return evaluateAnnualBudget(
                rule,
                requirement,
                category,
                studentProfile
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

export function analyzeOpportunity(
    opportunity, studentProfile
) {
    // Convert nested profile into the flat structure
    // expected by the eligibility evaluators.
    const profile =
        normalizeStudentProfile(studentProfile);
        
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
                    item, profile
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