import React, { useEffect, useState } from "react";
import axios from "../../utils/axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Stack,
  Paper,
} from "@mui/material";
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
  notInspected: boolean;
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
            notInspected: !item.inspected,
          })),
        });
      });
    }
  }, [id]);

  const handleItemChange = <K extends keyof ReceivedItem>(
    index: number,
    field: K,
    value: ReceivedItem[K]
  ) => {
    const updatedItems = [...form.receivedItems];
    if (field === "inspected") {
      updatedItems[index].inspected = value as boolean;
      updatedItems[index].notInspected = !value;
    } else if (field === "notInspected") {
      updatedItems[index].notInspected = value as boolean;
      updatedItems[index].inspected = !value;
    } else {
      updatedItems[index][field] = value;
    }
    setForm((prev) => ({ ...prev, receivedItems: updatedItems }));
  };
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      receivedItems: [
        ...prev.receivedItems,
        { material: "", quantity: 0, inspected: false, notInspected: false },
      ],
    }));
  };
  const removeItem = (index: number) => {
    const updatedItems = [...form.receivedItems];
    updatedItems.splice(index, 1);
    setForm((prev) => ({ ...prev, receivedItems: updatedItems }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      receivedItems: form.receivedItems.map((item) => ({ ...item, inspected: item.inspected })),
    };
    try {
      if (id) {
        await axios.put(`/api/grns/${id}`, payload);
      } else {
        await axios.post("/api/grns", payload);
      }
      navigate("/dashboard/purchase/grn");
    } catch (error) {
      console.error("Error submitting GRN:", error);
      alert("Failed to submit GRN.");
    }
  };
  
  return (
    <Box maxWidth={800} mx="auto" p={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {id ? "Edit GRN" : "Add GRN"}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#fafafa" }}>
        <form onSubmit={handleSubmit}>
          
          <FormControl fullWidth required margin="normal">
            <InputLabel>Purchase Order</InputLabel>
            <Select
              value={form.purchaseOrder}
              onChange={(e) => setForm({ ...form, purchaseOrder: e.target.value })}
              label="Purchase Order"
            >
              <MenuItem value="">Select PO</MenuItem>
              {purchaseOrders.map((po) => (
                <MenuItem key={po._id} value={po._id}>
                  {po._id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Received Date"
            type="date"
            value={form.receivedDate}
            onChange={(e) => setForm({ ...form, receivedDate: e.target.value })}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          <Typography variant="h6" mt={2}>
            Received Items
          </Typography>

          {form.receivedItems.map((item, index) => (
            <Box
              key={index}
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              gap={2}
              mt={1}
              p={2}
              bgcolor="#fff"
              borderRadius={1}
              border="1px solid #e0e0e0"
            >
              <FormControl fullWidth sx={{ flex: 1, minWidth: 200 }}>
                <InputLabel>Material</InputLabel>
                <Select
                  value={item.material}
                  onChange={(e) => handleItemChange(index, "material", e.target.value)}
                  label="Material"
                >
                  <MenuItem value="">Select Material</MenuItem>
                  {materials.map((mat) => (
                    <MenuItem key={mat._id} value={mat._id}>
                      {mat.material_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", parseInt(e.target.value) || 0)
                }
                required
                sx={{ flex: 1, minWidth: 100 }}
              />

              <Box display="flex" flexDirection="column" justifyContent="center" flex={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.inspected}
                      onChange={(e) => handleItemChange(index, "inspected", e.target.checked)}
                    />
                  }
                  label="Inspected"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={item.notInspected}
                      onChange={(e) => handleItemChange(index, "notInspected", e.target.checked)}
                    />
                  }
                  label="Not Inspected"
                />
              </Box>

              <Button variant="outlined" color="error" onClick={() => removeItem(index)}>
                Remove
              </Button>
            </Box>
          ))}

          <Button variant="outlined" onClick={addItem} sx={{ mt: 1, mb: 3 }}>
            + Add Item
          </Button>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button variant="contained" color="success" type="submit">
              {id ? "Update GRN" : "Create GRN"}
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/dashboard/purchase/grn")}
            >
              Cancel
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default GRNForm;
