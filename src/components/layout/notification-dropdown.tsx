"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/lib/dashboard-mock-data";
import { cn } from "@/lib/utils";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([...mockNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon-lg"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
      </Button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close notifications"
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-border bg-popover shadow-lg">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Mark all read
                </button>
              ) : null}
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className={cn(
                      "w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                      !notification.read && "bg-muted/60",
                    )}
                  >
                    <p className="font-medium">{notification.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{notification.message}</p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
