import express from 'express';
import Payment from '../../models/Finance/Payment';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

export default router;