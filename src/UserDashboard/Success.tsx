import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext"; // 🔥 Import AuthContext hook

const Success = () => {
  const { authToken } = useAuth(); // 🔥 Get token from context
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId && authToken) {
      axios
        .post(
          "https://healthcare-backend-a66n.onrender.com/api/subscription/confirm-payment",
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // 🔥 Use token from context
            },
          }
        )
        .then((res) => {
          toast.success("Payment successful! Subscription activated.");
          setTimeout(() => navigate("/dashboard"), 3000);
        })
        .catch((err) => {
          console.error("Payment verification failed:", err);
          toast.error("Failed to verify payment. Please contact support.");
        });
    }
  }, [sessionId, authToken, navigate]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>✅ Payment Successful! 🎉</h2>
      <p>We're verifying your subscription. Please wait...</p>
    </div>
  );
};

export default Success;
