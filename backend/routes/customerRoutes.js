import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
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
customerRouter.put("/:id", updateCustomer);
customerRouter.delete("/:id",auth,isAdmin, deleteCustomer);
export default customerRouter;
