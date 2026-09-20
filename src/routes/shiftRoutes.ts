import { Router } from "express";
import * as shiftController from '../controllers/shiftController.ts';
import * as signupController from '../controllers/signupController.ts';
import { requireAuth, requireRole } from "../middleware/requireAuth.ts";

const router = Router();

router.use(requireAuth);

router.get("/", shiftController.getShifts);
router.get("/upcoming", shiftController.getUpcomingShifts);
router.get("/:id", shiftController.getShiftById);
router.post("/", requireRole("admin"), shiftController.createShift);
router.patch("/:id", requireRole("admin"), shiftController.updateShift);
router.delete("/:id", requireRole("admin"), shiftController.deleteShift);

//signups
router.post("/:id/signups", signupController.createSignup);
router.get("/:id/signups", requireRole("admin"), signupController.getShiftSignups);

export default router;