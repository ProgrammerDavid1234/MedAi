import React, { useEffect, useState } from 'react';
import { Calendar, MessageSquare, FileText, Bell, User, Search } from 'lucide-react';
import DashboardCard from './DashboardCard';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // ✅ Correct import


interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

function Dashboard({ setActiveTab }: DashboardProps) {
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState("Click to check");
  const [medicalRecordsCount, setMedicalRecordsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0);
  const { authToken, userId } = useAuth();  // Ensure 'user' is available
  const [notificationsCount, setNotificationsCount] = useState("Click to check");

  useEffect(() => {
    if (authToken) {
      fetchDashboardData();
    }
  }, [authToken]);

  const fetchDashboardData = async () => {
    try {
      if (!authToken || !userId) {
        console.error("User ID or authToken is missing");
        return;
      }

      const headers = { Authorization: `Bearer ${authToken}` };

      // Fetch Appointments
      const appointmentsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/getappointments?userId=${userId}`, { headers }
      );
      console.log("Appointments Response:", appointmentsRes.data);
      setAppointmentsCount(appointmentsRes.data.appointments.length);

      // Fetch Messages
      const messagesRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/messages/unread?userId=${userId}`, { headers }
      );
      console.log("Messages Response:", messagesRes.data);
      setMessagesCount(messagesRes.data.length);

      // Fetch Doctors
      const doctorsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/doctors/available`, { headers }
      );
      console.log("Doctors Response:", doctorsRes.data);
      setDoctorsCount(doctorsRes.data.doctors.length);

      // Fetch Notifications
      // Fetch Notifications
      const notificationsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/notifications?userId=${userId}`,
        { headers }
      );
      console.log("Notifications Response:", notificationsRes.data); // ✅ Debugging
      setNotificationsCount(notificationsRes.data.length);


      // Fetch Medical Records
      const recordsRes = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/medical/medicalRecords?/${userId}`, { headers }
      );
      console.log("Medical Records Response:", recordsRes.data);
      setMedicalRecordsCount(recordsRes.data.length);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Upcoming Appointments"
        icon={<Calendar className="h-6 w-6 text-blue-500" />}
        count={appointmentsCount}
        onClick={() => setActiveTab('appointments')}
      />
      <DashboardCard
        title="Unread Messages"
        icon={<MessageSquare className="h-6 w-6 text-green-500" />}
        count={messagesCount}
        onClick={() => setActiveTab('messages')}
      />
      {/* <DashboardCard
        title="Medical Records"
        icon={<FileText className="h-6 w-6 text-purple-500" />}
        count={medicalRecordsCount}
        onClick={() => setActiveTab('records')}
      /> */}
      <DashboardCard
        title="Find Doctors"
        icon={<Search className="h-6 w-6 text-indigo-500" />}
        count={doctorsCount}
        onClick={() => setActiveTab('doctors')}
      />
      <DashboardCard
        title="Notifications"
        icon={<Bell className="h-6 w-6 text-yellow-500" />}
        count={notificationsCount}
        onClick={() => setActiveTab('notifications')}
      />
      <DashboardCard
        title="Profile"
        icon={<User className="h-6 w-6 text-gray-500" />}
        count={null}  // Profile doesn't need a count
        onClick={() => setActiveTab('profile')}
      />
    </div>
  );
}

export default Dashboard;
