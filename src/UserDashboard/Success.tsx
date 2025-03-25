import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const Success = () => {
  const { authToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id"); // Get session ID from URL

  useEffect(() => {
    const fetchUpdatedUser = async () => {
      if (!authToken) return;

      try {
        // Fetch latest user data
        const response = await axios.get("https://healthcare-backend-a66n.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        setUser(response.data); // ✅ Update subscription status
        navigate("/dashboard"); // ✅ Redirect to dashboard
      } catch (error) {
        console.error("Error fetching updated user:", error);
      }
    };

    if (sessionId) {
      fetchUpdatedUser(); // Fetch updated subscription info
    }
  }, [authToken, navigate, setUser, sessionId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-green-600">Payment Successful! 🎉</h1>
      <p>Redirecting you to your dashboard...</p>
    </div>
  );
};

export default Success;
