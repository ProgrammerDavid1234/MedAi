import React from "react";
import { CheckCircle } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "$9.99/mo",
      features: ["Book Appointments", "Access Medical Records", "Limited Messaging"],
      button: "Get Started",
    },
    {
      name: "Pro",
      price: "$19.99/mo",
      features: [
        "Everything in Basic",
        "Unlimited Messaging",
        "Priority Support",
        "Health Insights",
      ],
      button: "Choose Plan",
    },
    {
      name: "Enterprise",
      price: "$49.99/mo",
      features: [
        "Everything in Pro",
        "Dedicated Doctor",
        "24/7 Support",
        "Advanced Analytics",
      ],
      button: "Contact Us",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Pricing Plans</h2>
      <p className="text-gray-600 mb-10 text-center max-w-lg">
        Choose a plan that fits your healthcare needs and budget.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-md w-80 text-center">
            <h3 className="text-2xl font-semibold text-gray-800">{plan.name}</h3>
            <p className="text-3xl font-bold text-indigo-600 my-4">{plan.price}</p>
            <ul className="text-gray-600 space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> {feature}
                </li>
              ))}
            </ul>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
