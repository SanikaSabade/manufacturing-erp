import express from 'express';
import BOM from '../../models/Inventory/BOM';
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const bom = await BOM.create(req.body);
    res.status(201).json(bom);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  try {
    const boms = await BOM.find();
    res.json(boms);
  } catch (error) {
    res.status(500).json({ error });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updated = await BOM.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: 'BOM not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await BOM.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'BOM not found' });
    res.json({ message: 'BOM deleted' });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
