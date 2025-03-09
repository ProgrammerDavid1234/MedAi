import React, { useState } from "react";
import { X } from "lucide-react";
import { mockDoctors, mockMessages } from "../data/mockData";

function Messages() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    age: "",
    gender: "",
    medicalHistory: "",
  });
  const [showDetailsForm, setShowDetailsForm] = useState(true);

  // Mock AI Doctor
  const aiDoctor = {
    id: "ai-doctor",
    name: "Dr. AI",
    specialty: "Online Doctor",
  };

  // Function to format AI response as a properly spaced numbered list
  const formatAIResponse = (data) => {
    const formatList = (title, items) =>
      items?.length
        ? `**${title}**\n${items.map((item, index) => `\n${index + 1}. ${item}`).join("")}`
        : `**${title}**\n\nNot Available`;

    return `${formatList("🩺 Possible Conditions", data.conditions)}\n\n${formatList("💊 Possible Treatments", data.treatments)}\n\n${formatList("💊 Medications", data.medications)}`;
  };

  // Function to send a message to the AI API
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    // Add user message to chat
    const userMessage = {
      id: messages.length + 1,
      sender: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString(),
    };
    setMessages([...messages, userMessage]);

    // Prepare request payload
    const requestBody = {
      symptoms: [newMessage],
      age: userDetails.age,
      gender: userDetails.gender,
      medicalHistory: userDetails.medicalHistory,
    };

    setLoading(true);
    try {
      const response = await fetch(
        "https://healthcare-backend-a66n.onrender.com/api/diagnosis/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();
      console.log("AI Response:", data); // Debugging API response

      if (response.ok) {
        const formattedResponse = formatAIResponse(data);

        // Add AI response to chat
        const aiResponse = {
          id: messages.length + 2,
          sender: aiDoctor.name,
          message: formattedResponse,
          time: new Date().toLocaleTimeString(),
        };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      } else {
        throw new Error("Failed to fetch diagnosis");
      }
    } catch (error) {
      console.error("Error fetching AI diagnosis:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: messages.length + 2,
          sender: aiDoctor.name,
          message: "Sorry, I encountered an issue processing your request. Please try again later.",
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoading(false);
    }

    setNewMessage("");
  };

  // Function to handle user details input
  const handleUserDetailsSubmit = (e) => {
    e.preventDefault();
    if (userDetails.age && userDetails.gender) {
      setShowDetailsForm(false);
    } else {
      alert("Please fill in all required fields.");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>

      {/* User Details Form */}
      {showDetailsForm ? (
        <form onSubmit={handleUserDetailsSubmit} className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">Enter Your Details</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium">Age</label>
            <input
              type="number"
              value={userDetails.age}
              onChange={(e) => setUserDetails({ ...userDetails, age: e.target.value })}
              required
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Gender</label>
            <select
              value={userDetails.gender}
              onChange={(e) => setUserDetails({ ...userDetails, gender: e.target.value })}
              required
              className="border rounded-md px-3 py-2 w-full"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Medical History</label>
            <input
              type="text"
              value={userDetails.medicalHistory}
              onChange={(e) => setUserDetails({ ...userDetails, medicalHistory: e.target.value })}
              placeholder="E.g., Diabetes, Hypertension, None"
              className="border rounded-md px-3 py-2 w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md w-full">
            Save Details
          </button>
        </form>
      ) : (
        <>
          {/* Chat Interface */}
          <button
            onClick={() => {
              setSelectedDoctor(aiDoctor);
              setChatOpen(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4 hover:bg-blue-600 transition"
          >
            Chat with our Online Doctor
          </button>

          {chatOpen ? (
            <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-white text-blue-500 flex items-center justify-center font-bold">
                    {selectedDoctor.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{selectedDoctor.name}</p>
                    <p className="text-xs opacity-80">{selectedDoctor.specialty}</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-white hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs rounded-lg px-4 py-2 ${message.sender === "You" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                      <p>{message.message}</p>
                      <p className={`text-xs mt-1 ${message.sender === "You" ? "text-blue-100" : "text-gray-500"}`}>{message.time}</p>
                    </div>
                  </div>
                ))}
                {loading && <p className="text-gray-500 text-sm">Dr. AI is typing...</p>}
              </div>
              <div className="border-t p-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your symptoms..."
                  className="border rounded-md px-3 py-2 w-full"
                />
                <button onClick={handleSendMessage} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-md w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

export default Messages;