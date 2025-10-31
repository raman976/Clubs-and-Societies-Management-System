import express from "express";
import { getAllClubs, addClub } from "../controllers/clubController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/clubs", getAllClubs);
router.post("/clubs", authenticate, requireRole("SUPER_ADMIN"), addClub);

export default router;
