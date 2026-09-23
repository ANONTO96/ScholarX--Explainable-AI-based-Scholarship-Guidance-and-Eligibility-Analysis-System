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
    getDocumentMetadata,
    addDocument as addStoredDocument,
    addCustomDocument as addStoredCustomDocument,
    getCustomDocuments,
    removeChecklistDocument as removeStoredChecklistDocument,
} from "../../data/documents";


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
            profile.preferences?.annualBudget?.amount !== undefined,
        ];

        const completed = checks.filter(Boolean).length;
        const total = checks.length;

        return {
            completed,
            total,
            percentage: Math.round(
                (completed / total) * 100
            ),
        };
    }, [profile]);

    // =========================
    // Matches
    // =========================

    const matches = useMemo(() => {
        return (opportunities || []).map((opportunity) => {
            const evaluated = analyzeOpportunity(
                opportunity,
                profile
            );

            return {
                opportunity,
                analysis: evaluated.analysis,
            };
        });
    }, [profile]);

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
                customDocuments,
                addDocument,
                removeChecklistDocument,
                addCustomDocument,

                // Settings
                settings,
                hasSettingsChanges,
                updateSettings,
                saveSettings,
                resetSettings,

                // Dashboard
                dashboardStats,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};