import React from 'react';
import { Upload } from 'lucide-react';
import { mockMedicalRecords } from '../data/mockData';

function MedicalRecords() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
          <Upload className="h-4 w-4 mr-2" />
          Upload New Record
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex bg-gray-50 p-4 font-medium text-gray-600">
          <div className="w-1/3">Title</div>
          <div className="w-1/3">Date</div>
          <div className="w-1/3">Actions</div>
        </div>
        <div className="divide-y divide-gray-200">
          {mockMedicalRecords.map(record => (
            <div key={record.id} className="flex p-4 items-center">
              <div className="w-1/3">
                <p className="font-medium">{record.title}</p>
                <p className="text-sm text-gray-500">{record.type}</p>
              </div>
              <div className="w-1/3">
                <p>{new Date(record.date).toLocaleDateString()}</p>
              </div>
              <div className="w-1/3 space-x-3">
                <button 
                  onClick={() => {
                    // In a real app, this would download or view the record
                    console.log('View record:', record.id);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View
                </button>
                <button 
                  onClick={() => {
                    // In a real app, this would download the record
                    console.log('Download record:', record.id);
                  }}
                  className="text-green-500 hover:text-green-700"
                >
                  Download
                </button>
                <button 
                  onClick={() => {
                    // In a real app, this would call the delete API
                    console.log('Delete record:', record.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;