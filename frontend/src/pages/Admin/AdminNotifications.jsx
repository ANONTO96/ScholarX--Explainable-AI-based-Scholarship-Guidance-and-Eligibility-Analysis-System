import { useState } from "react";
import {
  ArrowLeft,
  BellRing,
  Globe,
  Mail,
  Send,
  Database,
  Info,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/+$/, "");

const channels = [
  {
    id: "in_app",
    label: "Website notifications",
    detail: "Show in students’ dashboard notification centre",
    icon: Globe,
  },
  {
    id: "email",
    label: "Email",
    detail: "Deliver through the configured SMTP/email provider",
    icon: Mail,
  },
];

export default function AdminNotifications() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all_students");
  const [selected, setSelected] = useState(["in_app"]);
  const [notice, setNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const toggle = (id) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    setNotice(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setNotice({
        type: "error",
        text: "Your login session was not found. Please sign in again.",
      });
      return;
    }

    if (!selected.length) {
      setNotice({ type: "error", text: "Select at least one delivery channel." });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/notifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          audience,
          channels: selected,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.detail || data.message || `Request failed (${response.status}).`);
      }

      const emailSummary = data.email
        ? ` Email: ${data.email.sent} sent, ${data.email.failed} failed.`
        : "";
      setNotice({
        type: "success",
        text: `Notification #${data.notification_id} created for ${data.recipient_count} students.${emailSummary}`,
      });
      setTitle("");
      setMessage("");
      setAudience("all_students");
      setSelected(["in_app"]);
    } catch (error) {
      setNotice({ type: "error", text: error.message || "Could not send notification." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          to="/admin"
          className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-900"
        >
          <ArrowLeft size={16} /> Back to overview
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
            <BellRing size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notification Centre</h1>
            <p className="mt-1 text-sm text-slate-500">
              Compose an announcement and choose where it should be delivered.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-5 rounded-2xl border border-sky-100 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="notification-title">
              Notification title
            </label>
            <input
              id="notification-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              placeholder="e.g. New scholarship opportunities available"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="notification-message">
              Message
            </label>
            <textarea
              id="notification-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={7}
              maxLength={2000}
              placeholder="Write the announcement for students..."
              className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
            <p className="mt-1 text-right text-xs text-slate-400">{message.length}/2000</p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700">Recipients</p>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option value="all_students">All students</option>
              <option value="active_students">Active student accounts</option>
            </select>
            <p className="mt-1 text-xs text-slate-400">
              Active accounts are determined by users.is_active in the database.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-700">Delivery channels</p>
            <div className="space-y-3">
              {channels.map(({ id, label, detail, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${selected.includes(id) ? "border-sky-300 bg-sky-50/60" : "border-slate-200 hover:bg-slate-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(id)}
                    onChange={() => toggle(id)}
                    className="mt-1 h-4 w-4 accent-sky-600"
                  />
                  <Icon size={19} className="mt-0.5 text-sky-600" />
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">{label}</span>
                    <span className="mt-1 block text-xs text-slate-500">{detail}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {notice && (
            <div
              role="status"
              className={`flex gap-2 rounded-xl border p-4 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}
            >
              {notice.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
              <span>{notice.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !title.trim() || !message.trim() || selected.length === 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {submitting ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
            {submitting ? "Sending..." : "Send Notification"}
          </button>
        </section>

        <aside className="h-fit space-y-4">
          <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-800">Delivery setup</h2>
            <div className="mt-4 flex gap-3">
              <Database size={19} className="shrink-0 text-sky-600" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Database storage</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Website notifications and read status are stored in MySQL.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Mail size={19} className="shrink-0 text-sky-600" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Email delivery</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Email requires SMTP environment variables on the backend. Email failures are reported separately.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <div className="flex gap-2">
              <Info size={17} className="mt-0.5 shrink-0 text-sky-700" />
              <p className="text-xs leading-5 text-sky-800">
                Website notifications are available to students after they sign in. Email delivery works only after SMTP is configured.
              </p>
            </div>
          </div>
        </aside>
      </form>
      <div className="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-500">
        Email delivery results are recorded independently from website notification delivery.
      </div>
    </div>
  );
}
