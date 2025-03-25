import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Subscription: React.FC = () => {
  const { authToken } = useAuth();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: string) => {
    if (!authToken) {
      toast.error("⚠️ Please log in to subscribe.");
      navigate("/login");
      return;
    }

    try {
        const response = await axios.post(
          "https://healthcare-backend-a66n.onrender.com/api/subscription/subscribe",
          { plan },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
      
        console.log("Subscription Response:", response.data); // ✅ Debugging
      
        if (response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl; // ✅ Redirect to Stripe
        } else {
          toast.error("❌ Subscription failed. Try again.");
        }
      } catch (error) {
        toast.error("❌ Subscription failed. Try again.");
      }
      
      
    };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        Choose the Right Plan for You
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Basic Plan */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Basic Plan</h2>
          <p className="text-center text-gray-600 mt-2">$9.99/month</p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>✅ Book Appointments</li>
            <li>✅ Access Medical Records</li>
            <li>⚠️ Limited Messaging</li>
          </ul>
          <button
            onClick={() => handleSubscribe("basic")}
            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Subscribe
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-blue-500 transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Pro Plan</h2>
          <p className="text-center text-gray-600 mt-2">$19.99/month</p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>✅ Everything in Basic</li>
            <li>✅ Unlimited Messaging</li>
            <li>✅ Priority Support</li>
            <li>✅ Health Insights</li>
          </ul>
          <button
            onClick={() => handleSubscribe("pro")}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Subscribe
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">Enterprise Plan</h2>
          <p className="text-center text-gray-600 mt-2">$49.99/month</p>
          <ul className="mt-4 space-y-2 text-gray-600">
            <li>✅ Everything in Pro</li>
            <li>✅ Dedicated Doctor</li>
            <li>✅ 24/7 Support</li>
            <li>✅ Advanced Analytics</li>
          </ul>
          <button
            onClick={() => handleSubscribe("enterprise")}
            className="mt-6 w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Subscribe
          </button>
        </div>
      </div>

      <p className="mt-6 text-gray-600 text-sm">
        Need help?{" "}
        <a href="/contact" className="text-blue-500 hover:underline">
          Contact support
        </a>
      </p>
    </div>
  );
};

export default Subscription;
