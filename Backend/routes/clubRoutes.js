import express from "express";
import { getAllClubs, addClub } from "../controllers/clubController.js";

const router = express.Router();

router.get("/clubs", getAllClubs);
router.post("/clubs", addClub);

export default router;
