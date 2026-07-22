import express from "express";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();
supplierRouter.post("/create", createSupplier);
supplierRouter.get("/get", getAllSuppliers);
supplierRouter.get("/get-id", getSupplierById);
supplierRouter.put("/update/:id", updateSupplier);
supplierRouter.put("/delete/:id", deleteSupplier);

export default supplierRouter;
