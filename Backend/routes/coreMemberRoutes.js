import express from "express";
import {
  getAllCoreMembers,
  getCoreMemberById,
  createCoreMember,
  updateCoreMember,
  deleteCoreMember,
} from "../controllers/coreMemberController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/members", authenticate, getAllCoreMembers);
router.get("/members/:id", authenticate, getCoreMemberById);

router.post(
  "/members",
  authenticate,
  requireRole("PRESIDENT", "VICE_PRESIDENT", "HANDLER", "SUPER_ADMIN"),
  createCoreMember
);

router.put("/members/:id", authenticate, updateCoreMember);
router.delete(
  "/members/:id",
  authenticate,
  requireRole("PRESIDENT", "VICE_PRESIDENT", "HANDLER", "SUPER_ADMIN"),
  deleteCoreMember
);

export default router;
