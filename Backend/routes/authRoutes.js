import express from "express";
import { login, refresh, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/refresh", refresh);
router.post("/auth/logout", logout);

export default router;
