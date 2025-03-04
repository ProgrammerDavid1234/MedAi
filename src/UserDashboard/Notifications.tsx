import React from 'react';
import { Calendar, FileText, MessageSquare, AlertTriangle } from 'lucide-react';
import { mockNotifications } from '../data/mockData';

function Notifications() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Notifications</h2>
      
      <div className="space-y-4">
        {mockNotifications.map(notification => (
          <div key={notification.id} className="bg-white rounded-lg shadow p-4 flex">
            <div className="mr-4">
              {notification.type === 'appointment' && (
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
              )}
              {notification.type === 'prescription' && (
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-500" />
                </div>
              )}
              {notification.type === 'message' && (
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-purple-500" />
                </div>
              )}
              {notification.type === 'emergency' && (
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{notification.title}</h3>
                <span className="text-xs text-gray-500">{notification.time}</span>
              </div>
              <p className="text-gray-600 mt-1">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;