import React, { useState } from 'react';
import { mockAppointments } from '../data/mockData';

function Appointments() {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rescheduleMode, setRescheduleMode] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Appointments</h2>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          Book New Appointment
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex bg-gray-50 p-4 font-medium text-gray-600">
          <div className="w-1/4">Doctor</div>
          <div className="w-1/4">Date & Time</div>
          <div className="w-1/4">Status</div>
          <div className="w-1/4">Actions</div>
        </div>
        <div className="divide-y divide-gray-200">
          {mockAppointments.map(appointment => (
            <div key={appointment.id} className="flex p-4 items-center">
              <div className="w-1/4">
                <p className="font-medium">{appointment.doctorName}</p>
                <p className="text-sm text-gray-500">{appointment.specialty}</p>
              </div>
              <div className="w-1/4">
                <p>{new Date(appointment.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">{appointment.time}</p>
              </div>
              <div className="w-1/4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  appointment.status === 'Confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {appointment.status}
                </span>
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
                  onClick={() => {
                    // In a real app, this would call the cancel API
                    console.log('Cancelling appointment:', appointment.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {rescheduleMode && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <p className="mb-4">Current appointment with {selectedAppointment.doctorName} on {new Date(selectedAppointment.date).toLocaleDateString()} at {selectedAppointment.time}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
              <input type="date" className="w-full p-2 border rounded-md" />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
              <select className="w-full p-2 border rounded-md">
                <option>9:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>1:00 PM</option>
                <option>2:00 PM</option>
                <option>3:00 PM</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setRescheduleMode(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // In a real app, this would call the reschedule API
                  console.log('Rescheduling appointment:', selectedAppointment.id);
                  setRescheduleMode(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointments;