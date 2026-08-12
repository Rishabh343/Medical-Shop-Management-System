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
import { auth } from "../middlewares/auth.js";

const medicineRouter = express.Router();
medicineRouter.post("/", upload.single("medicineImage"), auth, addMedicine);
medicineRouter.get("/get-all", auth, getAllMedicine);
medicineRouter.get("/search", auth, searchMedicine);
medicineRouter.get("/filter", auth, filterMedicine);
medicineRouter.get("/getone/:id", auth, getOneMedicine);
medicineRouter.put(
  "/:id",
  upload.single("medicineImage"),
  auth,
  updateMedicine,
);
medicineRouter.delete("/:id", auth, deleteMedicine);

export default medicineRouter;
