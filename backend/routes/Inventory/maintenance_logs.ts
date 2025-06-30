import express from 'express';
import MaintenanceLog from '../../models/Inventory/maintenance_logs';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const log = await MaintenanceLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  try {
    const logs = await MaintenanceLog.find()
    .populate("machine_id", "machine_name");
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await MaintenanceLog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Maintenance Log not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await MaintenanceLog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Maintenance Log not found' });
    res.json({ message: 'Maintenance Log deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
