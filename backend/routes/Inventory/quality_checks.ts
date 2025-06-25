import express from 'express';
import QualityCheck from '../../models/Inventory/quality_checks';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const qc = await QualityCheck.create(req.body);
    res.status(201).json(qc);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  try {
    const qcs = await QualityCheck.find();
    res.json(qcs);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await QualityCheck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'Quality Check not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await QualityCheck.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Quality Check not found' });
    res.json({ message: 'Quality Check deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
