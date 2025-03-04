import React from 'react';
import { Calendar, MessageSquare, FileText, Bell, User, Search } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { mockAppointments, mockDoctors, mockMedicalRecords, mockNotifications } from '../data/mockData';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

function Dashboard({ setActiveTab }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard 
        title="Upcoming Appointments" 
        icon={<Calendar className="h-6 w-6 text-blue-500" />}
        count={mockAppointments.length}
        onClick={() => setActiveTab('appointments')}
      />
      <DashboardCard 
        title="Unread Messages" 
        icon={<MessageSquare className="h-6 w-6 text-green-500" />}
        count={2}
        onClick={() => setActiveTab('messages')}
      />
      <DashboardCard 
        title="Medical Records" 
        icon={<FileText className="h-6 w-6 text-purple-500" />}
        count={mockMedicalRecords.length}
        onClick={() => setActiveTab('records')}
      />
      <DashboardCard 
        title="Find Doctors" 
        icon={<Search className="h-6 w-6 text-indigo-500" />}
        count={mockDoctors.length}
        onClick={() => setActiveTab('doctors')}
      />
      <DashboardCard 
        title="Notifications" 
        icon={<Bell className="h-6 w-6 text-yellow-500" />}
        count={mockNotifications.length}
        onClick={() => setActiveTab('notifications')}
      />
      <DashboardCard 
        title="Profile" 
        icon={<User className="h-6 w-6 text-gray-500" />}
        count={null}
        onClick={() => setActiveTab('profile')}
      />
    </div>
  );
}

export default Dashboard;