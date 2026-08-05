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

const reportRouter = express.Router();

reportRouter.get("/today", getTodaySalesReport);
reportRouter.get("/weekly", getWeeklySalesReport);
reportRouter.get("/monthly", getMonthlySalesReport);
reportRouter.get("/profit", getProfitReport);
reportRouter.get("/purchase", getPurchaseReport);
reportRouter.get("/best-selling", getBestSellingMedicines);
reportRouter.get("/low-stock", getLowStockReport);
reportRouter.get("/expiry", getExpiryReport);
reportRouter.get("/near-expiry", getNearExpiryReport);

export default reportRouter;
