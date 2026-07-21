import express from "express";
const app = express();
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
// import { router } from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/userRoutes.js";
app.use(cookieParser());
dotenv.config();
app.use(cors());
connectDB();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/api/user", router);
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("comming from backend");
});
app.listen(port, () => {
  try {
    console.log("server is connected");
  } catch (error) {
    console.log(error);
  }
});
// {
//     origin: "http://localhost:5173",
//     credentials: true,
//   }
