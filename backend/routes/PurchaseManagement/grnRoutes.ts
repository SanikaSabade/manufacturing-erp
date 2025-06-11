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

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await GRN.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'GRN not found' });
    }
    res.status(200).json({ message: 'GRN deleted successfully' });
  } catch (error: any) {
    console.error("GRN DELETE error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updated = await GRN.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ error: 'GRN not found' });
    }
    res.status(200).json(updated);
  } catch (error: any) {
    console.error("GRN PUT error:", error.message);
    res.status(400).json({ error: error.message });
  }
});



export default router;
