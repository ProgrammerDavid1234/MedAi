import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Pricing = () => {
  const [loading, setLoading] = useState(false);

  const handleSubscription = async (plan: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://healthcare-backend-a66n.onrender.com/api/subscriptions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const { sessionId } = await response.json();

      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="pricing-container">
      <h2>Choose Your Plan</h2>
      <div className="plans">
        <div className="plan">
          <h3>Basic - $9.99/mo</h3>
          <p>Book Appointments, Access Medical Records, Limited Messaging</p>
          <button onClick={() => handleSubscription("basic")} disabled={loading}>
            {loading ? "Processing..." : "Get Started"}
          </button>
        </div>

        <div className="plan">
          <h3>Pro - $19.99/mo</h3>
          <p>Unlimited Messaging, Priority Support, Health Insights</p>
          <button onClick={() => handleSubscription("pro")} disabled={loading}>
            {loading ? "Processing..." : "Choose Plan"}
          </button>
        </div>

        <div className="plan">
          <h3>Enterprise - $49.99/mo</h3>
          <p>Dedicated Doctor, 24/7 Support, Advanced Analytics</p>
          <button onClick={() => handleSubscription("enterprise")} disabled={loading}>
            {loading ? "Processing..." : "Contact Us"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
