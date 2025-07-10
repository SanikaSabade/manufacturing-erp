import { createBrowserRouter} from "react-router-dom";
import Login from "../pages/Auth/Login";
import DashboardLayout from "../components/DashboardLayout";
import SalesOrders from "../modules/SalesOrders/SalesOrder";
import Customers from "../modules/SalesOrders/Customer";
import Invoices from "../modules/SalesOrders/Invoice";
import PurchaseOrders from "../modules/PurchaseManagement/PurchaseOrder";
import Suppliers from "../modules/PurchaseManagement/Supplier";
import GRN from "../modules/PurchaseManagement/GRN";
import Employees from "../modules/ EmployeeHR/Employee";
import Attendance from "../modules/ EmployeeHR/Attendance";
import Payments from "../modules/Finance/Payment";
import Expenses from "../modules/Finance/Expense";
import Users from "../modules/AdminMiscellaneous/User";
import Settings from "../modules/AdminMiscellaneous/Settings";
import ActivityLogs from "../modules/AdminMiscellaneous/ActivityLog";
import InventoryLogs from "../modules/Inventory/InventoryLog";
import Materials from "../modules/Inventory/Material";
import SalesOrderForm from "../pages/Forms/SalesOrderForm";
import CustomerForm from "../pages/Forms/CustomerForm";
import InvoiceForm from "../pages/Forms/InvoiceForm";
import PurchaseOrderForm from "../pages/Forms/PurchaseOrderForm";
import SupplierForm from "../pages/Forms/SupplierForm";
import GRNForm from "../pages/Forms/GRNForm";
import EmployeeForm from "../pages/Forms/EmployeeForm";
import AttendanceForm from "../pages/Forms/AttendanceForm";
import PaymentForm from "../pages/Forms/PaymentForm";
import ExpenseForm from "../pages/Forms/ExpenseForm";
import InventoryForm from "../pages/Forms/InventoryForm";
import MaterialForm from "../pages/Forms/MaterialForm";
import SettingForm from "../pages/Forms/SettingForm";
import UserForm from "../pages/Forms/UserFrom";
import DashboardHome from "../components/Dashboardhome";
import Projects from "../modules/Projects/Project";
import ProjectForm from "../pages/Forms/ProjectForm";
import AuditTrail from "../modules/AdminMiscellaneous/Audit_trail";
import AuditTrailForm from "../pages/Forms/AuditTrailForm";
import NotificationPage from "../modules/AdminMiscellaneous/Notification";
import NotificationForm from "../pages/Forms/NotificationForm";
import BOMPage from "../modules/Inventory/BOM";
import Machines from "../modules/Inventory/Machine";
import MaintenanceLogs from "../modules/Inventory/MaintenanceLogs";
import QualityChecks from "../modules/Inventory/QualityCheck";
import WorkOrders from "../modules/Inventory/WorkOrder";
import BOMForm from "../pages/Forms/BOMForm";
import MachineForm from "../pages/Forms/MachineForm";
import MaintenanceLogForm from "../pages/Forms/MaintenanceForm";
import QualityCheckForm from "../pages/Forms/QualityCheckForm";
import WorkOrderForm from "../pages/Forms/WorkOrderForm";
import Signup from "../pages/Auth/Signup";
import EmployeeHome from "../components/EmployeeHmoe";


export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/signup", element: <Signup /> }, 
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    
    children: [
        { index: true, element: <DashboardHome /> },
      { path: "sales", element: <SalesOrders /> },
      { path: "sales/customers", element: <Customers /> },
      { path: "sales/invoices", element: <Invoices /> },
      { path: "purchase", element: <PurchaseOrders /> },
      { path: "purchase/suppliers", element: <Suppliers /> },
      { path: "purchase/grn", element: <GRN /> },
      { path: "hr", element: <Employees /> },
      { path: "hr/attendance", element: <Attendance /> },
      { path: "finance", element: <Payments /> },
      { path: "finance/expenses", element: <Expenses /> },
      { path: "admin", element: <Users /> },
      { path: "admin/settings", element: <Settings /> },
      { path: "admin/activity-log", element: <ActivityLogs /> },
      { path: "inventory", element: <InventoryLogs /> },
      { path: "inventory/material", element: <Materials/> },
      { path: "inventory/BOM", element: <BOMPage/> },
      { path: "BOM/add", element: <BOMForm/> },
      { path: "machine/add", element: <MachineForm/> },
      { path: "maintenanceLogs/add", element: <MaintenanceLogForm/> },
      { path: "qualityChecks/add", element: <QualityCheckForm/> },
      { path: "workOrders/add", element: <WorkOrderForm/> },
      { path: "inventory/machine", element: <Machines/> },
      { path: "inventory/maintenanceLogs", element: <MaintenanceLogs/> },
      { path: "inventory/qualityChecks", element: <QualityChecks/> },
      { path: "inventory/workOrders", element: <WorkOrders/> },
      { path: "sales/add", element: <SalesOrderForm /> },
      {path:"customers/add" ,element:<CustomerForm /> },
      {path:"invoices/add" ,element:<InvoiceForm /> },
      {path:"purchase/add" ,element:<PurchaseOrderForm/> },
      {path:"supplier/add" ,element:<SupplierForm/> },
      {path:"grn/add" ,element:<GRNForm/> },
      {path:"employee/add" ,element:<EmployeeForm/> },
      {path:"attendance/add" ,element:<AttendanceForm/> },
      {path:"finance/add" ,element:<PaymentForm/> },
      {path:"expenses/add" ,element:<ExpenseForm/> },
      {path:"inventory/add" ,element:<InventoryForm/> },
      {path:"material/add" ,element:<MaterialForm/> },
      {path:"setting/add" ,element:<SettingForm/> },
      {path:"user/add" ,element:<UserForm/> },
      {path:"projects" ,element:<Projects/> },
      {path:"admin/audit_trail" ,element:<AuditTrail/> },
      {path:"admin/notification" ,element:<NotificationPage/> },
      {path:"notification/add" ,element:<NotificationForm/> },
      {path:"project/add" ,element:<ProjectForm/> },
      {path:"audit_trail/add" ,element:<AuditTrailForm/> },
    ],
  },
  { path: '/employee/home', element: <EmployeeHome /> },

]);
