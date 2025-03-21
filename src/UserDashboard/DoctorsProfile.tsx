import React from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Doctor {
  name: string;
  specialization: string;
  rating: number;
  phone?: string; // ✅ Add phone number field
  [key: string]: any; // Allow dynamic properties
}

const DoctorProfile: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  const navigate = useNavigate();
  const { doctorId } = useParams(); // Get doctorId from URL

  // Exclude unnecessary fields
  const filteredDoctor = Object.fromEntries(
    Object.entries(doctor).filter(
      ([key]) => !["_id", "__v", "createdAt", "updatedAt"].includes(key)
    )
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-301 transition"
      >
        ← Back
      </button>

      <div className="flex items-center mb-6">
        <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-2xl">
          {doctor.name?.split(" ").map((part) => part[0]).join("")}
        </div>
        <div className="ml-6">
          <h3 className="text-2xl font-semibold">{doctor.name}</h3>
          {doctor.specialization && <p className="text-gray-500">{doctor.specialization}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(filteredDoctor).map(([key, value]) => (
          <div key={key}>
            <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
            <p>{Array.isArray(value) ? value.join(", ") : value || "N/A"}</p>
          </div>
        ))}

        {/* 📞 Phone Number Section */}
        {doctor.phoneNumber && (
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="text-lg font-medium">{doctor.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
