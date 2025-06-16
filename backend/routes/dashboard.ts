import express from 'express';
import Order from '../models/Sales&Orders/SalesOrder';
import Purchase from '../models/PurchaseManagement/PurchaseOrder';
import Expense from '../models/Finance/Payment';
import Inventory from '../models/Inventory/InventoryLog';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const [salesCount, purchaseCount, financeCount, inventoryCount] = await Promise.all([
      Order.countDocuments(),
      Purchase.countDocuments(),
      Expense.countDocuments(),
      Inventory.countDocuments(),
    ]);

    res.json({
      sales: salesCount,
      purchase: purchaseCount,
      finance: financeCount,
      inventory: inventoryCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
