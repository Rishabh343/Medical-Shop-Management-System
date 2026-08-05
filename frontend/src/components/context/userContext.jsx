import { createContext, useState } from "react";
import api from "../../services/api";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Register User
  const registerUser = async (formData) => {
    try {
      setLoading(true);

      const response = await api.post("/user/register", formData);

      setUsers((prev) => [response.data.data, ...prev]);

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const loginUser = async (formData) => {
    try {
      setLoading(true);

      const response = await api.post("/user/login", formData);

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("token", response.data.token);

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get All Users
  const getUsers = async () => {
    try {
      setLoading(true);

      const response = await api.get("/user/users");

      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete User
  const deleteUser = async (id) => {
    try {
      await api.delete(`/user/delete/${id}`);

      setUsers((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const logoutUser = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        registerUser,
        loginUser,
        getUsers,
        deleteUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
