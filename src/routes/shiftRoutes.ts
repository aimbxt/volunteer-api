import { Router } from "express";
import * as shiftController from '../controllers/shiftController.ts';

const router = Router();
router.get("/", shiftController.getShifts);
router.get("/:id", shiftController.getShiftById);
router.post("/", shiftController.createShift);
router.patch("/:id", shiftController.updateShift);
router.delete("/:id", shiftController.deleteShift);

export default router;