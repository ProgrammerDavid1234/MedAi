import React from 'react';

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  count: number | null;
  onClick: () => void;
}

function DashboardCard({ title, icon, count, onClick }: DashboardCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-700">{title}</h3>
        {icon}
      </div>
      {count !== null && (
        <p className="text-2xl font-semibold">{count}</p>
      )}
    </div>
  );
}

export default DashboardCard;