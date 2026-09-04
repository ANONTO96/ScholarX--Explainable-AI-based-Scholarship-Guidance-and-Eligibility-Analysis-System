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
  School,
  Target,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { calculateProfileCompletion } from "../../utils/profileCompletion";
import { NavLink } from "react-router";
import studentProfile from "../../data/studentProfile";

const Profile = () => {
  /*
   * ---------------------------------------------------------
   * STUDENT PROFILE
   * ---------------------------------------------------------
   *
   * This object is the frontend representation of the
   * student's profile.
   *
   * Later this will come from:
   *
   * GET /api/students/me
   *
   * The structure intentionally matches the data expected
   * by the ScholarX eligibility / matchmaking engine.
   */


  /*
   * ---------------------------------------------------------
   * PROFILE COMPLETION
   * ---------------------------------------------------------
   *
   * Later this calculation can happen on the backend.
   * Keeping it calculated from the profile means we don't
   * have to manually maintain "82%" when fields change.
   */

  const profileCompletion = calculateProfileCompletion(studentProfile);

  const formatBudget = () => {
    return `${studentProfile.preferences.annualBudget.currency} ${studentProfile.preferences.annualBudget.amount.toLocaleString()}`;
  };

  const formatWorkExperience = () => {
    const months =
      studentProfile.experience.workExperienceMonths;

    if (months === 0) return "No experience";

    if (months < 12) {
      return `${months} month${months > 1 ? "s" : ""}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (!remainingMonths) {
      return `${years} year${years > 1 ? "s" : ""}`;
    }

    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">

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
              Keep your information up to date to improve your
              scholarship matches.
            </p>
          </div>

          <button
            type="button"
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
          PROFILE HERO
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

        <div className="h-15 bg-linear-to-r from-sky-500 via-sky-500 to-cyan-500" />

        <div className="px-5 py-6 sm:px-6">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            {/* Avatar + identity */}
            <div className="flex items-end gap-4">

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-sky-100 text-2xl font-bold text-sky-600 shadow-md">
                SN
              </div>

              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {studentProfile.personal.name}
                </h2>

                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                  <span>
                    {studentProfile.personal.email}
                  </span>

                  <span className="hidden sm:inline">
                    •
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {studentProfile.personal.nationality}
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
                  {profileCompletion}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all"
                  style={{
                    width: `${profileCompletion}%`,
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
          value={studentProfile.personal.name}
        />

        <InfoItem
          icon={Languages}
          label="Email"
          value={studentProfile.personal.email}
        />

        <InfoItem
          icon={Globe2}
          label="Nationality"
          value={studentProfile.personal.nationality}
        />

        <InfoItem
          icon={UserRound}
          label="Age"
          value={`${studentProfile.personal.age} years`}
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
          value={studentProfile.academic.studyLevel}
        />

        <InfoItem
          icon={School}
          label="Completed Degree"
          value={
            studentProfile.academic.completedDegrees.join(
              ", "
            )
          }
        />

        <InfoItem
          icon={Target}
          label="Field of Study"
          value={studentProfile.academic.fieldOfStudy}
        />

        <InfoItem
          icon={Award}
          label="Academic Performance"
          value={`${studentProfile.academic.academicPerformance} GPA`}
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
          value={studentProfile.english.test}
        />

        <InfoItem
          icon={Award}
          label="Score"
          value={studentProfile.english.score}
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
          value={studentProfile.preferences.studyDestination}
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
            studentProfile.experience.leadershipExperience
          }
        />

        <BooleanInfoItem
          icon={Heart}
          label="Community Service"
          value={
            studentProfile.experience.communityService
          }
        />

        <BooleanInfoItem
          icon={Microscope}
          label="Research Experience"
          value={
            studentProfile.experience.researchExperience
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
              {studentProfile.experience.achievements.length >
              0 ? (
                studentProfile.experience.achievements.map(
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
            studentProfile.additional.internationalStudent
          }
        />

        <BooleanInfoItem
          icon={GraduationCap}
          label="Currently a Student"
          value={studentProfile.additional.isStudent}
        />

        <BooleanInfoItem
          icon={Users}
          label="GDSC Member"
          value={studentProfile.additional.gdscMember}
        />

        <BooleanInfoItem
          icon={Users}
          label="University Team"
          value={studentProfile.additional.universityTeam}
        />

        <InfoItem
          icon={School}
          label="Partner Universities"
          value={
            studentProfile.additional.partnerUniversities
              .length
              ? studentProfile.additional.partnerUniversities.join(
                  ", "
                )
              : "None added"
          }
        />

        <InfoItem
          icon={Lightbulb}
          label="Innovation Projects"
          value={
            studentProfile.additional.innovationProjects
              .length
              ? studentProfile.additional.innovationProjects.join(
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
          </NavLink
          >
        </div>

        <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-sky-500/10" />
        <div className="absolute -bottom-24 right-32 h-56 w-56 rounded-full bg-cyan-500/5" />
      </section>
    </div>
  );
};


/* ============================================================
   REUSABLE PROFILE SECTION
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