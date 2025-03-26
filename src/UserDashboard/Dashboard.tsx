import React, { useEffect, useState } from 'react';
import { Calendar, MessageSquare, FileText, Bell, User, Search } from 'lucide-react';
import DashboardCard from './DashboardCard';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import { useNavigate } from "react-router-dom";

interface UserData {
  subscriptionStatus: string;
  subscriptionPlan: string;
  subscriptionPrice: number;
}

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { authToken, userId } = useAuth();
  const navigate = useNavigate();

  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState("Click to check");
  const [medicalRecordsCount, setMedicalRecordsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState("Click to check");

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const getPlanPrice = (plan: string) => {
    switch (plan) {
      case "basic":
        return 9.99;
      case "pro":
        return 19.99;
      case "enterprise":
        return 49.99;
      default:
        return 0;
    }
  };
  
  useEffect(() => {
    if (!authToken || !userId) {
      console.warn("⚠️ No user found, redirecting to login...");
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    fetchUserData();
    fetchDashboardData();
  }, [authToken, userId, navigate]);

  const fetchUserData = async () => {
    try {
      // Fetch User Profile (includes subscription info)
      const userResponse = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/users/profile`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
  
      console.log("User Profile Data:", userResponse.data);
  
      // Extract user details
      const userId = userResponse.data._id; // Extract user ID
      const subscription = userResponse.data.subscription || {};
      const subscriptionPlan = subscription.plan || "No Plan";
      const subscriptionStatus = subscription.status || "inactive";
      const subscriptionPrice = getPlanPrice(subscriptionPlan); // Function to get price
  
      // Save user data (including userId)
      setUserData({
        userId, // Store user ID
        subscriptionPlan,
        subscriptionStatus,
        subscriptionPrice,
      });
  
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };
  
  

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // Fetch Appointments
      const appointmentsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/getappointments?userId=${userId}`,
        { headers }
      );
      setAppointmentsCount(appointmentsRes.data.appointments.length);

      // Fetch Messages
      const messagesRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/messages/unread?userId=${userId}`,
        { headers }
      );
      setMessagesCount(messagesRes.data.length);

      // Fetch Doctors
      const doctorsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/doctors/available`,
        { headers }
      );
      setDoctorsCount(doctorsRes.data.doctors.length);

      // Fetch Notifications
      const notificationsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/notifications?userId=${userId}`,
        { headers }
      );
      setNotificationsCount(notificationsRes.data.length);

      // Fetch Medical Records
      const recordsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/medical/medicalRecords/${userId}`,
        { headers }
      );
      setMedicalRecordsCount(recordsRes.data.length);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* ✅ Show Subscription Status */}
      {userData?.subscriptionStatus === "active" ? (
        <DashboardCard
          title="Premium Access"
          icon={<FileText className="h-6 w-6 text-green-600" />}
          count={`Plan: ${userData.subscriptionPlan} - $${userData.subscriptionPrice}/mo`}
          onClick={() => setActiveTab("subscription")}
        />
      ) : (
        <DashboardCard
          title="Upgrade to Premium"
          icon={<FileText className="h-6 w-6 text-red-600" />}
          count="No active plan"
          onClick={() => setActiveTab("subscription")}
        />
      )}

      {/* Other Dashboard Cards */}
      <DashboardCard
        title="Upcoming Appointments"
        icon={<Calendar className="h-6 w-6 text-blue-500" />}
        count={appointmentsCount}
        onClick={() => setActiveTab("appointments")}
      />
      <DashboardCard
        title="Unread Messages"
        icon={<MessageSquare className="h-6 w-6 text-green-500" />}
        count={messagesCount}
        onClick={() => setActiveTab("messages")}
      />
      <DashboardCard
        title="Find Doctors"
        icon={<Search className="h-6 w-6 text-indigo-500" />}
        count={doctorsCount}
        onClick={() => setActiveTab("doctors")}
      />
      <DashboardCard
        title="Notifications"
        icon={<Bell className="h-6 w-6 text-yellow-500" />}
        count={notificationsCount}
        onClick={() => setActiveTab("notifications")}
      />
      <DashboardCard
        title="Profile"
        icon={<User className="h-6 w-6 text-gray-500" />}
        count={null}
        onClick={() => setActiveTab("profile")}
      />
    </div>
  );
};

export default Dashboard;
