import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate, useParams } from "react-router-dom";

interface Material {
  _id: string;
  material_name: string;
}

interface PurchaseOrder {
  _id: string;
}

interface ReceivedItem {
  material: string;
  quantity: number;
  inspected: boolean;
}

const GRNForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState({
    purchaseOrder: "",
    receivedDate: "",
    receivedItems: [] as ReceivedItem[],
  });

  useEffect(() => {
    axios.get("/api/purchase-orders").then((res) => setPurchaseOrders(res.data));
    axios.get("/api/materials").then((res) => setMaterials(res.data));

    if (id) {
      axios.get(`/api/grns/${id}`).then((res) => {
        const grn = res.data;
        setForm({
          purchaseOrder: grn.purchaseOrder._id,
          receivedDate: grn.receivedDate.split("T")[0],
          receivedItems: grn.receivedItems.map((item: any) => ({
            material: item.material._id,
            quantity: item.quantity,
            inspected: item.inspected,
          })),
        });
      });
    }
  }, [id]);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...form.receivedItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setForm((prev) => ({ ...prev, receivedItems: updatedItems }));
  };

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      receivedItems: [...prev.receivedItems, { material: "", quantity: 0, inspected: false }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      await axios.put(`/api/grns/${id}`, form);
    } else {
      await axios.post("/api/grns", form);
    }
    navigate("/dashboard/purchase/grn");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{id ? "Edit GRN" : "Add GRN"}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-4 rounded shadow">
        <div>
          <label className="block font-semibold mb-1">Purchase Order</label>
          <select
            value={form.purchaseOrder}
            onChange={(e) => setForm((prev) => ({ ...prev, purchaseOrder: e.target.value }))}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select PO</option>
            {purchaseOrders.map((po) => (
              <option key={po._id} value={po._id}>
                {po._id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Received Date</label>
          <input
            type="date"
            value={form.receivedDate}
            onChange={(e) => setForm((prev) => ({ ...prev, receivedDate: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Received Items</label>
          {form.receivedItems.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <select
                value={item.material}
                onChange={(e) => handleItemChange(index, "material", e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Material</option>
                {materials.map((mat) => (
                  <option key={mat._id} value={mat._id}>
                    {mat.material_name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={item.quantity}
                placeholder="Quantity"
                onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                className="p-2 border rounded"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.inspected}
                  onChange={(e) => handleItemChange(index, "inspected", e.target.checked)}
                />
                Inspected
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Item
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {id ? "Update GRN" : "Create GRN"}
        </button>
      </form>
    </div>
  );
};

export default GRNForm;
