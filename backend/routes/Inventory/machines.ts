import express from 'express';
import Machine from '../../models/Inventory/machines'; 
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const machine = await Machine.create(req.body);
    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  try {
    const machines = await Machine.find().populate("operator_id", "name");
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await Machine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Machine not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Machine.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Machine not found' });
    res.json({ message: 'Machine deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
