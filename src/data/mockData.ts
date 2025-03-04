// Mock data for demonstration
export const mockAppointments = [
  { id: 1, doctorName: "Dr. Sarah Johnson", specialty: "Cardiologist", date: "2025-06-15", time: "10:00 AM", status: "Confirmed" },
  { id: 2, doctorName: "Dr. Michael Chen", specialty: "Dermatologist", date: "2025-06-20", time: "2:30 PM", status: "Pending" }
];

export const mockDoctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiologist", rating: 4.8, availability: "Mon-Fri" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Dermatologist", rating: 4.6, availability: "Tue-Sat" },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Pediatrician", rating: 4.9, availability: "Mon-Thu" }
];

export const mockMessages = [
  { id: 1, sender: "Dr. Sarah Johnson", message: "How are you feeling today?", time: "10:30 AM", date: "2025-06-10" },
  { id: 2, sender: "You", message: "Much better, thank you for asking.", time: "10:45 AM", date: "2025-06-10" }
];

export const mockMedicalRecords = [
  { id: 1, title: "Blood Test Results", date: "2025-05-20", type: "Lab Report" },
  { id: 2, title: "X-Ray Report", date: "2025-04-15", type: "Radiology" }
];

export const mockNotifications = [
  { id: 1, title: "Appointment Reminder", message: "You have an appointment with Dr. Johnson tomorrow at 10:00 AM", time: "1 day ago", type: "appointment" },
  { id: 2, title: "Prescription Refill", message: "Your prescription for Lisinopril is due for refill", time: "2 hours ago", type: "prescription" },
  { id: 3, title: "New Message", message: "Dr. Chen sent you a message regarding your recent visit", time: "Just now", type: "message" }
];