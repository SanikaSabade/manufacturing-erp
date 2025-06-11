import express from 'express';
import Settings from '../../models/Admin&Miscellaneous/Settings';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const setting = await Settings.create(req.body);
    res.status(201).json(setting);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  try {
    const settings = await Settings.find();
    if (!settings) return res.status(404).json({ message: 'No settings found' });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});
 router.put('/:id', async (req, res) => {
  try {
    const updated = await Settings.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Settings.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

export default router;