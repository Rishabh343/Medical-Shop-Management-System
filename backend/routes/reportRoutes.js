import express from "express";

import {
  getTodaySalesReport,
  getWeeklySalesReport,
  getMonthlySalesReport,
  getProfitReport,
  getPurchaseReport,
  getBestSellingMedicines,
  getLowStockReport,
  getExpiryReport,
  getNearExpiryReport,
} from "../controllers/reportController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const reportRouter = express.Router();

reportRouter.get("/today", auth, isAdmin, getTodaySalesReport);
reportRouter.get("/weekly", auth, isAdmin, getWeeklySalesReport);
reportRouter.get("/monthly", auth, isAdmin, getMonthlySalesReport);
reportRouter.get("/profit", auth, isAdmin, getProfitReport);
reportRouter.get("/purchase", auth, isAdmin, getPurchaseReport);
reportRouter.get("/best-selling", auth, isAdmin, getBestSellingMedicines);
reportRouter.get("/low-stock", auth, isAdmin, getLowStockReport);
reportRouter.get("/expiry", auth, isAdmin, getExpiryReport);
reportRouter.get("/near-expiry", auth, isAdmin, getNearExpiryReport);

export default reportRouter;
