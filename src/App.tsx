import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Heart, Activity, Calendar, Users, Phone, Mail, Menu, X, ChevronRight, ArrowRight } from 'lucide-react';

// Public Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import CallToAction from './components/CallToAction';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';

// User Dashboard Components
import Sidebar from './UserDashboard/Sidebar';
import MobileHeader from './UserDashboard/MobileHeader';
import MobileMenu from './UserDashboard/MobileMenu';
import Dashboard from './UserDashboard/Dashboard';
import Appointments from './UserDashboard/Appointments';
import Messages from './UserDashboard/Messages';
import Doctors from './UserDashboard/Doctors';
import MedicalRecords from './UserDashboard/MedicalRecords';
import Notifications from './UserDashboard/Notifications';
import Profile from './UserDashboard/Profile';

function UserDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileHeader mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      <MobileMenu activeTab={activeTab} setActiveTab={setActiveTab} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="flex-1 md:ml-64 p-6 md:p-8 mt-16 md:mt-0">
        {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
        {activeTab === 'appointments' && <Appointments />}
        {activeTab === 'messages' && <Messages />}
        {activeTab === 'doctors' && <Doctors setActiveTab={setActiveTab} setSelectedDoctor={setSelectedDoctor} setChatOpen={setChatOpen} />}
        {activeTab === 'records' && <MedicalRecords />}
        {activeTab === 'notifications' && <Notifications />}
        {activeTab === 'profile' && <Profile />}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Services />
              <Features />
              <Testimonials />
              <CallToAction />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
