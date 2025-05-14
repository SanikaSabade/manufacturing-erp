import express from 'express';
import Material from '../../models/Inventory/Material';

const router = express.Router();

router.get('/', async (req, res) => {
  const materials = await Material.find();
  res.json(materials);
});

router.post('/', async (req, res) => {
  const newMaterial = new Material(req.body);
  await newMaterial.save();
  res.status(201).json(newMaterial);
});

router.put('/:id', async (req, res) => {
  const updated = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await Material.findByIdAndDelete(req.params.id);
  res.json({ message: 'Material deleted' });
});

export default router;