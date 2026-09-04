import {
    AlertCircle,
    Award,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Download,
    Eye,
    FileCheck2,
    FileText,
    FolderOpen,
    GraduationCap,
    IdCard,
    Landmark,
    Mail,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    Upload,
    UserRound,
    WalletCards,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    useMemo,
    useRef,
    useState,
} from "react";

import opportunities from "../../data/opportunities.json";

import {
    addDocument,
     addCustomDocument,
    getCustomDocuments,
    getDocumentFile,
    getDocumentMetadata,
    removeChecklistDocument,
} from "../../data/documents";

/* ========================================================= */
/* Checklist                                                  */
/* ========================================================= */

const DEFAULT_DOCUMENTS = [
    {
        id: "passport",
        name: "Valid Passport",
        description:
            "A clear copy of your valid passport bio page.",
        category: "Identity",
        icon: IdCard,
        required: true,
    },

    {
        id: "national-id",
        name: "National ID / NID",
        description:
            "Government-issued national identification document.",
        category: "Identity",
        icon: ShieldCheck,
        required: true,
    },

    {
        id: "academic-transcript",
        name: "Academic Transcript",
        description:
            "Official or certified transcript showing your academic results.",
        category: "Academic",
        icon: GraduationCap,
        required: true,
    },

    {
        id: "degree-certificate",
        name: "Degree Certificate",
        description:
            "Certificate proving completion of your previous degree.",
        category: "Academic",
        icon: Award,
        required: true,
    },

    {
        id: "cv",
        name: "CV / Resume",
        description:
            "Updated academic or professional curriculum vitae.",
        category: "Application",
        icon: UserRound,
        required: true,
    },

    {
        id: "motivation-letter",
        name: "Motivation Letter",
        description:
            "Statement explaining your motivation and study goals.",
        category: "Application",
        icon: FileText,
        required: true,
    },

    {
        id: "recommendation-letter",
        name: "Recommendation Letter",
        description:
            "Academic or professional recommendation letter.",
        category: "Application",
        icon: Mail,
        required: true,
    },

    {
        id: "english-test",
        name: "English Proficiency Certificate",
        description:
            "IELTS, TOEFL, PTE or another accepted English test certificate.",
        category: "Language",
        icon: FileCheck2,
        required: true,
    },

    {
        id: "financial-proof",
        name: "Proof of Funds",
        description:
            "Bank statement, financial certificate or accepted funding evidence.",
        category: "Financial",
        icon: WalletCards,
        required: true,
    },

    {
        id: "study-plan",
        name: "Study Plan",
        description:
            "Detailed academic plan or study proposal where required.",
        category: "Application",
        icon: FileText,
        required: true,
    },

    {
        id: "research-proposal",
        name: "Research Proposal",
        description:
            "Research proposal for programs or scholarships that require one.",
        category: "Academic",
        icon: Landmark,
        required: false,
    },

    {
        id: "portfolio",
        name: "Portfolio",
        description:
            "Portfolio containing projects, achievements or relevant work.",
        category: "Application",
        icon: FolderOpen,
        required: false,
    },
];

/* ========================================================= */
/* Helpers                                                    */
/* ========================================================= */

// MUST be outside Documents
const DOCUMENT_CATEGORY_ICONS = {
  identity: IdCard,
  academic: GraduationCap,
  financial: WalletCards,
  application: FileText,
  language: FileCheck2,
  visa: Landmark,
  default: FolderOpen,
};

const DocumentCategoryIcon = ({
  category,
  className = "h-5 w-5",
}) => {
  const categoryKey = String(category || "").toLowerCase();

  const Icon =
    DOCUMENT_CATEGORY_ICONS[categoryKey] ||
    DOCUMENT_CATEGORY_ICONS.default;

  return <Icon className={className} />;
};

/* ========================================================= */
/* Stat Card                                                   */
/* ========================================================= */

function StatCard({
    icon: Icon,
    label,
    value,
    description,
    iconClass = "text-sky-600",
    bgClass = "bg-sky-50",
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
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {label}
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-900">
                        {value}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                        {description}
                    </p>
                </div>

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${bgClass}
                    `}
                >
                    <Icon
                        className={`
                            h-5
                            w-5
                            ${iconClass}
                        `}
                    />
                </div>
            </div>
        </div>
    );
}

/* ========================================================= */
/* Filter Select                                               */
/* ========================================================= */

function FilterSelect({
    value,
    onChange,
    children,
}) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(event) =>
                    onChange(
                        event.target.value
                    )
                }
                className="
                    h-10
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-white
                    pl-3
                    pr-9
                    text-xs
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

            <ChevronDown
                className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    h-3.5
                    w-3.5
                    -translate-y-1/2
                    text-slate-400
                "
            />
        </div>
    );
}

/* ========================================================= */
/* Progress Ring                                               */
/* ========================================================= */

function CompletionRing({
    percentage,
}) {
    const radius = 36;

    const circumference =
        2 *
        Math.PI *
        radius;

    const safePercentage =
        Math.min(
            Math.max(
                Number(
                    percentage
                ) || 0,
                0
            ),
            100
        );

    const offset =
        circumference -
        (safePercentage / 100) *
            circumference;

    return (
        <div className="relative h-28 w-28 shrink-0">
            <svg
                className="
                    h-28
                    w-28
                    -rotate-90
                "
                viewBox="0 0 80 80"
            >
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-sky-100"
                />

                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={
                        circumference
                    }
                    strokeDashoffset={
                        offset
                    }
                    className="text-sky-500 transition-all duration-500"
                />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-slate-900">
                    {safePercentage}%
                </span>

                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Complete
                </span>
            </div>
        </div>
    );
}

/* ========================================================= */
/* Document Card                                               */
/* ========================================================= */

function DocumentCard({
    document,
    uploaded,
    onUpload,
    onRemove,
    onMarkAdded,
    onView,
}) {
    const inputRef =
        useRef(null);

    const handleFileChange =
        async (event) => {
            const file =
                event.target.files?.[0];

            if (!file) {
                return;
            }

            if (
                file.type !==
                "application/pdf"
            ) {
                toast.error("Please upload a PDF file only.");

                event.target.value =
                    "";

                return;
            }

            const maxSize =
                10 * 1024 * 1024;

            if (
                file.size >
                maxSize
            ) {
                toast.error("PDF must be 10 MB or smaller.");

                event.target.value =
                    "";

                return;
            }

            await onUpload(
                document,
                file
            );

            event.target.value =
                "";
        };

    return (
        <div
            className={`
                group
                rounded-2xl
                border
                bg-white
                p-4
                shadow-sm
                transition-all
                duration-200
                ${
                    uploaded
                        ? "border-emerald-200 bg-emerald-50/20"
                        : "border-slate-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
                }
            `}
        >
            <div className="flex items-start gap-3">
                <div
                    className={`
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                            uploaded
                                ? "bg-emerald-100 text-emerald-600"
                                : "bg-sky-50 text-sky-600"
                        }
                    `}
                >
                    {uploaded ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (<DocumentCategoryIcon
    category={document.category}
    className="h-5 w-5"
  /> )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-900">
                                {document.name}
                            </h3>

                            <p className="mt-1 text-[11px] leading-5 text-slate-400">
                                {
                                    document.description
                                }
                            </p>
                        </div>

                        {document.required ? (
                            <span
                                className="
                                    shrink-0
                                    rounded-full
                                    border
                                    border-rose-200
                                    bg-rose-50
                                    px-2
                                    py-1
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-rose-500
                                "
                            >
                                Required
                            </span>
                        ) : (
                            <span
                                className="
                                    shrink-0
                                    rounded-full
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-2
                                    py-1
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-wide
                                    text-slate-400
                                "
                            >
                                Optional
                            </span>
                        )}
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                        <span
                            className="
                                rounded-lg
                                bg-slate-50
                                px-2
                                py-1
                                text-[9px]
                                font-bold
                                text-slate-500
                            "
                        >
                            {
                                document.category
                            }
                        </span>

                        {uploaded && (
                            <span
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-1
                                    text-[10px]
                                    font-semibold
                                    text-emerald-600
                                "
                            >
                                <Check className="h-3 w-3" />

                                <span className="max-w-40 truncate">
                                    {
                                        uploaded.fileName ||
                                            "Document added"
                                    }
                                </span>
                            </span>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <input
                            ref={inputRef}
                            type="file"
                            accept="application/pdf,.pdf"
                            className="hidden"
                            onChange={
                                handleFileChange
                            }
                        />

                        {uploaded ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        onView(
                                            uploaded
                                        )
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
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
                                        hover:text-sky-600
                                    "
                                >
                                    <Eye className="h-3.5 w-3.5" />
                                    View
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        inputRef.current?.click()
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        border
                                        border-sky-200
                                        bg-sky-50
                                        px-3
                                        text-[10px]
                                        font-bold
                                        text-sky-600
                                        transition
                                        hover:bg-sky-100
                                    "
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    Replace
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(
                                            document
                                        )
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        px-2.5
                                        text-[10px]
                                        font-bold
                                        text-rose-500
                                        transition
                                        hover:bg-rose-50
                                    "
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Remove
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        inputRef.current?.click()
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        bg-sky-500
                                        px-3
                                        text-[10px]
                                        font-bold
                                        text-white
                                        shadow-sm
                                        shadow-sky-100
                                        transition
                                        hover:bg-sky-600
                                    "
                                >
                                    <Upload className="h-3.5 w-3.5" />
                                    Upload PDF
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onMarkAdded(
                                            document
                                        )
                                    }
                                    className="
                                        inline-flex
                                        h-9
                                        items-center
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
                                        hover:border-emerald-200
                                        hover:bg-emerald-50
                                        hover:text-emerald-600
                                    "
                                >
                                    <Check className="h-3.5 w-3.5" />
                                    Mark as Added
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ========================================================= */
/* Empty State                                                 */
/* ========================================================= */

function EmptyDocuments({
    onAdd,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-dashed
                border-slate-300
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
                No documents found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-400">
                Start building your application
                document collection by adding a
                document to your checklist.
            </p>

            <button
                type="button"
                onClick={onAdd}
                className="
                    mt-5
                    inline-flex
                    h-10
                    items-center
                    gap-2
                    rounded-xl
                    bg-sky-500
                    px-4
                    text-xs
                    font-bold
                    text-white
                    shadow-sm
                    shadow-sky-100
                    transition
                    hover:bg-sky-600
                "
            >
                <Plus className="h-4 w-4" />
                Add Document
            </button>
        </div>
    );
}

/* ========================================================= */
/* Add Custom Document Form                                    */
/* ========================================================= */

function AddDocumentForm({
    onClose,
    onAdd,
}) {
    const [name, setName] =
        useState("");

    const [category, setCategory] =
        useState("Application");

    const [description, setDescription] =
        useState("");

    const [required, setRequired] =
        useState(true);

    const handleSubmit =
        (event) => {
            event.preventDefault();

            if (!name.trim()) {
                return;
            }

            onAdd({
                id: `custom-${Date.now()}`,
                name: name.trim(),
                description:
                    description.trim() ||
                    "Custom application document.",
                category,
                required,
                custom: true,
            });
        };

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
                    max-w-lg
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-2xl
                "
            >
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-100
                        px-5
                        py-4
                    "
                >
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Add Custom Document
                        </h2>

                        <p className="mt-0.5 text-[10px] text-slate-400">
                            Add another document to
                            your checklist.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-8
                            w-8
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

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="p-5"
                >
                    <div>
                        <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Document Name
                        </label>

                        <input
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Birth Certificate"
                            className="
                                mt-2
                                h-10
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                px-3
                                text-xs
                                font-medium
                                text-slate-700
                                outline-none
                                transition
                                focus:border-sky-400
                                focus:ring-4
                                focus:ring-sky-100
                            "
                        />
                    </div>

                    <div className="mt-4">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Category
                        </label>

                        <select
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                            className="
                                mt-2
                                h-10
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-3
                                text-xs
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-sky-400
                                focus:ring-4
                                focus:ring-sky-100
                            "
                        >
                            <option>
                                Identity
                            </option>
                            <option>
                                Academic
                            </option>
                            <option>
                                Application
                            </option>
                            <option>
                                Language
                            </option>
                            <option>
                                Financial
                            </option>
                            <option>
                                Visa
                            </option>
                            <option>
                                Other
                            </option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            Description
                        </label>

                        <textarea
                            value={
                                description
                            }
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            rows={3}
                            placeholder="What is this document for?"
                            className="
                                mt-2
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-slate-200
                                px-3
                                py-2.5
                                text-xs
                                font-medium
                                text-slate-700
                                outline-none
                                focus:border-sky-400
                                focus:ring-4
                                focus:ring-sky-100
                            "
                        />
                    </div>

                    <label className="mt-4 flex cursor-pointer items-center gap-2">
                        <input
                            type="checkbox"
                            checked={
                                required
                            }
                            onChange={(event) =>
                                setRequired(
                                    event.target
                                        .checked
                                )
                            }
                            className="
                                h-4
                                w-4
                                rounded
                                border-slate-300
                                text-sky-500
                                focus:ring-sky-400
                            "
                        />

                        <span className="text-xs font-semibold text-slate-600">
                            Required for application
                        </span>
                    </label>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            className="
                                h-10
                                rounded-xl
                                border
                                border-slate-200
                                px-4
                                text-xs
                                font-bold
                                text-slate-600
                                hover:bg-slate-50
                            "
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="
                                inline-flex
                                h-10
                                items-center
                                gap-2
                                rounded-xl
                                bg-sky-500
                                px-4
                                text-xs
                                font-bold
                                text-white
                                shadow-sm
                                shadow-sky-100
                                hover:bg-sky-600
                            "
                        >
                            <Plus className="h-4 w-4" />
                            Add Document
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ========================================================= */
/* Documents Page                                              */
/* ========================================================= */

export default function Documents() {
    const [
    customDocuments,
    setCustomDocuments,
] = useState(() =>
    getCustomDocuments()
);
    const [documents, setDocuments] =
        useState(() =>
            getDocumentMetadata()
        );

    const [
        selectedOpportunity,
        setSelectedOpportunity,
    ] = useState("all");

    const [search, setSearch] =
        useState("");

    const [
        categoryFilter,
        setCategoryFilter,
    ] = useState("all");

    const [
        showAddForm,
        setShowAddForm,
    ] = useState(false);

    const [viewingDocument, setViewingDocument] =
        useState(null);

    /* ===================================================== */
    /* Opportunity Options                                    */
    /* ===================================================== */

    const opportunityOptions =
        useMemo(() => {
            return opportunities || [];
        }, []);

    /* ===================================================== */
    /* Build Checklist                                        */
    /* ===================================================== */

    const checklist =
    useMemo(() => {
        const defaults =
            DEFAULT_DOCUMENTS.map(
                (document) => ({
                    ...document,
                    checklistId:
                        document.id,
                })
            );

        const customs =
            customDocuments.map(
                (document) => ({
                    ...document,
                    checklistId:
                        document.id,
                })
            );

        return [
            ...defaults,
            ...customs,
        ];
    }, [customDocuments]);

    /* ===================================================== */
    /* Uploaded Map                                           */
    /* ===================================================== */

    const uploadedMap =
        useMemo(() => {
            const map = {};

            documents.forEach(
                (document) => {
                    map[
                        document.checklistId
                    ] = document;
                }
            );

            return map;
        }, [documents]);

    /* ===================================================== */
    /* Required Documents                                     */
    /* ===================================================== */

    const requiredDocuments =
        useMemo(() => {
            return checklist.filter(
                (document) =>
                    document.required
            );
        }, [checklist]);

    const addedRequiredCount =
        requiredDocuments.filter(
            (document) =>
                uploadedMap[
                    document.checklistId
                ]
        ).length;

    const totalRequired =
        requiredDocuments.length;

    const remainingRequired =
        Math.max(
            totalRequired -
                addedRequiredCount,
            0
        );

    const completionPercentage =
        totalRequired === 0
            ? 100
            : Math.round(
                  (addedRequiredCount /
                      totalRequired) *
                      100
              );

    const optionalAddedCount =
        checklist.filter(
            (document) =>
                !document.required &&
                uploadedMap[
                    document.checklistId
                ]
        ).length;

    /* ===================================================== */
    /* Filtering                                              */
    /* ===================================================== */

    const filteredDocuments =
        useMemo(() => {
            const query =
                search
                    .trim()
                    .toLowerCase();

            return checklist.filter(
                (document) => {
                    const matchesSearch =
                        !query ||
                        document.name
                            .toLowerCase()
                            .includes(
                                query
                            ) ||
                        document.category
                            .toLowerCase()
                            .includes(
                                query
                            ) ||
                        document.description
                            .toLowerCase()
                            .includes(
                                query
                            );

                    const matchesCategory =
                        categoryFilter ===
                            "all" ||
                        document.category ===
                            categoryFilter;

                    return (
                        matchesSearch &&
                        matchesCategory
                    );
                }
            );
        }, [
            checklist,
            search,
            categoryFilter,
        ]);

    const groupedDocuments =
        useMemo(() => {
            return filteredDocuments.reduce(
                (
                    groups,
                    document
                ) => {
                    if (
                        !groups[
                            document.category
                        ]
                    ) {
                        groups[
                            document.category
                        ] = [];
                    }

                    groups[
                        document.category
                    ].push(document);

                    return groups;
                },
                {}
            );
        }, [filteredDocuments]);

    /* ===================================================== */
    /* Handlers                                                */
    /* ===================================================== */

    const handleUpload =
        async (
            document,
            file
        ) => {
            try {
                const updated =
                    await addDocument(
                        {
                            checklistId:
                                document.checklistId ||
                                document.id,

                            name:
                                document.name,

                            description:
                                document.description,

                            category:
                                document.category,

                            required:
                                document.required,

                            custom:
                                document.custom ||
                                false,

                            opportunityId:
                                selectedOpportunity !==
                                "all"
                                    ? selectedOpportunity
                                    : null,
                        },
                        file
                    );

                setDocuments(
                    updated
                );
            } catch (error) {
                console.error(
                    "Failed to upload document:",
                    error
                );

                toast.error("Failed to save the document. Please try again.");
            }
        };

    const handleMarkAdded =
        async (document) => {
            try {
                const updated =
                    await addDocument({
                        checklistId:
                            document.checklistId ||
                            document.id,

                        name:
                            document.name,

                        description:
                            document.description,

                        category:
                            document.category,

                        required:
                            document.required,

                        custom:
                            document.custom ||
                            false,

                        opportunityId:
                            selectedOpportunity !==
                            "all"
                                ? selectedOpportunity
                                : null,
                    });

                setDocuments(
                    updated
                );
            } catch (error) {
                console.error(
                    "Failed to mark document:",
                    error
                );
            }
        };

    const handleRemove =
        async (document) => {
            const confirmed =
                window.confirm(
                    `Remove "${document.name}" from your gathered documents?`
                );

            if (!confirmed) {
                return;
            }

            try {
                const updated =
                    await removeChecklistDocument(
                        document.checklistId ||
                            document.id
                    );

                setDocuments(
                    updated
                );
            } catch (error) {
                console.error(
                    "Failed to remove document:",
                    error
                );
            }
        };

    const handleAddCustom =
    (document) => {
        const updated =
            addCustomDocument(
                document
            );

        setCustomDocuments(
            updated
        );

        setShowAddForm(
            false
        );
    };

    /* ===================================================== */
    /* View PDF                                                */
    /* ===================================================== */

    const handleView =
        async (document) => {
            try {
                if (
                    !document.fileName
                ) {
                    toast.error(
    "This document was manually marked as added and has no PDF file."
);

                    return;
                }

                const file =
                    await getDocumentFile(
                        document.id
                    );

                if (!file) {
                    toast.error("The PDF file could not be found.");

                    return;
                }

                const url =
                    URL.createObjectURL(
                        file
                    );

                setViewingDocument({
                    ...document,
                    url,
                });
            } catch (error) {
                console.error(
                    "Failed to open document:",
                    error
                );

                toast.error("Unable to open this PDF.");
            }
        };

    /* ===================================================== */
    /* Categories                                              */
    /* ===================================================== */

    const categories =
        useMemo(() => {
            return [
                "all",
                ...new Set(
                    checklist.map(
                        (document) =>
                            document.category
                    )
                ),
            ];
        }, [checklist]);

    /* ===================================================== */
    /* JSX                                                     */
    /* ===================================================== */

    return (
        <div className="min-h-screen bg-slate-50/70">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
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
                    <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-sky-200
                                    bg-white/80
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-sky-600
                                "
                            >
                                <FileCheck2 className="h-3.5 w-3.5" />

                                Document Center
                            </div>

                            <h1
                                className="
                                    mt-4
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-slate-900
                                    sm:text-3xl
                                "
                            >
                                Get your application documents ready
                            </h1>

                            <p
                                className="
                                    mt-2
                                    max-w-xl
                                    text-sm
                                    leading-6
                                    text-slate-500
                                "
                            >
                                Keep every important
                                document organized,
                                upload your PDFs, and
                                track your application
                                readiness from one place.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowAddForm(
                                    true
                                )
                            }
                            className="
                                inline-flex
                                h-11
                                shrink-0
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-sky-500
                                px-5
                                text-xs
                                font-bold
                                text-white
                                shadow-sm
                                shadow-sky-200
                                transition
                                hover:bg-sky-600
                                hover:shadow-md
                            "
                        >
                            <Plus className="h-4 w-4" />

                            Add Document
                        </button>
                    </div>

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-20
                            h-52
                            w-52
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
                            right-20
                            h-44
                            w-44
                            rounded-full
                            bg-blue-200/30
                            blur-3xl
                        "
                    />
                </div>

                {/* ================================================= */}
                {/* Target Opportunity                               */}
                {/* ================================================= */}

                <div
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                    "
                >
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                Application Target
                            </p>

                            <h2 className="mt-1 text-sm font-bold text-slate-900">
                                Which opportunity are you preparing for?
                            </h2>

                            <p className="mt-1 text-[11px] text-slate-400">
                                Use this to keep your
                                document preparation
                                focused on a specific
                                scholarship or university.
                            </p>
                        </div>

                        <div className="relative w-full lg:w-96">
                            <select
                                value={
                                    selectedOpportunity
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSelectedOpportunity(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    h-11
                                    w-full
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-3
                                    pr-10
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    outline-none
                                    transition
                                    focus:border-sky-400
                                    focus:ring-4
                                    focus:ring-sky-100
                                "
                            >
                                <option value="all">
                                    General Document Collection
                                </option>

                                {opportunityOptions.map(
                                    (
                                        opportunity
                                    ) => (
                                        <option
                                            key={
                                                opportunity.id
                                            }
                                            value={
                                                opportunity.id
                                            }
                                        >
                                            {
                                                opportunity.title
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
                </div>

                {/* ================================================= */}
                {/* Completion Overview                               */}
                {/* ================================================= */}

                <div
                    className="
                        mt-6
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >
                    <div className="flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center">
                        <CompletionRing
                            percentage={
                                completionPercentage
                            }
                        />

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        Application Readiness
                                    </p>

                                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                                        {completionPercentage ===
                                        100
                                            ? "All required documents are ready"
                                            : `${remainingRequired} document${
                                                  remainingRequired !==
                                                  1
                                                      ? "s"
                                                      : ""
                                              } still needed`}
                                    </h2>

                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        {addedRequiredCount} of{" "}
                                        {
                                            totalRequired
                                        }{" "}
                                        required documents
                                        have been gathered.
                                    </p>
                                </div>

                                {completionPercentage ===
                                100 ? (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            self-start
                                            rounded-full
                                            border
                                            border-emerald-200
                                            bg-emerald-50
                                            px-3
                                            py-1.5
                                            text-[10px]
                                            font-bold
                                            text-emerald-600
                                        "
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5" />

                                        Ready to Apply
                                    </span>
                                ) : (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            self-start
                                            rounded-full
                                            border
                                            border-amber-200
                                            bg-amber-50
                                            px-3
                                            py-1.5
                                            text-[10px]
                                            font-bold
                                            text-amber-600
                                        "
                                    >
                                        <Clock3 className="h-3.5 w-3.5" />

                                        Preparation in Progress
                                    </span>
                                )}
                            </div>

                            <div className="mt-5">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[10px] font-semibold text-slate-400">
                                        Required document
                                        progress
                                    </span>

                                    <span className="text-[10px] font-bold text-slate-700">
                                        {
                                            addedRequiredCount
                                        }{" "}
                                        /{" "}
                                        {
                                            totalRequired
                                        }
                                    </span>
                                </div>

                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            bg-linear-to-r
                                            from-sky-400
                                            to-blue-500
                                            transition-all
                                            duration-500
                                        "
                                        style={{
                                            width: `${completionPercentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* Stats                                              */}
                {/* ================================================= */}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        icon={
                            FileCheck2
                        }
                        label="Required"
                        value={
                            totalRequired
                        }
                        description="Documents needed"
                        iconClass="text-sky-600"
                        bgClass="bg-sky-50"
                    />

                    <StatCard
                        icon={
                            CheckCircle2
                        }
                        label="Gathered"
                        value={
                            addedRequiredCount
                        }
                        description="Required documents added"
                        iconClass="text-emerald-600"
                        bgClass="bg-emerald-50"
                    />

                    <StatCard
                        icon={
                            AlertCircle
                        }
                        label="Remaining"
                        value={
                            remainingRequired
                        }
                        description="Still need to gather"
                        iconClass="text-amber-600"
                        bgClass="bg-amber-50"
                    />

                    <StatCard
                        icon={
                            FolderOpen
                        }
                        label="Optional"
                        value={
                            optionalAddedCount
                        }
                        description="Optional documents added"
                        iconClass="text-violet-600"
                        bgClass="bg-violet-50"
                    />
                </div>

                {/* ================================================= */}
                {/* Search / Filters                                  */}
                {/* ================================================= */}

                <div
                    className="
                        mt-8
                        flex
                        flex-col
                        gap-3
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-3
                        shadow-sm
                        md:flex-row
                        md:items-center
                    "
                >
                    <div className="relative flex-1">
                        <Search
                            className="
                                absolute
                                left-3
                                top-1/2
                                h-4
                                w-4
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            value={search}
                            onChange={(
                                event
                            ) =>
                                setSearch(
                                    event
                                        .target
                                        .value
                                )
                            }
                            placeholder="Search documents..."
                            className="
                                h-10
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                bg-slate-50
                                pl-9
                                pr-3
                                text-xs
                                font-medium
                                text-slate-700
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-sky-400
                                focus:bg-white
                                focus:ring-4
                                focus:ring-sky-100
                            "
                        />
                    </div>

                    <FilterSelect
                        value={
                            categoryFilter
                        }
                        onChange={
                            setCategoryFilter
                        }
                    >
                        {categories.map(
                            (category) => (
                                <option
                                    key={
                                        category
                                    }
                                    value={
                                        category
                                    }
                                >
                                    {category ===
                                    "all"
                                        ? "All categories"
                                        : category}
                                </option>
                            )
                        )}
                    </FilterSelect>

                    <button
                        type="button"
                        onClick={() =>
                            setShowAddForm(
                                true
                            )
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-sky-200
                            bg-sky-50
                            px-4
                            text-xs
                            font-bold
                            text-sky-600
                            transition
                            hover:bg-sky-100
                        "
                    >
                        <Plus className="h-3.5 w-3.5" />

                        Custom
                    </button>
                </div>

                {/* ================================================= */}
                {/* Checklist Header                                  */}
                {/* ================================================= */}

                <div className="mb-4 mt-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-500">
                            Document Checklist
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Documents you need
                        </h2>

                        <p className="mt-1 text-xs text-slate-400">
                            Upload your PDF or manually
                            mark a document as already
                            gathered.
                        </p>
                    </div>

                    <p className="text-[11px] font-semibold text-slate-400">
                        Showing{" "}
                        {
                            filteredDocuments.length
                        }{" "}
                        of{" "}
                        {checklist.length}
                    </p>
                </div>

                {/* ================================================= */}
                {/* Documents                                         */}
                {/* ================================================= */}

                {filteredDocuments.length ===
                0 ? (
                    <EmptyDocuments
                        onAdd={() =>
                            setShowAddForm(
                                true
                            )
                        }
                    />
                ) : (
                    <div className="space-y-8">
                        {Object.entries(
                            groupedDocuments
                        ).map(
                            ([
                                category,
                                categoryDocuments,
                            ]) => {

                                return (
                                    <section
                                        key={
                                            category
                                        }
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <div
                                                className="
                                                    flex
                                                    h-8
                                                    w-8
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-sky-50
                                                    text-sky-600
                                                "
                                            >
                                                <FileText className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-slate-800">
                                                    {
                                                        category
                                                    }
                                                </h3>

                                                <p className="text-[10px] text-slate-400">
                                                    {
                                                        categoryDocuments.length
                                                    }{" "}
                                                    document
                                                    {categoryDocuments.length !==
                                                    1
                                                        ? "s"
                                                        : ""}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                                            {categoryDocuments.map(
                                                (
                                                    document
                                                ) => (
                                                    <DocumentCard
                                                        key={
                                                            document.checklistId ||
                                                            document.id
                                                        }
                                                        document={
                                                            document
                                                        }
                                                        uploaded={
                                                            uploadedMap[
                                                                document.checklistId ||
                                                                    document.id
                                                            ]
                                                        }
                                                        onUpload={
                                                            handleUpload
                                                        }
                                                        onRemove={
                                                            handleRemove
                                                        }
                                                        onMarkAdded={
                                                            handleMarkAdded
                                                        }
                                                        onView={
                                                            handleView
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </section>
                                );
                            }
                        )}
                    </div>
                )}

                {/* ================================================= */}
                {/* Bottom Notice                                     */}
                {/* ================================================= */}

                <div
                    className="
                        mt-8
                        rounded-2xl
                        border
                        border-sky-100
                        bg-sky-50/70
                        p-4
                    "
                >
                    <div className="flex items-start gap-3">
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-sky-600
                                shadow-sm
                            "
                        >
                            <ShieldCheck className="h-4 w-4" />
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-slate-800">
                                Keep your documents application-ready
                            </h3>

                            <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                A document marked as
                                gathered counts toward
                                your readiness percentage.
                                Uploading the PDF is
                                recommended so your
                                application materials stay
                                organized in ScholarX.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===================================================== */}
            {/* Add Custom Document Modal                            */}
            {/* ===================================================== */}

            {showAddForm && (
                <AddDocumentForm
                    onClose={() =>
                        setShowAddForm(
                            false
                        )
                    }
                    onAdd={
                        handleAddCustom
                    }
                />
            )}

            {/* ===================================================== */}
            {/* PDF Viewer                                            */}
            {/* ===================================================== */}

            {viewingDocument && (
                <div
                    className="
                        fixed
                        inset-0
                        z-60
                        flex
                        flex-col
                        bg-slate-950/90
                        backdrop-blur-sm
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-white/10
                            bg-slate-950
                            px-4
                            py-3
                        "
                    >
                        <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-white">
                                {
                                    viewingDocument.name
                                }
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                                {
                                    viewingDocument.fileName
                                }
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={
                                    viewingDocument.url
                                }
                                download={
                                    viewingDocument.fileName
                                }
                                className="
                                    inline-flex
                                    h-9
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    bg-white/10
                                    px-3
                                    text-[10px]
                                    font-bold
                                    text-white
                                    transition
                                    hover:bg-white/20
                                "
                            >
                                <Download className="h-3.5 w-3.5" />

                                Download
                            </a>

                            <button
                                type="button"
                                onClick={() => {
                                    URL.revokeObjectURL(
                                        viewingDocument.url
                                    );

                                    setViewingDocument(
                                        null
                                    );
                                }}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white/10
                                    text-white
                                    transition
                                    hover:bg-white/20
                                "
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="min-h-0 flex-1 p-3">
                        <iframe
                            title={
                                viewingDocument.name
                            }
                            src={
                                viewingDocument.url
                            }
                            className="
                                h-full
                                w-full
                                rounded-xl
                                bg-white
                            "
                        />
                    </div>
                </div>
            )}
        </div>
    );
}