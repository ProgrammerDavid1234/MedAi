import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext'; // Adjust the import path based on your file structure

function Profile() {
  const authContext = useContext(AuthContext);
  const authToken = authContext ? authContext.authToken : null;
  // Use the token from AuthContext
  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    bloodType?: string;
    allergies?: string[];
    medications?: string[];
    medicalHistory?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    bloodType: "",
    allergies: "",
    medications: "",
    medicalHistory: "",
  });
  useEffect(() => {
    if (profile && !isEditing) { // Prevent override when editing
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        dateOfBirth: profile.dateOfBirth || "",
        address: profile.address || "",
        bloodType: profile.bloodType || "",
        allergies: profile.allergies?.join(", ") || "",
        medications: profile.medications?.join(", ") || "",
        medicalHistory: profile.medicalHistory || "",
      });
    }
  }, [profile, isEditing]); // Only run when profile updates or editing state changes
  
  // Fetch profile data when the component mounts
  useEffect(() => {
    console.log("Auth Token before request:", authToken);
    if (!authToken) {
      setError("Authentication token is missing. Please log in again.");
      return;
    }

    axios.get('https://healthcare-backend-a66n.onrender.com/api/users/profile', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((response) => {
        console.log("Profile fetched successfully:", response.data); // Debugging log
        setProfile(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again later.');
      });
  }, [authToken]);

  console.log("Auth Token:", authToken);


  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: ["allergies", "medications", "medicalHistory"].includes(name)
        ? value?.split(",").map((item) => item.trim()) || [] // Ensure an array is always assigned
        : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
  
    try {
      const updatedData = {
        ...formData,
        allergies: formData.allergies?.split(",").map((item) => item.trim()) ?? [],
        medications: formData.medications?.split(",").map((item) => item.trim()) ?? [],
      };
  
      const response = await axios.put(
        "https://healthcare-backend-a66n.onrender.com/api/users/update",
        updatedData,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
  
      console.log("Update response:", response.data);
  
      // ✅ Instantly update `profile`
      setProfile(response.data);
  
      // ✅ Sync `formData` with the new profile data
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        dateOfBirth: response.data.dateOfBirth || "",
        address: response.data.address || "",
        bloodType: response.data.bloodType || "",
        allergies: response.data.allergies?.join(", ") || "",
        medications: response.data.medications?.join(", ") || "",
        medicalHistory: response.data.medicalHistory || "",
      });
  
      setIsEditing(false); // Exit edit mode
      setError(null);
  
      // ✅ Refetch profile to ensure data consistency
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      setError("Failed to update profile. Please try again later.");
    }
  };
  
  
  
  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message
  }

  if (!profile) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }
  const fetchProfile = async () => {
    try {
      if (!authToken) {
        console.error("No auth token found");
        return;
      }
  
      const response = await axios.get(
        "https://healthcare-backend-a66n.onrender.com/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      console.log("Profile Data Fetched:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to fetch profile. Please try again.");
    }
  };
  

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Your Profile</h2>

      {isEditing ? (
        // Edit Form
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />

          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="text"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <input
              type="text"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Allergies</label>
            <input
              type="text"
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Medications</label>
            <input
              type="text"
              name="medications"
              value={formData.medications}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">medicalHistory</label>
            <input
              type="text"
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // Profile Display
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-2xl">
                {profile.name
                  ?.split(' ') // Ensure profile.name is defined before calling split()
                  .map((part) => part[0])
                  .join('')}

              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-semibold">{profile.name}</h3>
                <p className="text-gray-500">Patient ID: P1234567</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Personal Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{profile.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p>{profile.dateOfBirth || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p>{profile.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Medical Information</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Blood Type</p>
                    <p>{profile.bloodType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Allergies</p>
                    <p>{profile.allergies?.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Medications</p>
                    <p>{profile.medications?.join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">medicalHistory</p>
                    <p>{profile.medicalHistory || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium text-lg mb-4">Medical History</h3>
        <div className="space-y-4">
          {profile.medicalHistory?.map((entry, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="flex justify-between">
                <h4 className="font-medium">{entry.title}</h4>
                <span className="text-sm text-gray-500">{entry.date}</span>
              </div>
              <p className="text-gray-600 mt-2">{entry.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;