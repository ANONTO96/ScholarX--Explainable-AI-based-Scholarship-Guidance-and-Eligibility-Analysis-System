export const calculateProfileCompletion = (profile) => {
  if (!profile) {
    return {
      completed: 0,
      total: 0,
      percentage: 0,
    };
  }

  const checks = [
    Boolean(profile.personal?.name),
    Boolean(profile.personal?.email),
    Boolean(profile.personal?.nationality),
    Boolean(profile.personal?.age),

    Boolean(profile.academic?.studyLevel),
    Boolean(profile.academic?.completedDegrees?.length),
    Boolean(profile.academic?.fieldOfStudy),
    profile.academic?.academicPerformance !== undefined &&
      profile.academic?.academicPerformance !== "",

    Boolean(profile.english?.test),
    profile.english?.score !== undefined &&
      profile.english?.score !== "",

    Boolean(profile.preferences?.studyDestination),
    profile.preferences?.annualBudget?.amount !== undefined &&
      profile.preferences?.annualBudget?.amount !== "",

    profile.experience?.workExperienceMonths !== undefined &&
      profile.experience?.workExperienceMonths !== "",
    Boolean(profile.experience?.achievements?.length),

    profile.additional?.internationalStudent !== undefined,
    profile.additional?.isStudent !== undefined,
  ];

  const completed = checks.filter(Boolean).length;
  const total = checks.length;

  return {
    completed,
    total,
    percentage:
      total > 0
        ? Math.round((completed / total) * 100)
        : 0,
  };
};