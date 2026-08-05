import { createContext, useState } from "react";
import axios from "axios";
import api from "../../services/api";

export const BillingContext = createContext();

export default function BillingProvider({ children }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBills = async () => {
    try {
      setLoading(true);
      const response = await api.get("/billing/");
      setBills(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getBillById = async (id) => {
    try {
      const response = await api.get(`billing/${id}`);
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createBill = async (formData) => {
    try {
      console.log(formData);
      const response = await api.post("/billing", formData);
      setBills((prev) => [response.data.data, ...prev]);
       return response.data; 
      return response.data.data;
    } catch (error) {
      console.log(error.response?.data);
      throw error;
    }
  };

  const deleteBill = async (id) => {
    try {
      await api.delete(`billing/${id}`);
      setBills((prev) => prev.filter((bill) => bill._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <BillingContext.Provider
      value={{
        bills,
        loading,
        getBills,
        getBillById,
        createBill,
        deleteBill,
      }}
    >
      {children}
    </BillingContext.Provider>
  );
}
