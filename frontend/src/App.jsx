import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import MainLayout from "./components/layout/MainLayout";
import DashboardPharmasist from "./components/pages/Pharmasist/DashboardPharmasist";

// Admin Pages
import Dashboard from "./components/pages/Admin/Dashboard";
import Medicines from "./components/pages/Admin/Medicines";
import Suppliers from "./components/pages/Admin/Suppliers";
import Inventory from "./components/pages/Admin/Inventory";
import Customers from "./components/pages/Admin/Customers";
import Billing from "./components/pages/Admin/Billing";
import Reports from "./components/pages/Admin/Reports";
import UserManagement from "./components/pages/Admin/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<MainLayout />}>
          {/* ADMIN */}

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/medicine" element={<Medicines />} />
          <Route path="/admin/suppliers" element={<Suppliers />} />
          <Route path="/admin/inventory" element={<Inventory />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/billing" element={<Billing />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/user" element={<UserManagement />} />

          {/* PHARMACIST */}

          <Route
            path="/pharmasist/dashboard"
            element={<DashboardPharmasist />}
          />
          <Route
            path="/pharmacist/dashboard"
            element={<DashboardPharmasist />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
