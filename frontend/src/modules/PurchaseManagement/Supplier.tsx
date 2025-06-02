import React, { useEffect, useState } from "react";
import axios from "axios";

interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gstNumber: string;
}

const Suppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<Supplier[]>("http://localhost:8000/api/suppliers") 
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error("Error fetching suppliers:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading suppliers...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Suppliers</h2>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full border text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Address</th>
              <th className="px-4 py-2">GST Number</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier._id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2">{supplier.name}</td>
                <td className="px-4 py-2">{supplier.email}</td>
                <td className="px-4 py-2">{supplier.phone}</td>
                <td className="px-4 py-2">{supplier.address}</td>
                <td className="px-4 py-2">{supplier.gstNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;
