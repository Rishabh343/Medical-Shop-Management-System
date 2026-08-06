import express from "express";
import {
  getInventoryByMedicine,
  increaseStock,
  adjustStock,
  getLowStock,
  getOutOfStock,
  getExpiredInventory,
  getNearExpiryInventory,
  getAllInventory,
  searchInventory,
} from "../controllers/inventoryController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const inventoryRouter = express.Router();
inventoryRouter.get("/", getAllInventory);
inventoryRouter.get("/low-stock", getLowStock);
inventoryRouter.get("/out-of-stock",  getOutOfStock);
inventoryRouter.get("/expired", getExpiredInventory);
inventoryRouter.get("/near-expiry", getNearExpiryInventory);
inventoryRouter.get("/search", auth, isAdmin, searchInventory);
inventoryRouter.get("/:id", auth, isAdmin, getInventoryByMedicine);
inventoryRouter.patch("/increase-stock/:id",  increaseStock);
inventoryRouter.patch("/adjust-stock/:id", adjustStock);

export default inventoryRouter;
