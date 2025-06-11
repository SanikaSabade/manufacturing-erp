import express from 'express';
import PurchaseOrder from '../../models/PurchaseManagement/PurchaseOrder';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newOrder = await PurchaseOrder.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating purchase order:", error);
    res.status(400).json({ error: "Failed to create purchase order" });
  }
});

router.get('/', async (_req, res) => {
  try {
    const orders = await PurchaseOrder.find()
      .populate('supplier', 'name _id')
      .populate('items.material', 'material_name _id');

    res.json(orders);
  } catch (error: any) {
    console.error("Error fetching purchase orders:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await PurchaseOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('supplier', 'name _id')
      .populate('items.material', 'material_name _id');

    if (!updatedOrder) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    res.json(updatedOrder);
  } catch (error: any) {
    console.error("Error updating purchase order:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await PurchaseOrder.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    res.json({ message: "Purchase order deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting purchase order:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
