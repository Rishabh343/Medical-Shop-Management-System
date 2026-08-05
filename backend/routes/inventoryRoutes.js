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
inventoryRouter.get("/", auth, isAdmin, getAllInventory);
inventoryRouter.get("/low-stock", auth, isAdmin, getLowStock);
inventoryRouter.get("/out-of-stock", auth, isAdmin, getOutOfStock);
inventoryRouter.get("/expired", auth, isAdmin, getExpiredInventory);
inventoryRouter.get("/near-expiry", auth, isAdmin, getNearExpiryInventory);
inventoryRouter.get("/search", auth, isAdmin, searchInventory);
inventoryRouter.get("/:id", auth, isAdmin, getInventoryByMedicine);
inventoryRouter.patch("/increase-stock/:id", auth, isAdmin, increaseStock);
inventoryRouter.patch("/adjust-stock/:id", auth, isAdmin, adjustStock);

export default inventoryRouter;
