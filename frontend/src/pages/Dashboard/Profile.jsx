import { useEffect, useState } from "react";
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
   LOCAL STORAGE USER HELPERS
============================================================ */

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const setStoredUsername = (username) => {
  const storedUser = getStoredUser();
  localStorage.setItem(
    "user",
    JSON.stringify({ ...storedUser, username })
  );
};


/* ============================================================
   CONVERT SCHOLARX PROFILE → FORM DATA
============================================================ */

const profileToFormData = (profile) => {
  const storedUser = getStoredUser();
  return {
    username: profile.username || storedUser.username || "",
    name: profile.personal?.name || storedUser.name || "",
    email: profile.personal?.email || storedUser.email || "",
    nationality: profile.personal?.nationality || "",
    dateOfBirth: profile.personal?.dateOfBirth || "",

    studyLevel: profile.academic?.studyLevel || "",
    completedDegrees:
      profile.academic?.completedDegrees || [],
    fieldOfStudy:
      profile.academic?.fieldOfStudy || "",
    academicPerformance:
      profile.academic?.academicPerformance?.gpa ?? profile.academic?.academicPerformance ?? "",
    gpaScale:
      profile.academic?.academicPerformance?.scale ?? "4",

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
      profile.experience?.leadershipExperience ?? null,

    communityService:
      profile.experience?.communityService ?? null,

    researchExperience:
      profile.experience?.researchExperience ?? null,

    achievements:
      profile.experience?.achievements || [],

    internationalStudent:
      profile.additional?.internationalStudent ?? null,

    isStudent:
      profile.additional?.isStudent ?? null,

    gdscMember:
      profile.additional?.gdscMember ?? null,

    universityTeam:
      profile.additional?.universityTeam ?? null,

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
      dateOfBirth: formData.dateOfBirth || null,
    },

    academic: {
      studyLevel: formData.studyLevel,
      completedDegrees:
        formData.completedDegrees,

      fieldOfStudy:
        formData.fieldOfStudy.trim(),

      academicPerformance: {
        gpa: formData.academicPerformance !== "" ? Number(formData.academicPerformance) : null,
        scale: formData.gpaScale !== "" ? Number(formData.gpaScale) : null,
      },
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
          : null,

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
   DATE AND LANGUAGE HELPERS
============================================================ */

const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const beforeBirthday = today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age >= 0 ? age : null;
};

const emptyLanguageQualification = () => ({
  language_code: "ZH",
  proficiency_type: "test",
  test_name: "HSK",
  score_numeric: "",
  score_text: "",
  proficiency_level: "HSK 1",
  test_date: "",
  expiry_date: "",
});

const LanguageQualificationsPanel = ({ apiBaseUrl, onCompletionChange }) => {
  const [qualifications, setQualifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadQualifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Your session has expired. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${apiBaseUrl}/api/profile/languages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || "Could not load language qualifications.");
      setQualifications((body.qualifications || []).map((item) => ({
        ...item,
        score_numeric: item.score_numeric ?? "",
        score_text: item.score_text ?? "",
        test_date: item.test_date ?? "",
        expiry_date: item.expiry_date ?? "",
      })));
      if (body.completion) onCompletionChange?.(body.completion);
    } catch (err) {
      setError(err.message || "Could not load language qualifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQualifications(); /* load once on mount */ }, [apiBaseUrl]);

  const updateQualification = (index, key, value) => {
    setQualifications((current) => current.map((item, i) => i === index ? { ...item, [key]: value } : item));
  };

  const addQualification = () => setQualifications((current) => [...current, emptyLanguageQualification()]);
  const removeQualification = (index) => setQualifications((current) => current.filter((_, i) => i !== index));

  const saveQualifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setError("Your session has expired. Please log in again."); return; }
    const cleaned = qualifications.filter((item) => item.language_code && item.proficiency_type).map((item) => ({
      language_code: item.language_code.trim().toUpperCase(),
      proficiency_type: item.proficiency_type,
      test_name: item.test_name?.trim() || null,
      score_numeric: item.score_numeric === "" || item.score_numeric == null ? null : Number(item.score_numeric),
      score_text: item.score_text?.trim() || null,
      proficiency_level: item.proficiency_level?.trim() || null,
      test_date: item.test_date || null,
      expiry_date: item.expiry_date || null,
    }));
    try {
      setSaving(true); setError(""); setMessage("");
      const response = await fetch(`${apiBaseUrl}/api/profile/languages`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ qualifications: cleaned }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.detail || "Could not save language qualifications.");
      setQualifications((body.qualifications || []).map((item) => ({
        ...item, score_numeric: item.score_numeric ?? "", score_text: item.score_text ?? "",
        test_date: item.test_date ?? "", expiry_date: item.expiry_date ?? "",
      })));
      if (body.completion) onCompletionChange?.(body.completion);
      setMessage("Language qualifications saved successfully.");
    } catch (err) {
      setError(err.message || "Could not save language qualifications.");
    } finally { setSaving(false); }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><Languages className="h-5 w-5" /></div>
          <div><h2 className="font-bold text-slate-900">Language Qualifications</h2><p className="mt-1 text-xs leading-5 text-slate-500">Manage HSK, IELTS, TOEFL, and other language tests independently from your main profile.</p></div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addQualification} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><Plus className="h-4 w-4" /> Add qualification</button>
          <button type="button" onClick={saveQualifications} disabled={saving || loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60">{saving ? "Saving…" : "Save languages"}</button>
        </div>
      </div>
      <div className="space-y-4 p-5 sm:p-6">
        {loading && <p className="text-sm text-slate-500">Loading language qualifications…</p>}
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
        {!loading && qualifications.length === 0 && <p className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-500">No language qualifications added yet. Add one if you have taken a language test; leave this section empty if you have not.</p>}
        {qualifications.map((item, index) => (
          <div key={item.id || `qualification-${index}`} className="rounded-xl border border-slate-200 p-4">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-slate-800">Qualification {index + 1}</h3><button type="button" onClick={() => removeQualification(index)} aria-label={`Remove qualification ${index + 1}`} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button></div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="block text-xs font-medium text-slate-600">Language<select value={item.language_code || ""} onChange={(e) => updateQualification(index, "language_code", e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="ZH">Chinese</option><option value="EN">English</option><option value="FR">French</option><option value="DE">German</option><option value="JA">Japanese</option><option value="KO">Korean</option><option value="OTHER">Other</option></select></label>
              <label className="block text-xs font-medium text-slate-600">Qualification type<select value={item.proficiency_type || "test"} onChange={(e) => updateQualification(index, "proficiency_type", e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="test">Standardized test</option><option value="level">Proficiency level</option><option value="native">Native language</option><option value="course">Course certificate</option></select></label>
              <label className="block text-xs font-medium text-slate-600">Test / certificate<select value={item.test_name || ""} onChange={(e) => updateQualification(index, "test_name", e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Select test</option><option>HSK</option><option>IELTS</option><option>TOEFL</option><option>PTE</option><option>Duolingo English Test</option><option>MOI</option><option>Other</option></select></label>
              <label className="block text-xs font-medium text-slate-600">Level (e.g. HSK 3)<input value={item.proficiency_level || ""} onChange={(e) => updateQualification(index, "proficiency_level", e.target.value)} placeholder="HSK 3 / B2 / C1" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="block text-xs font-medium text-slate-600">Numeric score<input type="number" step="0.01" value={item.score_numeric} onChange={(e) => updateQualification(index, "score_numeric", e.target.value)} placeholder="Optional" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="block text-xs font-medium text-slate-600">Text score / grade<input value={item.score_text || ""} onChange={(e) => updateQualification(index, "score_text", e.target.value)} placeholder="Optional" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="block text-xs font-medium text-slate-600">Test date<input type="date" value={item.test_date || ""} onChange={(e) => updateQualification(index, "test_date", e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
              <label className="block text-xs font-medium text-slate-600">Expiry date<input type="date" value={item.expiry_date || ""} onChange={(e) => updateQualification(index, "expiry_date", e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
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

  const [formData, setFormData] = useState(() => profileToFormData(profile || {}));
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [completionData, setCompletionData] = useState(profileCompletion || { percentage: 0, completed: 0, total: 0, missing_fields: [] });

  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL).replace(/\/$/, "");
  const PROFILE_ENDPOINT = `${API_BASE_URL}/api/profile/username`;

  // The verified JWT identifies the student. Never send a user ID from localStorage.
  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setProfileError("Your session has expired. Please log in again.");
        setLoadingProfile(false);
        return;
      }

      try {
        setLoadingProfile(true);
        setProfileError("");
        const response = await fetch(PROFILE_ENDPOINT, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body.detail || body.message || "Could not load your profile.");
        }

        // The profile API should return { profile: <nested profile> } or the profile itself.
        const serverProfile = body.profile ?? body.data ?? body;
        if (body.completion) setCompletionData(body.completion);
        const storedUser = getStoredUser();
        const normalizedServerProfile = {
          ...serverProfile,
          username: serverProfile.username || body.user?.username || storedUser.username || "",
          personal: {
            ...serverProfile.personal,
            name: body.user?.name || storedUser.name || "",
            email: body.user?.email || storedUser.email || "",
          },

        };
        if (!cancelled && normalizedServerProfile && typeof normalizedServerProfile === "object") {
          updateProfile(normalizedServerProfile);
          setFormData(profileToFormData(normalizedServerProfile));
        }
      } catch (error) {
        if (!cancelled) setProfileError(error.message || "Could not load your profile.");
      } finally {
        if (!cancelled) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => { cancelled = true; };
    // Avoid an infinite reload loop if Dashboard recreates updateProfile on each render.
    // The endpoint is stable, so load once when this component mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PROFILE_ENDPOINT]);



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

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setProfileError("Your session has expired. Please log in again.");
      return;
    }

    try {
      setSavingProfile(true);
      setProfileError("");
      const storedUser = getStoredUser();
      const nextUsername = (formData.username || "").trim();
      const currentUsername = (storedUser.username || "").trim();

      if (!nextUsername) {
        throw new Error("Username cannot be empty.");
      }
      if (!/^[a-zA-Z0-9._-]{3,30}$/.test(nextUsername)) {
        throw new Error("Username must be 3–30 characters and may contain letters, numbers, dots, underscores, or hyphens.");
      }

      // Username is updated separately from profile details. The backend must
      // verify the JWT and enforce uniqueness before changing the account.
      if (nextUsername !== currentUsername) {
        const usernameResponse = await fetch(PROFILE_ENDPOINT, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: nextUsername }),
        });
        const usernameBody = await usernameResponse.json().catch(() => ({}));
        if (!usernameResponse.ok) {
          throw new Error(usernameBody.detail || usernameBody.message || "Could not update username.");
        }
        const confirmedUsername = usernameBody.username || usernameBody.user?.username || nextUsername;
        setStoredUsername(confirmedUsername);
        setFormData((prev) => ({ ...prev, username: confirmedUsername }));
      }

      const normalizedProfile = formDataToProfile(formData);
      const response = await fetch(PROFILE_ENDPOINT, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(normalizedProfile),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.detail || body.message || "Could not save your profile.");
      }

      const savedProfile = body.profile ?? body.data ?? normalizedProfile;
      if (body.completion) setCompletionData(body.completion);
      const latestStoredUser = getStoredUser();
      const confirmedUsername = savedProfile.username || latestStoredUser.username || formData.username;
      if (confirmedUsername) setStoredUsername(confirmedUsername);
      const completeSavedProfile = {
        ...savedProfile,
        username: confirmedUsername || "",
      };
      updateProfile(completeSavedProfile);
      setFormData(profileToFormData(completeSavedProfile));
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      setProfileError(error.message || "Could not save your profile.");
    } finally {
      setSavingProfile(false);
    }
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

  if (loadingProfile) {
    return <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-500">Loading your profile…</div>;
  }

  if (!profile) {
    return <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-500">Your profile is not available yet.</div>;
  }


  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 space-y-6">
      {profileError && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileError}
        </div>
      )}

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
                    @{getStoredUser().username || formData.username || "username-not-set"}
                  </span>

                  <span className="hidden sm:inline">•</span>

                  <span>
                    {profile.personal.email || "Email not added"}
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
                  {completionData.percentage ?? profileCompletion?.percentage ?? 0}%
                </span>

              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{
                    width: `${completionData.percentage ?? profileCompletion?.percentage ?? 0}%`,
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
          label="Date of Birth"
          value={profile.personal.dateOfBirth || "Not specified"}
        />

        <InfoItem
          icon={UserRound}
          label="Age"
          value={calculateAge(profile.personal.dateOfBirth) !== null
            ? `${calculateAge(profile.personal.dateOfBirth)} years`
            : "Not specified"}
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
          icon={School}
          label="Institution Name"
          value={profile.academic.institutionName || "Not specified"}
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
            profile.academic.academicPerformance?.gpa != null
              ? `${profile.academic.academicPerformance.gpa} / ${profile.academic.academicPerformance.scale ?? "?"} GPA`
              : profile.academic.academicPerformance !== "" && typeof profile.academic.academicPerformance !== "object"
                ? `${profile.academic.academicPerformance} GPA`
                : "Not specified"
          }
        />
      </ProfileSection>


      <LanguageQualificationsPanel
        apiBaseUrl={API_BASE_URL}
        onCompletionChange={setCompletionData}
      />

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
          saving={savingProfile}
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
  saving = false,
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
                label="Username"
                value={formData.username}
                placeholder="Choose a unique username"
                onChange={(value) => updateField("username", value)}
              />
              <p className="-mt-3 text-xs text-slate-500">3–30 characters. Letters, numbers, dots, underscores, and hyphens are allowed. Username availability is checked by the server.</p>

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
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(value) => updateField("dateOfBirth", value)}
              />
              <p className="-mt-3 text-xs text-slate-500">Your age is calculated automatically from your date of birth for scholarship age requirements.</p>

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

              <InputField
                label="GPA Scale"
                type="number"
                step="0.01"
                min="1"
                value={formData.gpaScale}
                placeholder="e.g. 4.00 or 5.00"
                onChange={(value) => updateField("gpaScale", value)}
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
            disabled={saving}
            className="
              rounded-xl bg-sky-500
              px-5 py-2.5
              text-sm font-bold text-white
              shadow-lg shadow-sky-500/20
              transition
              hover:bg-sky-600
            "
          >
            {saving ? "Saving…" : "Save Changes"}
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