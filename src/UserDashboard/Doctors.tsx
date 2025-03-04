import React from 'react';
import { Search, Star } from 'lucide-react';
import { mockDoctors } from '../data/mockData';

interface DoctorsProps {
  setActiveTab: (tab: string) => void;
  setSelectedDoctor: (doctor: any) => void;
  setChatOpen: (open: boolean) => void;
}

function Doctors({ setActiveTab, setSelectedDoctor, setChatOpen }: DoctorsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Available Doctors</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search doctors..."
            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDoctors.map(doctor => (
          <div key={doctor.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-xl">
                  {doctor.name.charAt(3)}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-lg">{doctor.name}</h3>
                  <p className="text-gray-500">{doctor.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4" fill={i < Math.floor(doctor.rating) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">{doctor.rating}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-medium">Availability:</span> {doctor.availability}
              </p>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => {
                    // In a real app, this would navigate to booking page
                    console.log('Book appointment with:', doctor.id);
                  }}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                >
                  Book Appointment
                </button>
                <button 
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setChatOpen(true);
                    setActiveTab('messages');
                  }}
                  className="flex-1 border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition"
                >
                  Message
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4">
              <button 
                onClick={() => {
                  // In a real app, this would show doctor details
                  console.log('View doctor details:', doctor.id);
                }}
                className="text-blue-500 text-sm font-medium hover:text-blue-700"
              >
                View Full Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Doctors;