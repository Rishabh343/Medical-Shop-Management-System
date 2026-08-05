import { createContext, useState } from "react";
import api from "../../services/api";

export const MedicineContext = createContext();

export default function MedicineProvider({ children }) {
  const [medicine, setMedicine] = useState([]);
  const [loading, setLoading] = useState(false);

  //Add medicine
  const addMedicine = async (formData) => {
    try {
      setLoading(true);
      const response = await api.post("/medicine/", formData);
      setMedicine((prev) => [response.data.data, ...prev]);
      return response.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const updateMedicine = async (id, formData) => {
    try {
      setLoading(true);

      const response = await api.put(`/medicine/${id}`, formData);

      setMedicine((prev) =>
        prev.map((item) => (item._id === id ? response.data.data : item)),
      );

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const searchMedicine = async (keyword) => {
    try {
      const response = await api.get(`/medicine/search?keyword=${keyword}`);

      setMedicine(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const filterMedicine = async (category) => {
    try {
      const response = await api.get(`/medicine/filter?category=${category}`);

      setMedicine(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getMedicine = async () => {
    try {
      setLoading(true);
      const response = await api.get("/medicine/get-all");
      setMedicine(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const getByMedicineId = async (id) => {
    try {
      const response = await api.get(`/medicine/getone/${id}`);

      return response.data.data;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const deleteMedicine = async (id) => {
    try {
      await api.delete(`/medicine/${id}`);

      setMedicine((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <MedicineContext.Provider
      value={{
        medicine,
        loading,
        getMedicine,
        getByMedicineId,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        searchMedicine,
        filterMedicine,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}
