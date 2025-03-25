import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Appointment {
  _id: string;
  doctorName: string;
  date: string;
  time: string;
  reason?: string;
  symptoms?: string[];
}

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);

  const [doctors, setDoctors] = useState([]);  // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [rescheduleMode, setRescheduleMode] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [showBookModal, setShowBookModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const { authToken, userId } = useAuth();
  const [showUpgradeTooltip, setShowUpgradeTooltip] = useState(false);
  const navigate = useNavigate();







  console.log("Appointments.tsx - Auth Token:", authToken);

  useEffect(() => {
    fetchAppointments();
  }, [authToken]); // Refetch appointments when the token changes
  useEffect(() => {
    console.log("🔍 Checking Subscription Plan:", subscriptionPlan);
  }, [subscriptionPlan]);

  const fetchAppointments = async () => {
    try {
      console.log("Fetching appointments...");

      const appointmentResponse = await axios.get(
        "https://healthcare-backend-a66n.onrender.com/api/appointments/getappointments",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("📅 Appointments API Response:", appointmentResponse.data);

      // Ensure appointments exist, otherwise set an empty array
      const fetchedAppointments = appointmentResponse.data?.appointments || [];

      setAppointments(fetchedAppointments);
      setAppointmentCount(fetchedAppointments.length);
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn("No appointments found. Displaying empty list.");
        setAppointments([]); // ✅ Handle gracefully
        setAppointmentCount(0);
      } else {
        console.error("❌ Error fetching data:", error.response?.data || error.message);
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };




  const handleUpgrade = async (plan: string) => {
    try {
      const response = await axios.post(
        "https://healthcare-backend-a66n.onrender.com/api/subscription/create-checkout-session",
        { plan },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      if (response.data.url) {
        window.location.href = response.data.url; // Redirect to Stripe Checkout
      }
    } catch (error) {
      console.error("Error redirecting to checkout:", error);
      alert("Failed to start subscription. Please try again.");
    }
  };
  

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "https://healthcare-backend-a66n.onrender.com/api/doctors/available"
        );

        // Adjust structure based on API response
        const fetchedDoctors = response.data.doctors || response.data;
        console.log("✅ Doctors Fetched:", fetchedDoctors);

        if (Array.isArray(fetchedDoctors)) {
          setDoctors(fetchedDoctors);
        } else {
          console.error("❌ Unexpected API response:", response.data);
          setDoctors([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch doctors:", err);
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);


  const handleReschedule = async () => {
    if (!selectedAppointment || !authToken) return;

    try {
      const response = await axios.put(
        `https://healthcare-backend-a66n.onrender.com/api/appointments/${selectedAppointment._id}/reschedule`,
        { newDate, newTime },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      console.log("Reschedule Response:", response.data);

      if (response.data && response.data.appointment) {
        // Update the state with the new appointment details
        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment._id === selectedAppointment._id
              ? { ...appointment, date: newDate, time: newTime }
              : appointment
          )
        );

        alert("Appointment rescheduled successfully!");
      } else {
        console.error("Unexpected reschedule API response:", response.data);
        alert("Failed to reschedule appointment. Please try again.");
      }

      setRescheduleMode(false);
      setSelectedAppointment(null);
    } catch (err) {
      console.error("Error rescheduling appointment:", err);
      alert("Failed to reschedule appointment.");
    }
  };
  const bookAppointment = async () => {
    if (!doctorName || !appointmentDate || !appointmentTime || !userId) {
      toast.error("Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await axios.post(
        "https://healthcare-backend-a66n.onrender.com/api/appointments/appointments",
        {
          userId: userId, 
          doctorName,
          date: appointmentDate,
          time: appointmentTime,
          reason: appointmentReason,
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      if (response.data && response.status === 201) {
        toast.success("Appointment booked successfully!");
        setShowBookModal(false);
        fetchAppointments(); // Refresh appointments list
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
  
      if (error.response?.status === 403) {
        // User reached free limit, show upgrade message
        const toastId = toast.error("You've reached your free limit. Upgrade to continue.", {
          autoClose: 3000, // Close after 3 seconds
        });
  
        // Redirect to subscription page after toast closes
        toast.onChange((payload) => {
          if (payload.id === toastId && payload.status === "removed") {
            navigate("/subscription");
          }
        });
      } else {
        toast.error(error.response?.data?.message || "An error occurred while booking.");
      }
    }
  };
  

  const handleBookClick = () => {
    if (subscriptionPlan === "Free" && appointmentCount >= 5) {
      setShowSubscribeModal(true);
      toast.warn("You've reached the free appointment limit. Upgrade to continue.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setShowBookModal(true);
  };
  
  const fetchSubscriptionPlan = async () => {
    try {
      const response = await axios.get(
        "https://healthcare-backend-a66n.onrender.com/api/subscription/status",
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
  
      setSubscriptionPlan(response.data.plan);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscriptionPlan("Free"); // Default to Free if error occurs
    }
  };
  
  useEffect(() => {
    if (authToken) {
      fetchSubscriptionPlan();
    }
  }, [authToken]);
  













  const handleCancelAppointment = async (id) => {
    console.log("🚀 Attempting to delete appointment:", id);

    try {
      await axios.delete(
        `https://healthcare-backend-a66n.onrender.com/api/appointments/${id}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      console.log("✅ Appointment deleted successfully");

      // Update state
      setAppointments((prev) => prev.filter((appointment) => appointment._id !== id));
    } catch (err) {
      console.error("❌ Error deleting appointment:", err.response?.data || err.message);
      alert("Failed to delete appointment");
    }
  };



  if (loading) return <p>Loading appointments...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Appointments</h2>
        <button
          onClick={handleBookClick}
          className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition ${subscriptionPlan === "Free" && appointmentCount >= 5 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          disabled={subscriptionPlan === "Free" && appointmentCount >= 5}
        >
          Book New Appointment
        </button>



      </div>


      {appointments.length === 0 ? (
        // ✅ Show this when no appointments exist
        <div className="text-center py-10">
          <p className="text-gray-500">You have no appointments scheduled.</p>
        </div>
      ) : (

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex bg-gray-50 p-4 font-medium text-gray-600">
            <div className="w-1/4">Doctor</div>
            <div className="w-1/4">Date & Time</div>
            <div className="w-1/4">Reason</div>
            <div className="w-1/4">Actions</div>
          </div>
          <div className="divide-y divide-gray-200">
            {appointments?.length > 0 ? (
              appointments.map((appointment) => (
                <div key={appointment._id} className="flex p-4 items-center">
                  <div className="w-1/4">
                    <p className="font-medium">{appointment.doctorName}</p>
                  </div>
                  <div className="w-1/4">
                    <p>{appointment.date}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                  <div className="w-1/4">
                    <p>{appointment.reason || "N/A"}</p>
                  </div>
                  <div className="w-1/4 space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setRescheduleMode(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center p-4">No appointments available.</p>
            )}

          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleMode && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <p className="mb-4">
              Current appointment with {selectedAppointment.doctorName} on {selectedAppointment.date} at {selectedAppointment.time}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
              <input type="date" className="w-full p-2 border rounded-md" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
              <select className="w-full p-2 border rounded-md" value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                <option value="">Select Time</option>
                <option>9:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>1:00 PM</option>
                <option>2:00 PM</option>
                <option>3:00 PM</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setRescheduleMode(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">Cancel</button>
              <button onClick={handleReschedule} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" disabled={!newDate || !newTime}>Confirm Reschedule</button>
            </div>
          </div>
        </div>
      )}



      {/* Book Appointment Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Book Appointment</h3>
            <select value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="w-full p-2 border rounded-md mb-3">
              <option value="">Select a Doctor</option>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))
              ) : (
                <option disabled>Loading doctors...</option>
              )}
            </select>
            <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <input type="time" value={appointmentTime} onChange={(e) => setAppointmentTime(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <input type="text" placeholder="Reason (Optional)" value={appointmentReason} onChange={(e) => setAppointmentReason(e.target.value)} className="w-full p-2 border rounded-md mb-3" />
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowBookModal(false)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button onClick={bookAppointment} className="px-4 py-2 bg-blue-500 text-white rounded-md">Confirm</button>
            </div>
          </div>
        </div>
      )}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upgrade to Continue</h3>
            <p className="mb-4">You’ve reached the limit of 5 free appointments. Upgrade to book more!</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowSubscribeModal(false)} className="px-4 py-2 border rounded-md">
                Cancel
              </button>
              <button onClick={() => handleUpgrade("pro")}>Upgrade to Pro</button>
              <button onClick={() => handleUpgrade("enterprise")}>Upgrade to Enterprise</button>

            </div>
          </div>
        </div>
      )}

      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Upgrade to Continue</h3>
            <p className="mb-4">You’ve reached the limit of 5 free AI messages. Upgrade to continue!</p>
            <div className="flex justify-end space-x-3">
              <button onClick={() => setShowSubscribeModal(false)} className="px-4 py-2 border rounded-md">Cancel</button>
              <button onClick={() => handleUpgrade("pro")} className="px-4 py-2 bg-blue-500 text-white rounded-md">Upgrade to Pro</button>
              <button onClick={() => handleUpgrade("enterprise")} className="px-4 py-2 bg-green-500 text-white rounded-md">Upgrade to Enterprise</button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default Appointments;

//APPOINTMENT PAGE IS NOT WORKING 