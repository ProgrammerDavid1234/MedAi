import React from 'react';
import { Home, Calendar, MessageSquare, Search, FileText, Bell, User, LogOut, X } from 'lucide-react';
import SidebarLink from './SidebarLink';

interface MobileMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

function MobileMenu({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }: MobileMenuProps) {
  if (!mobileMenuOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-20">
      <div className="bg-white h-full w-64 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-blue-600">MedConnect</h1>
          <button onClick={() => setMobileMenuOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="space-y-4">
          <SidebarLink 
            icon={<Home />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => {
              setActiveTab('dashboard');
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarLink 
            icon={<Calendar />} 
            label="Appointments" 
            active={activeTab === 'appointments'} 
            onClick={() => {
              setActiveTab('appointments');
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarLink 
            icon={<MessageSquare />} 
            label="Messages" 
            active={activeTab === 'messages'} 
            onClick={() => {
              setActiveTab('messages');
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarLink 
            icon={<Search />} 
            label="Find Doctors" 
            active={activeTab === 'doctors'} 
            onClick={() => {
              setActiveTab('doctors');
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarLink 
            icon={<FileText />} 
            label="Medical Records" 
            active={activeTab === 'records'} 
            onClick={() => {
              setActiveTab('records');
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarLink 
            icon={<Bell />} 
            label="Notifications" 
            active={activeTab === 'notifications'} 
            onClick={() => {
              setActiveTab('notifications');
              setMobileMenuOpen(false);
            }} 
          />
          <SidebarLink 
            icon={<User />} 
            label="Profile" 
            active={activeTab === 'profile'} 
            onClick={() => {
              setActiveTab('profile');
              setMobileMenuOpen(false);
            }} 
          />
        </nav>
        <div className="mt-6 pt-6 border-t">
          <button className="flex items-center text-gray-600 hover:text-gray-900">
            <LogOut className="h-5 w-5 mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;