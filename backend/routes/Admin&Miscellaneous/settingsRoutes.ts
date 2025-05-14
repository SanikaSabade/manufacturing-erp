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
  const settings = await Settings.find();
  res.json(settings);
});

export default router;