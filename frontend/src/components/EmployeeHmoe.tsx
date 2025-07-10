import React from 'react';
import { useAuth } from '../context/AuthContext';

const EmployeeHome: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">Welcome, {user?.name} 👋</h1>
        <p className="text-gray-600 mb-6">You are logged in as <span className="font-medium text-gray-800">{user?.role}</span>.</p>

        <div className="flex flex-col gap-4">
          <button
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded transition"
            onClick={() => alert('Employee dashboard features will go here!')}
          >
            View Tasks
          </button>

          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeHome;
