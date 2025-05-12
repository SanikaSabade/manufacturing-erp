import express from 'express';
import ActivityLog from '../models/ActivityLog';

const router = express.Router();

router.get('/', async (req, res) => {
  const logs = await ActivityLog.find().populate('user_id');
  res.json(logs);
});

router.post('/', async (req, res) => {
  const newLog = new ActivityLog(req.body);
  await newLog.save();
  res.status(201).json(newLog);
});

router.put('/:id', async (req, res) => {
  const updated = await ActivityLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  await ActivityLog.findByIdAndDelete(req.params.id);
  res.json({ message: 'Activity log deleted' });
});

export default router;