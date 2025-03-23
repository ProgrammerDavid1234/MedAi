import { useEffect } from "react";

const SubscriptionSuccess = () => {
  useEffect(() => {
    fetch("/api/subscriptions/status", { method: "POST" })
      .then(() => console.log("Subscription Updated"))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <div>
      <h2>🎉 Subscription Activated!</h2>
      <p>Thank you for subscribing.</p>
    </div>
  );
};

export default SubscriptionSuccess;
