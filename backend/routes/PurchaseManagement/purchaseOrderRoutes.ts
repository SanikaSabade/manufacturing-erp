import express from 'express';
import PurchaseOrder from '../../models/PurchaseManagement/PurchaseOrder';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const order = await PurchaseOrder.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const orders = await PurchaseOrder.find();
  res.json(orders);
});

export default router;