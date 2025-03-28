import React, { useEffect, useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { useAuth } from "../AuthContext"; // Ensure AuthContext is implemented

const ChatPage: React.FC = () => {
    const { authToken, userId } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [doctors, setDoctors] = useState<any[]>([]); // Store list of available doctors

    useEffect(() => {
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (userId && doctorId) fetchMessages();
    }, [userId, doctorId]);
    

    const fetchDoctors = async () => {
        try {
            const res = await axios.get("https://healthcare-backend-a66n.onrender.com/api/doctors/available");
    
            console.log("Doctors API Response:", res.data); // Debugging line
    
            if (res.data && Array.isArray(res.data.doctors)) {
                setDoctors(res.data.doctors); // Extract the `doctors` array
            } else {
                setDoctors([]); // Ensure it's always an array
                console.error("Doctors data is not an array:", res.data);
            }
        } catch (error) {
            console.error("Error fetching doctors", error);
            setDoctors([]); // Prevents map error by ensuring an empty array
        }
    };
    


    const fetchMessages = async () => {
        if (!doctorId) return;
        try {
            const res = await axios.get(
                `https://healthcare-backend-a66n.onrender.com/api/interactions/messages/${userId}_${doctorId}`,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    };
    
    
    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const res = await axios.post(
                "https://healthcare-backend-a66n.onrender.com/api/interactions/messages",
                { receiver: doctorId, content: newMessage },
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            setMessages([...messages, res.data.data]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    return (
        <div className="flex flex-col h-screen p-4 bg-gray-100">
            <h2 className="text-xl font-bold text-blue-600 mb-2">Chat with Doctor</h2>

            {/* Doctor Selection */}
            <select
                className="p-2 mb-4 border rounded"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
            >
                <option value="">Select a Doctor</option>
                {Array.isArray(doctors) && doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <option key={doctor._id} value={doctor._id}>
                            {doctor.name} - {doctor.specialization}
                        </option>
                    ))
                ) : (
                    <option disabled>No doctors available yet</option>
                )}
            </select>


            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-white rounded shadow-md">
            {messages.length > 0 ? (
    messages.map((msg) => (
        <div key={msg._id} className={`mb-2 flex ${msg.sender === userId ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg max-w-xs ${msg.sender === user?.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                <p>{msg.content}</p>
            </div>
        </div>
    ))
) : (
    <p className="text-gray-500">No messages yet.</p>
)}

            </div>

            {/* Message Input */}
            <div className="flex mt-4">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage} className="ml-2 p-2 bg-blue-600 text-white rounded">
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
