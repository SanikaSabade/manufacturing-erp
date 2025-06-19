import express from 'express';
import SalesOrder from '../models/Sales&Orders/SalesOrder';
import PurchaseOrder from '../models/PurchaseManagement/PurchaseOrder';
import Payment from '../models/Finance/Payment';
import InventoryLog from '../models/Inventory/InventoryLog';
import Employee from '../models/Employee&HR/Employee';
import Material from '../models/Inventory/Material';

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Current month: sales, purchases, and profit
    const monthlySales = await SalesOrder.aggregate([
      { $match: { date: { $gte: startOfMonth } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      }
    ]);

    const monthlyPurchases = await PurchaseOrder.aggregate([
      { $match: { orderDate: { $gte: startOfMonth } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalPurchases: { $sum: { $multiply: ['$items.cost', '$items.quantity'] } }
        }
      }
    ]);

    const salesTotal = monthlySales[0]?.totalSales || 0;
    const purchaseTotal = monthlyPurchases[0]?.totalPurchases || 0;
    const profit = salesTotal - purchaseTotal;

    // Last 10 Sales Orders and Purchase Orders
    const lastSalesOrders = await SalesOrder.find().sort({ createdAt: -1 }).limit(10).populate('customer');
    const lastPurchaseOrders = await PurchaseOrder.find().sort({ createdAt: -1 }).limit(10).populate('supplier');

    // Top 10 Products (by quantity sold)
    const topProducts = await SalesOrder.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.material",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "materials",
          localField: "_id",
          foreignField: "_id",
          as: "materialDetails"
        }
      },
      { $unwind: "$materialDetails" },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $project: {
          name: "$materialDetails.material_name",
          totalSold: 1
        }
      }
    ]);

    // Top 10 Categories (by quantity sold)
    const topCategories = await SalesOrder.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "materials",
          localField: "items.material",
          foreignField: "_id",
          as: "materialDetails"
        }
      },
      { $unwind: "$materialDetails" },
      {
        $group: {
          _id: "$materialDetails.category",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $project: {
          category: "$_id",
          totalSold: 1,
          _id: 0
        }
      }
    ]);

    // Active Employees
    const activeEmployees = await Employee.countDocuments({ status: "Active" });

    // Order status breakdown
    const receivedOrders = await PurchaseOrder.countDocuments({ status: "Received" });
    const pendingOrders = await SalesOrder.countDocuments({ status: { $in: ["Pending", "Confirmed"] } });

    res.json({
      salesTotal,
      purchaseTotal,
      profit,
      lastSalesOrders,
      lastPurchaseOrders,
      topProducts,
      topCategories,
      activeEmployees,
      receivedOrders,
      pendingOrders
    });
  } catch (err) {
    console.error("Failed to fetch dashboard stats:", err);
    res.status(500).json({ error: 'Failed to fetch extended dashboard stats' });
  }
});

export default router;
