import { useState } from "react";
import { useDashboard } from "../../context/Dashboard/useDashboard";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Edit3,
  GraduationCap,
  Globe2,
  Heart,
  Languages,
  Lightbulb,
  MapPin,
  Microscope,
  Plus,
  School,
  Target,
  UserRound,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { NavLink } from "react-router";



/* ============================================================
   DEFAULT FORM STRUCTURE
============================================================

const emptyFormData = {
  name: "",
  email: "",
  nationality: "",
  age: "",

  studyLevel: "",
  completedDegrees: [],
  fieldOfStudy: "",
  academicPerformance: "",

  englishTest: "",
  englishScore: "",

  studyDestination: "",
  budgetCurrency: "USD",
  annualBudget: "",

  workExperienceMonths: "",
  leadershipExperience: false,
  communityService: false,
  researchExperience: false,
  achievements: [],

  internationalStudent: false,
  isStudent: false,
  gdscMember: false,
  universityTeam: false,

  partnerUniversities: [],
  innovationProjects: [],
};
*/


/* ============================================================
   CONVERT SCHOLARX PROFILE → FORM DATA
============================================================ */

const profileToFormData = (profile) => {
  return {
    name: profile.personal?.name || "",
    email: profile.personal?.email || "",
    nationality: profile.personal?.nationality || "",
    age: profile.personal?.age ?? "",

    studyLevel: profile.academic?.studyLevel || "",
    completedDegrees:
      profile.academic?.completedDegrees || [],
    fieldOfStudy:
      profile.academic?.fieldOfStudy || "",
    academicPerformance:
      profile.academic?.academicPerformance ?? "",

    englishTest: profile.english?.test || "",
    englishScore: profile.english?.score ?? "",

    studyDestination:
      profile.preferences?.studyDestination || "",

    budgetCurrency:
      profile.preferences?.annualBudget?.currency || "USD",

    annualBudget:
      profile.preferences?.annualBudget?.amount ?? "",

    workExperienceMonths:
      profile.experience?.workExperienceMonths ?? "",

    leadershipExperience:
      profile.experience?.leadershipExperience || false,

    communityService:
      profile.experience?.communityService || false,

    researchExperience:
      profile.experience?.researchExperience || false,

    achievements:
      profile.experience?.achievements || [],

    internationalStudent:
      profile.additional?.internationalStudent || false,

    isStudent:
      profile.additional?.isStudent || false,

    gdscMember:
      profile.additional?.gdscMember || false,

    universityTeam:
      profile.additional?.universityTeam || false,

    partnerUniversities:
      profile.additional?.partnerUniversities || [],

    innovationProjects:
      profile.additional?.innovationProjects || [],
  };
};


/* ============================================================
   CONVERT FORM DATA → SCHOLARX PROFILE STRUCTURE
============================================================ */

const formDataToProfile = (formData) => {
  return {
    personal: {
      name: formData.name.trim(),
      email: formData.email.trim(),
      nationality: formData.nationality.trim(),
      age: formData.age
        ? Number(formData.age)
        : "",
    },

    academic: {
      studyLevel: formData.studyLevel,
      completedDegrees:
        formData.completedDegrees,

      fieldOfStudy:
        formData.fieldOfStudy.trim(),

      academicPerformance:
        formData.academicPerformance !== ""
          ? Number(formData.academicPerformance)
          : "",
    },

    english: {
      test: formData.englishTest,
      score:
        formData.englishScore !== ""
          ? Number(formData.englishScore)
          : "",
    },

    preferences: {
      studyDestination:
        formData.studyDestination,

      annualBudget: {
        currency: formData.budgetCurrency,
        amount:
          formData.annualBudget !== ""
            ? Number(formData.annualBudget)
            : "",
      },
    },

    experience: {
      workExperienceMonths:
        formData.workExperienceMonths !== ""
          ? Number(formData.workExperienceMonths)
          : 0,

      leadershipExperience:
        formData.leadershipExperience,

      communityService:
        formData.communityService,

      researchExperience:
        formData.researchExperience,

      achievements:
        formData.achievements,
    },

    additional: {
      internationalStudent:
        formData.internationalStudent,

      isStudent:
        formData.isStudent,

      gdscMember:
        formData.gdscMember,

      universityTeam:
        formData.universityTeam,

      partnerUniversities:
        formData.partnerUniversities,

      innovationProjects:
        formData.innovationProjects,
    },
  };
};


/* ============================================================
   PROFILE
============================================================ */

const Profile = () => {

  const {
    profile,
    updateProfile,
    profileCompletion,
} = useDashboard();

const [formData, setFormData] = useState(
    profileToFormData(profile)
);


  const [editing, setEditing] =
    useState(false);

  const [saved, setSaved] =
    useState(false);



  /* ==========================================================
     OPEN EDIT MODE
  ========================================================== */

  const handleEditProfile = () => {
    setFormData(profileToFormData(profile));
    setEditing(true);
    setSaved(false);
  };


  /* ==========================================================
     CLOSE EDIT MODE
  ========================================================== */

  const handleCancel = () => {
    setFormData(profileToFormData(profile));
    setEditing(false);
  };


  /* ==========================================================
     HANDLE INPUT
  ========================================================== */

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* ==========================================================
     SAVE PROFILE
  ========================================================== */

  const handleSave = () => {
    const normalizedProfile =
      formDataToProfile(formData);

    updateProfile(normalizedProfile);

    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };


  /* ==========================================================
     FORMATTING
  ========================================================== */

  const formatBudget = () => {
    const budget =
      profile.preferences.annualBudget;

    if (
      budget.amount === "" ||
      budget.amount === null ||
      budget.amount === undefined
    ) {
      return "Not specified";
    }

    return `${budget.currency} ${Number(
      budget.amount
    ).toLocaleString()}`;
  };


  const formatWorkExperience = () => {
    const months =
      profile.experience.workExperienceMonths;

    if (
      months === "" ||
      months === null ||
      months === undefined
    ) {
      return "Not specified";
    }

    if (Number(months) === 0) {
      return "No experience";
    }

    if (Number(months) < 12) {
      return `${months} month${Number(months) > 1 ? "s" : ""
        }`;
    }

    const years = Math.floor(
      Number(months) / 12
    );

    const remainingMonths =
      Number(months) % 12;

    if (!remainingMonths) {
      return `${years} year${years > 1 ? "s" : ""
        }`;
    }

    return `${years}y ${remainingMonths}m`;
  };


  /* ==========================================================
     LOADING / EMPTY SAFETY
  ========================================================== */

  if (!profile) {
    return null;
  }


  return (
    <div className="mx-auto max-w-6xl py-6 lg:py-8 space-y-6">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-500">
          Account
        </p>

        <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Keep your information up to date to improve
              your scholarship matches.
            </p>
          </div>

          <button
            type="button"
            onClick={handleEditProfile}
            className="
              flex w-fit items-center gap-2
              rounded-xl bg-slate-900
              px-4 py-2.5
              text-sm font-semibold text-white
              transition
              hover:bg-slate-800
            "
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>


      {/* =====================================================
          SAVE SUCCESS
      ====================================================== */}

      {saved && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Profile updated successfully.
        </div>
      )}


      {/* =====================================================
          PROFILE HERO
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="h-15 bg-linear-to-r from-sky-500 via-sky-500 to-cyan-500" />

        <div className="px-5 py-6 sm:px-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            {/* Avatar + identity */}

            <div className="flex items-end gap-4">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-sky-100 text-2xl font-bold text-sky-600 shadow-md">
                {profile.personal.name
                  ? profile.personal.name
                    .split(" ")
                    .map((word) => word[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                  : "U"}
              </div>

              <div className="pb-1">

                <h2 className="text-xl font-bold text-slate-900">
                  {profile.personal.name ||
                    "Your Name"}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">

                  <span>
                    {profile.personal.email ||
                      "Email not added"}
                  </span>

                  <span className="hidden sm:inline">
                    •
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />

                    {profile.personal.nationality ||
                      "Nationality not added"}
                  </span>

                </div>
              </div>
            </div>


            {/* Completion */}

            <div className="w-full sm:w-56">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-xs font-semibold text-slate-500">
                  Profile completion
                </span>

                <span className="text-sm font-bold text-sky-600">
                  {profileCompletion.percentage}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{
  width: `${profileCompletion.percentage}%`,
}}
                />

              </div>

              <p className="mt-2 text-[11px] text-slate-400">
                A complete profile gives ScholarX more data
                for accurate matching.
              </p>

            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          PERSONAL INFORMATION
      ====================================================== */}

      <ProfileSection
        icon={UserRound}
        title="Personal Information"
        description="Basic information used to personalize your scholarship recommendations."
      >
        <InfoItem
          icon={UserRound}
          label="Full Name"
          value={
            profile.personal.name ||
            "Not specified"
          }
        />

        <InfoItem
          icon={Languages}
          label="Email"
          value={
            profile.personal.email ||
            "Not specified"
          }
        />

        <InfoItem
          icon={Globe2}
          label="Nationality"
          value={
            profile.personal.nationality ||
            "Not specified"
          }
        />

        <InfoItem
          icon={UserRound}
          label="Age"
          value={
            profile.personal.age
              ? `${profile.personal.age} years`
              : "Not specified"
          }
        />
      </ProfileSection>


      {/* =====================================================
          ACADEMIC BACKGROUND
      ====================================================== */}

      <ProfileSection
        icon={GraduationCap}
        title="Academic Background"
        description="Your academic information is one of the most important factors in scholarship matching."
      >
        <InfoItem
          icon={GraduationCap}
          label="Current Study Level"
          value={
            profile.academic.studyLevel ||
            "Not specified"
          }
        />

        <InfoItem
          icon={School}
          label="Completed Degree"
          value={
            profile.academic.completedDegrees
              ?.length
              ? profile.academic.completedDegrees.join(
                ", "
              )
              : "Not specified"
          }
        />

        <InfoItem
          icon={Target}
          label="Field of Study"
          value={
            profile.academic.fieldOfStudy ||
            "Not specified"
          }
        />

        <InfoItem
          icon={Award}
          label="Academic Performance"
          value={
            profile.academic.academicPerformance !==
              ""
              ? `${profile.academic.academicPerformance} GPA`
              : "Not specified"
          }
        />
      </ProfileSection>


      {/* =====================================================
          ENGLISH PROFICIENCY
      ====================================================== */}

      <ProfileSection
        icon={Languages}
        title="English Proficiency"
        description="Your language proficiency helps ScholarX identify scholarships with compatible language requirements."
      >
        <InfoItem
          icon={Languages}
          label="English Test"
          value={
            profile.english.test ||
            "Not specified"
          }
        />

        <InfoItem
          icon={Award}
          label="Score"
          value={
            profile.english.score !== ""
              ? profile.english.score
              : "Not specified"
          }
        />
      </ProfileSection>


      {/* =====================================================
          STUDY PREFERENCES
      ====================================================== */}

      <ProfileSection
        icon={Globe2}
        title="Study Preferences"
        description="Tell ScholarX where and what you are planning to study."
      >
        <InfoItem
          icon={MapPin}
          label="Preferred Destination"
          value={
            profile.preferences.studyDestination ||
            "Not specified"
          }
        />

        <InfoItem
          icon={WalletCards}
          label="Annual Budget"
          value={formatBudget()}
        />
      </ProfileSection>


      {/* =====================================================
          EXPERIENCE & ACHIEVEMENTS
      ====================================================== */}

      <ProfileSection
        icon={BriefcaseBusiness}
        title="Experience & Achievements"
        description="Your experience, achievements, and activities can unlock additional scholarship opportunities."
      >
        <InfoItem
          icon={BriefcaseBusiness}
          label="Work Experience"
          value={formatWorkExperience()}
        />

        <BooleanInfoItem
          icon={Users}
          label="Leadership Experience"
          value={
            profile.experience
              .leadershipExperience
          }
        />

        <BooleanInfoItem
          icon={Heart}
          label="Community Service"
          value={
            profile.experience
              .communityService
          }
        />

        <BooleanInfoItem
          icon={Microscope}
          label="Research Experience"
          value={
            profile.experience
              .researchExperience
          }
        />

        <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">

          <div className="rounded-xl bg-slate-50 p-4">

            <div className="flex items-center gap-2">

              <Award className="h-4 w-4 text-sky-500" />

              <p className="text-xs font-semibold text-slate-500">
                Achievements
              </p>

            </div>

            <div className="mt-3 flex flex-wrap gap-2">

              {profile.experience.achievements
                ?.length > 0 ? (

                profile.experience.achievements.map(
                  (achievement) => (
                    <span
                      key={achievement}
                      className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                    >
                      {achievement}
                    </span>
                  )
                )

              ) : (

                <span className="text-xs text-slate-400">
                  No achievements added yet.
                </span>

              )}

            </div>
          </div>
        </div>
      </ProfileSection>


      {/* =====================================================
          ADDITIONAL INFORMATION
      ====================================================== */}

      <ProfileSection
        icon={Lightbulb}
        title="Additional Information"
        description="Additional information used by ScholarX when evaluating specific scholarship requirements."
      >
        <BooleanInfoItem
          icon={Globe2}
          label="International Student"
          value={
            profile.additional
              .internationalStudent
          }
        />

        <BooleanInfoItem
          icon={GraduationCap}
          label="Currently a Student"
          value={
            profile.additional.isStudent
          }
        />

        <BooleanInfoItem
          icon={Users}
          label="GDSC Member"
          value={
            profile.additional.gdscMember
          }
        />

        <BooleanInfoItem
          icon={Users}
          label="University Team"
          value={
            profile.additional.universityTeam
          }
        />

        <InfoItem
          icon={School}
          label="Partner Universities"
          value={
            profile.additional
              .partnerUniversities?.length
              ? profile.additional.partnerUniversities.join(
                ", "
              )
              : "None added"
          }
        />

        <InfoItem
          icon={Lightbulb}
          label="Innovation Projects"
          value={
            profile.additional
              .innovationProjects?.length
              ? profile.additional.innovationProjects.join(
                ", "
              )
              : "None added"
          }
        />
      </ProfileSection>


      {/* =====================================================
          MATCHING CTA
      ====================================================== */}

      <section className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-7">

        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="max-w-xl">

            <div className="flex items-center gap-2">

              <Target className="h-5 w-5 text-sky-400" />

              <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                Next Step
              </span>

            </div>

            <h3 className="mt-2 text-xl font-bold">
              Find scholarships that match your profile.
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-400">
              ScholarX can compare your academic background,
              experience, preferences, and other requirements
              against available opportunities.
            </p>

          </div>

          <NavLink
            to="/dashboard/matches"
            className="
              flex shrink-0 items-center justify-center gap-2
              rounded-xl bg-sky-500
              px-5 py-3
              text-sm font-bold text-white
              shadow-lg shadow-sky-500/20
              transition
              hover:bg-sky-400
            "
          >
            Explore Matches

            <ChevronRight className="h-4 w-4" />
          </NavLink>

        </div>

        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-sky-500/10" />

        <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-cyan-500/5" />

      </section>


      {/* =====================================================
          EDIT PROFILE MODAL
      ====================================================== */}

      {editing && (
        <ProfileEditModal
          formData={formData}
          updateField={updateField}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

    </div>
  );
};


/* ============================================================
   EDIT PROFILE MODAL
============================================================ */

const ProfileEditModal = ({
  formData,
  updateField,
  onSave,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}

        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit Profile
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Update your information to improve your scholarship matches.
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>

        </div>


        {/* Form */}

        <div className="overflow-y-auto p-5 sm:p-6">

          <div className="space-y-6">

            {/* =================================================
                PERSONAL
            ================================================== */}

            <EditSection
              title="Personal Information"
            >

              <InputField
                label="Full Name"
                value={formData.name}
                placeholder="Enter your full name"
                onChange={(value) =>
                  updateField("name", value)
                }
              />

              <InputField
                label="Email"
                type="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={(value) =>
                  updateField("email", value)
                }
              />

              <InputField
                label="Nationality"
                value={formData.nationality}
                placeholder="e.g. Bangladeshi"
                onChange={(value) =>
                  updateField(
                    "nationality",
                    value
                  )
                }
              />

              <InputField
                label="Age"
                type="number"
                min="1"
                max="100"
                value={formData.age}
                placeholder="Your age"
                onChange={(value) =>
                  updateField("age", value)
                }
              />

            </EditSection>


            {/* =================================================
                ACADEMIC
            ================================================== */}

            <EditSection
              title="Academic Background"
            >

              <SelectField
                label="Current Study Level"
                value={formData.studyLevel}
                onChange={(value) =>
                  updateField(
                    "studyLevel",
                    value
                  )
                }
                options={[
                  "Bachelor",
                  "Master",
                  "PhD",
                ]}
                placeholder="Select study level"
              />

              <InputField
                label="Completed Degree"
                value={
                  formData.completedDegrees[0] ||
                  ""
                }
                placeholder="e.g. BSc in Computer Science"
                onChange={(value) =>
                  updateField(
                    "completedDegrees",
                    value
                      ? [value]
                      : []
                  )
                }
              />

              <InputField
                label="Field of Study"
                value={formData.fieldOfStudy}
                placeholder="e.g. Computer Science"
                onChange={(value) =>
                  updateField(
                    "fieldOfStudy",
                    value
                  )
                }
              />

              <InputField
                label="Academic Performance / GPA"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={
                  formData.academicPerformance
                }
                placeholder="e.g. 3.50"
                onChange={(value) =>
                  updateField(
                    "academicPerformance",
                    value
                  )
                }
              />

            </EditSection>


            {/* =================================================
                ENGLISH
            ================================================== */}

            <EditSection
              title="English Proficiency"
            >

              <SelectField
                label="English Test"
                value={formData.englishTest}
                onChange={(value) =>
                  updateField(
                    "englishTest",
                    value
                  )
                }
                options={[
                  "IELTS",
                  "TOEFL",
                  "PTE",
                  "Duolingo",
                  "MOI",
                  "Other",
                ]}
                placeholder="Select test"
              />

              <InputField
                label="Score"
                type="number"
                step="0.5"
                value={formData.englishScore}
                placeholder="e.g. 7.0"
                onChange={(value) =>
                  updateField(
                    "englishScore",
                    value
                  )
                }
              />

            </EditSection>


            {/* =================================================
                PREFERENCES
            ================================================== */}

            <EditSection
              title="Study Preferences"
            >

              <InputField
                label="Preferred Destination"
                value={
                  formData.studyDestination
                }
                placeholder="e.g. Australia"
                onChange={(value) =>
                  updateField(
                    "studyDestination",
                    value
                  )
                }
              />

              <SelectField
                label="Budget Currency"
                value={
                  formData.budgetCurrency
                }
                onChange={(value) =>
                  updateField(
                    "budgetCurrency",
                    value
                  )
                }
                options={[
                  "USD",
                  "EUR",
                  "GBP",
                  "AUD",
                  "CAD",
                ]}
              />

              <InputField
                label="Annual Budget"
                type="number"
                min="0"
                value={formData.annualBudget}
                placeholder="e.g. 50000"
                onChange={(value) =>
                  updateField(
                    "annualBudget",
                    value
                  )
                }
              />

            </EditSection>


            {/* =================================================
                EXPERIENCE
            ================================================== */}

            <EditSection
              title="Experience & Achievements"
            >

              <InputField
                label="Work Experience (months)"
                type="number"
                min="0"
                value={
                  formData.workExperienceMonths
                }
                placeholder="e.g. 6"
                onChange={(value) =>
                  updateField(
                    "workExperienceMonths",
                    value
                  )
                }
              />

              <ToggleField
                label="Leadership Experience"
                checked={
                  formData.leadershipExperience
                }
                onChange={(value) =>
                  updateField(
                    "leadershipExperience",
                    value
                  )
                }
              />

              <ToggleField
                label="Community Service"
                checked={
                  formData.communityService
                }
                onChange={(value) =>
                  updateField(
                    "communityService",
                    value
                  )
                }
              />

              <ToggleField
                label="Research Experience"
                checked={
                  formData.researchExperience
                }
                onChange={(value) =>
                  updateField(
                    "researchExperience",
                    value
                  )
                }
              />

              <TagInput
                label="Achievements"
                values={formData.achievements}
                onChange={(value) =>
                  updateField(
                    "achievements",
                    value
                  )
                }
                placeholder="e.g. Hackathon Winner"
              />

            </EditSection>


            {/* =================================================
                ADDITIONAL
            ================================================== */}

            <EditSection
              title="Additional Information"
            >

              <ToggleField
                label="International Student"
                checked={
                  formData.internationalStudent
                }
                onChange={(value) =>
                  updateField(
                    "internationalStudent",
                    value
                  )
                }
              />

              <ToggleField
                label="Currently a Student"
                checked={
                  formData.isStudent
                }
                onChange={(value) =>
                  updateField(
                    "isStudent",
                    value
                  )
                }
              />

              <ToggleField
                label="GDSC Member"
                checked={
                  formData.gdscMember
                }
                onChange={(value) =>
                  updateField(
                    "gdscMember",
                    value
                  )
                }
              />

              <ToggleField
                label="University Team"
                checked={
                  formData.universityTeam
                }
                onChange={(value) =>
                  updateField(
                    "universityTeam",
                    value
                  )
                }
              />

              <TagInput
                label="Partner Universities"
                values={
                  formData.partnerUniversities
                }
                onChange={(value) =>
                  updateField(
                    "partnerUniversities",
                    value
                  )
                }
                placeholder="e.g. University of Melbourne"
              />

              <TagInput
                label="Innovation Projects"
                values={
                  formData.innovationProjects
                }
                onChange={(value) =>
                  updateField(
                    "innovationProjects",
                    value
                  )
                }
                placeholder="e.g. AI Scholarship Predictor"
              />

            </EditSection>

          </div>
        </div>


        {/* Footer */}

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-6">

          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-xl px-4 py-2.5
              text-sm font-semibold
              text-slate-600
              transition
              hover:bg-slate-100
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSave}
            className="
              rounded-xl bg-sky-500
              px-5 py-2.5
              text-sm font-bold text-white
              shadow-lg shadow-sky-500/20
              transition
              hover:bg-sky-600
            "
          >
            Save Changes
          </button>

        </div>

      </div>
    </div>
  );
};


/* ============================================================
   EDIT SECTION
============================================================ */

const EditSection = ({
  title,
  children,
}) => {
  return (
    <section>

      <div className="mb-4">

        <h3 className="text-sm font-bold text-slate-900">
          {title}
        </h3>

      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {children}
      </div>

    </section>
  );
};


/* ============================================================
   INPUT FIELD
============================================================ */

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  min,
  max,
  step,
}) => {
  return (
    <label className="block">

      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>

      <input
        type={type}
        value={value ?? ""}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full rounded-xl
          border border-slate-200
          bg-slate-50
          px-3.5 py-2.5
          text-sm text-slate-800
          outline-none
          transition
          placeholder:text-slate-400
          focus:border-sky-400
          focus:bg-white
          focus:ring-2
          focus:ring-sky-100
        "
      />

    </label>
  );
};


/* ============================================================
   SELECT FIELD
============================================================ */

const SelectField = ({
  label,
  value,
  onChange,
  options,
  placeholder,
}) => {
  return (
    <label className="block">

      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>

      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          w-full rounded-xl
          border border-slate-200
          bg-slate-50
          px-3.5 py-2.5
          text-sm text-slate-800
          outline-none
          transition
          focus:border-sky-400
          focus:bg-white
          focus:ring-2
          focus:ring-sky-100
        "
      >

        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </label>
  );
};


/* ============================================================
   TOGGLE
============================================================ */

const ToggleField = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

      <span className="text-sm font-medium text-slate-700">
        {label}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() =>
          onChange(!checked)
        }
        className={`
          relative h-6 w-11 rounded-full
          transition
          ${checked
            ? "bg-sky-500"
            : "bg-slate-300"
          }
        `}
      >

        <span
          className={`
            absolute top-1 h-4 w-4
            rounded-full bg-white
            shadow-sm transition
            ${checked
              ? "left-6"
              : "left-1"
            }
          `}
        />

      </button>

    </label>
  );
};


/* ============================================================
   TAG INPUT
============================================================ */

const TagInput = ({
  label,
  values,
  onChange,
  placeholder,
}) => {
  const [input, setInput] =
    useState("");

  const addTag = () => {
    const value = input.trim();

    if (!value) return;

    if (
      values.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase()
      )
    ) {
      setInput("");
      return;
    }

    onChange([
      ...values,
      value,
    ]);

    setInput("");
  };

  const removeTag = (index) => {
    onChange(
      values.filter(
        (_, i) => i !== index
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="sm:col-span-2">

      <span className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </span>

      <div className="flex gap-2">

        <input
          value={input}
          placeholder={placeholder}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="
            min-w-0 flex-1 rounded-xl
            border border-slate-200
            bg-slate-50
            px-3.5 py-2.5
            text-sm text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-sky-400
            focus:bg-white
            focus:ring-2
            focus:ring-sky-100
          "
        />

        <button
          type="button"
          onClick={addTag}
          className="
            flex h-11 w-11 shrink-0
            items-center justify-center
            rounded-xl bg-sky-500
            text-white
            transition
            hover:bg-sky-600
          "
        >
          <Plus className="h-4 w-4" />
        </button>

      </div>


      {values.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">

          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="
                flex items-center gap-1.5
                rounded-full
                bg-sky-50
                px-3 py-1.5
                text-xs font-medium
                text-sky-700
              "
            >

              {value}

              <button
                type="button"
                onClick={() =>
                  removeTag(index)
                }
                className="text-sky-400 transition hover:text-sky-700"
              >
                <X className="h-3 w-3" />
              </button>

            </span>
          ))}

        </div>
      )}

    </div>
  );
};


/* ============================================================
   PROFILE SECTION
============================================================ */

const ProfileSection = ({
  icon: Icon,
  title,
  description,
  children,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
            <Icon className="h-5 w-5" />
          </div>

          <div>

            <h2 className="font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-400">
              {description}
            </p>

          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:p-6">
        {children}
      </div>

    </section>
  );
};


/* ============================================================
   INFORMATION ITEM
============================================================ */

const InfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4 transition hover:bg-sky-50/60">

      <div className="flex items-center gap-2">

        <Icon className="h-4 w-4 text-sky-500" />

        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>

      </div>

      <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-800">
        {value}
      </p>

    </div>
  );
};


/* ============================================================
   BOOLEAN INFORMATION ITEM
============================================================ */

const BooleanInfoItem = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-xl bg-slate-50 p-4 transition hover:bg-sky-50/60">

      <div className="flex items-center gap-2">

        <Icon className="h-4 w-4 text-sky-500" />

        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </span>

      </div>

      <div className="mt-2 flex items-center gap-1.5">

        {value ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />

            <span className="text-sm font-semibold text-emerald-600">
              Yes
            </span>
          </>
        ) : (
          <>
            <span className="h-4 w-4 rounded-full border-2 border-slate-300" />

            <span className="text-sm font-semibold text-slate-500">
              No
            </span>
          </>
        )}

      </div>

    </div>
  );
};


export default Profile;