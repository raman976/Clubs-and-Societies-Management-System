import express from "express";
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/events", getAllEvents);
router.get("/events/:id", getEventById);
router.post(
  "/events",
  authenticate,
  requireRole("PRESIDENT", "VICE_PRESIDENT", "HANDLER", "SUPER_ADMIN"),
  createEvent
);
router.put("/events/:id", authenticate, updateEvent);
router.delete(
  "/events/:id",
  authenticate,
  requireRole("PRESIDENT", "VICE_PRESIDENT", "HANDLER", "SUPER_ADMIN"),
  deleteEvent
);

export default router;
