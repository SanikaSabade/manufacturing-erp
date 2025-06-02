import express from 'express';
import Attendance from '../../models/ Employee&HR/Attendance';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json(attendance);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const records = await Attendance.find().populate('employee', 'name email');
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/employee/:id', async (req, res) => {
  try {
    const records = await Attendance.find({ employee: req.params.id }).sort({ date: -1 });
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
