import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

interface Supplier {
  _id: string;
  name: string;
}

interface Material {
  _id: string;
  material_name: string;
}

interface Item {
  materialId: string;
  quantity: string;
  cost: string;
}

interface PurchaseOrderInput {
  supplierId: string;
  orderDate: string;
  status: "Ordered" | "Received" | "Cancelled";
  items: Item[];
}

const PurchaseOrderForm: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState<PurchaseOrderInput>({
    supplierId: "",
    orderDate: "",
    status: "Ordered",
    items: [{ materialId: "", quantity:"" , cost: ""}],
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/suppliers").then((res) => setSuppliers(res.data));
    axios.get("/api/materials").then((res) => setMaterials(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const hasInvalidItems = form.items.some(
      (item) => !item.materialId || item.quantity  || item.cost 
    );
  
    if (!form.supplierId || !form.orderDate || hasInvalidItems) {
      alert("Please fill in all fields correctly before submitting.");
      return;
    }
  
    try {
      await axios.post("/api/purchase-orders", {
        supplier: form.supplierId,
        orderDate: form.orderDate,
        status: form.status,
        items: form.items.map((item) => ({
          material: item.materialId,
          quantity: item.quantity,
          cost: item.cost,
        })),
      });
      navigate("/dashboard/purchase");
    } catch (error) {
      console.error("Error adding purchase order:", error);
      alert("Error creating purchase order");
    }
  };

  const handleItemChange = <K extends keyof Item>(
    index: number,
    field: K,
    value: Item[K]
  ) => {
    const updatedItems = [...form.items];
    updatedItems[index][field] = value;
    setForm({ ...form, items: updatedItems });
  };
  

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add Purchase Order</h2>
      <form onSubmit={handleSubmit}        className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded shadow">
        <div>
          <label className="block mb-1 font-medium">Supplier</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.supplierId}
            onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup._id} value={sup._id}>{sup.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Order Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={form.orderDate}
            onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
          >
            <option value="Ordered">Ordered</option>
            <option value="Received">Received</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Items</label>
          {form.items.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                className="flex-1 border px-2 py-1"
                value={item.materialId}
                onChange={(e) => handleItemChange(index, "materialId", e.target.value)}
              >
                <option value="">Select Material</option>
                {materials.map((mat) => (
                  <option key={mat._id} value={mat._id}>{mat.material_name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Qty"
                className="w-20 border px-2 py-1"
                value={item.quantity}
                min={1}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              />
              <input
                type="number"
                placeholder="Cost"
                className="w-24 border px-2 py-1"
                value={item.cost}
                min={0}
                onChange={(e) => handleItemChange(index, "cost", e.target.value)}
              />
              <button
  type="button"
  onClick={() => {
    const updated = [...form.items];
    updated.splice(index, 1);
    setForm({ ...form, items: updated });
  }}
  className="text-red-600 text-sm hover:underline"
>
  Remove
</button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setForm({ ...form, items: [...form.items, { materialId: "", quantity: "", cost: ""}] })}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Item
          </button>
        </div>
<div className="flex gap-2 justify-center">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Purchase Order
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/purchase")}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
          Cancel
        </button>
        </div>

      </form>
    </div>
  );
};

export default PurchaseOrderForm;
