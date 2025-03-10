import React from "react";
import { useNavigate } from "react-router-dom";

interface ProfileCardProps {
    profile: Record<string, any>;
    isEditing: boolean;
    formData?: Record<string, any>;
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit?: (e: React.FormEvent) => void;
    setIsEditing: (isEditing: boolean) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
    profile,
    isEditing,
    formData,
    handleInputChange,
    handleSubmit,
    setIsEditing,
}) => {
    const navigate = useNavigate(); // ✅ Hook for back navigation

    return (
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {/* 🔙 Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
            >
                ← Back
            </button>

            {isEditing && formData && handleInputChange && handleSubmit ? (
                <form onSubmit={handleSubmit}>
                    {Object.keys(formData).map((key) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-700">{key}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key] || ""}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                    <div className="flex space-x-4 mt-4">
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="flex items-center mb-6">
                        <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-2xl">
                            {profile.name
                                ?.split(" ")
                                .map((part: string) => part[0])
                                .join("")}
                        </div>
                        <div className="ml-6">
                            <h3 className="text-2xl font-semibold">{profile.name}</h3>
                            {profile.specialization && <p className="text-gray-500">{profile.specialization}</p>}
                            {profile.phone && (
                                <p className="text-gray-500">
                                    <strong>Phone:</strong> {profile.phone ? profile.phone : "N/A"}
                                    console.log("Profile Data:", profile);

                                </p>


                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(profile).map(([key, value]) => (
                            <div key={key}>
                                <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                                <p>{Array.isArray(value) ? value.join(", ") : value || "N/A"}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileCard;
