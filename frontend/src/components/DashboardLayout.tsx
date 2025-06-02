import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
  FaCogs,
  FaSignOutAlt,
  FaBoxes
} from "react-icons/fa";

const SidebarLinks = [
  { path: "/dashboard/sales", label: "Sales & Orders", icon: <FaChartLine /> },
  { path: "/dashboard/purchase", label: "Purchase Management", icon: <FaShoppingCart /> },
  { path: "/dashboard/hr", label: "Employee & HR", icon: <FaUsers /> },
  { path: "/dashboard/finance", label: "Finance", icon: <FaMoneyBillWave /> },
  { path: "/dashboard/admin", label: "Admin & Settings", icon: <FaCogs /> },
  { path: "/dashboard/inventory", label: "Inventory", icon: <FaBoxes /> },

];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100 font-sans">

      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-lg">
        <div className="text-3xl font-bold text-center mb-10 tracking-wide">Admin Panel</div>

        <nav className="flex-1">
          {SidebarLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md mb-2 text-left transition-all duration-200 ${
                location.pathname === link.path
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-sm font-medium">{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200"
          >
            <FaSignOutAlt className="text-lg" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
  <div className="mb-6 flex justify-between items-center">
    <h1 className="text-2xl font-semibold text-gray-800">Welcome to Manufacturing ERP</h1>
    <span className="text-sm text-gray-500">Logged in as <strong>{user?.role}</strong></span>
  </div>

  

  <div className="bg-white p-6 rounded-xl shadow-md mb-6">
    <h3 className="text-lg font-semibold text-gray-700 mb-4">Production Overview</h3>
    <p className="text-sm text-gray-600">
      Track your plant's overall efficiency, identify bottlenecks, and monitor production KPIs here.
    </p>
  </div>

  <div className="bg-white p-6 rounded-xl ">
    <Outlet />
  </div>
</main>

    </div>
  );
};

export default DashboardLayout;
