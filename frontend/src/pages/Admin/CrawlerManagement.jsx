import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Play, Loader2, RefreshCw, CheckCircle2, XCircle, Terminal } from "lucide-react";
import { Link } from "react-router";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000");
const countries = [{
  country: "China",
  flag: "🇨🇳",
  processes: [
    { id: "china_crawler", title: "Scholarship Crawler", script: "backend/crawler/china_crawler.py", description: "Extract scholarship information from the stored HTML source and save records to the database." },
    { id: "china_rules", title: "Eligibility Parser", script: "backend/ai/china/runner.py", description: "Generate eligibility rules from the China scholarship records already stored in the database." },
  ],
}];
const initialStatus = { status: "idle", process: null, message: "No crawler execution has been recorded.", started_at: null, finished_at: null, log_tail: "" };
const dateText = (v) => !v ? "—" : (Number.isNaN(new Date(v).getTime()) ? v : new Date(v).toLocaleString());
const Status = ({ value }) => {
  const styles = { idle: "bg-slate-100 text-slate-600", queued: "bg-amber-100 text-amber-800", running: "bg-sky-100 text-sky-800", completed: "bg-emerald-100 text-emerald-800", failed: "bg-rose-100 text-rose-800" };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${styles[value] || styles.idle}`}>{value || "idle"}</span>;
};

export default function CrawlerManagement() {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [starting, setStarting] = useState("");
  const [error, setError] = useState("");

  const request = useCallback(async (path, options = {}) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Your session has expired. Please sign in again.");
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || data.message || "Crawler request failed.");
    return data;
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try { setStatus(await request("/api/admin/crawler/status")); setError(""); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [request]);

  useEffect(() => {
    // Defer the first stateful refresh until after the effect has completed.
    const first = window.setTimeout(refresh, 0);
    const interval = window.setInterval(refresh, 5000);
    return () => { window.clearTimeout(first); window.clearInterval(interval); };
  }, [refresh]);

  const run = async (process) => {
    if (starting || ["queued", "running"].includes(status.status)) return;
    if (!window.confirm(`Run ${process.title}? This may update scholarship records in the database.`)) return;
    setStarting(process.id); setError("");
    try {
      const result = await request("/api/admin/crawler/run", { method: "POST", body: JSON.stringify({ process: process.id }) });
      setStatus(result);
      await refresh();
    } catch (e) { setError(e.message); }
    finally { setStarting(""); }
  };
  const busy = Boolean(starting) || ["queued", "running"].includes(status.status);
  const activeProcess = countries.flatMap(c => c.processes).find(p => p.id === status.process);

  return <div className="mx-auto max-w-7xl space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><Link to="/admin" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-900"><ArrowLeft size={16}/> Back to overview</Link><h1 className="text-2xl font-bold text-slate-900">Crawler Management</h1><p className="mt-1 text-sm text-slate-500">Manage country crawlers and eligibility parsers.</p></div>
      <button onClick={refresh} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""}/> Refresh status</button>
    </div>
    {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}
    {countries.map(country => <section key={country.country} className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4"><div className="flex items-center gap-3"><span className="text-2xl">{country.flag}</span><div><h2 className="font-bold text-slate-800">{country.country}</h2><p className="text-xs text-slate-500">Country data pipeline</p></div></div><span className="text-xs font-medium text-slate-500">{country.processes.length} processes</span></div>
      <div className="divide-y divide-slate-100">{country.processes.map(p => <div key={p.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3"><div className="mt-1 rounded-xl bg-sky-50 p-3 text-sky-600"><Terminal size={20}/></div><div className="min-w-0"><h3 className="font-semibold text-slate-800">{p.title}</h3><p className="mt-1 text-sm text-slate-500">{p.description}</p><code className="mt-2 inline-block break-all rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-500">{p.script}</code></div></div>
        <button onClick={() => run(p)} disabled={busy} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300">{starting === p.id || (status.process === p.id && busy) ? <Loader2 size={16} className="animate-spin"/> : <Play size={16}/>}Run {p.title}</button>
      </div>)}</div>
    </section>)}
    <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-slate-800">Latest execution</h2><p className="mt-1 text-xs text-slate-500">Automatically refreshes every five seconds.</p></div><Status value={status.status}/></div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Process</p><p className="mt-1 text-sm font-semibold">{activeProcess?.title || status.process || "—"}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Started</p><p className="mt-1 text-sm font-semibold">{dateText(status.started_at)}</p></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Finished</p><p className="mt-1 text-sm font-semibold">{dateText(status.finished_at)}</p></div></div>
      <p className="mt-4 text-sm text-slate-600">{status.message}</p>
      {status.status === "completed" && <p className="mt-3 flex items-center gap-2 text-sm text-emerald-700"><CheckCircle2 size={16}/> Completed successfully</p>}
      {status.status === "failed" && <p className="mt-3 flex items-center gap-2 text-sm text-rose-700"><XCircle size={16}/> Process failed</p>}
      {status.log_tail && <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{status.log_tail}</pre>}
    </section>
    <p className="text-xs text-slate-400">Only the China crawler and parser are currently configured. Add another country after its backend process ID and script are implemented.</p>
  </div>;
}
