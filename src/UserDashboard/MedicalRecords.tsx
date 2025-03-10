import React, { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

function MedicalRecords() {
  const { authToken, userId } = useAuth();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  // Fetch Medical Records
  const fetchMedicalRecords = async () => {
    try {
      const response = await axios.get(
        `https://healthcare-backend-a66n.onrender.com/api/medicalRecords`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch medical records:', error);
    }
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload Medical Record
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("userId", userId); // Attach user ID if needed

      await axios.post(
        `https://healthcare-backend-a66n.onrender.com/api/uploadMedicalRecord`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSelectedFile(null);
      fetchMedicalRecords(); // Refresh the list after upload
      alert("Medical record uploaded successfully!");
    } catch (error) {
      console.error('Failed to upload medical record:', error);
      alert("Upload failed. Please try again.");
    }
  };

  // Delete Medical Record
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://healthcare-backend-a66n.onrender.com/api/medicalRecord/${id}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setMedicalRecords(medicalRecords.filter(record => record.id !== id));
    } catch (error) {
      console.error('Failed to delete medical record:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Medical Records</h2>
        
        <div className="flex items-center space-x-4">
          {/* File Input */}
          <input type="file" onChange={handleFileChange} className="border p-1" />

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex bg-gray-50 p-4 font-medium text-gray-600">
          <div className="w-1/3">Title</div>
          <div className="w-1/3">Date</div>
          <div className="w-1/3">Actions</div>
        </div>
        <div className="divide-y divide-gray-200">
          {medicalRecords.map(record => (
            <div key={record.id} className="flex p-4 items-center">
              <div className="w-1/3">
                <p className="font-medium">{record.title}</p>
                <p className="text-sm text-gray-500">{record.type}</p>
              </div>
              <div className="w-1/3">
                <p>{new Date(record.date).toLocaleDateString()}</p>
              </div>
              <div className="w-1/3 space-x-3">
                <button className="text-blue-500 hover:text-blue-700">View</button>
                <button className="text-green-500 hover:text-green-700">Download</button>
                <button onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MedicalRecords;
