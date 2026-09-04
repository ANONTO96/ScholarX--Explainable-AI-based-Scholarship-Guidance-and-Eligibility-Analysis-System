import {
    Bell,
    Check,
    ChevronRight,
    CircleHelp,
    Clock3,
    Eye,
    FolderOpen,
    Globe2,
    GraduationCap,
    KeyRound,
    Laptop,
    Lock,
    Mail,
    Moon,
    Palette,
    Save,
    ShieldCheck,
    Sparkles,
    Sun,
    Trash2,
    UserRound,
    WalletCards,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import toast from "react-hot-toast";

/* ========================================================= */
/* Constants                                                   */
/* ========================================================= */

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

/* ========================================================= */
/* Helpers                                                     */
/* ========================================================= */

function loadSettings() {
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
}

function saveSettings(settings) {
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
}

/* ========================================================= */
/* Section Header                                               */
/* ========================================================= */

function SectionHeader({
    icon: Icon,
    title,
    description,
}) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-sky-50
                    text-sky-600
                "
            >
                <Icon className="h-5 w-5" />
            </div>

            <div>
                <h2 className="text-sm font-bold text-slate-900">
                    {title}
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    );
}

/* ========================================================= */
/* Toggle                                                       */
/* ========================================================= */

function Toggle({
    checked,
    onChange,
}) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() =>
                onChange(!checked)
            }
            className={`
                relative
                h-6
                w-11
                shrink-0
                rounded-full
                transition
                ${
                    checked
                        ? "bg-sky-500"
                        : "bg-slate-200"
                }
            `}
        >
            <span
                className={`
                    absolute
                    top-1/2
                    h-4
                    w-4
                    -translate-y-1/2
                    rounded-full
                    bg-white
                    shadow-sm
                    transition-all
                    ${
                        checked
                            ? "left-6"
                            : "left-1"
                    }
                `}
            />
        </button>
    );
}

/* ========================================================= */
/* Setting Row                                                  */
/* ========================================================= */

function SettingRow({
    icon: Icon,
    title,
    description,
    children,
    last = false,
}) {
    return (
        <div
            className={`
                flex
                items-center
                justify-between
                gap-4
                py-4
                ${
                    !last
                        ? "border-b border-slate-100"
                        : ""
                }
            `}
        >
            <div className="flex min-w-0 items-center gap-3">
                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-50
                        text-slate-500
                    "
                >
                    <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800">
                        {title}
                    </p>

                    <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                        {description}
                    </p>
                </div>
            </div>

            <div className="shrink-0">
                {children}
            </div>
        </div>
    );
}

/* ========================================================= */
/* Select                                                       */
/* ========================================================= */

function SettingsSelect({
    value,
    onChange,
    children,
}) {
    return (
        <select
            value={value}
            onChange={(event) =>
                onChange(
                    event.target.value
                )
            }
            className="
                h-9
                min-w-32
                rounded-lg
                border
                border-slate-200
                bg-white
                px-3
                text-[11px]
                font-semibold
                text-slate-700
                outline-none
                transition
                focus:border-sky-400
                focus:ring-4
                focus:ring-sky-100
            "
        >
            {children}
        </select>
    );
}

/* ========================================================= */
/* Theme Option                                                 */
/* ========================================================= */

function ThemeOption({
    value,
    current,
    icon: Icon,
    label,
    description,
    onClick,
}) {
    const active =
        value === current;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                flex
                min-h-24
                flex-1
                flex-col
                items-start
                rounded-xl
                border
                p-3
                text-left
                transition
                ${
                    active
                        ? "border-sky-400 bg-sky-50 ring-2 ring-sky-100"
                        : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/40"
                }
            `}
        >
            <div className="flex w-full items-center justify-between">
                <div
                    className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        ${
                            active
                                ? "bg-sky-500 text-white"
                                : "bg-slate-50 text-slate-500"
                        }
                    `}
                >
                    <Icon className="h-4 w-4" />
                </div>

                {active && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white">
                        <Check className="h-3 w-3" />
                    </div>
                )}
            </div>

            <p className="mt-3 text-[11px] font-bold text-slate-800">
                {label}
            </p>

            <p className="mt-0.5 text-[9px] leading-4 text-slate-400">
                {description}
            </p>
        </button>
    );
}

/* ========================================================= */
/* Danger Modal                                                 */
/* ========================================================= */

function DangerModal({
    onClose,
    onConfirm,
}) {
    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-slate-950/40
                p-4
                backdrop-blur-sm
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-6
                    shadow-2xl
                "
            >
                <div className="flex items-start gap-3">
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-rose-50
                            text-rose-500
                        "
                    >
                        <Trash2 className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-bold text-slate-900">
                            Reset ScholarX settings?
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            This will restore your
                            notification, privacy,
                            appearance, and preference
                            settings to their defaults.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-slate-100
                            hover:text-slate-700
                        "
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            h-10
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            text-xs
                            font-bold
                            text-slate-600
                            transition
                            hover:bg-slate-50
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-xl
                            bg-rose-500
                            px-4
                            text-xs
                            font-bold
                            text-white
                            transition
                            hover:bg-rose-600
                        "
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Reset Settings
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ========================================================= */
/* Main Settings Page                                           */
/* ========================================================= */

export default function Settings() {
    const [
        settings,
        setSettings,
    ] = useState(() =>
        loadSettings()
    );

    const [
        hasChanges,
        setHasChanges,
    ] = useState(false);

    const [
        showResetModal,
        setShowResetModal,
    ] = useState(false);

    useEffect(() => {
        document.title =
            "Settings | ScholarX";

        return () => {
            document.title =
                "ScholarX";
        };
    }, []);

    /* ===================================================== */
    /* Update Helpers                                         */
    /* ===================================================== */

    const updateNotification =
        (key, value) => {
            setSettings((current) => ({
                ...current,
                notifications: {
                    ...current.notifications,
                    [key]: value,
                },
            }));

            setHasChanges(true);
        };

    const updatePreference =
        (key, value) => {
            setSettings((current) => ({
                ...current,
                preferences: {
                    ...current.preferences,
                    [key]: value,
                },
            }));

            setHasChanges(true);
        };

    const updateAppearance =
        (key, value) => {
            setSettings((current) => ({
                ...current,
                appearance: {
                    ...current.appearance,
                    [key]: value,
                },
            }));

            setHasChanges(true);
        };

    const updatePrivacy =
        (key, value) => {
            setSettings((current) => ({
                ...current,
                privacy: {
                    ...current.privacy,
                    [key]: value,
                },
            }));

            setHasChanges(true);
        };

    /* ===================================================== */
    /* Save                                                   */
    /* ===================================================== */

    const handleSave = () => {
        const success =
            saveSettings(settings);

        if (!success) {
            toast.error(
                "Could not save your settings."
            );

            return;
        }

        setHasChanges(false);

        toast.success(
            "Settings saved successfully."
        );
    };

    /* ===================================================== */
    /* Reset                                                  */
    /* ===================================================== */

    const handleReset = () => {
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

        setSettings(
            freshSettings
        );

        saveSettings(
            freshSettings
        );

        setHasChanges(false);
        setShowResetModal(false);

        toast.success(
            "Settings restored to default."
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/70">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

                {/* ================================================= */}
                {/* Header                                             */}
                {/* ================================================= */}

                <div
                    className="
                        relative
                        overflow-hidden
                        rounded-3xl
                        border
                        border-sky-100
                        bg-linear-to-br
                        from-sky-50
                        via-white
                        to-blue-50
                        p-6
                        shadow-sm
                    "
                >
                    <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div className="flex items-start gap-4">
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-500
                                    text-white
                                    shadow-sm
                                    shadow-sky-200
                                "
                            >
                                <Sparkles className="h-5 w-5" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                                        Account Settings
                                    </p>

                                    {hasChanges && (
                                        <span
                                            className="
                                                rounded-full
                                                bg-amber-50
                                                px-2
                                                py-1
                                                text-[8px]
                                                font-bold
                                                uppercase
                                                tracking-wide
                                                text-amber-600
                                            "
                                        >
                                            Unsaved changes
                                        </span>
                                    )}
                                </div>

                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                    Manage your ScholarX experience
                                </h1>

                                <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
                                    Control your application
                                    preferences, notifications,
                                    privacy, and account
                                    experience from one place.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className={`
                                inline-flex
                                h-10
                                shrink-0
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                px-4
                                text-xs
                                font-bold
                                shadow-sm
                                transition
                                ${
                                    hasChanges
                                        ? "bg-sky-500 text-white shadow-sky-200 hover:bg-sky-600"
                                        : "cursor-not-allowed bg-slate-100 text-slate-400"
                                }
                            `}
                        >
                            <Save className="h-3.5 w-3.5" />
                            Save Changes
                        </button>
                    </div>

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-20
                            -top-20
                            h-56
                            w-56
                            rounded-full
                            bg-sky-200/30
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-20
                            right-24
                            h-44
                            w-44
                            rounded-full
                            bg-blue-200/30
                            blur-3xl
                        "
                    />
                </div>

                {/* ================================================= */}
                {/* Quick Profile Card                                */}
                {/* ================================================= */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-sky-50
                                    text-sky-600
                                "
                            >
                                <UserRound className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Student Account
                                </p>

                                <h2 className="mt-1 text-sm font-bold text-slate-900">
                                    Student Profile
                                </h2>

                                <p className="mt-0.5 text-[10px] text-slate-400">
                                    Manage your personal and
                                    academic information.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                toast(
                                    "Profile editing is managed from your Student Profile page."
                                )
                            }
                            className="
                                inline-flex
                                h-9
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-[10px]
                                font-bold
                                text-slate-600
                                transition
                                hover:border-sky-200
                                hover:bg-sky-50
                                hover:text-sky-600
                            "
                        >
                            <UserRound className="h-3.5 w-3.5" />
                            Edit Profile
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-4">
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                Study Level
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-800">
                                Master
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                Field
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-800">
                                Computer Science
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                Country
                            </p>
                            <p className="mt-1 text-xs font-bold text-slate-800">
                                Bangladesh
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-400">
                                Account
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <Check className="h-3 w-3" />
                                Active
                            </p>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* Main Grid                                          */}
                {/* ================================================= */}

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* ================================================= */}
                    {/* Notifications                                    */}
                    {/* ================================================= */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <SectionHeader
                            icon={Bell}
                            title="Notifications"
                            description="Choose which ScholarX updates you want to receive."
                        />

                        <div className="mt-4">
                            <SettingRow
                                icon={Clock3}
                                title="Application deadlines"
                                description="Get reminders before important deadlines."
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .applicationDeadlines
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "applicationDeadlines",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>

                            <SettingRow
                                icon={GraduationCap}
                                title="Scholarship updates"
                                description="Receive updates about relevant opportunities."
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .scholarshipUpdates
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "scholarshipUpdates",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>

                            <SettingRow
                                icon={FolderOpen}
                                title="Document reminders"
                                description="Be reminded when application documents are incomplete."
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .documentReminders
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "documentReminders",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>

                            <SettingRow
                                icon={Sparkles}
                                title="Eligibility updates"
                                description="Receive important changes to your eligibility results."
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .eligibilityUpdates
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "eligibilityUpdates",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>

                            <SettingRow
                                icon={Mail}
                                title="Email notifications"
                                description="Allow ScholarX to send important account emails."
                                last
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .notifications
                                            .emailNotifications
                                    }
                                    onChange={(value) =>
                                        updateNotification(
                                            "emailNotifications",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>
                        </div>
                    </section>

                    {/* ================================================= */}
                    {/* Application Preferences                           */}
                    {/* ================================================= */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <SectionHeader
                            icon={Globe2}
                            title="Application Preferences"
                            description="Customize how scholarship information is displayed."
                        />

                        <div className="mt-4">
                            <SettingRow
                                icon={Globe2}
                                title="Language"
                                description="Choose the language used throughout ScholarX."
                            >
                                <SettingsSelect
                                    value={
                                        settings
                                            .preferences
                                            .language
                                    }
                                    onChange={(value) =>
                                        updatePreference(
                                            "language",
                                            value
                                        )
                                    }
                                >
                                    <option value="English">
                                        English
                                    </option>
                                    <option value="Bengali">
                                        বাংলা
                                    </option>
                                </SettingsSelect>
                            </SettingRow>

                            <SettingRow
                                icon={WalletCards}
                                title="Currency"
                                description="Used for budgets, fees and financial information."
                            >
                                <SettingsSelect
                                    value={
                                        settings
                                            .preferences
                                            .currency
                                    }
                                    onChange={(value) =>
                                        updatePreference(
                                            "currency",
                                            value
                                        )
                                    }
                                >
                                    <option value="USD">
                                        USD ($)
                                    </option>
                                    <option value="BDT">
                                        BDT (৳)
                                    </option>
                                    <option value="EUR">
                                        EUR (€)
                                    </option>
                                    <option value="GBP">
                                        GBP (£)
                                    </option>
                                </SettingsSelect>
                            </SettingRow>

                            <SettingRow
                                icon={Globe2}
                                title="Timezone"
                                description="Used when displaying deadlines and reminders."
                                last
                            >
                                <SettingsSelect
                                    value={
                                        settings
                                            .preferences
                                            .timezone
                                    }
                                    onChange={(value) =>
                                        updatePreference(
                                            "timezone",
                                            value
                                        )
                                    }
                                >
                                    <option value="Asia/Dhaka">
                                        Dhaka
                                    </option>
                                    <option value="Asia/Kolkata">
                                        Kolkata
                                    </option>
                                    <option value="Europe/London">
                                        London
                                    </option>
                                    <option value="America/New_York">
                                        New York
                                    </option>
                                    <option value="America/Los_Angeles">
                                        Los Angeles
                                    </option>
                                </SettingsSelect>
                            </SettingRow>
                        </div>
                    </section>

                    {/* ================================================= */}
                    {/* Appearance                                       */}
                    {/* ================================================= */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <SectionHeader
                            icon={Palette}
                            title="Appearance"
                            description="Choose how ScholarX should look on your device."
                        />

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <ThemeOption
                                value="light"
                                current={
                                    settings
                                        .appearance
                                        .theme
                                }
                                icon={Sun}
                                label="Light"
                                description="Use the light ScholarX interface."
                                onClick={() =>
                                    updateAppearance(
                                        "theme",
                                        "light"
                                    )
                                }
                            />

                            <ThemeOption
                                value="dark"
                                current={
                                    settings
                                        .appearance
                                        .theme
                                }
                                icon={Moon}
                                label="Dark"
                                description="Use a darker interface."
                                onClick={() =>
                                    updateAppearance(
                                        "theme",
                                        "dark"
                                    )
                                }
                            />

                            <ThemeOption
                                value="system"
                                current={
                                    settings
                                        .appearance
                                        .theme
                                }
                                icon={Laptop}
                                label="System"
                                description="Follow your device preference."
                                onClick={() =>
                                    updateAppearance(
                                        "theme",
                                        "system"
                                    )
                                }
                            />
                        </div>

                        <div
                            className="
                                mt-4
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-sky-100
                                bg-sky-50/60
                                p-3
                            "
                        >
                            <Palette className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />

                            <p className="text-[10px] leading-5 text-slate-500">
                                ScholarX currently uses its
                                sky-blue visual system.
                                Theme selection is saved
                                locally for this browser.
                            </p>
                        </div>
                    </section>

                    {/* ================================================= */}
                    {/* Privacy & Security                               */}
                    {/* ================================================= */}

                    <section
                        className="
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-5
                            shadow-sm
                        "
                    >
                        <SectionHeader
                            icon={ShieldCheck}
                            title="Privacy & Security"
                            description="Control how your information is used and displayed."
                        />

                        <div className="mt-4">
                            <SettingRow
                                icon={Eye}
                                title="Profile visibility"
                                description="Control whether other ScholarX features can use your profile."
                            >
                                <SettingsSelect
                                    value={
                                        settings
                                            .privacy
                                            .profileVisibility
                                    }
                                    onChange={(value) =>
                                        updatePrivacy(
                                            "profileVisibility",
                                            value
                                        )
                                    }
                                >
                                    <option value="private">
                                        Private
                                    </option>
                                    <option value="limited">
                                        Limited
                                    </option>
                                </SettingsSelect>
                            </SettingRow>

                            <SettingRow
                                icon={Sparkles}
                                title="Personalized recommendations"
                                description="Use your profile to improve scholarship recommendations."
                                last
                            >
                                <Toggle
                                    checked={
                                        settings
                                            .privacy
                                            .personalizedRecommendations
                                    }
                                    onChange={(value) =>
                                        updatePrivacy(
                                            "personalizedRecommendations",
                                            value
                                        )
                                    }
                                />
                            </SettingRow>
                        </div>
                    </section>
                </div>

                {/* ================================================= */}
                {/* Security Actions                                  */}
                {/* ================================================= */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    <SectionHeader
                        icon={Lock}
                        title="Account & Security"
                        description="Manage access to your ScholarX account."
                    />

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() =>
                                toast(
                                    "Password management will be available when authentication is connected."
                                )
                            }
                            className="
                                group
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-slate-200
                                p-4
                                text-left
                                transition
                                hover:border-sky-200
                                hover:bg-sky-50/40
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-slate-50
                                        text-slate-500
                                    "
                                >
                                    <KeyRound className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        Change Password
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        Update your account password.
                                    </p>
                                </div>
                            </div>

                            <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:text-sky-500" />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                toast(
                                    "Two-factor authentication can be connected when authentication is implemented."
                                )
                            }
                            className="
                                group
                                flex
                                items-center
                                justify-between
                                rounded-xl
                                border
                                border-slate-200
                                p-4
                                text-left
                                transition
                                hover:border-sky-200
                                hover:bg-sky-50/40
                            "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-emerald-50
                                        text-emerald-600
                                    "
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-bold text-slate-800">
                                        Two-Factor Authentication
                                    </p>

                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        Add an extra layer of security.
                                    </p>
                                </div>
                            </div>

                            <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:text-sky-500" />
                        </button>
                    </div>
                </section>

                {/* ================================================= */}
                {/* Help & Support                                    */}
                {/* ================================================= */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-sky-100
                        bg-sky-50/70
                        p-5
                    "
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white
                                    text-sky-600
                                    shadow-sm
                                "
                            >
                                <CircleHelp className="h-5 w-5" />
                            </div>

                            <div>
                                <h2 className="text-xs font-bold text-slate-800">
                                    Need help with ScholarX?
                                </h2>

                                <p className="mt-1 max-w-xl text-[10px] leading-5 text-slate-500">
                                    If something isn't working
                                    correctly, contact support
                                    or report an issue so we
                                    can help.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                toast(
                                    "Support can be connected to your Book Consultation or Report Issue page."
                                )
                            }
                            className="
                                inline-flex
                                h-9
                                shrink-0
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                bg-white
                                px-3
                                text-[10px]
                                font-bold
                                text-sky-600
                                shadow-sm
                                transition
                                hover:bg-sky-100
                            "
                        >
                            Contact Support
                            <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </section>

                {/* ================================================= */}
                {/* Reset Settings                                    */}
                {/* ================================================= */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-rose-100
                        bg-white
                        p-5
                        shadow-sm
                    "
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-rose-50
                                    text-rose-500
                                "
                            >
                                <Trash2 className="h-4 w-4" />
                            </div>

                            <div>
                                <h2 className="text-xs font-bold text-slate-800">
                                    Reset Settings
                                </h2>

                                <p className="mt-1 text-[10px] leading-5 text-slate-400">
                                    Restore all settings on
                                    this page to their default
                                    values.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowResetModal(
                                    true
                                )
                            }
                            className="
                                inline-flex
                                h-9
                                shrink-0
                                items-center
                                justify-center
                                gap-1.5
                                rounded-lg
                                border
                                border-rose-200
                                bg-rose-50
                                px-3
                                text-[10px]
                                font-bold
                                text-rose-500
                                transition
                                hover:bg-rose-100
                            "
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Reset
                        </button>
                    </div>
                </section>

                {/* ================================================= */}
                {/* Footer                                             */}
                {/* ================================================= */}

                <div className="mt-6 flex flex-col items-center justify-between gap-2 pb-4 text-center sm:flex-row sm:text-left">
                    <p className="text-[9px] font-medium text-slate-400">
                        ScholarX Settings
                    </p>

                    <div className="flex items-center gap-2 text-[9px] text-slate-400">
                        <Lock className="h-3 w-3" />
                        Your preferences are stored locally.
                    </div>
                </div>
            </div>

            {/* ===================================================== */}
            {/* Reset Modal                                           */}
            {/* ===================================================== */}

            {showResetModal && (
                <DangerModal
                    onClose={() =>
                        setShowResetModal(
                            false
                        )
                    }
                    onConfirm={
                        handleReset
                    }
                />
            )}
        </div>
    );
}