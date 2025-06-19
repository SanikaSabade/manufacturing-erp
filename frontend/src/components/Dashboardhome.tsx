import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00c49f"];

interface Order {
  orderNumber: string;
  date: string;
  status: string;
  customer?: { name: string };
  supplier?: { name: string };
}

interface DashboardStats {
  salesTotal: number;
  purchaseTotal: number;
  profit: number;
  lastSalesOrders: Order[];
  lastPurchaseOrders: Order[];
  topProducts: { name: string; totalSold: number }[];
  topCategories: { category: string; totalSold: number }[];
  activeEmployees: number;
  receivedOrders: number;
  pendingOrders: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/dashboard/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

  const financialData = [
    { name: "Sales", value: stats.salesTotal },
    { name: "Purchase", value: stats.purchaseTotal },
    { name: "Profit", value: stats.profit }
  ];

  return (
    <div className="space-y-10 p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {financialData.map(({ name, value }) => (
          <div key={name} className="bg-white shadow p-6 rounded-lg text-center">
            <p className="text-lg font-semibold text-gray-600">{name}</p>
            <p className="text-2xl font-bold text-indigo-600">₹{value.toFixed(2)}</p>
          </div>
        ))}
        <div className="bg-white shadow p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-600">Active Employees</p>
          <p className="text-2xl font-bold text-green-600">{stats.activeEmployees}</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-600">Received Orders</p>
          <p className="text-2xl font-bold text-blue-600">{stats.receivedOrders}</p>
        </div>
        <div className="bg-white shadow p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-gray-600">Pending Orders</p>
          <p className="text-2xl font-bold text-red-600">{stats.pendingOrders}</p>
        </div>
      </div>

      {/* Top Products - Bar Chart */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Top 10 Products Sold</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="totalSold" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Categories - Pie Chart */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Top 10 Categories Sold</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stats.topCategories.map(c => ({ name: c.category, value: c.totalSold }))}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stats.topCategories.map((_entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Last 10 Sales Orders */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Last 10 Sales Orders</h3>
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Order No.</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.lastSalesOrders.map((order, i) => (
              <tr key={i} className="hover:bg-gray-50 border">
                <td className="px-4 py-2 border">{order.orderNumber}</td>
                <td className="px-4 py-2 border">{order.customer?.name || 'N/A'}</td>
                <td className="px-4 py-2 border">{order.status}</td>
                <td className="px-4 py-2 border">{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Last 10 Purchase Orders */}
      <div className="bg-white p-6 shadow rounded-lg">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Last 10 Purchase Orders</h3>
        <table className="min-w-full text-sm text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Supplier</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.lastPurchaseOrders.map((order, i) => (
              <tr key={i} className="hover:bg-gray-50 border">
                <td className="px-4 py-2 border">{order.supplier?.name || 'N/A'}</td>
                <td className="px-4 py-2 border">{order.status}</td>
                <td className="px-4 py-2 border">{new Date(order.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardHome;
