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

router.put('/:id', async (req, res) => {
  try {
    const updatedOrder = await SalesOrder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Sales order not found' });
    }
    res.json(updatedOrder);
  } catch (error: any) {
    console.error('SalesOrder PUT error:', error.message);
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedOrder = await SalesOrder.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Sales order not found' });
    }
    res.json({ message: 'Sales order deleted successfully' });
  } catch (error: any) {
    console.error('SalesOrder DELETE error:', error.message);
    res.status(500).json({ error: error.message });
  }
});



export default router;
