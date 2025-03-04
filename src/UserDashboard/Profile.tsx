import React from 'react';

function Profile() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Profile</h2>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-2xl">
              JD
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-semibold">John Doe</h3>
              <p className="text-gray-500">Patient ID: P12345678</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>john.doe@example.com</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>(555) 123-4567</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p>January 15, 1985</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>123 Main Street, Anytown, CA 12345</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Medical Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Blood Type</p>
                  <p>O Positive</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p>Penicillin, Peanuts</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Medications</p>
                  <p>Lisinopril, Metformin</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Emergency Contact</p>
                  <p>Jane Doe - (555) 987-6543</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium text-lg mb-4">Medical History</h3>
        <div className="space-y-4">
          <div className="p-4 border rounded-md">
            <div className="flex justify-between">
              <h4 className="font-medium">Hypertension Diagnosis</h4>
              <span className="text-sm text-gray-500">March 2024</span>
            </div>
            <p className="text-gray-600 mt-2">Diagnosed with Stage 1 Hypertension. Prescribed Lisinopril 10mg daily.</p>
          </div>
          <div className="p-4 border rounded-md">
            <div className="flex justify-between">
              <h4 className="font-medium">Type 2 Diabetes</h4>
              <span className="text-sm text-gray-500">November 2023</span>
            </div>
            <p className="text-gray-600 mt-2">Diagnosed with Type 2 Diabetes. Prescribed Metformin 500mg twice daily.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;