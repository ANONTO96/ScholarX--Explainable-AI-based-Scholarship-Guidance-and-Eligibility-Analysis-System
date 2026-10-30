
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import { DashboardContext } from "./DashboardContext";

import opportunities from "../../data/opportunities.json";

import { analyzeOpportunity } from "../../utils/eligibility";

import { calculateProfileCompletion } from "../../utils/profileCompletion";

import {
    getFavorites,
    toggleFavorite as toggleStoredFavorite,
    removeFavorite as removeStoredFavorite,
} from "../../utils/favorites";

import {
    getApplications,
    addApplication as addStoredApplication,
    removeApplication as removeStoredApplication,
} from "../../data/applications";

import {
    getDocumentMetadata,
    addDocument as addStoredDocument,
    addCustomDocument as addStoredCustomDocument,
    getCustomDocuments,
    removeChecklistDocument as removeStoredChecklistDocument,
} from "../../data/documents";


// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const PROFILE_ENDPOINT = `${API_BASE_URL}/api/profile/me`;


// ============================================================
// EMPTY PROFILE
// ============================================================

// Never use the demo student profile as authenticated data.

const EMPTY_PROFILE = {
    personal: {
        name: "",
        email: "",
        nationality: "",
        age: null,
        dateOfBirth: null,
    },

    academic: {
        studyLevel: "",
        completedDegrees: [],
        fieldOfStudy: "",
        academicPerformance: null,
    },

    english: {
        test: "",
        score: null,
    },

    preferences: {
        studyDestination: "",
        annualBudget: {
            currency: "USD",
            amount: null,
        },
    },

    experience: {
        workExperienceMonths: null,
        leadershipExperience: false,
        communityService: false,
        researchExperience: false,
        achievements: [],
    },

    additional: {
        internationalStudent: false,
        isStudent: false,
        gdscMember: false,
        universityTeam: false,
        partnerUniversities: [],
        innovationProjects: [],
    },
};


// ============================================================
// SETTINGS
// ============================================================

const SETTINGS_STORAGE_KEY = "scholarx-settings";

const DEFAULT_SETTINGS = {
    notifications: {
        applicationDeadlines: true,
        scholarshipUpdates: true,
        documentReminders: true,
        eligibilityUpdates: true,
        emailNotifications: true,
    },

    preferences: {
        language: "English",
        currency: "USD",
        timezone: "Asia/Dhaka",
    },

    appearance: {
        theme: "system",
    },

    privacy: {
        profileVisibility: "private",
        personalizedRecommendations: true,
    },
};


const loadSettings = () => {
    try {
        const saved = localStorage.getItem(
            SETTINGS_STORAGE_KEY
        );

        if (!saved) {
            return DEFAULT_SETTINGS;
        }

        const parsed = JSON.parse(saved);

        return {
            ...DEFAULT_SETTINGS,
            ...parsed,

            notifications: {
                ...DEFAULT_SETTINGS.notifications,
                ...(parsed.notifications || {}),
            },

            preferences: {
                ...DEFAULT_SETTINGS.preferences,
                ...(parsed.preferences || {}),
            },

            appearance: {
                ...DEFAULT_SETTINGS.appearance,
                ...(parsed.appearance || {}),
            },

            privacy: {
                ...DEFAULT_SETTINGS.privacy,
                ...(parsed.privacy || {}),
            },
        };
    } catch (error) {
        console.error(
            "Failed to load ScholarX settings:",
            error
        );

        return DEFAULT_SETTINGS;
    }
};


const saveStoredSettings = (settings) => {
    try {
        localStorage.setItem(
            SETTINGS_STORAGE_KEY,
            JSON.stringify(settings)
        );

        return true;
    } catch (error) {
        console.error(
            "Failed to save ScholarX settings:",
            error
        );

        return false;
    }
};


// ============================================================
// HELPERS
// ============================================================

const hasValue = (value) =>
    value !== null &&
    value !== undefined &&
    (
        typeof value !== "string" ||
        value.trim() !== ""
    );


const hasFiniteNumber = (value) => {
    if (!hasValue(value)) return false;

    const number = Number(value);

    return Number.isFinite(number);
};


// Your profile form can store GPA as:
// 1. A number
// 2. An object: { gpa: 3.5, scale: 4 }

const getAcademicPerformance = (value) => {
    if (
        value !== null &&
        typeof value === "object"
    ) {
        return value.gpa;
    }

    return value;
};


// Calculate age from dateOfBirth when age is not supplied.

const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const birthDate = new Date(
        `${dateOfBirth}T00:00:00`
    );

    if (Number.isNaN(birthDate.getTime())) {
        return null;
    }

    const today = new Date();

    let age =
        today.getFullYear() -
        birthDate.getFullYear();

    const beforeBirthday =
        today.getMonth() < birthDate.getMonth() ||
        (
            today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate()
        );

    if (beforeBirthday) {
        age -= 1;
    }

    return age >= 0 ? age : null;
};


const getProfileAge = (personal) => {
    if (hasFiniteNumber(personal?.age)) {
        return Number(personal.age);
    }

    return calculateAge(
        personal?.dateOfBirth
    );
};


// Safely read the user stored during authentication.

const getStoredUser = () => {
    try {
        return JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        return {};
    }
};


// Normalize the API response without discarding profile fields.

const normalizeServerProfile = (body) => {
    const serverProfile =
        body?.profile ??
        body?.data ??
        body;

    if (
        !serverProfile ||
        typeof serverProfile !== "object" ||
        Array.isArray(serverProfile)
    ) {
        throw new Error(
            "Invalid profile response from the server."
        );
    }

    const storedUser = getStoredUser();

    return {
        ...EMPTY_PROFILE,
        ...serverProfile,

        personal: {
            ...EMPTY_PROFILE.personal,
            ...(serverProfile.personal || {}),

            name:
                serverProfile.personal?.name ||
                body?.user?.name ||
                storedUser.name ||
                "",

            email:
                serverProfile.personal?.email ||
                body?.user?.email ||
                storedUser.email ||
                "",

            age:
                serverProfile.personal?.age ??
                null,
        },

        academic: {
            ...EMPTY_PROFILE.academic,
            ...(serverProfile.academic || {}),
        },

        english: {
            ...EMPTY_PROFILE.english,
            ...(serverProfile.english || {}),
        },

        preferences: {
            ...EMPTY_PROFILE.preferences,
            ...(serverProfile.preferences || {}),

            annualBudget: {
                ...EMPTY_PROFILE.preferences.annualBudget,

                ...(serverProfile.preferences?.annualBudget || {}),
            },
        },

        experience: {
            ...EMPTY_PROFILE.experience,
            ...(serverProfile.experience || {}),
        },

        additional: {
            ...EMPTY_PROFILE.additional,
            ...(serverProfile.additional || {}),
        },
    };
};


// ============================================================
// DASHBOARD PROVIDER
// ============================================================

export const DashboardProvider = ({ children }) => {

    // ========================================================
    // TIME
    // ========================================================

    const [currentTime, setCurrentTime] = useState(
        () => Date.now()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000);

        return () => clearInterval(interval);
    }, []);


    // ========================================================
    // PROFILE - SINGLE SOURCE OF TRUTH
    // ========================================================

    const [profile, setProfile] = useState(
        EMPTY_PROFILE
    );

    const [profileLoading, setProfileLoading] = useState(
        true
    );

    const [profileError, setProfileError] = useState(
        ""
    );


    // Fetch the authenticated student's profile.

    const loadProfile = useCallback(async ({ signal } = {}) => {
        const token = localStorage.getItem("token");

        if (!token) {
            setProfile(EMPTY_PROFILE);

            setProfileError(
                "Your session has expired. Please log in again."
            );

            setProfileLoading(false);

            return false;
        }

        try {
            setProfileLoading(true);
            setProfileError("");

            const response = await fetch(
                PROFILE_ENDPOINT,
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },

                    signal,
                }
            );

            const body = await response.json().catch(
                () => ({})
            );

            if (!response.ok) {
                throw new Error(
                    body.detail ||
                    body.message ||
                    "Could not load your profile."
                );
            }

            const normalizedProfile =
                normalizeServerProfile(body);

            setProfile(normalizedProfile);

            return true;

        } catch (error) {
            if (error.name === "AbortError") {
                return false;
            }

            console.error(
                "Failed to load dashboard profile:",
                error
            );

            setProfileError(
                error.message ||
                "Could not load your profile."
            );

            return false;

        } finally {
            if (!signal?.aborted) {
                setProfileLoading(false);
            }
        }
    }, []);


    // Load the actual student profile when the provider mounts.

    useEffect(() => {
        const controller = new AbortController();

        Promise.resolve().then(() => {
            if (!controller.signal.aborted) {
                loadProfile({
                    signal: controller.signal,
                });
            }
        });

        return () => {
            controller.abort();
        };
    }, [loadProfile]);


    // All profile updates must go through this function.

    const updateProfile = useCallback((updatedProfile) => {
        if (
            !updatedProfile ||
            typeof updatedProfile !== "object"
        ) {
            console.error(
                "Invalid profile update."
            );

            return;
        }

        setProfile((current) => ({
            ...EMPTY_PROFILE,
            ...current,
            ...updatedProfile,

            personal: {
                ...EMPTY_PROFILE.personal,
                ...current.personal,
                ...(updatedProfile.personal || {}),
            },

            academic: {
                ...EMPTY_PROFILE.academic,
                ...current.academic,
                ...(updatedProfile.academic || {}),
            },

            english: {
                ...EMPTY_PROFILE.english,
                ...current.english,
                ...(updatedProfile.english || {}),
            },

            preferences: {
                ...EMPTY_PROFILE.preferences,
                ...current.preferences,
                ...(updatedProfile.preferences || {}),

                annualBudget: {
                    ...EMPTY_PROFILE.preferences.annualBudget,
                    ...current.preferences?.annualBudget,
                    ...(updatedProfile.preferences?.annualBudget || {}),
                },
            },

            experience: {
                ...EMPTY_PROFILE.experience,
                ...current.experience,
                ...(updatedProfile.experience || {}),
            },

            additional: {
                ...EMPTY_PROFILE.additional,
                ...current.additional,
                ...(updatedProfile.additional || {}),
            },
        }));
    }, []);


    // ========================================================
    // PROFILE COMPLETION
    // ========================================================

    // General profile completion.
    // Kept separate from scholarship analysis readiness.

    const profileCompletion = useMemo(() => {
        return calculateProfileCompletion(profile);
    }, [profile]);

    // ========================================================
    // PROFILE COMPLETION ONBOARDING
    // ========================================================

    const showProfileOnboarding = useMemo(
    () =>
        !profileLoading &&
        profileCompletion.percentage === 0,
    [
        profileLoading,
        profileCompletion.percentage,
    ]
);


    // ========================================================
    // SCHOLARSHIP ANALYSIS READINESS
    // ========================================================

    // These are the SAME 10 checks used by Matches and
    // Eligibility Analysis.

    const profileReadiness = useMemo(() => {

        const academicPerformance =
            getAcademicPerformance(
                profile?.academic?.academicPerformance
            );

        const age = getProfileAge(
            profile?.personal
        );

        const checks = [
            // 1. Nationality
            hasValue(profile?.personal?.nationality),

            // 2. Age / Date of birth
            hasFiniteNumber(age),

            // 3. Study level
            hasValue(profile?.academic?.studyLevel),

            // 4. Completed degrees
            Boolean(
                profile?.academic?.completedDegrees?.length
            ),

            // 5. Field of study
            hasValue(profile?.academic?.fieldOfStudy),

            // 6. Academic performance / GPA
            hasFiniteNumber(academicPerformance),

            // 7. English test
            hasValue(profile?.english?.test),

            // 8. English score
            hasFiniteNumber(profile?.english?.score),

            // 9. Study destination
            hasValue(profile?.preferences?.studyDestination),

            // 10. Annual budget
            hasFiniteNumber(
                profile?.preferences?.annualBudget?.amount
            ),
        ];

        const completed = checks.filter(Boolean).length;

        const total = checks.length;

        const percentage = Math.round(
            (completed / total) * 100
        );

        return {
            completed,
            total,
            percentage,
            isReady: completed === total,
        };

    }, [profile]);


    // ========================================================
    // MATCHES & ELIGIBILITY
    // ========================================================

    // Evaluate scholarships ONLY after the real profile
    // has loaded and all 10 readiness checks are complete.

    const matches = useMemo(() => {
    if (
        profileLoading ||
        profileCompletion.percentage === 0
    ) {
        return [];
    }

    return opportunities.map((opportunity) => {
        const evaluated = analyzeOpportunity(
            opportunity,
            profile
        );

        return {
            opportunity,
            analysis: evaluated.analysis,
        };
    });
}, [
    profile,
    profileLoading,
    profileCompletion.percentage,
]);


    // Both pages receive the SAME analysis results.
    // Matches uses { opportunity, analysis }.
    // Eligibility Analysis uses flattened opportunity data.

    const eligibilityOpportunities = useMemo(() => {

        return matches.map(
            ({ opportunity, analysis }) => ({
                ...opportunity,
                analysis,
            })
        );

    }, [matches]);


    // ========================================================
    // MATCH STATISTICS
    // ========================================================

    const strongMatches = useMemo(() => {
        return matches.filter(
            ({ analysis }) =>
                analysis.status === "strong"
        );
    }, [matches]);


    const reviewMatches = useMemo(() => {
        return matches.filter(
            ({ analysis }) =>
                analysis.status === "review"
        );
    }, [matches]);


    const notEligibleMatches = useMemo(() => {
        return matches.filter(
            ({ analysis }) =>
                analysis.status === "not-eligible"
        );
    }, [matches]);


    const matchStats = useMemo(() => {
        return {
            total: matches.length,

            strong: strongMatches.length,

            review: reviewMatches.length,

            notEligible: notEligibleMatches.length,
        };
    }, [
        matches,
        strongMatches,
        reviewMatches,
        notEligibleMatches,
    ]);


    // ========================================================
    // FAVORITES
    // ========================================================

    const [favorites, setFavorites] = useState(
        () => getFavorites()
    );


    const toggleFavorite = (id) => {
        const updated = toggleStoredFavorite(id);

        setFavorites(updated);

        return updated;
    };


    const removeFavorite = (id) => {
        const updated = removeStoredFavorite(id);

        setFavorites(updated);

        return updated;
    };


    const favoriteMatches = useMemo(() => {

        const favoriteSet = new Set(favorites);

        return matches.filter(
            ({ opportunity }) =>
                favoriteSet.has(opportunity.id)
        );

    }, [matches, favorites]);


    const isFavorite = (id) => {
        return favorites.includes(id);
    };


    // ========================================================
    // APPLICATIONS
    // ========================================================

    const [applications, setApplications] = useState(
        () => getApplications()
    );


    const addApplication = (application) => {
        const updated = addStoredApplication(
            application
        );

        setApplications(updated);

        return updated;
    };


    const removeApplication = (id) => {
        const updated = removeStoredApplication(id);

        setApplications(updated);

        return updated;
    };


    const applicationStats = useMemo(() => {

        return {
            total: applications.length,

            active: applications.filter(
                (app) =>
                    app.status === "planning" ||
                    app.status === "applying"
            ).length,

            submitted: applications.filter(
                (app) =>
                    app.status === "submitted"
            ).length,

            underReview: applications.filter(
                (app) =>
                    app.status === "under-review"
            ).length,

            accepted: applications.filter(
                (app) =>
                    app.status === "accepted"
            ).length,
        };

    }, [applications]);


    // ========================================================
    // DEADLINES
    // ========================================================

    const deadlines = useMemo(() => {

        return opportunities
            .map((opportunity) => {

                const date = new Date(
                    `${opportunity.deadline}T23:59:59`
                );

                if (Number.isNaN(date.getTime())) {
                    return null;
                }

                const daysRemaining = Math.ceil(
                    (
                        date.getTime() -
                        currentTime
                    ) /
                    (1000 * 60 * 60 * 24)
                );

                return {
                    opportunity,
                    deadlineDate: date,
                    daysRemaining,
                };
            })
            .filter(
                (item) =>
                    item &&
                    item.daysRemaining >= 0
            )
            .sort(
                (a, b) =>
                    a.deadlineDate - b.deadlineDate
            );

    }, [currentTime]);


    // ========================================================
    // DOCUMENTS
    // ========================================================

    const [documents, setDocuments] = useState(
        () => getDocumentMetadata()
    );


    const [customDocuments, setCustomDocuments] = useState(
        () => getCustomDocuments()
    );


    const addDocument = async (documentData, file) => {

        const updated = await addStoredDocument(
            documentData,
            file
        );

        const savedDocuments = await getStudentDocuments();
        const updated = normalizeDocuments(savedDocuments);
        setDocuments(updated);

        return updated;
    };


    const removeChecklistDocument = async (checklistId) => {

        const updated =
            await removeStoredChecklistDocument(
                checklistId
            );

        setDocuments(updated);

        return updated;
    };


    const addCustomDocument = (document) => {

        const updated =
            addStoredCustomDocument(document);

        setCustomDocuments(updated);

        return updated;
    };


    // ========================================================
    // SETTINGS
    // ========================================================

    const [settings, setSettings] = useState(
        () => loadSettings()
    );


    const [
        hasSettingsChanges,
        setHasSettingsChanges,
    ] = useState(false);


    const updateSettings = (
        section,
        key,
        value
    ) => {

        setSettings((current) => ({
            ...current,

            [section]: {
                ...current[section],
                [key]: value,
            },
        }));

        setHasSettingsChanges(true);
    };


    const saveSettings = () => {

        const success = saveStoredSettings(
            settings
        );

        if (success) {
            setHasSettingsChanges(false);
        }

        return success;
    };


    const resetSettings = () => {

        const freshSettings = {
            ...DEFAULT_SETTINGS,

            notifications: {
                ...DEFAULT_SETTINGS.notifications,
            },

            preferences: {
                ...DEFAULT_SETTINGS.preferences,
            },

            appearance: {
                ...DEFAULT_SETTINGS.appearance,
            },

            privacy: {
                ...DEFAULT_SETTINGS.privacy,
            },
        };

        setSettings(freshSettings);

        saveStoredSettings(freshSettings);

        setHasSettingsChanges(false);
    };


    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    const [notifications, setNotifications] = useState([
        {
            id: "notification-match-1",
            type: "match",
            title: "New scholarship match",
            message:
                "A scholarship opportunity has been matched to your profile.",
            time: "2 hours ago",
            unread: true,
            link: "/dashboard/matches",
        },
        {
            id: "notification-deadline-1",
            type: "deadline",
            title: "Scholarship deadline approaching",
            message:
                "One of your matched scholarship opportunities has an upcoming deadline.",
            time: "1 day ago",
            unread: true,
            link: "/dashboard/deadlines",
        },
        {
            id: "notification-application-1",
            type: "application",
            title: "Application update",
            message:
                "Your scholarship application status has been updated.",
            time: "2 days ago",
            unread: false,
            link: "/dashboard/applications",
        },
        {
            id: "notification-profile-1",
            type: "profile",
            title: "Complete your profile",
            message:
                "Complete more of your profile to improve your scholarship matches.",
            time: "3 days ago",
            unread: true,
            link: "/dashboard/profile",
        },
    ]);


    const markNotificationRead = (notificationId) => {

        setNotifications((current) =>
            current.map((notification) =>
                notification.id === notificationId
                    ? {
                        ...notification,
                        unread: false,
                    }
                    : notification
            )
        );
    };


    const markAllNotificationsRead = () => {

        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                unread: false,
            }))
        );
    };


    const addNotification = (notification) => {

        const newNotification = {
            id:
                notification.id ||
                `notification-${Date.now()}`,

            type: notification.type || "general",

            title:
                notification.title ||
                "New notification",

            message: notification.message || "",

            time: notification.time || "Just now",

            unread: notification.unread ?? true,

            link:
                notification.link ||
                "/dashboard/notifications",
        };

        setNotifications((current) => [
            newNotification,
            ...current,
        ]);
    };


    // ========================================================
    // DASHBOARD STATISTICS
    // ========================================================

    const dashboardStats = useMemo(() => {

        return {
            matches: matches.length,

            favorites: favorites.length,

            applications: applications.length,

            upcomingDeadlines: deadlines.length,
        };

    }, [
        matches,
        favorites,
        applications,
        deadlines,
    ]);


    // ========================================================
    // PROVIDER
    // ========================================================

    return (
        <DashboardContext.Provider
            value={{

                // Profile
                profile,
                updateProfile,
                loadProfile,
                profileLoading,
                profileError,
                profileCompletion,
                profileReadiness,
                showProfileOnboarding,

                // Opportunities
                opportunities,

                // Matches & Eligibility
                matches,
                strongMatches,
                reviewMatches,
                notEligibleMatches,
                matchStats,
                eligibilityOpportunities,

                // Favorites
                favorites,
                favoriteMatches,
                isFavorite,
                toggleFavorite,
                removeFavorite,

                // Applications
                applications,
                addApplication,
                removeApplication,
                applicationStats,

                // Deadlines
                deadlines,

                // Documents
                documents,
                documentsLoading,
                addDocument,
                removeChecklistDocument,

                // Settings
                settings,
                hasSettingsChanges,
                updateSettings,
                saveSettings,
                resetSettings,

                // Notifications
                notifications,
                markNotificationRead,
                markAllNotificationsRead,
                addNotification,

                // Dashboard
                dashboardStats,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};
