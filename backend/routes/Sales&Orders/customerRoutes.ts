import express from 'express';
import Customer from '../../models/Sales&Orders/Customer';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

export default router;