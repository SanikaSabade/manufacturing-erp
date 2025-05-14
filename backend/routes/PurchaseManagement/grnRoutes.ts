import express from 'express';
import GRN from '../../models/PurchaseManagement/GRN';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const grn = await GRN.create(req.body);
    res.status(201).json(grn);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get('/', async (_req, res) => {
  const grns = await GRN.find();
  res.json(grns);
});

export default router;
