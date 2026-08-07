import express from "express";
import {
  deleteUser,
  getAllUsers,
  login,
  logout,
  Register,
} from "../controllers/userController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();
router.post("/register", Register);
router.post("/login", login);
router.get("/users", auth, isAdmin, getAllUsers);
router.delete("/delete/:id", auth, isAdmin, deleteUser);
router.post("/logout", auth, logout);
export default router;
