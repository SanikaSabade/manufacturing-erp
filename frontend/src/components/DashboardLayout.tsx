import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaChartLine,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave,
  FaCogs,
  FaSignOutAlt,
  FaBoxes,
  FaBars,
  FaTimes} from "react-icons/fa";

const SidebarLinks = [
  { 
    path: "/dashboard/sales", 
    label: "Sales & Orders", 
    icon: <FaChartLine />,
    color: "from-blue-500 to-blue-600"
  },
  { 
    path: "/dashboard/purchase", 
    label: "Purchase Management", 
    icon: <FaShoppingCart />,
    color: "from-green-500 to-green-600"
  },
  { 
    path: "/dashboard/hr", 
    label: "Employee & HR", 
    icon: <FaUsers />,
    color: "from-purple-500 to-purple-600"
  },
  { 
    path: "/dashboard/finance", 
    label: "Finance", 
    icon: <FaMoneyBillWave />,
    color: "from-yellow-500 to-yellow-600"
  },
  { 
    path: "/dashboard/admin", 
    label: "Admin & Settings", 
    icon: <FaCogs />,
    color: "from-red-500 to-red-600"
  },
  { 
    path: "/dashboard/inventory", 
    label: "Inventory", 
    icon: <FaBoxes />,
    color: "from-indigo-500 to-indigo-600"
  },
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        ${sidebarCollapsed ? 'w-20' : 'w-72'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:static h-full bg-white/95 backdrop-blur-sm shadow-2xl z-50 transition-all duration-300 ease-in-out
        border-r border-slate-200/50
      `}>
        <div className="flex flex-col h-full">

          <div className="p-6 border-b border-slate-200/50">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">M</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Manufacturing
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">ERP System</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FaBars className="text-slate-600" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <FaTimes className="text-slate-600" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {SidebarLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full group relative overflow-hidden rounded-xl transition-all duration-300
                    ${isActive 
                      ? `bg-gradient-to-r ${link.color} text-white shadow-lg transform scale-105` 
                      : 'hover:bg-slate-50 text-slate-700 hover:scale-102'
                    }
                  `}
                >
                  <div className={`flex items-center gap-4 p-4 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                    <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {link.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span className="font-medium text-sm tracking-wide">
                        {link.label}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200/50">
            
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className={`
                w-full flex items-center gap-3 p-3 rounded-xl
                bg-gradient-to-r from-red-500 to-red-600 text-white
                hover:from-red-600 hover:to-red-700 transition-all duration-300
                shadow-lg hover:shadow-xl hover:scale-105
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <FaSignOutAlt className="text-lg" />
              {!sidebarCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-8 bg-gray-50">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaBars className="text-gray-600" />
          </button>
        </div>

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

        <div className="bg-white p-6 rounded-xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;