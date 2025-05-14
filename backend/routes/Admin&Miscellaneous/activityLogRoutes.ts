import express from 'express';
import ActivityLog from '../../models/Admin&Miscellaneous/ActivityLog';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const log = await ActivityLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const logs = await ActivityLog.find();
  res.json(logs);
});

export default router;