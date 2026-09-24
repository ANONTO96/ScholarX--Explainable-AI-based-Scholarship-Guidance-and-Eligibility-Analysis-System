import {
    Bell,
    CalendarDays,
    CheckCheck,
    FileCheck2,
    FileText,
    Target,
    UserRound,
} from "lucide-react";
import { NavLink } from "react-router";
import { useState } from "react";
import { useDashboard } from "../../context/Dashboard/useDashboard";

const Notifications = () => {
    const {
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
    } = useDashboard();

    const [filter, setFilter] = useState("all");

    const unreadCount = notifications.filter(
        (notification) => notification.unread
    ).length;

    const filteredNotifications =
        filter === "unread"
            ? notifications.filter((notification) => notification.unread)
            : notifications;

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
        <div className="mx-auto max-w-6xl py-6 lg:py-8">
            {/* Header */}
            <div className="mb-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
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
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllNotificationsRead}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-xs font-bold text-sky-600 transition hover:bg-sky-50"
                        >
                            <CheckCheck className="h-4 w-4" />
                            Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {/* Summary */}
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
                    <p className="text-xs font-medium text-slate-400">
                        Unread
                    </p>

                    <p className="mt-1 text-2xl font-bold text-sky-600">
                        {unreadCount}
                    </p>
                </div>

                <div className="hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:block">
                    <p className="text-xs font-medium text-slate-400">
                        Status
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                        {unreadCount > 0
                            ? "You have updates"
                            : "You're all caught up"}
                    </p>
                </div>
            </div>

            {/* Notification card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Filter header */}
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900">
                            Your notifications
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-400">
                            {filter === "unread"
                                ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"
                                }`
                                : `${notifications.length} notification${notifications.length === 1 ? "" : "s"
                                }`}
                        </p>
                    </div>

                    <div className="flex w-fit items-center rounded-xl bg-slate-100 p-1">
                        <button
                            type="button"
                            onClick={() => setFilter("all")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === "all"
                                ? "bg-white text-slate-800 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            All
                        </button>

                        <button
                            type="button"
                            onClick={() => setFilter("unread")}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${filter === "unread"
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

                {/* List */}
                {filteredNotifications.length === 0 ? (
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
                                ? "You're all caught up. There are no unread notifications right now."
                                : "We'll notify you when there is something important about your scholarship journey."}
                        </p>

                        {filter === "unread" && notifications.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setFilter("all")}
                                className="mt-5 rounded-xl bg-sky-50 px-4 py-2.5 text-xs font-bold text-sky-600 transition hover:bg-sky-100"
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
                                    key={notification.id}
                                    to={
                                        notification.link ||
                                        "/dashboard/notifications"
                                    }
                                    onClick={() =>
                                        markNotificationRead(notification.id)
                                    }
                                    className={`
                    flex gap-4 border-b border-slate-100
                    px-5 py-5 transition last:border-b-0
                    sm:px-6
                    ${notification.unread
                                            ? "bg-sky-50/40 hover:bg-sky-50"
                                            : "bg-white hover:bg-slate-50"
                                        }
                  `}
                                >
                                    {/* Icon */}
                                    <div
                                        className={`
                      flex h-11 w-11 shrink-0 items-center justify-center
                      rounded-xl
                      ${notification.unread
                                                ? "bg-sky-100 text-sky-600"
                                                : "bg-slate-100 text-slate-500"
                                            }
                    `}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-2">
                                                <h3
                                                    className={`truncate text-sm ${notification.unread
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
                                            <span
                                                className={`
                          rounded-full px-2.5 py-1 text-[10px] font-bold capitalize
                          ${notification.unread
                                                        ? "bg-sky-100 text-sky-600"
                                                        : "bg-slate-100 text-slate-500"
                                                    }
                        `}
                                            >
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