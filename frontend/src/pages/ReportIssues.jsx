import { useMemo, useState } from "react";
import {
    AlertCircle,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    ClipboardCheck,
    FileText,
    Headphones,
    Info,
    LifeBuoy,
    MessageSquare,
    Paperclip,
    Search,
    Send,
    Sparkles,
    Upload,
    X,
} from "lucide-react";
import { NavLink } from "react-router";

const resolvedIssues = [
    {
        id: 1,
        title: "Unable to upload documents",
        description:
            "Users were unable to upload required documents during the application process.",
        category: "Application",
        resolvedDate: "May 18, 2026",
        details:
            "The document upload service was experiencing an issue that prevented some users from attaching PDF and image files. The upload service has been fixed and document submissions are now working normally.",
        icon: FileText,
        iconStyle: "bg-emerald-50 text-emerald-600",
    },
    {
        id: 2,
        title: "Payment not going through",
        description:
            "Some payments were failing at the final step for certain banks.",
        category: "Payment",
        resolvedDate: "May 16, 2026",
        details:
            "A payment gateway configuration issue caused selected transactions to fail. The configuration has been corrected and payment processing is operating normally.",
        icon: ClipboardCheck,
        iconStyle: "bg-sky-50 text-sky-600",
    },
    {
        id: 3,
        title: "Email notifications not received",
        description:
            "Users were not receiving email notifications for important updates.",
        category: "Notifications",
        resolvedDate: "May 12, 2026",
        details:
            "Some notification emails were delayed because of a temporary email delivery problem. The service has been restored and notifications are now being delivered normally.",
        icon: MessageSquare,
        iconStyle: "bg-violet-50 text-violet-600",
    },
    {
        id: 4,
        title: "Profile picture not updating",
        description:
            "Profile picture changes were not being reflected for some users.",
        category: "Account",
        resolvedDate: "May 10, 2026",
        details:
            "An image caching issue prevented newly uploaded profile pictures from appearing immediately. The caching behavior has been corrected.",
        icon: CircleHelp,
        iconStyle: "bg-amber-50 text-amber-600",
    },
    {
        id: 5,
        title: "Scholarship search results not loading",
        description:
            "Scholarship search results were occasionally not appearing after applying filters.",
        category: "Scholarships",
        resolvedDate: "May 7, 2026",
        details:
            "A filtering issue caused some combinations of search filters to return an empty result even when matching scholarships existed. The filtering system has been updated.",
        icon: BookOpen,
        iconStyle: "bg-blue-50 text-blue-600",
    },
    {
        id: 6,
        title: "Dashboard statistics showing incorrect values",
        description:
            "Some students saw outdated statistics on their dashboard.",
        category: "Dashboard",
        resolvedDate: "May 4, 2026",
        details:
            "Dashboard statistics were not refreshing correctly after certain profile changes. The data refresh mechanism has been fixed.",
        icon: ClipboardCheck,
        iconStyle: "bg-indigo-50 text-indigo-600",
    },
];

const issueTypes = [
    "Account & Profile",
    "Application",
    "Scholarship",
    "Payment & Billing",
    "Technical Problem",
    "Website Error",
    "Other",
];

const categories = [
    "All Categories",
    "Application",
    "Payment",
    "Notifications",
    "Account",
    "Scholarships",
    "Dashboard",
];

export default function ReportIssue() {
    const [activeTab, setActiveTab] = useState("report");

    const [formData, setFormData] = useState({
        issueType: "",
        area: "",
        subject: "",
        description: "",
    });

    const [attachment, setAttachment] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [search, setSearch] = useState("");
    const [expandedIssue, setExpandedIssue] = useState(null);

    const filteredIssues = useMemo(() => {
        return resolvedIssues.filter((issue) => {
            const matchesCategory =
                selectedCategory === "All Categories" ||
                issue.category === selectedCategory;

            const searchText = search.toLowerCase();

            const matchesSearch =
                issue.title.toLowerCase().includes(searchText) ||
                issue.description.toLowerCase().includes(searchText) ||
                issue.category.toLowerCase().includes(searchText);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, search]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Please select a file smaller than 5MB.");
            return;
        }

        setAttachment(file);
    };

    const removeAttachment = () => {
        setAttachment(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log({
            ...formData,
            attachment,
        });

        // Connect this with your backend/API here.
        alert("Your issue has been submitted successfully.");

        setFormData({
            issueType: "",
            area: "",
            subject: "",
            description: "",
        });

        setAttachment(null);
    };

    return (
        <main className="min-h-screen bg-slate-50">
            {/* ========================================================= */}
            {/* HERO */}
            {/* ========================================================= */}

            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                {/* Background decorations */}

                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

                    <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />

                    <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-sky-200/20 blur-3xl" />

                    {/* Grid */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
            linear-gradient(to right,#2563eb 1px,transparent 1px),
            linear-gradient(to bottom,#2563eb 1px,transparent 1px)
          `,
                            backgroundSize: "60px 60px",
                        }}
                    />
                </div>

                <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-40 lg:px-8 lg:pb-16">

                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
                        {/* Hero content */}

                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100 px-5 py-2 text-sm font-semibold text-sky-600 shadow-sm backdrop-blur-3xl">
                                <Sparkles size={16} />
                                Student Support
                            </div>

                            <h1 className="mt-7 text-5xl font-black leading-tight text-slate-900 lg:text-7xl">
                                Report an{" "}
                                <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                                    Issue
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-500">
                                Facing a problem? Let us know so our support
                                team can investigate it and improve your
                                ScholarX experience.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    Fast support
                                </div>

                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    Track resolved issues
                                </div>

                                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    Student-first support
                                </div>
                            </div>
                        </div>

                        {/* Hero visual */}

                        <div className="relative hidden h-64 lg:block">
                            <div className="absolute right-12 top-4 h-48 w-48 rounded-[3rem] bg-linear-to-br from-indigo-100 to-purple-100 rotate-6" />

                            <div className="absolute right-0 top-0 h-48 w-48 rounded-[3rem] bg-white shadow-2xl shadow-indigo-100">
                                <div className="flex h-full flex-col items-center justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200">
                                        <MessageSquare className="h-10 w-10" />
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-700">
                                        <AlertCircle className="h-4 w-4 text-purple-500" />
                                        We're listening
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-35 left-26 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
                                <Headphones className="h-7 w-7 text-indigo-600" />
                            </div>

                            <div className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-purple-500" />
                            <div className="absolute bottom-16 right-46 h-3 w-3 rounded-full bg-indigo-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* TABS */}
            {/* ========================================================= */}

            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex gap-8">
                        <button
                            type="button"
                            onClick={() => setActiveTab("report")}
                            className={`relative flex items-center gap-2 py-5 text-sm font-bold transition ${activeTab === "report"
                                    ? "text-blue-600"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <MessageSquare className="h-5 w-5" />
                            Report New Issue

                            {activeTab === "report" && (
                                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab("resolved")}
                            className={`relative flex items-center gap-2 py-5 text-sm font-bold transition ${activeTab === "resolved"
                                    ? "text-blue-600"
                                    : "text-slate-500 hover:text-slate-800"
                                }`}
                        >
                            <CheckCircle2 className="h-5 w-5" />
                            Resolved Issues

                            {activeTab === "resolved" && (
                                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
                            )}
                        </button>
                    </div>
                </div>
            </section>

            {/* ========================================================= */}
            {/* CONTENT */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
                {/* ===================================================== */}
                {/* REPORT ISSUE */}
                {/* ===================================================== */}

                {activeTab === "report" && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-black tracking-tight text-slate-950">
                                Report a New Issue
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Fill out the form below and our support team
                                will look into it.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                        >
                            <div className="grid gap-6 lg:grid-cols-2">
                                {/* Issue Type */}

                                <div>
                                    <label
                                        htmlFor="issueType"
                                        className="mb-2 block text-sm font-bold text-slate-800"
                                    >
                                        Issue Type
                                    </label>

                                    <div className="relative">
                                        <select
                                            id="issueType"
                                            name="issueType"
                                            value={formData.issueType}
                                            onChange={handleChange}
                                            required
                                            className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                        >
                                            <option value="">
                                                Select issue type
                                            </option>

                                            {issueTypes.map((type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </option>
                                            ))}
                                        </select>

                                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    </div>
                                </div>

                                {/* Area */}

                                <div>
                                    <label
                                        htmlFor="area"
                                        className="mb-2 block text-sm font-bold text-slate-800"
                                    >
                                        Area / Page{" "}
                                        <span className="font-normal text-slate-400">
                                            (Optional)
                                        </span>
                                    </label>

                                    <input
                                        id="area"
                                        name="area"
                                        value={formData.area}
                                        onChange={handleChange}
                                        placeholder="Where did you encounter the issue?"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                {/* Subject */}

                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-sm font-bold text-slate-800"
                                    >
                                        Subject
                                    </label>

                                    <input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Short summary of the issue"
                                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />
                                </div>

                                {/* Attachment */}

                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-800">
                                        Attachments{" "}
                                        <span className="font-normal text-slate-400">
                                            (Optional)
                                        </span>
                                    </label>

                                    {!attachment ? (
                                        <label
                                            htmlFor="attachment"
                                            className="group flex h-13 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 text-sm font-medium text-slate-500 transition hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-600"
                                        >
                                            <Upload className="h-4 w-4" />

                                            <span>
                                                Click to upload an image or
                                                document
                                            </span>

                                            <input
                                                id="attachment"
                                                type="file"
                                                accept="image/*,.pdf,.doc,.docx"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        <div className="flex h-13 items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <Paperclip className="h-4 w-4 shrink-0 text-indigo-600" />

                                                <span className="truncate text-sm font-medium text-slate-700">
                                                    {attachment.name}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={removeAttachment}
                                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-white hover:text-red-500"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}

                                <div className="lg:col-span-1">
                                    <label
                                        htmlFor="description"
                                        className="mb-2 block text-sm font-bold text-slate-800"
                                    >
                                        Description
                                    </label>

                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={7}
                                        placeholder="Please describe the issue in detail..."
                                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                                    />

                                    <div className="mt-3 inline-flex items-center gap-2 text-xs text-slate-400">
                                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />

                                        <span>
                                            Include as much detail as possible
                                            so we can resolve it faster.
                                        </span>
                                    </div>
                                </div>

                                {/* Side information */}

                                <div className="flex flex-col justify-between rounded-2xl bg-slate-50 p-6">
                                    <div>
                                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                                            <LifeBuoy className="h-5 w-5" />
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900">
                                            Need help describing the issue?
                                        </h3>

                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            Tell us what you were trying to do,
                                            what happened, and what you expected
                                            to happen instead.
                                        </p>

                                        <div className="mt-5 space-y-3">
                                            {[
                                                "What were you trying to do?",
                                                "What went wrong?",
                                                "What did you expect?",
                                            ].map((item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center gap-2 text-sm text-slate-600"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 via-indigo-600 to-sky-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-200"
                                    >
                                        <Send className="h-4 w-4" />
                                        Submit Issue
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Bottom note */}

                        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
                            <Info className="h-4 w-4" />
                            Our support team will review your report and
                            contact you if additional information is needed.
                        </div>
                    </div>
                )}

                {/* ===================================================== */}
                {/* RESOLVED ISSUES */}
                {/* ===================================================== */}

                {activeTab === "resolved" && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-black tracking-tight text-slate-950">
                                Resolved Issues
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Browse issues that have already been resolved
                                by our support team.
                            </p>
                        </div>

                        {/* Filters */}

                        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* Category */}

                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) =>
                                        setSelectedCategory(e.target.value)
                                    }
                                    className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                >
                                    {categories.map((category) => (
                                        <option
                                            key={category}
                                            value={category}
                                        >
                                            {category}
                                        </option>
                                    ))}
                                </select>

                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>

                            {/* Search */}

                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search resolved issues..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                                />
                            </div>
                        </div>

                        {/* Issue list */}

                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                            {filteredIssues.length > 0 ? (
                                filteredIssues.map((issue, index) => {
                                    const Icon = issue.icon;
                                    const isExpanded =
                                        expandedIssue === issue.id;

                                    return (
                                        <div
                                            key={issue.id}
                                            className={
                                                index !==
                                                    filteredIssues.length - 1
                                                    ? "border-b border-slate-200"
                                                    : ""
                                            }
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setExpandedIssue(
                                                        isExpanded
                                                            ? null
                                                            : issue.id
                                                    )
                                                }
                                                className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-slate-50 sm:p-6"
                                            >
                                                {/* Icon */}

                                                <div
                                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${issue.iconStyle}`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                </div>

                                                {/* Main */}

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-bold text-slate-900">
                                                            {issue.title}
                                                        </h3>

                                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-600">
                                                            Resolved
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 truncate text-sm text-slate-500">
                                                        {issue.description}
                                                    </p>
                                                </div>

                                                {/* Date */}

                                                <div className="hidden items-center gap-2 text-sm text-slate-400 md:flex">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                                                    <span>
                                                        Resolved on{" "}
                                                        {issue.resolvedDate}
                                                    </span>
                                                </div>

                                                {/* Arrow */}

                                                <ChevronDown
                                                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isExpanded
                                                            ? "rotate-180"
                                                            : ""
                                                        }`}
                                                />
                                            </button>

                                            {/* Expanded content */}

                                            {isExpanded && (
                                                <div className="border-t border-slate-100 bg-slate-50 px-5 pb-6 pt-5 sm:px-6">
                                                    <div className="ml-0 max-w-3xl md:ml-16">
                                                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                            <span>
                                                                Resolution
                                                            </span>

                                                            <span className="h-1 w-1 rounded-full bg-slate-300" />

                                                            <span>
                                                                {
                                                                    issue.category
                                                                }
                                                            </span>
                                                        </div>

                                                        <p className="text-sm leading-7 text-slate-600">
                                                            {issue.details}
                                                        </p>

                                                        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            This issue has been
                                                            resolved.
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="px-6 py-16 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                        <Search className="h-6 w-6" />
                                    </div>

                                    <h3 className="mt-4 font-bold text-slate-900">
                                        No issues found
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Try changing your search or category
                                        filter.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Results count */}

                        <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                            <span>
                                Showing{" "}
                                <span className="font-semibold text-slate-600">
                                    {filteredIssues.length}
                                </span>{" "}
                                resolved issues
                            </span>

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedCategory("All Categories");
                                }}
                                className="font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* ========================================================= */}
            {/* SUPPORT BANNER */}
            {/* ========================================================= */}

            <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-sky-600 px-6 py-10 sm:px-10">
        {/* Sky + Indigo glow */}
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-500/20 blur-3xl" />

        <div className="absolute -bottom-24 left-20 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Subtle center glow */}
        <div className="absolute right-1/3 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-300">
                    <Headphones className="h-4 w-4" />
                    Need more help?
                </div>

                <h2 className="text-2xl font-black text-white sm:text-3xl">
                    Can't find what you're looking for?
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    Our support team is ready to help you with
                    anything related to your ScholarX journey.
                </p>
            </div>

            <NavLink
                to="/book-consultation"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-900 transition-all hover:scale-104 hover:bg-base-200"
            >
                Book Consultation
                <ChevronRight className="h-4 w-4" />
            </NavLink>
        </div>
    </div>
</section>
        </main>
    );
}
