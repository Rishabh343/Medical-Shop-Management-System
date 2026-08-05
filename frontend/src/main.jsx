import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import CustomerProvider from "./components/context/CustomerContext.jsx";
import MedicineProvider from "./components/context/MedicineContext.jsx";
import SupplierProvider from "./components/context/SupplierConrtext.jsx";
import InventoryProvider from "./components/context/InventoryContext.jsx";
import BillingProvider from "./components/context/BillingContext";
import DashboardProvider from "./components/context/DashboardContext.jsx";
import ReportProvider from "./components/context/ReportContext.jsx";
import UserProvider from "./components/context/userContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
    <ReportProvider>
      <DashboardProvider>
        <MedicineProvider>
          <InventoryProvider>
            <SupplierProvider>
              <CustomerProvider>
                <BillingProvider>
                  <App />
                </BillingProvider>
              </CustomerProvider>
            </SupplierProvider>
          </InventoryProvider>
        </MedicineProvider>
      </DashboardProvider>
    </ReportProvider>
    </UserProvider>
  </StrictMode>,
);
