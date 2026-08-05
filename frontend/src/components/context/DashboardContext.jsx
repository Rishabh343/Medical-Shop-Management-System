import { createContext, useState } from "react";
import api from "../../services/api";

export const DashboardContext = createContext();
export default function DashboardProvider({ children }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/dashboard");

      setDashboard(response.data.data);

      return response.data.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        dashboard,
        loading,
        getDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
