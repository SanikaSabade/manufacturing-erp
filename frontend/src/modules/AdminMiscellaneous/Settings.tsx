import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";

interface Settings {
  _id?: string;
  currency: string;
  taxPercentage: number;
  fiscalYearStart: string;
  fiscalYearEnd: string;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Settings>({
    currency: "",
    taxPercentage: 0,
    fiscalYearStart: "",
    fiscalYearEnd: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    setLoading(true);
    axios
      .get<Settings[]>(`${import.meta.env.VITE_BACKEND_URL}api/settings`)
      .then((res) => setSettings(res.data))
      .catch((err) => console.error("Failed to fetch settings:", err))
      .finally(() => setLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "taxPercentage" ? +value : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/settings/${editingId}`, form);
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/settings`, form);
      }
      fetchSettings();
      setForm({ currency: "", taxPercentage: 0, fiscalYearStart: "", fiscalYearEnd: "" });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Save failed", error);
    }
  };

  const handleEdit = (setting: Settings) => {
    setForm({
      ...setting,
      fiscalYearStart: setting.fiscalYearStart.split("T")[0],
      fiscalYearEnd: setting.fiscalYearEnd.split("T")[0],
    });
    setEditingId(setting._id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this setting?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/settings/${id}`);
        fetchSettings();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            </div>
            
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{editingId ? "Edit Setting" : "Add Setting"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <input
                    name="currency"
                    value={form.currency}
                    onChange={handleInputChange}
                    placeholder="Enter currency (e.g., INR, USD)"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Percentage</label>
                  <input
                    name="taxPercentage"
                    value={form.taxPercentage}
                    onChange={handleInputChange}
                    type="number"
                    step="0.01"
                    placeholder="Enter tax %"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start</label>
                  <input
                    name="fiscalYearStart"
                    value={form.fiscalYearStart}
                    onChange={handleInputChange}
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year End</label>
                  <input
                    name="fiscalYearEnd"
                    value={form.fiscalYearEnd}
                    onChange={handleInputChange}
                    type="date"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  {editingId ? "Update Setting" : "Add Setting"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm({ currency: "", taxPercentage: 0, fiscalYearStart: "", fiscalYearEnd: "" });
                    setEditingId(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Settings List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[100px]">Currency</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[100px]">Tax (%)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiscal Year Start</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiscal Year End</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {settings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No settings found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  settings.map((setting) => (
                    <tr key={setting._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-3 py-2 max-w-[100px] whitespace-nowrap">
                        <div className="text-sm text-gray-900">{setting.currency}</div>
                      </td>
                      <td className="px-3 py-2 max-w-[100px] whitespace-nowrap">
                        <div className="text-sm text-gray-900">{setting.taxPercentage}%</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(setting.fiscalYearStart).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(setting.fiscalYearEnd).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(setting)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(setting._id!)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;