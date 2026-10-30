
const hasText = (value) =>
  typeof value === "string" && value.trim().length > 0;

const hasValidNumber = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value));

const hasBoolean = (value) =>
  typeof value === "boolean";

export const calculateProfileCompletion = (profile) => {
  if (!profile) {
    return {
      completed: 0,
      total: 16,
      percentage: 0,
    };
  }

  const checks = [
    hasText(profile.personal?.name),
    hasText(profile.personal?.email),
    hasText(profile.personal?.nationality),
    hasValidNumber(profile.personal?.age) ||
      hasText(profile.personal?.dateOfBirth),

    hasText(profile.academic?.studyLevel),
    Array.isArray(profile.academic?.completedDegrees) &&
      profile.academic.completedDegrees.length > 0,
    hasText(profile.academic?.fieldOfStudy),
    hasValidNumber(
      typeof profile.academic?.academicPerformance === "object"
        ? profile.academic.academicPerformance?.gpa
        : profile.academic?.academicPerformance
    ),

    hasText(profile.english?.test),
    hasValidNumber(profile.english?.score),

    hasText(profile.preferences?.studyDestination),
    hasValidNumber(profile.preferences?.annualBudget?.amount),

    hasValidNumber(profile.experience?.workExperienceMonths),
    Array.isArray(profile.experience?.achievements) &&
      profile.experience.achievements.length > 0,

    hasBoolean(profile.additional?.internationalStudent),
    hasBoolean(profile.additional?.isStudent),
  ];

  const completed = checks.filter(Boolean).length;
  const total = checks.length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
};
