import express from 'express';
import InventoryLog from '../../models/Inventory/InventoryLog';

const router = express.Router();

router.get('/', async (req, res) => {
  const logs = await InventoryLog.find().populate('material_id user_id');
  res.json(logs);
});

router.post('/', async (req, res) => {
  const newLog = new InventoryLog(req.body);
  await newLog.save();
  res.status(201).json(newLog);
});

router.put('/:id', async (req, res) => {
  const updated = await InventoryLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await InventoryLog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Log deleted' });
});

export default router;