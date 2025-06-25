import express from 'express';
import WorkOrder from '../../models/Inventory/work_orders';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const workOrder = await WorkOrder.create(req.body);
    res.status(201).json(workOrder);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  try {
    const workOrders = await WorkOrder.find();
    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await WorkOrder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Work Order not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await WorkOrder.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Work Order not found' });
    res.json({ message: 'Work Order deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
