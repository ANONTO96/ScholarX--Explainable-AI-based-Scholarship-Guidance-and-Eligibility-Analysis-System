import {
    AlertCircle,
    Award,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    Clock3,
    ExternalLink,
    FileText,
    Globe2,
    GraduationCap,
    Link2,
    Mail,
    MapPin,
    NotebookPen,
    Plus,
    Trash2,
    University,
    X,
    XCircle,
} from "lucide-react";

import { useMemo, useState } from "react";

import {
    addApplication,
    getApplications,
    removeApplication,
} from "../../data/applications";


/* ========================================================= */
/* STATUS CONFIG                                              */
/* ========================================================= */

const STATUS_CONFIG = {
    planning: {
        label: "Planning",
        icon: NotebookPen,
        badge:
            "border-slate-200 bg-slate-50 text-slate-600",
        iconBg:
            "bg-slate-100 text-slate-600",
    },

    applying: {
        label: "Applying",
        icon: Clock3,
        badge:
            "border-sky-200 bg-sky-50 text-sky-700",
        iconBg:
            "bg-sky-100 text-sky-600",
    },

    submitted: {
        label: "Submitted",
        icon: CheckCircle2,
        badge:
            "border-indigo-200 bg-indigo-50 text-indigo-700",
        iconBg:
            "bg-indigo-100 text-indigo-600",
    },

    "under-review": {
        label: "Under Review",
        icon: AlertCircle,
        badge:
            "border-amber-200 bg-amber-50 text-amber-700",
        iconBg:
            "bg-amber-100 text-amber-600",
    },

    accepted: {
        label: "Accepted",
        icon: CheckCircle2,
        badge:
            "border-emerald-200 bg-emerald-50 text-emerald-700",
        iconBg:
            "bg-emerald-100 text-emerald-600",
    },

    rejected: {
        label: "Rejected",
        icon: XCircle,
        badge:
            "border-rose-200 bg-rose-50 text-rose-700",
        iconBg:
            "bg-rose-100 text-rose-600",
    },

    withdrawn: {
        label: "Withdrawn",
        icon: X,
        badge:
            "border-slate-200 bg-slate-50 text-slate-500",
        iconBg:
            "bg-slate-100 text-slate-500",
    },
};


/* ========================================================= */
/* INITIAL FORM                                               */
/* ========================================================= */

const INITIAL_FORM = {
    scholarshipName: "",
    university: "",
    provider: "",
    country: "",
    city: "",

    degree: "",
    fieldOfStudy: "",
    intake: "",

    applicationPortal: "",
    applicationId: "",

    applicationDate: "",
    deadline: "",

    status: "applying",

    funding: "",
    applicationFee: "",
    feeCurrency: "USD",

    contactName: "",
    contactEmail: "",
    contactPhone: "",

    documents: "",
    notes: "",

    followUpDate: "",
};


/* ========================================================= */
/* HELPERS                                                    */
/* ========================================================= */

function formatDate(date) {
    if (!date) {
        return "Not specified";
    }

    const parsed = new Date(
        `${date}T00:00:00`
    );

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "Not specified";
    }

    return parsed.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );
}


function formatDateTime(date) {
    if (!date) {
        return "Not specified";
    }

    const parsed = new Date(date);

    if (
        Number.isNaN(
            parsed.getTime()
        )
    ) {
        return "Not specified";
    }

    return parsed.toLocaleString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );
}


function getDaysLeft(date) {
    if (!date) {
        return null;
    }

    const deadline = new Date(
        `${date}T00:00:00`
    );

    if (
        Number.isNaN(
            deadline.getTime()
        )
    ) {
        return null;
    }

    const today = new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );

    return Math.ceil(
        (
            deadline.getTime() -
            today.getTime()
        ) /
            (1000 * 60 * 60 * 24)
    );
}


function getDeadlineLabel(date) {
    const days =
        getDaysLeft(date);

    if (days === null) {
        return "Deadline not specified";
    }

    if (days < 0) {
        return "Deadline passed";
    }

    if (days === 0) {
        return "Due today";
    }

    if (days === 1) {
        return "1 day left";
    }

    return `${days} days left`;
}


/* ========================================================= */
/* FORM FIELD                                                 */
/* ========================================================= */

function FormField({
    label,
    icon: Icon,
    required = false,
    children,
}) {
    return (
        <div className="space-y-1.5">

            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">

                {Icon && (
                    <Icon className="h-3.5 w-3.5 text-slate-400" />
                )}

                {label}

                {required && (
                    <span className="text-rose-500">
                        *
                    </span>
                )}

            </label>

            {children}

        </div>
    );
}


const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-200
    bg-white
    px-3.5
    py-2.5
    text-sm
    text-slate-700
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-sky-400
    focus:ring-4
    focus:ring-sky-100
`;


/* ========================================================= */
/* APPLICATION CARD                                           */
/* ========================================================= */

function ApplicationCard({
    application,
    onRemove,
}) {
    const config =
        STATUS_CONFIG[
            application.status
        ] ||
        STATUS_CONFIG.applying;

    const StatusIcon =
        config.icon;

    const daysLeft =
        getDaysLeft(
            application.deadline
        );

    return (
        <article
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition
                hover:border-sky-200
                hover:shadow-md
            "
        >

            {/* =================================================
                CARD HEADER
            ================================================= */}

            <div className="p-4 sm:p-5">

                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="flex min-w-0 items-start gap-3">

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-sky-50
                                text-sky-600
                            "
                        >
                            <GraduationCap className="h-5 w-5" />
                        </div>

                        <div className="min-w-0">

                            <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                                {application.scholarshipName}
                            </h3>

                            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">

                                <span>
                                    {application.university ||
                                        application.provider ||
                                        "Institution not specified"}
                                </span>

                                {application.country && (
                                    <>
                                        <span>
                                            •
                                        </span>

                                        <span>
                                            {application.country}
                                        </span>
                                    </>
                                )}

                            </div>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div
                        className={`
                            inline-flex
                            w-fit
                            items-center
                            gap-2
                            rounded-xl
                            border
                            px-3
                            py-2
                            ${config.badge}
                        `}
                    >

                        <div
                            className={`
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                ${config.iconBg}
                            `}
                        >
                            <StatusIcon className="h-4 w-4" />
                        </div>

                        <span className="text-xs font-bold">
                            {config.label}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    DETAILS
                ================================================= */}

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-2
                        sm:grid-cols-3
                        lg:grid-cols-5
                    "
                >

                    <DetailItem
                        icon={GraduationCap}
                        label="Degree"
                        value={
                            application.degree ||
                            "Not specified"
                        }
                    />

                    <DetailItem
                        icon={Globe2}
                        label="Country"
                        value={
                            application.country ||
                            "Not specified"
                        }
                    />

                    <DetailItem
                        icon={Award}
                        label="Funding"
                        value={
                            application.funding ||
                            "Not specified"
                        }
                    />

                    <DetailItem
                        icon={CalendarDays}
                        label="Deadline"
                        value={formatDate(
                            application.deadline
                        )}
                    />

                    <DetailItem
                        icon={Clock3}
                        label="Added"
                        value={formatDateTime(
                            application.createdAt
                        )}
                    />

                </div>


                {/* =================================================
                    APPLICATION META
                ================================================= */}

                <div
                    className="
                        mt-4
                        grid
                        gap-3
                        border-t
                        border-slate-100
                        pt-4
                        sm:grid-cols-2
                    "
                >

                    <div className="space-y-1">

                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Application Date
                        </p>

                        <p className="text-xs font-semibold text-slate-700">
                            {formatDate(
                                application.applicationDate
                            )}
                        </p>

                    </div>


                    {application.applicationId && (
                        <div className="space-y-1">

                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Application ID
                            </p>

                            <p className="truncate text-xs font-semibold text-slate-700">
                                {application.applicationId}
                            </p>

                        </div>
                    )}

                </div>


                {/* =================================================
                    DEADLINE WARNING
                ================================================= */}

                {daysLeft !== null && (
                    <div
                        className={`
                            mt-4
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            px-3
                            py-2.5
                            ${
                                daysLeft < 0
                                    ? "bg-rose-50 text-rose-600"
                                    : daysLeft <= 14
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-slate-50 text-slate-600"
                            }
                        `}
                    >

                        <Clock3 className="h-4 w-4 shrink-0" />

                        <span className="text-xs font-semibold">
                            {getDeadlineLabel(
                                application.deadline
                            )}
                        </span>

                    </div>
                )}


                {/* =================================================
                    NOTES
                ================================================= */}

                {application.notes && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-3">

                        <div className="flex items-center gap-1.5 text-slate-400">

                            <NotebookPen className="h-3.5 w-3.5" />

                            <span className="text-[10px] font-bold uppercase tracking-wide">
                                Notes
                            </span>

                        </div>

                        <p className="mt-1.5 text-xs leading-5 text-slate-600">
                            {application.notes}
                        </p>

                    </div>
                )}


                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div
                    className="
                        mt-4
                        flex
                        flex-col
                        gap-2
                        border-t
                        border-slate-100
                        pt-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div className="flex flex-wrap gap-2">

                        {application.applicationPortal && (
                            <a
                                href={
                                    application.applicationPortal
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-xl
                                    bg-sky-500
                                    px-3.5
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-sky-600
                                "
                            >
                                Open Portal

                                <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                        )}

                        {application.followUpDate && (
                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                "
                            >
                                <CalendarDays className="h-3.5 w-3.5" />

                                Follow up:{" "}
                                {formatDate(
                                    application.followUpDate
                                )}
                            </div>
                        )}

                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            onRemove(
                                application.id
                            )
                        }
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-1.5
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            px-3
                            py-2.5
                            text-xs
                            font-semibold
                            text-slate-500
                            transition
                            hover:border-rose-200
                            hover:bg-rose-50
                            hover:text-rose-600
                        "
                    >
                        <Trash2 className="h-3.5 w-3.5" />

                        Remove
                    </button>

                </div>

            </div>

        </article>
    );
}


/* ========================================================= */
/* DETAIL ITEM                                                */
/* ========================================================= */

function DetailItem({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-3">

            <div className="flex items-center gap-1.5 text-slate-400">

                <Icon className="h-3.5 w-3.5" />

                <span className="text-[10px] font-bold uppercase tracking-wide">
                    {label}
                </span>

            </div>

            <p className="mt-1 truncate text-xs font-semibold text-slate-700">
                {value}
            </p>

        </div>
    );
}


/* ========================================================= */
/* MAIN PAGE                                                   */
/* ========================================================= */

export default function Applications() {

    const [
        applications,
        setApplications,
    ] = useState(
        () => getApplications()
    );

    const [
        isFormOpen,
        setIsFormOpen,
    ] = useState(true);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        form,
        setForm,
    ] = useState(
        INITIAL_FORM
    );


    /* ===================================================== */
    /* FORM CHANGE                                           */
    /* ===================================================== */

    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    /* ===================================================== */
    /* ADD APPLICATION                                       */
    /* ===================================================== */

    const handleSubmit = (
        event
    ) => {

        event.preventDefault();

        if (
            !form.scholarshipName.trim()
        ) {
            return;
        }

        const updated =
            addApplication({
                ...form,

                scholarshipName:
                    form.scholarshipName.trim(),

                university:
                    form.university.trim(),

                provider:
                    form.provider.trim(),

                country:
                    form.country.trim(),

                city:
                    form.city.trim(),

                degree:
                    form.degree.trim(),

                fieldOfStudy:
                    form.fieldOfStudy.trim(),

                applicationPortal:
                    form.applicationPortal.trim(),

                applicationId:
                    form.applicationId.trim(),

                contactName:
                    form.contactName.trim(),

                contactEmail:
                    form.contactEmail.trim(),

                contactPhone:
                    form.contactPhone.trim(),

                documents:
                    form.documents.trim(),

                notes:
                    form.notes.trim(),
            });

        setApplications(updated);

        setForm(
            INITIAL_FORM
        );

        setIsFormOpen(false);
    };


    /* ===================================================== */
    /* REMOVE APPLICATION                                   */
    /* ===================================================== */

    const handleRemove = (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Remove this application from your tracker?"
            );

        if (!confirmed) {
            return;
        }

        const updated =
            removeApplication(id);

        setApplications(updated);
    };


    /* ===================================================== */
    /* FILTER                                                */
    /* ===================================================== */

    const filteredApplications =
        useMemo(() => {

            const query =
                search
                    .trim()
                    .toLowerCase();

            return applications.filter(
                (application) => {

                    const matchesSearch =
                        !query ||
                        application.scholarshipName
                            ?.toLowerCase()
                            .includes(query) ||
                        application.university
                            ?.toLowerCase()
                            .includes(query) ||
                        application.provider
                            ?.toLowerCase()
                            .includes(query) ||
                        application.country
                            ?.toLowerCase()
                            .includes(query);

                    const matchesStatus =
                        statusFilter ===
                            "all" ||
                        application.status ===
                            statusFilter;

                    return (
                        matchesSearch &&
                        matchesStatus
                    );
                }
            );

        }, [
            applications,
            search,
            statusFilter,
        ]);


    /* ===================================================== */
    /* STATS                                                 */
    /* ===================================================== */

    const totalCount =
        applications.length;

    const activeCount =
        applications.filter(
            (application) =>
                application.status ===
                    "planning" ||
                application.status ===
                    "applying"
        ).length;

    const submittedCount =
        applications.filter(
            (application) =>
                application.status ===
                    "submitted"
        ).length;

    const reviewCount =
        applications.filter(
            (application) =>
                application.status ===
                "under-review"
        ).length;

    const acceptedCount =
        applications.filter(
            (application) =>
                application.status ===
                "accepted"
        ).length;


    return (
        <div className="min-h-screen pb-12">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <section className="mb-6">

                <div
                    className="
                        rounded-3xl
                        bg-linear-to-br
                        from-sky-500
                        via-blue-600
                        to-indigo-600
                        p-6
                        text-white
                        shadow-lg
                        sm:p-8
                    "
                >

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        <div>

                            <div className="mb-3 flex items-center gap-2">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">

                                    <FileText className="h-5 w-5" />

                                </div>

                                <span className="text-xs font-bold uppercase tracking-wider text-sky-100">
                                    Application Tracker
                                </span>

                            </div>

                            <h1 className="text-2xl font-bold sm:text-3xl">
                                My Applications
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-sky-100">
                                Keep track of every scholarship
                                and university application in
                                one place.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setIsFormOpen(
                                    (previous) =>
                                        !previous
                                )
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-white
                                px-5
                                py-3
                                text-sm
                                font-bold
                                text-sky-600
                                shadow-sm
                                transition
                                hover:bg-sky-50
                            "
                        >
                            <Plus className="h-4 w-4" />

                            Add Application
                        </button>

                    </div>

                </div>

            </section>


            {/* =================================================
                STATS
            ================================================= */}

            <section
                className="
                    mb-6
                    grid
                    grid-cols-2
                    gap-3
                    sm:grid-cols-3
                    lg:grid-cols-5
                "
            >

                <StatCard
                    icon={FileText}
                    label="Total"
                    value={totalCount}
                />

                <StatCard
                    icon={Clock3}
                    label="Active"
                    value={activeCount}
                />

                <StatCard
                    icon={CheckCircle2}
                    label="Submitted"
                    value={submittedCount}
                />

                <StatCard
                    icon={AlertCircle}
                    label="Under Review"
                    value={reviewCount}
                />

                <StatCard
                    icon={Award}
                    label="Accepted"
                    value={acceptedCount}
                />

            </section>


            {/* =================================================
                ADD APPLICATION FORM
            ================================================= */}

            {isFormOpen && (
                <section
                id="application-form"
                    className="
                        mb-8
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >

                    {/* Form header */}

                    <div
                        className="
                            border-b
                            border-slate-100
                            bg-slate-50/70
                            px-5
                            py-4
                            sm:px-6
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <div className="flex items-center gap-2">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">

                                        <Plus className="h-4 w-4" />

                                    </div>

                                    <h2 className="text-base font-bold text-slate-900">
                                        Add Application
                                    </h2>

                                </div>

                                <p className="mt-1 text-xs text-slate-500">
                                    Record the details of a
                                    scholarship or university
                                    application.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setIsFormOpen(
                                        false
                                    )
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-slate-400
                                    transition
                                    hover:bg-slate-100
                                    hover:text-slate-600
                                "
                            >
                                <X className="h-4 w-4" />
                            </button>

                        </div>

                    </div>


                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="p-5 sm:p-6"
                    >

                        {/* =================================================
                            SECTION 1 — PROGRAM
                        ================================================= */}

                        <FormSection
                            number="01"
                            title="Program Information"
                            description="Basic information about the scholarship or program."
                        >

                            <div className="grid gap-4 md:grid-cols-2">

                                <FormField
                                    label="Scholarship / Program Name"
                                    icon={Award}
                                    required
                                >
                                    <input
                                        name="scholarshipName"
                                        value={
                                            form.scholarshipName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. DAAD Scholarship 2027"
                                        className={
                                            inputClass
                                        }
                                        required
                                    />
                                </FormField>


                                <FormField
                                    label="University / Institution"
                                    icon={University}
                                >
                                    <input
                                        name="university"
                                        value={
                                            form.university
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Technical University of Munich"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Provider / Organization"
                                    icon={Award}
                                >
                                    <input
                                        name="provider"
                                        value={
                                            form.provider
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. DAAD"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Country"
                                    icon={Globe2}
                                >
                                    <input
                                        name="country"
                                        value={
                                            form.country
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Germany"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="City"
                                    icon={MapPin}
                                >
                                    <input
                                        name="city"
                                        value={
                                            form.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Munich"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Intake / Session"
                                    icon={CalendarDays}
                                >
                                    <input
                                        name="intake"
                                        value={
                                            form.intake
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Fall 2027"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>

                            </div>

                        </FormSection>


                        {/* =================================================
                            SECTION 2 — ACADEMIC
                        ================================================= */}

                        <FormSection
                            number="02"
                            title="Academic Information"
                            description="The academic program you are applying for."
                        >

                            <div className="grid gap-4 md:grid-cols-2">

                                <FormField
                                    label="Degree Level"
                                    icon={GraduationCap}
                                >
                                    <select
                                        name="degree"
                                        value={
                                            form.degree
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    >
                                        <option value="">
                                            Select degree
                                        </option>

                                        <option value="Bachelor">
                                            Bachelor
                                        </option>

                                        <option value="Master">
                                            Master
                                        </option>

                                        <option value="PhD">
                                            PhD
                                        </option>

                                        <option value="Postdoctoral">
                                            Postdoctoral
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>
                                </FormField>


                                <FormField
                                    label="Field of Study"
                                    icon={GraduationCap}
                                >
                                    <input
                                        name="fieldOfStudy"
                                        value={
                                            form.fieldOfStudy
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Computer Science"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>

                            </div>

                        </FormSection>


                        {/* =================================================
                            SECTION 3 — APPLICATION
                        ================================================= */}

                        <FormSection
                            number="03"
                            title="Application Details"
                            description="Important dates and application tracking information."
                        >

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                                <FormField
                                    label="Application Date"
                                    icon={CalendarDays}
                                >
                                    <input
                                        type="date"
                                        name="applicationDate"
                                        value={
                                            form.applicationDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Application Deadline"
                                    icon={CalendarDays}
                                >
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={
                                            form.deadline
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Current Status"
                                    icon={Clock3}
                                >
                                    <select
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    >
                                        <option value="planning">
                                            Planning
                                        </option>

                                        <option value="applying">
                                            Applying
                                        </option>

                                        <option value="submitted">
                                            Submitted
                                        </option>

                                        <option value="under-review">
                                            Under Review
                                        </option>

                                        <option value="accepted">
                                            Accepted
                                        </option>

                                        <option value="rejected">
                                            Rejected
                                        </option>

                                        <option value="withdrawn">
                                            Withdrawn
                                        </option>
                                    </select>
                                </FormField>


                                <FormField
                                    label="Application ID / Reference"
                                    icon={FileText}
                                >
                                    <input
                                        name="applicationId"
                                        value={
                                            form.applicationId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. APP-2027-12345"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Application Portal"
                                    icon={Link2}
                                >
                                    <input
                                        type="url"
                                        name="applicationPortal"
                                        value={
                                            form.applicationPortal
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://..."
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Follow-up Date"
                                    icon={CalendarDays}
                                >
                                    <input
                                        type="date"
                                        name="followUpDate"
                                        value={
                                            form.followUpDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>

                            </div>

                        </FormSection>


                        {/* =================================================
                            SECTION 4 — FINANCIAL
                        ================================================= */}

                        <FormSection
                            number="04"
                            title="Financial Information"
                            description="Application fee and funding information."
                        >

                            <div className="grid gap-4 md:grid-cols-3">

                                <FormField
                                    label="Funding"
                                    icon={Award}
                                >
                                    <input
                                        name="funding"
                                        value={
                                            form.funding
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Fully Funded"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Application Fee"
                                    icon={Award}
                                >
                                    <input
                                        type="number"
                                        min="0"
                                        name="applicationFee"
                                        value={
                                            form.applicationFee
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. 100"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Currency"
                                    icon={Globe2}
                                >
                                    <select
                                        name="feeCurrency"
                                        value={
                                            form.feeCurrency
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className={
                                            inputClass
                                        }
                                    >
                                        <option value="USD">
                                            USD
                                        </option>

                                        <option value="EUR">
                                            EUR
                                        </option>

                                        <option value="GBP">
                                            GBP
                                        </option>

                                        <option value="BDT">
                                            BDT
                                        </option>

                                        <option value="AUD">
                                            AUD
                                        </option>

                                        <option value="CAD">
                                            CAD
                                        </option>
                                    </select>
                                </FormField>

                            </div>

                        </FormSection>


                        {/* =================================================
                            SECTION 5 — CONTACT
                        ================================================= */}

                        <FormSection
                            number="05"
                            title="Contact Information"
                            description="Useful contact details for the university or scholarship provider."
                        >

                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                                <FormField
                                    label="Contact Person"
                                    icon={University}
                                >
                                    <input
                                        name="contactName"
                                        value={
                                            form.contactName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="e.g. Admissions Officer"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Contact Email"
                                    icon={Mail}
                                >
                                    <input
                                        type="email"
                                        name="contactEmail"
                                        value={
                                            form.contactEmail
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="admissions@example.com"
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>


                                <FormField
                                    label="Contact Phone"
                                    icon={Mail}
                                >
                                    <input
                                        name="contactPhone"
                                        value={
                                            form.contactPhone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="+49 ..."
                                        className={
                                            inputClass
                                        }
                                    />
                                </FormField>

                            </div>

                        </FormSection>


                        {/* =================================================
                            SECTION 6 — DOCUMENTS & NOTES
                        ================================================= */}

                        <FormSection
                            number="06"
                            title="Documents & Notes"
                            description="Keep track of documents and anything important about this application."
                        >

                            <div className="space-y-4">

                                <FormField
                                    label="Documents"
                                    icon={FileText}
                                >
                                    <textarea
                                        name="documents"
                                        value={
                                            form.documents
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="3"
                                        placeholder="e.g. Passport, CV, SOP, Transcript, Recommendation Letter..."
                                        className={`${inputClass} resize-none`}
                                    />
                                </FormField>


                                <FormField
                                    label="Notes"
                                    icon={NotebookPen}
                                >
                                    <textarea
                                        name="notes"
                                        value={
                                            form.notes
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows="4"
                                        placeholder="Add any important notes, requirements, pending tasks, interview information, etc."
                                        className={`${inputClass} resize-none`}
                                    />
                                </FormField>

                            </div>

                        </FormSection>


                        {/* =================================================
                            FORM ACTIONS
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                flex
                                flex-col
                                gap-3
                                border-t
                                border-slate-100
                                pt-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-end
                            "
                        >

                            <button
                                type="button"
                                onClick={() => {
                                    setForm(
                                        INITIAL_FORM
                                    );
                                }}
                                className="
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-5
                                    py-2.5
                                    text-xs
                                    font-semibold
                                    text-slate-600
                                    transition
                                    hover:bg-slate-50
                                "
                            >
                                Clear
                            </button>


                            <button
                                type="submit"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-sky-500
                                    px-6
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-white
                                    shadow-sm
                                    transition
                                    hover:bg-sky-600
                                "
                            >
                                <Plus className="h-4 w-4" />

                                Add Application
                            </button>

                        </div>

                    </form>

                </section>
            )}


            {/* =================================================
                APPLICATIONS HEADER
            ================================================= */}

            <section>

                <div
                    className="
                        mb-4
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            My Applications
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                            {filteredApplications.length}{" "}
                            application
                            {filteredApplications.length !==
                            1
                                ? "s"
                                : ""}{" "}
                            in your tracker
                        </p>

                    </div>

                </div>


                {/* =================================================
                    SEARCH + FILTER
                ================================================= */}

                {applications.length > 0 && (
                    <div
                        className="
                            mb-5
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                        "
                    >

                        <div className="relative flex-1">

                            <FileText
                                className="
                                    absolute
                                    left-3.5
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search applications..."
                                className={`${inputClass} pl-10`}
                            />

                        </div>


                        <div className="relative sm:w-48">

                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                                className={`${inputClass} appearance-none pr-9`}
                            >
                                <option value="all">
                                    All Statuses
                                </option>

                                {Object.entries(
                                    STATUS_CONFIG
                                ).map(
                                    ([
                                        value,
                                        config,
                                    ]) => (
                                        <option
                                            key={
                                                value
                                            }
                                            value={
                                                value
                                            }
                                        >
                                            {
                                                config.label
                                            }
                                        </option>
                                    )
                                )}

                            </select>

                            <ChevronDown
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    h-4
                                    w-4
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                        </div>

                    </div>
                )}


                {/* =================================================
                    APPLICATION LIST
                ================================================= */}

                {filteredApplications.length >
                0 ? (
                    <div className="space-y-4">

                        {filteredApplications.map(
                            (application) => (
                                <ApplicationCard
                                    key={
                                        application.id
                                    }
                                    application={
                                        application
                                    }
                                    onRemove={
                                        handleRemove
                                    }
                                />
                            )
                        )}

                    </div>
                ) : (
                    <EmptyApplications
                        hasApplications={
                            applications.length >
                            0
                        }
                        onAdd={() =>
                            setIsFormOpen(
                                true
                            )
                        }
                    />
                )}

            </section>

        </div>
    );
}


/* ========================================================= */
/* FORM SECTION                                               */
/* ========================================================= */

function FormSection({
    number,
    title,
    description,
    children,
}) {
    return (
        <div className="border-b border-slate-100 py-6 first:pt-0 last:border-b-0">

            <div className="mb-5 flex items-start gap-3">

                <div
                    className="
                        flex
                        h-8
                        w-8
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-sky-50
                        text-[10px]
                        font-bold
                        text-sky-600
                    "
                >
                    {number}
                </div>

                <div>

                    <h3 className="text-sm font-bold text-slate-900">
                        {title}
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                        {description}
                    </p>

                </div>

            </div>

            {children}

        </div>
    );
}


/* ========================================================= */
/* STAT CARD                                                  */
/* ========================================================= */

function StatCard({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            <div className="flex items-center justify-between">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">

                    <Icon className="h-4 w-4" />

                </div>

                <span className="text-2xl font-bold text-slate-900">
                    {value}
                </span>

            </div>

            <p className="mt-3 text-xs font-semibold text-slate-500">
                {label}
            </p>

        </div>
    );
}


/* ========================================================= */
/* EMPTY STATE                                                */
/* ========================================================= */

function EmptyApplications({
    hasApplications,
    onAdd,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-dashed
                border-slate-200
                bg-white
                px-6
                py-14
                text-center
            "
        >

            <div
                className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-sky-50
                    text-sky-500
                "
            >
                <FileText className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-base font-bold text-slate-900">
                {hasApplications
                    ? "No applications found"
                    : "No applications yet"}
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
                {hasApplications
                    ? "Try changing your search or status filter."
                    : "Start tracking your scholarship applications by adding your first application above."}
            </p>

            {!hasApplications && (
                <button
                    type="button"
                    onClick={() => {
    onAdd();

    setTimeout(() => {
        document
            .getElementById("application-form")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
    }, 100);
}}
                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-sky-500
                        px-5
                        py-2.5
                        text-xs
                        font-bold
                        text-white
                        transition
                        hover:bg-sky-600
                    "
                >
                    <Plus className="h-4 w-4" />

                    Add Application
                </button>
            )}

        </div>
    );
}