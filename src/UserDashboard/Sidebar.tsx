import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Calendar, MessageSquare, Search, FileText, Bell, User, LogOut, ShoppingBag } from 'lucide-react';
import SidebarLink from './SidebarLink';
import localforage from 'localforage';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear token from localStorage
    localStorage.removeItem('authToken');

    // Clear token from localforage (if used)
    await localforage.removeItem('authToken');

    // Redirect to login page
    navigate('/');
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-white shadow-md">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-600">Curease</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <SidebarLink
          icon={<Home />}
          label="Dashboard"
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
        <SidebarLink
          icon={<Calendar />}
          label="Appointments"
          active={activeTab === 'appointments'}
          onClick={() => setActiveTab('appointments')}
        />
        <SidebarLink
          icon={<MessageSquare />}
          label="Messages"
          active={activeTab === 'messages'}
          onClick={() => setActiveTab('messages')}
        />
        <SidebarLink
          icon={<Search />}
          label="Find Doctors"
          active={activeTab === 'doctors'}
          onClick={() => setActiveTab('doctors')}
        />
        <SidebarLink
          icon={<FileText />}
          label="Medical Records"
          active={activeTab === 'records'}
          onClick={() => setActiveTab('records')}
        />
        <SidebarLink
          icon={<Bell />}
          label="Notifications"
          active={activeTab === 'notifications'}
          onClick={() => setActiveTab('notifications')}
        />
        <SidebarLink
          icon={<User />}
          label="Profile"
          active={activeTab === 'profile'}
          onClick={() => setActiveTab('profile')}
        />
        {/* ✅ New Pharmacy Tab */}
        <SidebarLink
          icon={<ShoppingBag />}
          label="Pharmacy"
          active={activeTab === 'pharmacy'}
          onClick={() => setActiveTab('pharmacy')}
        />
        {/* <SidebarLink
          icon={<MessageSquare />}
          label="Chat with Doctor"
          active={activeTab === 'chat'}
          onClick={() => setActiveTab('chat')}
        /> */}

      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center text-gray-600 hover:text-gray-900 w-full"
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
