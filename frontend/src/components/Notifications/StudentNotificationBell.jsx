import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck, LoaderCircle } from "lucide-react";
import { NavLink } from "react-router";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const isUnread = (value) =>
  value === 0 || value === false || value === "0";

export default function StudentNotificationBell() {
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const headers = getAuthHeaders();

      const [listResponse, countResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/notifications?limit=15`, { headers }),
        fetch(`${API_BASE_URL}/api/notifications/unread-count`, { headers }),
      ]);

      if (!listResponse.ok || !countResponse.ok) {
        const failedResponse = !listResponse.ok
          ? listResponse
          : countResponse;
        const body = await failedResponse.json().catch(() => ({}));
        throw new Error(
          body.detail || `Could not load notifications (${failedResponse.status}).`
        );
      }

      const [listData, countData] = await Promise.all([
        listResponse.json(),
        countResponse.json(),
      ]);

      setItems(Array.isArray(listData.items) ? listData.items : []);
      setUnreadCount(Number(countData.unread_count ?? 0));
      setError("");
    } catch (err) {
      console.error("Could not load notifications:", err);
      setError(err.message || "Could not load notifications.");
    }
  }, []);

  useEffect(() => {
    loadNotifications();

    const intervalId = window.setInterval(loadNotifications, 30000);
    return () => window.clearInterval(intervalId);
  }, [loadNotifications]);

  const markRead = async (notificationId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || "Could not mark notification as read.");
      }

      setItems((previous) =>
        previous.map((item) =>
          item.notification_id === notificationId
            ? { ...item, is_read: 1 }
            : item
        )
      );
      setUnreadCount((previous) => Math.max(0, previous - 1));
      setError("");
      await loadNotifications();
    } catch (err) {
      console.error("Could not mark notification as read:", err);
      setError(err.message || "Could not update notification.");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token || unreadCount === 0 || loading) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notifications/read-all`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || "Could not mark all as read.");
      }

      setItems((previous) =>
        previous.map((item) => ({ ...item, is_read: 1 }))
      );
      setUnreadCount(0);
      setError("");
    } catch (err) {
      console.error("Could not mark all notifications as read:", err);
      setError(err.message || "Could not update notifications.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          if (!open) loadNotifications();
        }}
        aria-label={`Notifications (${unreadCount} unread)`}
        aria-expanded={open}
        className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
      >
        <Bell size={21} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-[min(90vw,380px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <p className="text-xs text-slate-500">
                {unreadCount} unread
              </p>
            </div>

            <button
              type="button"
              onClick={markAllRead}
              disabled={loading || unreadCount === 0}
              className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 disabled:opacity-40"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>

          {error && (
            <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">
                {error ? "Notifications could not be loaded." : "No notifications yet."}
              </p>
            ) : (
              items.map((item) => (
                <button
                  type="button"
                  key={item.user_notification_id}
                  onClick={() => isUnread(item.is_read) && markRead(item.notification_id)}
                  className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${
                    isUnread(item.is_read) ? "bg-sky-50/60" : "bg-white"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isUnread(item.is_read) && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-sky-600" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-xs leading-5 text-slate-600">
                        {item.message}
                      </p>
                      <p className="mt-2 text-[11px] text-slate-400">
                        {item.delivered_at
                          ? new Date(item.delivered_at).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {loading && (
            <div className="flex justify-center border-t border-slate-100 p-2">
              <LoaderCircle
                size={16}
                className="animate-spin text-sky-600"
              />
            </div>
          )}

          <div className="border-t border-slate-100 px-4 py-3">
            <NavLink
              to="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold text-sky-700 hover:text-sky-800"
            >
              View all notifications
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}
