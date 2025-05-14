import express from 'express';
import Invoice from '../../models/Sales&Orders/Invoice';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const invoices = await Invoice.find();
  res.json(invoices);
});

export default router;