import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import CallToAction from "./components/CallToAction";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Dashboard Components
import Sidebar from "./UserDashboard/Sidebar";
import MobileHeader from "./UserDashboard/MobileHeader";
import MobileMenu from "./UserDashboard/MobileMenu";
import Dashboard from "./UserDashboard/Dashboard";
import Appointments from "./UserDashboard/Appointments";
import Messages from "./UserDashboard/Messages";
import Doctors from "./UserDashboard/Doctors";
import MedicalRecords from "./UserDashboard/MedicalRecords";
import Notifications from "./UserDashboard/Notifications";
import Profile from "./UserDashboard/Profile";
import DoctorProfile from "./UserDashboard/DoctorsProfile";
import Pricing from "./components/Pricing";
import Subscription from "./UserDashboard/Subscription";


function UserDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const { doctorId } = useParams(); // ✅ Get doctorId from URL

  useEffect(() => {
    if (doctorId && !selectedDoctor) {
      // ✅ Fetch doctor details if not already set
      const fetchDoctor = async () => {
        try {
          const response = await fetch(`https://healthcare-backend-a66n.onrender.com/api/doctors/${doctorId}`);
          const data = await response.json();
          if (data) {
            setSelectedDoctor(data);
            setActiveTab("doctorprofile"); // ✅ Set active tab
          }
        } catch (error) {
          console.error("Error fetching doctor details:", error);
        }
      };
      fetchDoctor();
    }
  }, [doctorId, selectedDoctor]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileHeader mobileMenuOpen={mobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      <MobileMenu activeTab={activeTab} setActiveTab={setActiveTab} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      <div className="w-full p-6 md:p-8 mt-20 md:mt-0">
        {doctorId && selectedDoctor ? (
          <DoctorProfile doctor={selectedDoctor} />
        ) : (
          <>
            {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === "appointments" && <Appointments />}
            {activeTab === "messages" && <Messages />}
            {activeTab === "doctors" && (
              <Doctors setActiveTab={setActiveTab} setSelectedDoctor={setSelectedDoctor} setChatOpen={setChatOpen} />
            )}
            {activeTab === "records" && <MedicalRecords />}
            {activeTab === "notifications" && <Notifications />}
            {activeTab === "profile" && <Profile />}
          </>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // ✅ Makes it more vibrant
        />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Navbar /> {/* ✅ Only shown on public pages */}
                <Hero />
                <Services />
                <Features />
                <Pricing />
                <Testimonials />
                <CallToAction />
                <Footer /> {/* ✅ Only shown on public pages */}
              </>
            }
          />
          <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
          <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />

          {/* Dashboard Routes - NO NAVBAR OR FOOTER */}
          <Route path="/dashboard/*" element={<UserDashboard />} />
          <Route path="/doctorprofile/:doctorId" element={<UserDashboard />} />
          <Route path="/subscription" element={<Subscription />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
