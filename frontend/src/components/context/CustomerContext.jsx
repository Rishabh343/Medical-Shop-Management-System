import { createContext, useState } from "react";
import api from "../../services/api";

export const CustomerContext = createContext();

export default function CustomerProvider({ children }) {
  const [customer, setCustomer] = useState([]);
  const [loading, setLoading] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  //Add medicine
  const addCustomer = async (formData) => {
    try {
      setLoading(true);
      console.log(formData);
      const response = await api.post("/customer", formData);
      console.log(response.data);

      setCustomer((prev) => [response.data.data, ...prev]);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getCustomer = async () => {
    try {
      setLoading(true);
      const response = await api.get("/customer/get");
      console.log(response.data);
      // return response.data.customers;
      setCustomer(response.data.customers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getCustomerById = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`/customer/${id}`);
      return response.data.customer;
      setCustomer(response.data.customer);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getCustomerPurchaseHistory = async (id) => {
    try {
      setLoading(true);
      const response = await api.get(`customer/history/${id}`);
      setPurchaseHistory(response.data.bills);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const searchCustomer = async (keyword) => {
    try {
      const response = await api.get(`/customer/search?keyword=${keyword}`);

      setCustomer(response.data.customers);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteCustomer = async (id) => {
    try {
      await api.delete(`customer/${id}`);

      setCustomer((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const updateCustomer = async (id, formData) => {
    try {
      const response = await api.put(`/customer/${id}`, formData);

      setCustomer((prev) =>
        prev.map((item) => (item._id === id ? response.data.data : item)),
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <CustomerContext.Provider
      value={{
        customer,
        loading,
        addCustomer,
        getCustomer,
        searchCustomer,
        purchaseHistory,
        getCustomerPurchaseHistory,
        getCustomerById,
        deleteCustomer,
        updateCustomer,
        deleteCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
