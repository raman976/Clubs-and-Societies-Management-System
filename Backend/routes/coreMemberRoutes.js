import express from "express";
import {
  getAllCoreMembers,
  getCoreMemberById,
  createCoreMember,
  updateCoreMember,
  deleteCoreMember,
} from "../controllers/coreMemberController.js";

const router = express.Router();

router.get("/members", getAllCoreMembers);
router.get("/members/:id", getCoreMemberById);
router.post("/members", createCoreMember);
router.put("/members/:id", updateCoreMember);
router.delete("/members/:id", deleteCoreMember);

export default router;
