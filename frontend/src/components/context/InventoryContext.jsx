import { createContext, useState } from "react";
import api from "../../services/api";

export const InventoryContext = createContext();

export default function InventoryProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]);

  // \Get All Inventory
  const getInventory = async () => {
    try {
      setLoading(true);

      const response = await api.get("/inventory");

      setInventory(response.data.data);
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

  return (
    <InventoryContext.Provider
      value={{
        loading,
        inventory,
        getInventory,
        getInventoryById,
        increaseStock,
        decreaseStock,
        getLowStock,
        getOutOfStock,
        searchInventory,
        getExpiredInventory,
        getNearExpiryInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}
