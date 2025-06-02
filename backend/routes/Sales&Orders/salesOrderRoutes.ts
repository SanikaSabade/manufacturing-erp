import express from 'express';
import SalesOrder from '../../models/Sales&Orders/SalesOrder';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const order = await SalesOrder.create(req.body);
    res.status(201).json(order);
  } catch (error: any) {
    console.error('SalesOrder POST error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const orders = await SalesOrder.find()
      .populate('customer', 'name email')
      .populate('items.material', 'material_name material_code');
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
