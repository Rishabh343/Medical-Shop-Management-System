import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./components/pages/Login";
import MainLayout from "./components/layout/MainLayout";


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
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1c1917",
            color: "#faf9f6",
            border: "1px solid #44403c",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 30px rgba(28, 25, 23, 0.15)",
          },
          success: {
            iconTheme: {
              primary: "#faf9f6",
              secondary: "#1c1917",
            },
          },
          error: {
            iconTheme: {
              primary: "#faf9f6",
              secondary: "#1c1917",
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route element={<MainLayout />}>
          {/* ADMIN */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRole="Admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/medicine"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}>
                <Medicines />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/suppliers"
            element={
              <ProtectedRoute allowedRole="Admin">
                <Suppliers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute allowedRole="Admin">
                <Inventory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}>
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/billing"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}>
                <Billing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user"
            element={
              <ProtectedRoute allowedRole="Admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRole="Admin">
                <Report />
              </ProtectedRoute>
            }
          />

          {/* PHARMACIST */}

    

          <Route
            path="/pharmacist/medicine"
            element={
              <ProtectedRoute allowedRole="Pharmacist">
                <Medicines />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pharmacist/customers"
            element={
              <ProtectedRoute allowedRole="Pharmacist">
                <Customers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pharmacist/billing"
            element={
              <ProtectedRoute allowedRole="Pharmacist">
                <Billing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/invoice/:id"
            element={
              <ProtectedRoute allowedRoles={["Admin", "Pharmacist"]}>
                <Invoice />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
