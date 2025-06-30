import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  Typography,
  TextField,
  Button,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

interface Employee {
  _id: string;
  name: string;
}
interface WorkOrder {
  _id: string;
  orderNumber: string;
}
interface QualityCheck {
  _id: string;
  work_order_id: { _id: string; orderNumber: string };
  inspected_by: { _id: string; name: string };
  qc_result: string;
  remarks?: string;
  createdAt: string;
}

const QualityChecks: React.FC = () => {
  const [checks, setChecks] = useState<QualityCheck[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCheck, setEditingCheck] = useState<QualityCheck | null>(null);

  useEffect(() => {
    fetchChecks();
    fetchWorkOrders();
    fetchEmployees();
  }, []);

  const fetchChecks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/quality-checks`);
      setChecks(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchWorkOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/work-orders`);
      setWorkOrders(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditingCheck((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : null
    );
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCheck) return;

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/quality-checks/${editingCheck._id}`,
        {
          work_order_id: editingCheck.work_order_id._id,
          inspected_by: editingCheck.inspected_by._id,
          qc_result: editingCheck.qc_result,
          remarks: editingCheck.remarks,
        }
      );
      setEditingCheck(null);
      fetchChecks();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this quality check?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/quality-checks/${id}`);
        fetchChecks();
      } catch (error) {
        console.error(error);
      }
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen font-inter">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Quality Checks</h1>
        {editingCheck && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Edit Quality Check
            </Typography>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Work Order</InputLabel>
                  <Select
                    name="work_order_id"
                    value={editingCheck.work_order_id?._id || ""}
                     onChange={(e) =>
                      setEditingCheck((prev) =>
                        prev
                          ? {
                              ...prev,
                              work_order_id: { _id: e.target.value, orderNumber: "" },
                            }
                          : null
                      )
                    }
                    label="Work Order"
                  >
                    {workOrders.map((order) => (
                      <MenuItem key={order._id} value={order._id}>
                        {order.orderNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Inspected By</InputLabel>
                  <Select
                    name="inspected_by"
                    value={editingCheck.inspected_by._id}
                    onChange={(e) =>
                      setEditingCheck((prev) =>
                        prev
                          ? {
                              ...prev,
                              inspected_by: { _id: e.target.value, name: "" },
                            }
                          : null
                      )
                    }
                    label="Inspected By"
                  >
                    {employees.map((emp) => (
                      <MenuItem key={emp._id} value={emp._id}>
                        {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="QC Result"
                  name="qc_result"
                  value={editingCheck.qc_result}
                  onChange={handleEditChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={editingCheck.remarks || ""}
                  onChange={handleEditChange}
                  fullWidth
                  multiline
                  rows={3}
                />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="contained" color="inherit" onClick={() => setEditingCheck(null)}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quality Checks List</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Work Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Inspected By</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">QC Result</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {checks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      No quality checks found
                    </td>
                  </tr>
                ) : (
                  checks.map((check) => (
                    <tr key={check._id} className="hover:bg-gray-50 transition-colors duration-200">
<td className="px-6 py-4">{check.work_order_id?.orderNumber || "—"}</td>
<td className="px-6 py-4">{check.inspected_by.name}</td>
                      <td className="px-6 py-4">{check.qc_result}</td>
                      <td className="px-6 py-4">{check.remarks || "—"}</td>
                      <td className="px-6 py-4">{new Date(check.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCheck(check)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(check._id)}
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

export default QualityChecks;
