export const calculateProfileCompletion = (profile) => {
  const checks = [
    Boolean(profile.personal?.name),
    Boolean(profile.personal?.email),
    Boolean(profile.personal?.nationality),
    Boolean(profile.personal?.age),

    Boolean(profile.academic?.studyLevel),
    Boolean(profile.academic?.completedDegrees?.length),
    Boolean(profile.academic?.fieldOfStudy),
    profile.academic?.academicPerformance !== undefined,

    Boolean(profile.english?.test),
    profile.english?.score !== undefined,

    Boolean(profile.preferences?.studyDestination),
    Boolean(profile.preferences?.annualBudget?.amount),

    profile.experience?.workExperienceMonths !== undefined,
    Boolean(profile.experience?.achievements?.length),

    profile.additional?.internationalStudent !== undefined,
    profile.additional?.isStudent !== undefined,
  ];

  const completed = checks.filter(Boolean).length;

  return Math.round((completed / checks.length) * 100);
};