// routes/dashboardRoutes.js

import express from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { auth } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/",auth,isAdmin, getDashboard);

export default dashboardRouter;