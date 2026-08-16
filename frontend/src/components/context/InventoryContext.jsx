import { createContext, useState } from "react";
import api from "../../services/api";

export const InventoryContext = createContext();

export default function InventoryProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stockMovement, setStockMovement] = useState([]);
  const [stockSummary, setStockSummary] = useState({
    currentStock: 0,
    totalStockIn: 0,
    totalStockOut: 0,
  });
  const getInventory = async (page = 1) => {
    try {
      setLoading(true);

      const response = await api.get(`/inventory?page=${page}&limit=10`);

      setInventory(response.data.inventory);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Get Single Medicine
  const getInventoryById = async (id) => {
    try {
      const response = await api.get(`/inventory/${id}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };
  const getStockMovement = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/stock-movement");

      setStockMovement(response.data.data);

      return response.data.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // Increase Stock
  const increaseStock = async (id, quantity) => {
    try {
      const response = await api.patch(`/inventory/increase-stock/${id}`, {
        quantity,
      });

      setInventory((prev) =>
        prev.map((item) => (item._id === id ? response.data.data : item)),
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Decrease Stock
  const decreaseStock = async (id, quantity) => {
    try {
      const response = await api.patch(`/inventory/adjust-stock/${id}`, {
        quantity,
      });

      setInventory((prev) =>
        prev.map((item) => (item._id === id ? response.data.data : item)),
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //  Low Stock
  const getLowStock = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/low-stock");

      setInventory(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //  Out Of Stock
  const getOutOfStock = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/out-of-stock");

      setInventory(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const searchInventory = async (keyword) => {
    try {
      if (!keyword.trim()) {
        return getInventory();
      }

      const response = await api.get(`/inventory/search?keyword=${keyword}`);

      setInventory(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  //Expired
  const getExpiredInventory = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/expired");

      setInventory(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Near Expiry
  const getNearExpiryInventory = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory/near-expiry");

      setInventory(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getStockMovementHistory = async (id) => {
    try {
      setLoading(true);

      const response = await api.get(`/inventory/stock-history/${id}`);
      const data = response.data.data;

      setStockMovement(data.history || []);
      setStockSummary({
        currentStock: data.currentStock || 0,
        totalStockIn: data.totalStockIn || 0,
        totalStockOut: data.totalStockOut || 0,
      });
    } catch (error) {
      console.log(error);
      setStockMovement([]);
      setStockSummary({
        currentStock: 0,
        totalStockIn: 0,
        totalStockOut: 0,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <InventoryContext.Provider
      value={{
        loading,
        inventory,
        getInventory,
        stockMovement,
        getInventoryById,
        increaseStock,
        decreaseStock,
        currentPage,
        totalPages,
        getLowStock,
        getOutOfStock,
        searchInventory,
        stockSummary,
        getStockMovementHistory,
        getExpiredInventory,
        getNearExpiryInventory,
        getStockMovement,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
