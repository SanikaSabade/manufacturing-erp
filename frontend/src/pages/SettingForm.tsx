import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

interface Settings {
  currency: string;
  taxPercentage: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
}

const SettingsForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Settings>({
    currency: "",
    taxPercentage: "",
    fiscalYearStart: "",
    fiscalYearEnd: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "taxPercentage" ? +value : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/settings`, form);
      navigate("/dashboard/admin/settings"); 
    } catch (error) {
      console.error("Failed to save setting:", error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add New Setting</h2>
      <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow space-y-4">
        <input
          name="currency"
          value={form.currency}
          onChange={handleChange}
          placeholder="Currency"
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="taxPercentage"
          type="number"
          value={form.taxPercentage}
          onChange={handleChange}
          placeholder="Tax %"
          className="w-full p-2 border rounded"
          required
        />
        <div>
        <label className="block mb-1 font-medium">Fiscal Year Start</label>

        <input
          name="fiscalYearStart"
          type="date"
          value={form.fiscalYearStart}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          />
          </div>
          <div>
          <label className="block mb-1 font-medium">Fiscal Year End</label>

        <input
          name="fiscalYearEnd"
          type="date"
          value={form.fiscalYearEnd}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
          />
          </div>
        <div className="flex gap-2 justify-center">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Add Setting
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/admin/settings")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsForm;
