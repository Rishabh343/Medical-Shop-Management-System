import express from "express";
import {
  createPurchase,
  getPurchaseById,
  getPurchases,
} from "../controllers/purchaseController.js";

const purchaseRouter = express.Router();
purchaseRouter.post("/create", createPurchase);
purchaseRouter.get("/get", getPurchases);
purchaseRouter.get("/get-id/:id", getPurchaseById);

export default purchaseRouter;
