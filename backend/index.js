import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";

import router from "./routes/userRoutes.js";
import medicineRouter from "./routes/medicineRoutes.js";
import supplierRouter from "./routes/supplierRoutes.js";
import inventoryRouter from "./routes/inventoryRoutes.js";
import billingRouter from "./routes/billingroutes.js";
import customerRouter from "./routes/customerRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(
  cors({
    origin: "https://medical-shop-management-system-phi.vercel.app",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/user", router);
app.use("/api/medicine", medicineRouter);
app.use("/api/supplier", supplierRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/billing", billingRouter);
app.use("/api/customer", customerRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Coming from backend");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
