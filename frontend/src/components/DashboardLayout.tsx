import React, { useState } from "react";
import { Outlet, useNavigate, useLocation,Link } from "react-router-dom";
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
  FaTimes,
  FaPlus,
  FaUserPlus,
  FaFileInvoice,
  FaTruckLoading,
  FaTools,
  FaUserClock,
  FaReceipt,
  FaUserCog,
  FaHome,
  
} from "react-icons/fa";

import { FiBell, FiBriefcase, FiChevronDown, FiChevronRight, FiFileText } from "react-icons/fi";

const SidebarLinks = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: <FaHome />,
    color: "from-indigo-500 to-purple-600",
  },
  {
    path: "/dashboard/sales",
    label: "Sales & Orders",
    icon: <FaChartLine />,
    color: "from-blue-500 to-blue-700",
    submenu: [
      {
        path: "/dashboard/sales/add",
        label: "Add Order",
        icon: <FaPlus />,
      },
      {
        path: "/dashboard/sales/customers",
        label: "Customers",
        icon: <FaUsers />,
        submenu: [
          {
            path: "/dashboard/customers/add",
            label: "Add Customer",
            icon: <FaUserPlus />,
          },
        ],
      },
      {
        path: "/dashboard/sales/invoices",
        label: "Invoices",
        icon: <FaFileInvoice />,
        submenu: [
          {
            path: "/dashboard/invoices/add",
            label: "Add Invoice",
            icon: <FaPlus />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard/purchase",
    label: "Purchase Management",
    icon: <FaShoppingCart />,
    color: "from-green-500 to-green-600",
    submenu: [
      {
        path: "/dashboard/purchase/add",
        label: "Add Purchase Order",
        icon: <FaPlus />,
      },
      {
        path: "/dashboard/purchase/suppliers",
        label: "Suppliers",
        icon: <FaUsers />,
        submenu: [
          {
            path: "/dashboard/supplier/add",
            label: "Add Supplier",
            icon: <FaUserPlus />,
          },
        ],
      },
      {
        path: "/dashboard/purchase/grn",
        label: "GRNs",
        icon: <FaTruckLoading />,
        submenu: [
          {
            path: "/dashboard/grn/add",
            label: "Add GRN",
            icon: <FaPlus />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard/hr",
    label: "Employee & HR",
    icon: <FaUsers />,
    color: "from-purple-500 to-purple-600",
    submenu: [
      {
        path: "/dashboard/employee/add",
        label: "Add Employee",
        icon: <FaUserPlus />,
      },
      {
        path: "/dashboard/hr/attendance",
        label: "Attendance",
        icon: <FaUserClock />,
        submenu: [
          {
            path: "/dashboard/attendance/add",
            label: "Add Attendance",
            icon: <FaPlus />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard/finance",
    label: "Finance",
    icon: <FaMoneyBillWave />,
    color: "from-yellow-500 to-yellow-600",
    submenu: [
      {
        path: "/dashboard/finance/add",
        label: "Add Payment",
        icon: <FaPlus />,
      },
      {
        path: "/dashboard/finance/expenses",
        label: "Expenses",
        icon: <FaReceipt />,
        submenu: [
          {
            path: "/dashboard/expenses/add",
            label: "Add Expense",
            icon: <FaPlus />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard/admin",
    label: "Admin & Settings",
    icon: <FaCogs />,
    color: "from-red-500 to-red-600",
    submenu: [
      {
        path: "/dashboard/user/add",
        label: "Add User",
        icon: <FaUserPlus />,
      },
      {
        path: "/dashboard/admin/settings",
        label: "Settings",
        icon: <FaTools />,
        submenu: [
          {
            path: "/dashboard/setting/add",
            label: "Add Setting",
            icon: <FaPlus />,
          },
        ],
      },
      {
        path: "/dashboard/admin/audit_trail",
        label: "Audit Trail",
        icon: <FiFileText />,
        submenu: [
          {
            path: "/dashboard/audit_trail/add",
            label: "Add Audit Trail",
            icon: <FaPlus />,
          },
        ],
      },
      {
        path: "/dashboard/admin/notification",
        label: "Notification",
        icon: < FiBell  />,
        submenu: [
          {
            path: "/dashboard/notification/add",
            label: "Add Notification",
            icon: <FaPlus />,
          },
        ],
      },
      {
        path: "/dashboard/admin/activity-log",
        label: "Activity-logs",
        icon: <FaUserCog />,
      },
    ],
  },
  {
    path: "/dashboard/inventory",
    label: "Inventory",
    icon: <FaBoxes />,
    color: "from-indigo-500 to-indigo-600",
    submenu: [
      {
        path: "/dashboard/inventory/add",
        label: "Add Inventory-log",
        icon: <FaPlus />,
      },
      {
        path: "/dashboard/inventory/material",
        label: "Materials",
        icon: <FaUsers />,
        submenu: [
          {
            path: "/dashboard/material/add",
            label: "Add Material",
            icon: <FaPlus />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard/projects",
    label: "Project",
    icon: <FiBriefcase />,
    color: "from-indigo-500 to-indigo-600",
    submenu: [
      {
        path: "/dashboard/project/add",
        label: "Add Project",
        icon: <FaPlus />,
      },
    ]
    }
];

const DashboardLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (path: string, depth: number) => {
    setOpenMenus((prev) => {
      if (depth === 0) {
        return prev.includes(path) ? [] : [path]; 
      } else {
        return prev.includes(path)
          ? prev.filter((p) => p !== path)
          : [...prev, path]; 
      }
    });
  };

  const SidebarItem = ({ link, depth = 0 }: { link: any; depth?: number }) => {
    const isActive = location.pathname === link.path;
    const isOpen = openMenus.includes(link.path);
    const hasSubmenu = Array.isArray(link.submenu);

    const handleClick = () => {
      if (link.path) {
        navigate(link.path);
        setMobileMenuOpen(false);
      }
      if (hasSubmenu) {
        toggleMenu(link.path, depth);
      }
    };

    return (
      <div className="w-full">
        <button
          onClick={handleClick}
          className={`
            w-full group relative overflow-hidden rounded-lg transition-all duration-200 mb-1
            ${isActive
              ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
              : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
            }
          `}
          style={{ paddingLeft: `${depth * 16 + 16}px` }}
        >
          <div className={`flex items-center justify-between px-4 py-3`}>
            <div className="flex items-center gap-3">
              {link.icon && (
                <span className={`text-lg ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                  {link.icon}
                </span>
              )}
              {!sidebarCollapsed && (
                <span className="text-sm font-medium">{link.label}</span>
              )}
            </div>
            {hasSubmenu && !sidebarCollapsed && (
              <span className="text-sm text-gray-400">
                {isOpen ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            )}
          </div>
        </button>

        {hasSubmenu && isOpen && (
          <div className="ml-1">
            {link.submenu.map((sublink: any) => (
              <SidebarItem key={sublink.path} link={sublink} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        ${sidebarCollapsed ? 'w-16' : 'w-64'} 
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:static h-full  bg-[#ECEBFE] shadow-lg z-50 transition-all duration-300
        border-r border-gray-300
      `}>
        <div className="flex flex-col h-full">

          <div className="p-6 border-b border-gray-300">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <Link to="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <img src="/logo.png" alt="logo" className="w-full h-full object-contain" />
                </div>
              
                <div>
                  <h1 className="text-lg font-bold text-gray-800">Manufacturing ERP</h1>
                </div>
              </Link>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="text-gray-600 text-sm" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            {SidebarLinks.map((link) => (
              <SidebarItem key={link.path} link={link} />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200 space-y-2">
           
            
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                hover:bg-gray-50 text-gray-700 transition-all duration-200
                ${sidebarCollapsed ? 'justify-center' : ''}
              `}
            >
              <FaSignOutAlt className="text-lg text-gray-500" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <header className="bg-gray-100 border-b border-gray-300 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FaBars className="text-gray-600" />
              </button>
              
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              

              

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{user?.role || 'Admin'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;