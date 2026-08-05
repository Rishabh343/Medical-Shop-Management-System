import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  withCredentials: true,
  // "https://medical-shop-management-system.onrender.com/api"
});
//
export default api;
