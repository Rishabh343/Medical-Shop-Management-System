import axios from "axios";

const api = axios.create({
  baseURL: "https://medical-shop-management-system.onrender.com/api/",
  withCredentials: true,
});
//
export default api;
