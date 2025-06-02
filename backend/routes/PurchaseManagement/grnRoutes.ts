import express from 'express';
import GRN from '../../models/PurchaseManagement/GRN';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const grn = await GRN.create(req.body);
    res.status(201).json(grn);
  } catch (error: any) {
    console.error("GRN POST error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const grns = await GRN.find()
      .populate('purchaseOrder', 'orderDate status')
      .populate('receivedItems.material', 'material_name material_code');
    res.json(grns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});



export default router;
