import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import MainLayout from "./components/layout/MainLayout";
import DashboardPharmasist from "./components/pages/Pharmasist/Customer";

// Admin Pages
import Dashboard from "./components/pages/Admin/Dashboard";
import Medicines from "./components/pages/Admin/Medicines";
import Suppliers from "./components/pages/Admin/Suppliers";

import Customers from "./components/pages/Admin/Customers";
import Billing from "./components/pages/Admin/Billing";

import UserManagement from "./components/pages/Admin/UserManagement";
import Inventory from "./components/pages/Admin/Inventory";
import Invoice from "./components/pages/Invoice";
import Report from "./components/pages/Admin/Report";
import Signup from "./components/pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          {/* ADMIN */}

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/medicine" element={<Medicines />} />
          <Route path="/admin/suppliers" element={<Suppliers />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/billing" element={<Billing />} />
          <Route path="/admin/user" element={<UserManagement />} />
          <Route path="/admin/reports" element={<Report />} />
          <Route path="/invoice/:id" element={<Invoice />} />

          {/* PHARMACIST */}

          <Route path="/pharmacist/billing" element={<Billing />} />
          <Route path="/pharmacist/customers" element={<Customers />} />
          <Route path="/pharmacist/medicine" element={<Medicines />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
