import express from 'express';
import Attendance from '../../models/ Employee&HR/Attendance';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const records = await Attendance.find();
  res.json(records);
});

export default router;