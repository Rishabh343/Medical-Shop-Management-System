import express from "express";
import {
  createBill,
  deleteBill,
  getAllBills,
  getBillById,
} from "../controllers/billingControlller.js";

const billingRouter = express.Router();
billingRouter.post("/", createBill);
billingRouter.get("/", getAllBills);
billingRouter.get("/:id", getBillById);
billingRouter.delete("/:id", deleteBill);
export default billingRouter;
