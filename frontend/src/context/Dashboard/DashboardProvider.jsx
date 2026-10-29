import { useEffect, useMemo, useState } from "react";

import { DashboardContext } from "./DashboardContext";

import opportunities from "../../data/opportunities.json";

import { studentProfile } from "../../data/studentProfile";

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
    getStudentDocuments,
    saveStudentDocument,
    deleteStudentDocument,
} from "../../data/studentDocuments";


// =========================
// Settings
// =========================

const SETTINGS_STORAGE_KEY =
    "scholarx-settings";

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
        const saved =
            localStorage.getItem(
                SETTINGS_STORAGE_KEY
            );

        if (!saved) {
            return DEFAULT_SETTINGS;
        }

        const parsed =
            JSON.parse(saved);

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

// =========================
// Helpers
// =========================

const hasValue = (value) =>
    value !== null &&
    value !== undefined &&
    (typeof value !== "string" || value.trim() !== "");

const hasFiniteNumber = (value) => {
    if (!hasValue(value)) return false;

    const number = Number(value);

    return Number.isFinite(number);
};


export const DashboardProvider = ({ children }) => {
    const [currentTime, setCurrentTime] = useState(() =>
        new Date().getTime()
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date().getTime());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    // =========================
    // Notifications
    // =========================

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
            title: notification.title || "New notification",
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

    // =========================
    // Profile
    // =========================

    const [profile, setProfile] = useState(studentProfile);

    const updateProfile = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    const profileCompletion = useMemo(() => {
        return calculateProfileCompletion(profile);
    }, [profile]);

    
const profileReadiness = useMemo(() => {
    // These fields are relevant to scholarship comparison.
    // Name and email remain part of profile completion,
    // but they do not block eligibility analysis.
    const checks = [
        hasValue(profile?.personal?.nationality),
        hasFiniteNumber(profile?.personal?.age),

        hasValue(profile?.academic?.studyLevel),
        Boolean(profile?.academic?.completedDegrees?.length),
        hasValue(profile?.academic?.fieldOfStudy),
        hasFiniteNumber(
            profile?.academic?.academicPerformance
        ),

        hasValue(profile?.english?.test),
        hasFiniteNumber(profile?.english?.score),

        hasValue(profile?.preferences?.studyDestination),
        hasFiniteNumber(
            profile?.preferences?.annualBudget?.amount
        ),
    ];

    const completed = checks.filter(Boolean).length;
    const total = checks.length;

    return {
        completed,
        total,
        percentage: Math.round((completed / total) * 100),
        isReady: checks.every(Boolean),
    };
}, [profile]);


    // =========================
// Matches & Eligibility
// =========================

const matches = useMemo(() => {
    if (!profileReadiness.isReady) {
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
}, [profile, profileReadiness.isReady]);

    // Full eligibility-analysis records shared by both dashboard pages.
    // Matches keeps its existing { opportunity, analysis } shape; this
    // flattened shape preserves the data contract used by EligibilityAnalysis.
    const eligibilityOpportunities = useMemo(() => {
        return matches.map(({ opportunity, analysis }) => ({
            ...opportunity,
            analysis,
        }));
    }, [matches]);

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

    // =========================
    // Favorites
    // =========================

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

        return matches.filter(({ opportunity }) =>
            favoriteSet.has(opportunity.id)
        );
    }, [matches, favorites]);

    const isFavorite = (id) => {
        return favorites.includes(id);
    };

    // =========================
    // Applications
    // =========================

    const [applications, setApplications] = useState(
        () => getApplications()
    );

    const addApplication = (application) => {
        const updated = addStoredApplication(application);

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

    // =========================
    // Deadlines
    // =========================

    const deadlines = useMemo(() => {
        return (opportunities || [])
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

    // =========================
    // Documents
    // =========================

    const [documents, setDocuments] = useState([]);
    const [documentsLoading, setDocumentsLoading] = useState(true);

    const normalizeDocuments = (items = []) =>
        items.map((item) => ({
            ...item,
            id: item.id,
            checklistId: item.checklist_id ?? item.checklistId,
            fileName: item.original_filename ?? item.fileName ?? null,
            fileSize: item.file_size_bytes ?? item.fileSize ?? null,
            uploaded: Boolean(item.has_document ?? item.hasDocument ?? item.uploaded),
            hasDocument: Boolean(item.has_document ?? item.hasDocument ?? item.uploaded),
        }));

    useEffect(() => {
        let cancelled = false;

        const loadDocuments = async () => {
            try {
                const savedDocuments = await getStudentDocuments();

                if (!cancelled) {
                    setDocuments(normalizeDocuments(savedDocuments));
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load student documents:", error);
                }
            } finally {
                if (!cancelled) {
                    setDocumentsLoading(false);
                }
            }
        };

        loadDocuments();

        return () => {
            cancelled = true;
        };
    }, []);

    const addDocument = async (documentData, file = null) => {
        const checklistId =
            documentData.checklistId ?? documentData.checklist_id;

        if (!checklistId) {
            throw new Error("A document checklist ID is required.");
        }

        const hasDocument = file
            ? true
            : Boolean(
                documentData.hasDocument ??
                documentData.has_document ??
                documentData.uploaded ??
                true
            );

        await saveStudentDocument({
            checklistId,
            hasDocument,
            file,
        });

        const savedDocuments = await getStudentDocuments();
        const updated = normalizeDocuments(savedDocuments);
        setDocuments(updated);

        return updated;
    };

    const removeChecklistDocument = async (checklistId) => {
        await deleteStudentDocument(checklistId);

        setDocuments((current) =>
            current.filter(
                (document) =>
                    document.checklistId !== checklistId &&
                    document.checklist_id !== checklistId
            )
        );
    };

    // =========================
    // Settings
    // =========================

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
        const success =
            saveStoredSettings(settings);

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

        saveStoredSettings(
            freshSettings
        );

        setHasSettingsChanges(false);
    };

    // =========================
    // Dashboard Stats
    // =========================

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

    // =========================
    // Provider
    // =========================

    return (
        <DashboardContext.Provider
            value={{
                // Profile
                profile,
                updateProfile,
                profileCompletion,
                profileReadiness,

                // Opportunities
                opportunities,

                // Matches
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