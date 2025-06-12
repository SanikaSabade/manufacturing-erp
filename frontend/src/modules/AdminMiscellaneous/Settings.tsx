import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";

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
    fiscalYearEnd: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
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
    setForm(setting);
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

  if (loading) return <div className="p-6 text-gray-500">Loading settings...</div>;

  return (
    <div className="p-6">
           <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">System Settings</h2>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/dashboard/setting/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add Setting
          </button>
        </div>
        </div>


      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded shadow">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              name="currency"
              value={form.currency}
              onChange={handleInputChange}
              placeholder="Currency"
              className="p-2 border rounded"
              required
            />
            <input
              name="taxPercentage"
              value={form.taxPercentage}
              onChange={handleInputChange}
              type="number"
              placeholder="Tax %"
              className="p-2 border rounded"
              required
            />
            <input
              name="fiscalYearStart"
              value={form.fiscalYearStart}
              onChange={handleInputChange}
              type="date"
              className="p-2 border rounded"
              required
            />
            <input
              name="fiscalYearEnd"
              value={form.fiscalYearEnd}
              onChange={handleInputChange}
              type="date"
              className="p-2 border rounded"
              required
            />
          </div>
          <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
>
  Cancel
</button>
        </div>
        </form>
      )}

      <div className="overflow-x-auto shadow rounded">
        <table className="min-w-full border border-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Currency</th>
              <th className="px-4 py-2 border">Tax (%)</th>
              <th className="px-4 py-2 border">Fiscal Year Start</th>
              <th className="px-4 py-2 border">Fiscal Year End</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 border">{setting.currency}</td>
                <td className="px-4 py-2 border">{setting.taxPercentage}</td>
                <td className="px-4 py-2 border">
                  {new Date(setting.fiscalYearStart).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(setting.fiscalYearEnd).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 flex gap-2 border-r-1">
                  <button
                    onClick={() => handleEdit(setting)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(setting._id!)}
                    className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {settings.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center px-4 py-4 text-gray-500">
                  No settings available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingsPage;
