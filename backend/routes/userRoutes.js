import express from "express";
import {
  deleteUser,
  forgotPassword,
  getAllUsers,
  login,
  logout,
  Register,
  resetPassword,
  searchUser,
} from "../controllers/userController.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import { auth } from "../middlewares/auth.js";
const router = express.Router();
router.post("/register", Register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/search", auth, searchUser);
router.get("/users", auth, isAdmin, getAllUsers);
router.delete("/delete/:id", auth, isAdmin, deleteUser);
router.post("/logout", auth, logout);
export default router;
