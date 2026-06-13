import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const performanceData = [
  { name: 'Jan', views: 4, connections: 1, pitchDownloads: 0 },
  { name: 'Feb', views: 12, connections: 3, pitchDownloads: 2 },
  { name: 'Mar', views: 18, connections: 5, pitchDownloads: 4 },
  { name: 'Apr', views: 24, connections: 8, pitchDownloads: 7 },
  { name: 'May', views: 35, connections: 12, pitchDownloads: 15 },
  { name: 'Jun', views: 48, connections: 19, pitchDownloads: 22 },
];

export const DashboardAnalytics: React.FC = () => {
  return (
    <div className="space-y-6 mt-6">
      
      {/* Heading */}
      <div className="border-b border-gray-100 pb-2">
        <h2 className="text-xl font-bold text-gray-900">📈 Startup Analytics & Insights</h2>
        <p className="text-xs text-gray-500">Track how investors are interacting with your profile and pitch deck</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Line Chart */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Profile Visibility Growth (Monthly)</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend iconType="circle" />
                <Line type="monotone" dataKey="views" name="Profile Views" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="connections" name="Connections" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bar Chart */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-bold text-gray-800 mb-4">Pitch Deck Interest Rates</h3>
          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Legend iconType="rect" />
                <Bar dataKey="pitchDownloads" name="Pitch PPTX Downloads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};