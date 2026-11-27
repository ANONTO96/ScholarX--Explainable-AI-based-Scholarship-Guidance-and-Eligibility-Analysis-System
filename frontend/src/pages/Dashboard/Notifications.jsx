import {
  Bell,
  CalendarDays,
  CheckCheck,
  FileCheck2,
  FileText,
  RefreshCw,
  Target,
  UserRound,
} from "lucide-react";
import { NavLink } from "react-router";
import { useCallback, useEffect, useState } from "react";

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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please log in to view your notifications.");
      }

      const response = await fetch(`${API_BASE_URL}/api/notifications`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body.detail || `Could not load notifications (${response.status}).`
        );
      }

      const data = await response.json();
      const records = Array.isArray(data.items) ? data.items : [];

      setNotifications(
        records.map((item) => ({
          id: item.notification_id,
          userNotificationId: item.user_notification_id,
          title: item.title,
          message: item.message,
          unread: isUnread(item.is_read),
          type: item.type || "notification",
          link: item.link || null,
          time: item.delivered_at
            ? new Date(item.delivered_at).toLocaleString()
            : "",
        }))
      );
      setError("");
    } catch (err) {
      console.error("Notification loading error:", err);
      setError(err.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => notification.unread)
      : notifications;

  const markNotificationRead = async (notificationId) => {
    const notification = notifications.find(
      (item) => item.id === notificationId
    );

    if (!notification || !notification.unread) return;

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

      setNotifications((previous) =>
        previous.map((item) =>
          item.id === notificationId ? { ...item, unread: false } : item
        )
      );
      setError("");
    } catch (err) {
      console.error("Mark notification read error:", err);
      setError(err.message || "Could not update notification.");
    }
  };

  const markAllNotificationsRead = async () => {
    if (unreadCount === 0 || updating) return;

    setUpdating(true);
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

      setNotifications((previous) =>
        previous.map((item) => ({ ...item, unread: false }))
      );
      setError("");
    } catch (err) {
      console.error("Mark all notifications read error:", err);
      setError(err.message || "Could not update notifications.");
    } finally {
      setUpdating(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    fetchNotifications();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "profile":
        return UserRound;
      case "match":
        return Target;
      case "application":
        return FileCheck2;
      case "deadline":
        return CalendarDays;
      case "documents":
        return FileText;
      default:
        return Bell;
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
            <Bell className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Notifications
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Stay updated with your scholarship journey.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRetry}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsRead}
              disabled={updating}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-xs font-bold text-sky-600 transition hover:bg-sky-50 disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4" />
              {updating ? "Updating..." : "Mark all as read"}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{error}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">
            Total notifications
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {notifications.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-400">Unread</p>
          <p className="mt-1 text-2xl font-bold text-sky-600">{unreadCount}</p>
        </div>

        <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:block">
          <p className="text-xs font-medium text-slate-400">Status</p>
          <p className="mt-1 text-sm font-bold text-slate-700">
            {unreadCount > 0 ? "You have updates" : "You're all caught up"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Your notifications
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {filter === "unread"
                ? `${unreadCount} unread notifications`
                : `${notifications.length} notifications`}
            </p>
          </div>

          <div className="flex w-fit items-center rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === "all"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              All
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                filter === "unread"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <span className="ml-1.5 rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] text-sky-600">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <RefreshCw className="h-7 w-7 animate-spin text-sky-500" />
            <p className="mt-3 text-sm text-slate-500">
              Loading your notifications...
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Bell className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-700">
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </h3>

            <p className="mt-1 max-w-md text-xs leading-5 text-slate-400">
              {filter === "unread"
                ? "There are no unread notifications right now."
                : "You will see notifications here when they are sent to your account."}
            </p>

            {filter === "unread" && notifications.length > 0 && (
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-5 rounded-xl bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-600"
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type);

              return (
                <NavLink
                  key={notification.userNotificationId}
                  to={notification.link || "/dashboard/notifications"}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`flex gap-4 border-b border-slate-100 px-5 py-5 transition last:border-b-0 sm:px-6 ${
                    notification.unread
                      ? "bg-sky-50/40 hover:bg-sky-50"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      notification.unread
                        ? "bg-sky-100 text-sky-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3
                          className={`truncate text-sm ${
                            notification.unread
                              ? "font-bold text-slate-900"
                              : "font-semibold text-slate-700"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {notification.unread && (
                          <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                        )}
                      </div>

                      <span className="shrink-0 text-[10px] font-medium text-slate-400">
                        {notification.time}
                      </span>
                    </div>

                    <p className="mt-1.5 max-w-3xl text-xs leading-5 text-slate-500">
                      {notification.message}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold capitalize text-slate-500">
                        {notification.type}
                      </span>

                      {notification.unread && (
                        <span className="text-[10px] font-medium text-slate-400">
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </NavLink>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
