import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button onClick={() => navigate('/users')} className="btn bg-blue-500 text-white p-4 rounded shadow">
          Users
        </button>
        <button onClick={() => navigate('/materials')} className="btn bg-green-500 text-white p-4 rounded shadow">
          Materials
        </button>
        <button onClick={() => navigate('/inventory')} className="btn bg-yellow-500 text-white p-4 rounded shadow">
          Inventory
        </button>
        <button onClick={() => navigate('/activities')} className="btn bg-purple-500 text-white p-4 rounded shadow">
          Activities
        </button>
      </div>
    </div>
  );
}
