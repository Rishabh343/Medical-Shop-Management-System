import express from "express";
import {
    getAllInventory,
  getExpiredInventory,
  getInventoryByMedicine,
  getLowStock,
  getNearExpiryInventory,
} from "../controllers/inventoryController.js";

const inventoryRouter = express.Router();
inventoryRouter.get("/get-all", getAllInventory);
inventoryRouter.get("/get-by-medicine", getInventoryByMedicine);
inventoryRouter.get("/get-low-stock", getLowStock);
inventoryRouter.delete("/get-expire", getExpiredInventory);
inventoryRouter.put("/get-near-expire", getNearExpiryInventory);

export default inventoryRouter;
