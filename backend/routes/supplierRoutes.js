import express from "express";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  searchSupplier,
  updateSupplier,
} from "../controllers/supplierController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { auth } from "../middlewares/auth.js";

const supplierRouter = express.Router();
supplierRouter.post("/create",auth,isAdmin, createSupplier);
supplierRouter.get("/get",auth,isAdmin,getAllSuppliers);
supplierRouter.get("/search",auth,isAdmin, searchSupplier);
supplierRouter.get("/get-id/:id",auth,isAdmin, getSupplierById);
supplierRouter.put("/update/:id",auth,isAdmin, updateSupplier);
supplierRouter.delete("/delete/:id",auth,isAdmin, deleteSupplier);

export default supplierRouter;
