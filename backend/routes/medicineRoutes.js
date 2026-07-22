import express from "express";
import {
  addMedicine,
  deleteMedicine,
  filterMedicine,
  getAllMedicine,
  getOneMedicine,
  searchMedicine,
  updateMedicine,
} from "../controllers/medicineController.js";

const medicineRouter = express.Router();
medicineRouter.post("/add", addMedicine);
medicineRouter.get("/getAll", getAllMedicine);
medicineRouter.get("/getone/:id", getOneMedicine);
medicineRouter.delete("/delete/:id", deleteMedicine);
medicineRouter.put("/update/:id", updateMedicine);
medicineRouter.get("/search", searchMedicine);
medicineRouter.get("/filter", filterMedicine);

export default medicineRouter;
