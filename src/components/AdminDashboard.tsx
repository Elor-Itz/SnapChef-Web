'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CubeIcon, 
  DocumentTextIcon, 
  ArrowRightOnRectangleIcon,
  UserIcon 
} from '@heroicons/react/24/solid';

interface AdminDashboardProps {
  user: { username: string; role: string };
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('ingredients');

  const handleNavigateToIngredients = () => {
    router.push('/ingredients');
  };

  const handleViewLogs = () => {
    // Future feature: Navigate to logs
    alert('Logs feature will be added soon');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    onLogout();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          <UserIcon className="h-8 w-8 text-[#ff7a59]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Hello {user.username}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('ingredients')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'ingredients'
              ? 'border-b-2 border-[#ff7a59] text-[#ff7a59]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CubeIcon className="h-5 w-5" />
            Ingredients Management
          </div>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'logs'
              ? 'border-b-2 border-[#ff7a59] text-[#ff7a59]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <DocumentTextIcon className="h-5 w-5" />
            Logs
          </div>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'ingredients' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Ingredients Management</h3>
            <p className="text-gray-600 mb-6">
              From here you can manage all ingredients in the system - add, edit and delete ingredients.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <CubeIcon className="h-8 w-8 text-[#ff7a59]" />
                  <div>
                    <h4 className="font-semibold">Ingredients List</h4>
                    <p className="text-sm text-gray-600">View and edit existing ingredients</p>
                  </div>
                </div>
                <button
                  onClick={handleNavigateToIngredients}
                  className="w-full bg-[#ff7a59] text-white py-2 px-4 rounded-md hover:bg-[#e86a4d] transition-colors"
                >
                  Go to Ingredients Management
                </button>
              </div>
              
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <DocumentTextIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <h4 className="font-semibold">Statistics</h4>
                    <p className="text-sm text-gray-600">Data about ingredients in the system</p>
                  </div>
                </div>
                <div className="text-center py-4">
                  <div className="text-2xl font-bold text-gray-800">--</div>
                  <div className="text-sm text-gray-600">Total Ingredients</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">System Logs</h3>
            <p className="text-gray-600 mb-6">
              From here you can view system activity and various logs.
            </p>
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-3 mb-3">
                <DocumentTextIcon className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="font-semibold">Activity Logs</h4>
                  <p className="text-sm text-gray-600">View user activity in the system</p>
                </div>
              </div>
              <button
                onClick={handleViewLogs}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
              >
                View Logs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;