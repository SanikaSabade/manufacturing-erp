import express from 'express';
import Expense from '../../models/Finance/Expense';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

export default router;