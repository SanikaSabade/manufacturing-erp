import express from 'express';
import Employee from '../../models/ Employee&HR/Employee';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

export default router;