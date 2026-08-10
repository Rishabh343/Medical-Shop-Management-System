import { createContext, useState } from "react";
import api from "../../services/api";

export const SupplierContext = createContext();

export default function SupplierProvider({ children }) {
  const [supplier, setSupplier] = useState([]);
  const [loading, setLoading] = useState(false);

  //Add medicine
  const addSupplier = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post("/supplier/create", formData);
      setSupplier((prev) => [response.data.suppliers, ...prev]);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getSupplier = async () => {
    try {
      setLoading(true);
      const response = await api.get("/supplier/get");
      setSupplier(response.data.suppliers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getSupplierById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/supplier/get-id/${id}`);
      return response.data.supplier;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const updateSupplier = async (id, formData) => {
    try {
      setLoading(true);

      const response = await api.put(`/supplier/update/${id}`, formData);

      setSupplier((prev) =>
        prev.map((item) => (item._id === id ? response.data.supplier : item)),
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const deleteSupplier = async (id) => {
    try {
      await api.delete(`supplier/delete/${id}`);

      setSupplier((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const searchSupplier = async (keyword) => {
    try {
      const response = await api.get(`/supplier/search?keyword=${keyword}`);

      setSupplier(response.data.supplier);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SupplierContext.Provider
      value={{
        supplier,
        loading,
        addSupplier,
        getSupplier,
        updateSupplier,
        getSupplierById,
        deleteSupplier,
        searchSupplier,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
}
