import React, { useState } from 'react';
import { X } from 'lucide-react';
import { mockDoctors, mockMessages } from '../data/mockData';

function Messages() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // In a real app, this would send the message to the API
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      
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
            <button 
              onClick={() => setChatOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mockMessages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    message.sender === 'You' 
                      ? 'bg-blue-500 text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p>{message.message}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'You' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t p-4">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockDoctors.map(doctor => (
            <div 
              key={doctor.id}
              onClick={() => {
                setSelectedDoctor(doctor);
                setChatOpen(true);
              }}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition"
            >
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-lg">
                  {doctor.name.charAt(3)}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">{doctor.name}</h3>
                  <p className="text-sm text-gray-500">{doctor.specialty}</p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>Start a conversation</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Messages;