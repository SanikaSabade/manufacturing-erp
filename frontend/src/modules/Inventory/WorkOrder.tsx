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
  type SelectChangeEvent
} from "@mui/material";

interface Machine {
  _id: string;
  machine_name: string;
}

interface WorkOrder {
  _id: string;
  orderNumber: string;
  machine_id: { _id: string; machine_name: string };
  shift: "Morning" | "Evening" | "Night";
  planned_start_date: string;
  planned_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  createdAt: string;
}

const WorkOrders: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState<WorkOrder | null>(null);

  useEffect(() => {
    fetchWorkOrders();
    fetchMachines();
  }, []);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/work-orders`);
      setWorkOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchMachines = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/machines`);
      setMachines(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditingOrder((prev) =>
      prev
        ? {
            ...prev,
            [name]: value,
          }
        : null
    );
  };

  const handleReadFlagChange = (e: SelectChangeEvent) => {
    setReadFlag(e.target.value === "true");
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}api/work-orders/${editingOrder._id}`, {
        machine_id: editingOrder.machine_id._id,
        shift: editingOrder.shift,
        planned_start_date: editingOrder.planned_start_date,
        planned_end_date: editingOrder.planned_end_date,
        actual_start_date: editingOrder.actual_start_date || undefined,
        actual_end_date: editingOrder.actual_end_date || undefined,
      });
      setEditingOrder(null);
      fetchWorkOrders();
    } catch (error) {
      console.error(error);
    }
  };
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this work order?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/work-orders/${id}`);
        fetchWorkOrders();
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
        <h1 className="text-3xl font-bold text-gray-900">Work Orders</h1>

        {editingOrder && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-4">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Edit Work Order
            </Typography>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Machine</InputLabel>
                  <Select
                    name="machine_id"
                    value={editingOrder.machine_id._id}
                    onChange={(e) =>
                      setEditingOrder((prev) =>
                        prev
                          ? {
                              ...prev,
                              machine_id: {
                                _id: e.target.value,
                                machine_name: "",
                              },
                            }
                          : null
                      )
                    }
                    required
                    label="Machine"
                  >
                    {machines.map((machine) => (
                      <MenuItem key={machine._id} value={machine._id}>
                        {machine.machine_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Shift</InputLabel>
                  <Select
                    name="shift"
                    value={editingOrder.shift}
                    onChange={handleReadFlagChange}
                    required
                    label="Shift"
                  >
                    <MenuItem value="Morning">Morning</MenuItem>
                    <MenuItem value="Evening">Evening</MenuItem>
                    <MenuItem value="Night">Night</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Planned Start Date"
                  type="date"
                  name="planned_start_date"
                  value={editingOrder.planned_start_date.slice(0, 10)}
                  onChange={handleEditChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Planned End Date"
                  type="date"
                  name="planned_end_date"
                  value={editingOrder.planned_end_date.slice(0, 10)}
                  onChange={handleEditChange}
                  required
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Actual Start Date"
                  type="date"
                  name="actual_start_date"
                  value={editingOrder.actual_start_date?.slice(0, 10) || ""}
                  onChange={handleEditChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Actual End Date"
                  type="date"
                  name="actual_end_date"
                  value={editingOrder.actual_end_date?.slice(0, 10) || ""}
                  onChange={handleEditChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="contained" color="inherit" onClick={() => setEditingOrder(null)}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Work Orders List</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Machine</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Planned Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Planned End Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actual Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actual End Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      No work orders found
                    </td>
                  </tr>
                ) : (
                  workOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors duration-200">
  <td className="px-6 py-4">{order.orderNumber}</td>

                      <td className="px-6 py-4">{order.machine_id.machine_name}</td>
                      <td className="px-6 py-4">{order.shift}</td>
                      <td className="px-6 py-4">{new Date(order.planned_start_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{new Date(order.planned_end_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4">{order.actual_start_date ? new Date(order.actual_start_date).toLocaleDateString() : "—"}</td>
                      <td className="px-6 py-4">{order.actual_end_date ? new Date(order.actual_end_date).toLocaleDateString() : "—"}</td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingOrder(order)}
                            className="inline-flex items-center px-1.5 py-0.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(order._id)}
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
export default WorkOrders;
function setReadFlag(_arg0: boolean) {
  throw new Error("Function not implemented.");
}

