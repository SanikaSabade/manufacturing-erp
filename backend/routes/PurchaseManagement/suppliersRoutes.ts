import express from 'express';
import Supplier from '../../models/PurchaseManagement/Supplier';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

export default router;