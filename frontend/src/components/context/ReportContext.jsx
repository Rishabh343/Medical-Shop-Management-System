import { createContext, useState } from "react";
import api from "../../services/api";

export const ReportContext = createContext();

export default function ReportProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Today's Sales
  const getTodayReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/report/today");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Weekly Sales
  const getWeeklyReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/report/weekly");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Monthly Sales
  const getMonthlyReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/report/monthly");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Profit Report
  const getProfitReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/report/profit");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Purchase Report
  const getPurchaseReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/report/purchase");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Best Selling Medicines
  const getBestSellingReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/report/best-selling");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Low Stock (Inventory API)
  const getLowStockReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/low-stock");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Out of Stock (Inventory API)
  const getOutOfStockReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/out-of-stock");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Expired Medicines (Inventory API)
  const getExpiredReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/expired");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Near Expiry (Inventory API)
  const getNearExpiryReport = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/near-expiry");

      setReports(response.data.data);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        loading,
        getTodayReport,
        getWeeklyReport,
        getMonthlyReport,
        getProfitReport,
        getPurchaseReport,
        getBestSellingReport,
        getLowStockReport,
        getOutOfStockReport,
        getExpiredReport,
        getNearExpiryReport,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}