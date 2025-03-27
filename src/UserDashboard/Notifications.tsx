import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, FileText, MessageSquare, Trash2, Trash } from "lucide-react";
import { useAuth } from "../AuthContext";
import { toast } from "react-toastify";  // ✅ Import toast notifications
import "react-toastify/dist/ReactToastify.css";

interface Notification {
  _id: string; // MongoDB uses _id, not id
  message: string;
  type: string;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authContext = useAuth();
  const authToken = authContext?.authToken;
  const userId = authContext?.userId;

  useEffect(() => {
    if (!authToken || !userId) return;

    console.log("Fetching notifications for userId:", userId);

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `https://healthcare-backend-a66n.onrender.com/api/notifications/notifications/${userId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        console.log("Notifications fetched:", response.data.notifications);
        setNotifications(response.data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
        setError("Error fetching notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [authToken, userId]);

  // 🔴 Handle Delete Single Notification
  const handleDeleteNotification = async (notificationId: string) => {
    if (!authToken) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this notification?");
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `https://healthcare-backend-a66n.onrender.com/api/notifications/notifications/${notificationId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
      toast.success("Notification deleted successfully! ✅");
    } catch (err) {
      console.error("Failed to delete notification", err);
      toast.error("Failed to delete notification. Please try again.");
    }
  };

  // 🔴 Handle Clear All Notifications
  const handleClearAllNotifications = async () => {
    if (!authToken) return;

    const confirmClear = window.confirm("Are you sure you want to clear all notifications?");
    if (!confirmClear) return;

    try {
      await axios.delete(
        `https://healthcare-backend-a66n.onrender.com/api/notifications/notifications/user/${userId}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setNotifications([]);
      toast.success("All notifications cleared successfully! ✅");
    } catch (err) {
      console.error("Failed to clear notifications", err);
      toast.error("Failed to clear notifications. Please try again.");
    }
  };

  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Notifications</h2>

        {/* 🔴 Clear All Notifications Button */}
        {notifications.length > 0 && (
          <button
            onClick={handleClearAllNotifications}
            className="flex items-center text-red-500 hover:text-red-700 bg-red-100 px-3 py-2 rounded-md"
          >
            <Trash className="h-5 w-5 mr-2" />
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications available.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
            >
              <div className="flex items-center">
                <div className="mr-4">
                  {notification.type === "Appointment" && (
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                  )}
                  {notification.type === "Medical Update" && (
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                  {notification.type === "Reminder" && (
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{notification.type}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                </div>
              </div>

              {/* 🗑️ Delete Single Notification Button */}
              <button
                onClick={() => handleDeleteNotification(notification._id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
