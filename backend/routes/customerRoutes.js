import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerPurchaseHistory,
  searchCustomer,
  updateCustomer,
} from "../controllers/customerController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const customerRouter = express.Router();
customerRouter.post("/", createCustomer);
customerRouter.get("/get", getAllCustomers);
customerRouter.get("/search", searchCustomer);
customerRouter.get("/:id", getCustomerById);
customerRouter.get("/history/:id", getCustomerPurchaseHistory);
customerRouter.put("/:id", updateCustomer);
customerRouter.delete("/:id", auth, isAdmin, deleteCustomer);
export default customerRouter;
