import { Router } from "express";
import * as shiftController from '../controllers/shiftController.ts';
import * as signupController from '../controllers/signupController.ts';

const router = Router();
router.get("/", shiftController.getShifts);
router.get("/:id", shiftController.getShiftById);
router.post("/", shiftController.createShift);
router.patch("/:id", shiftController.updateShift);
router.delete("/:id", shiftController.deleteShift);

//signups
router.post("/:id/signups", signupController.createSignup);
router.get("/:id/signups", signupController.getShiftSignups);

export default router;