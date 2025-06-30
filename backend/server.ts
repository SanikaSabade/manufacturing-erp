import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import materialRoutes from './routes/Inventory/materialRoutes';
import inventoryLogRoutes from './routes/Inventory/inventoryLogRoutes';
import customerRoutes from './routes/Sales&Orders/customerRoutes';
import salesOrderRoutes from './routes/Sales&Orders/salesOrderRoutes';
import invoiceRoutes from './routes/Sales&Orders/invoiceRoutes';
import supplierRoutes from './routes/PurchaseManagement/suppliersRoutes';
import purchaseOrderRoutes from './routes/PurchaseManagement/purchaseOrderRoutes';
import grnRoutes from './routes/PurchaseManagement/grnRoutes';
import employeeRoutes from './routes/Employee&HR/employeeRoutes';
import attendanceRoutes from './routes/Employee&HR/attendanceRoutes';
import paymentRoutes from './routes/Finance/paymentRoutes';
import expenseRoutes from './routes/Finance/expenseRoutes';
import userRoutes from './routes/Admin&Miscellaneous/userRoutes';
import activityLogRoutes from './routes/Admin&Miscellaneous/activityLogRoutes';
import settingsRoutes from './routes/Admin&Miscellaneous/settingsRoutes';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboard'; 
import workOrderRoutes from './routes/Inventory/work_orders';
import bomRoutes from './routes/Inventory/BOM';
import machineRoutes from './routes/Inventory/machines';
import qualityCheckRoutes from './routes/Inventory/quality_checks';
import maintenanceLogRoutes from './routes/Inventory/maintenance_logs';
import projectRoutes from './routes/Projects/projects';
import auditTrailRoutes from './routes/Admin&Miscellaneous/audit_trail';
import notificationRoutes from './routes/Admin&Miscellaneous/notifications';



dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/materials', materialRoutes);
app.use('/api/inventory-logs', inventoryLogRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/bom', bomRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/quality-checks', qualityCheckRoutes);
app.use('/api/maintenance-logs', maintenanceLogRoutes);


app.use('/api/customers', customerRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use('/api/invoices', invoiceRoutes);


app.use('/api/suppliers', supplierRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/grns', grnRoutes);


app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);


app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);


app.use('/api/users', userRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit-trail', auditTrailRoutes);

app.use('/api/projects', projectRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
