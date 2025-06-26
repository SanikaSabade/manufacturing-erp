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

interface Project {
  _id: string;
  project_name: string;
  start_date?: string;
  deadline?: string;
  client_id?: { _id: string; name: string };
  budget?: number;
  createdAt: string;
}

interface Client {
  _id: string;
  name: string;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchClients();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/projects`);
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchClients = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/customers`);
      setClients(res.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingProject((prev) =>
      prev ? { ...prev, [name]: name === "budget" ? +value : value } : null
    );
  };
  
  const handleEditClientChange = (e: any) => {
    const { value } = e.target;
    setEditingProject((prev) =>
      prev ? { ...prev, client_id: { _id: value, name: "" } } : null
    );
  };
  
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/projects/${editingProject._id}`,
        editingProject
      );
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            </div>
          </div>
        </div>

        {editingProject && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 p-4">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Edit Project
            </Typography>
            <form onSubmit={handleEditSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Project Name"
                  name="project_name"
                  value={editingProject.project_name}
                  onChange={handleEditChange}
                  required
                  fullWidth
                />
                <TextField
                  label="Start Date"
                  name="start_date"
                  value={editingProject.start_date?.slice(0, 10)}
                  onChange={handleEditChange}
                  required
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Deadline"
                  name="deadline"
                  value={editingProject.deadline?.slice(0, 10)}
                  onChange={handleEditChange}
                  required
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Select
                    value={editingProject.client_id?._id || ""}
                    onChange={handleEditClientChange}
                    label="Client"
                  >
                    <MenuItem value="">None</MenuItem>
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Budget"
                  name="budget"
                  value={editingProject.budget ?? ""}
                  onChange={handleEditChange}
                  fullWidth
                  type="number"
                />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="success" type="submit">
                    Save Changes
                  </Button>
                  <Button variant="contained" color="inherit" onClick={() => setEditingProject(null)}>
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Projects List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">{project.project_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(project.start_date ?? "").toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(project.deadline ?? "").toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{project.client_id?.name || "—"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{project.budget ?? 0}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(project.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors duration-200"
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

export default Projects;
