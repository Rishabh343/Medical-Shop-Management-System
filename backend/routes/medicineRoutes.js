import express from "express";
import {
  addMedicine,
  deleteMedicine,
  updateMedicine,
  searchMedicine,
  filterMedicine,
  getAllMedicine,
  getOneMedicine,
} from "../controllers/medicineController.js";
import upload from "../middlewares/uploads.js";

const medicineRouter = express.Router();
medicineRouter.post("/", upload.single("medicineImage"), addMedicine);
medicineRouter.get("/get-all", getAllMedicine);
medicineRouter.get("/search", searchMedicine);
medicineRouter.get("/filter", filterMedicine);
medicineRouter.get("/getone/:id", getOneMedicine);
medicineRouter.put("/:id", upload.single("medicineImage"), updateMedicine);
medicineRouter.delete("/:id", deleteMedicine);

export default medicineRouter;
