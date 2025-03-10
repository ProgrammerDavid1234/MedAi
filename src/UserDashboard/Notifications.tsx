import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Calendar, FileText, MessageSquare, AlertTriangle } from "lucide-react";
import { useAuth } from "../AuthContext";

interface Notification {
  id: string;
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
  
    console.log("Fetching notifications for userId:", userId); // ✅ Check if ObjectId is used
  
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `https://healthcare-backend-a66n.onrender.com/api/notifications/${userId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
  
        console.log("Notifications fetched successfully:", response.data.notifications);
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
  
  if (loading) return <p>Loading notifications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notifications</h2>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white rounded-lg shadow p-4 flex">
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
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{notification.type}</h3>
                <span className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
              <p className="text-gray-600 mt-1">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
