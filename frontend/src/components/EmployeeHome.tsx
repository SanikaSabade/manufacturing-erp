import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaClock, FaTasks, FaUser, FaCalendarAlt, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmployeeHome: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white p-6 rounded-lg shadow mb-6 text-center">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">Welcome, {user?.name} </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <FaClipboardList className="text-indigo-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Tasks Assigned</p>
              <p className="text-xl font-semibold text-gray-800">5</p> 
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <FaClock className="text-yellow-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Today's Hours</p>
              <p className="text-xl font-semibold text-gray-800">8 hrs</p> 
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
            <FaCalendarAlt className="text-green-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">Leave Balance</p>
              <p className="text-xl font-semibold text-gray-800">10 Days</p> 
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2"
            onClick={() => alert('Redirect to assigned tasks')}
          >
            <FaTasks /> View Tasks
          </button>

          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded flex items-center justify-center gap-2"
            onClick={() => alert('Redirect to attendance page')}
          >
            <FaCalendarAlt /> View Attendance
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white p-6 rounded-lg shadow text-left">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaUser /> Profile Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p> 
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Department:</strong> Inventory</p> 
            <p><strong>Employee ID:</strong> EMP1234</p> 
            <p><strong>Joining Date:</strong> 01/01/2023</p> 
          </div>
        </div>

        <div className="fixed bottom-4 left-4">
          <button
    onClick={() => {
      logout();
      navigate("/");
    }}
    className="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded flex items-center gap-2 justify-center shadow-lg"
  >
    <FaSignOutAlt /> Logout
  </button>
</div>

      </div>
    </div>
  );
};

export default EmployeeHome;
