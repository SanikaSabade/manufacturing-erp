import React, { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
  } from "recharts";
  
import axios from "../utils/axios";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00c49f"];

interface Stats {
  sales: number;
  purchase: number;
  hr: number;
  finance: number;
  inventory: number;
}

interface ChartData {
  name: string;
  count: number;
}

interface PieChartData {
  name: string;
  value: number;
}

const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios.get<Stats>("/api/dashboard/stats")
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
    return <p className="text-gray-500">Loading stats...</p>;
  }

  const barData: ChartData[] = [
    { name: "Sales", count: stats.sales },
    { name: "Purchase", count: stats.purchase },
    { name: "Finance", count: stats.finance },
    { name: "Inventory", count: stats.inventory },
  ];

  const pieData: PieChartData[] = barData.map(({ name, count }) => ({
    name,
    value: count,
  }));

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
      <h2 className="flex justify-center text-3xl">Example Statistics</h2>

        <h2 className="text-xl font-bold text-gray-700 p-4">Menu Statistics Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Menu Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardHome;
