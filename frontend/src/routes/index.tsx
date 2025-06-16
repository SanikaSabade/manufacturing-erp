import { createBrowserRouter} from "react-router-dom";
import Login from "../pages/Login";
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
import SalesOrderForm from "../pages/SalesOrderForm";
import CustomerForm from "../pages/CustomerForm";
import InvoiceForm from "../pages/InvoiceForm";
import PurchaseOrderForm from "../pages/PurchaseOrderForm";
import SupplierForm from "../pages/SupplierForm";
import GRNForm from "../pages/GRNForm";
import EmployeeForm from "../pages/EmployeeForm";
import AttendanceForm from "../pages/AttendanceForm";
import PaymentForm from "../pages/PaymentForm";
import ExpenseForm from "../pages/ExpenseForm";
import InventoryForm from "../pages/InventoryForm";
import MaterialForm from "../pages/MaterialForm";
import SettingForm from "../pages/SettingForm";
import UserForm from "../pages/UserFrom";
import DashboardHome from "../components/Dashboardhome"; 



export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
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





    ],
  },
]);
