import express from "express";
import {
  createBill,
  deleteBill,
  getAllBills,
  getBillById,
} from "../controllers/billingControlller.js";
import { auth } from "../middlewares/auth.js";

const billingRouter = express.Router();
billingRouter.post("/", auth, createBill);
billingRouter.get("/", auth, getAllBills);
billingRouter.get("/:id", auth, getBillById);
billingRouter.delete("/:id", auth, deleteBill);
export default billingRouter;
