import { useEffect, useState } from "react";
import {
    History,
    ChevronDown,
    RefreshCw,
    CheckCircle2,
    CircleAlert,
    XCircle,
} from "lucide-react";

const API_BASE_URL = (
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

function getStatus(status) {
    const config = {
        met: {
            label: "Passed",
            className: "bg-emerald-50 text-emerald-700",
            icon: CheckCircle2,
        },
        not_met: {
            label: "Not met",
            className: "bg-rose-50 text-rose-700",
            icon: XCircle,
        },
        unknown: {
            label: "Review",
            className: "bg-amber-50 text-amber-700",
            icon: CircleAlert,
        },
        not_applicable: {
            label: "Not applicable",
            className: "bg-slate-100 text-slate-600",
            icon: CircleAlert,
        },
    };

    return config[status] || config.unknown;
}

export default function EligibilityHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(null);

    const loadHistory = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Please log in to view your eligibility history.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_BASE_URL}/api/matching/history`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || "Unable to load eligibility history."
                );
            }

            setHistory(data.history || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    return (
        <section className="mx-auto max-w-7xl px-3 pb-16 sm:px-6 lg:px-8">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-sky-600">
                        <History size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">
                            Saved analyses
                        </span>
                    </div>

                    <h2 className="text-2xl font-black text-slate-950">
                        Eligibility Check History
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Your previously completed scholarship eligibility checks.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadHistory}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={15}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    Loading saved analyses...
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                    {error}
                </div>
            ) : history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <History className="mx-auto text-slate-400" size={30} />

                    <h3 className="mt-3 font-bold text-slate-800">
                        No saved eligibility checks yet
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        Your completed analyses will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {history.map((item) => {
                        const summary = item.summary || {};
                        const score = summary.eligibility_score || {};
                        const isOpen = expanded === item.check_uuid;

                        return (
                            <div
                                key={item.check_uuid}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">
                                            {item.scholarship_title || "Scholarship"}
                                        </h3>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {item.country || "Country not specified"}
                                            {item.program_name
                                                ? ` · ${item.program_name}`
                                                : ""}
                                        </p>

                                        <p className="mt-2 text-xs text-slate-400">
                                            {item.created_at
                                                ? new Date(item.created_at).toLocaleString()
                                                : "Date unavailable"}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-black text-sky-600">
                                                {score.score ?? 0}%
                                            </p>
                                            <p className="text-[10px] font-bold uppercase text-slate-400">
                                                Fit score
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpanded(
                                                    isOpen ? null : item.check_uuid
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            {isOpen ? "Hide" : "Details"}
                                            <ChevronDown
                                                size={16}
                                                className={isOpen ? "rotate-180" : ""}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="border-t border-slate-100 bg-slate-50 p-5">
                                        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-xl font-black text-slate-800">
                                                    {score.total_rules ?? item.requirements.length}
                                                </p>
                                                <p className="text-xs text-slate-500">Total rules</p>
                                            </div>

                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-xl font-black text-emerald-600">
                                                    {score.met_rules ?? 0}
                                                </p>
                                                <p className="text-xs text-slate-500">Passed</p>
                                            </div>

                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-xl font-black text-rose-600">
                                                    {score.not_met_rules ?? 0}
                                                </p>
                                                <p className="text-xs text-slate-500">Not met</p>
                                            </div>

                                            <div className="rounded-xl bg-white p-3">
                                                <p className="text-xl font-black text-amber-600">
                                                    {score.unknown_rules ?? 0}
                                                </p>
                                                <p className="text-xs text-slate-500">Needs review</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {item.requirements.map((rule, index) => {
                                                const status = getStatus(rule.status);
                                                const StatusIcon = status.icon;
                                                const ruleData = rule.rule_data || {};

                                                return (
                                                    <div
                                                        key={`${rule.rule_id}-${index}`}
                                                        className="rounded-xl border border-slate-200 bg-white p-4"
                                                    >
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <p className="font-bold text-slate-800">
                                                                {ruleData.attribute ||
                                                                    ruleData.rule_type ||
                                                                    `Requirement #${rule.rule_id}`}
                                                            </p>

                                                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${status.className}`}>
                                                                <StatusIcon size={13} />
                                                                {status.label}
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                                                            <p className="text-slate-600">
                                                                <strong>Student value:</strong>{" "}
                                                                {rule.student_value ?? "Not specified"}
                                                            </p>

                                                            <p className="text-slate-600">
                                                                <strong>Required value:</strong>{" "}
                                                                {rule.required_value ?? "Not specified"}
                                                            </p>
                                                        </div>

                                                        {rule.reason && (
                                                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                                                {rule.reason}
                                                            </p>
                                                        )}

                                                        {rule.recommendation && (
                                                            <p className="mt-2 rounded-lg bg-sky-50 p-3 text-sm leading-6 text-sky-800">
                                                                <strong>Recommendation:</strong>{" "}
                                                                {rule.recommendation}
                                                            </p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}