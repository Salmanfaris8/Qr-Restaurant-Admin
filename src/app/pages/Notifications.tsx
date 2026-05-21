import { useEffect, useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { AlertCircle, Loader, CheckCircle2, XCircle, Bell, Check } from "lucide-react";

const API = import.meta.env.VITE_API_URL;

interface Notification {
  id: string;
  type: "order" | "subscription" | "system";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const statusIcons = {
  open: AlertCircle,
  in_progress: Loader,
  resolved: CheckCircle2,
  closed: XCircle,
};

const statusColors = {
  open: "bg-orange-500",
  in_progress: "bg-blue-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  // 🔹 GET NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/hotel-admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data?.success && Array.isArray(data.data)) {
        const formatted = data.data.map((n: any) => ({
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          time: new Date(n.createdAt).toLocaleString(),
          read: n.isRead,
        }));

        setNotifications(formatted);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error(err);
      setNotifications([]);
    }
  };

  // 🔹 UNREAD COUNT
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(
        `${API}/hotel-admin/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data?.success) {
        setUnreadCount(data.count || 0);
      } else {
        setUnreadCount(0);
      }
    } catch (err) {
      console.error(err);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [token]);

  // 🔹 MARK AS READ
  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(
        `${API}/hotel-admin/notifications/${id}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data?.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
        );

        fetchUnreadCount();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 MARK ALL READ
  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.read)
          .map((n) => markAsRead(n.id))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getStatusFromTitle = (title: string) => {
    if (title.toLowerCase().includes("open")) return "open";
    if (title.toLowerCase().includes("in progress")) return "in_progress";
    if (title.toLowerCase().includes("resolved")) return "resolved";
    if (title.toLowerCase().includes("closed")) return "closed";
    return "open";
  };

  return (
    <div className="space-y-8">
      {/* HEADER (UNCHANGED) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Notifications
          </h1>
          <p className="text-gray-500 mt-1">
            Stay updated with your restaurant activity
          </p>
        </div>

        {unreadCount > 0 && (
          <Badge className="bg-red-500 text-lg px-4 py-2">
            {unreadCount} Unread
          </Badge>
        )}
      </div>

      {/* STATS (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-blue-500">
                  {notifications.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ RESOLVED COUNT */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved Tickets</p>
                <p className="text-2xl font-bold text-green-500">
                  {
                    notifications.filter((n) =>
                      n.title.toLowerCase().includes("resolved")
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ✅ CLOSED COUNT */}
        <Card className="bg-white shadow-sm border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Closed Tickets</p>
                <p className="text-2xl font-bold text-red-500">
                  {
                    notifications.filter((n) =>
                      n.title.toLowerCase().includes("closed")
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* LIST (UNCHANGED) */}
      <div className="space-y-3">
        {notifications.map((notification) => {
          const status = getStatusFromTitle(notification.title);

const Icon =
  statusIcons[status as keyof typeof statusIcons] || AlertCircle;

const colorClass =
  statusColors[status as keyof typeof statusColors] || "bg-gray-400";

          return (
            <Card
              key={notification.id}
              className={`bg-white shadow-sm border-gray-200 hover:shadow-md transition-all ${
                !notification.read ? "border-l-4 border-l-[#1E88E5]" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0`}>
  <Icon className="w-6 h-6 text-white" />
</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400">
                          {notification.time}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Badge className="bg-[#1E88E5]">New</Badge>
                        )}
                        {notification.read && (
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>
                    </div>

                    {!notification.read && (
                      <button
                        className="text-xs text-blue-500 mt-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ACTIONS (UNCHANGED) */}
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={handleMarkAllRead}>
          <Bell className="w-4 h-4 mr-2" />
          Mark All as Read
        </Button>

        <Button variant="outline" onClick={handleClearAll}>
          Clear All Notifications
        </Button>
      </div>
    </div>
  );
}