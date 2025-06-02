import express from 'express';
import Invoice from '../../models/Sales&Orders/Invoice';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error: any) {
    console.error("Invoice POST error:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('salesOrder', 'orderNumber date status'); 
    res.json(invoices);
  } catch (error: any) {
    console.error("Invoice GET error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
