import express from 'express';
import SalesOrder from '../../models/Sales&Orders/SalesOrder';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const order = await SalesOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const orders = await SalesOrder.find();
  res.json(orders);
});

export default router;
