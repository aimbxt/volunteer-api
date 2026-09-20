import { Router } from "express";
import * as volunteerController from "../controllers/volunteerController.ts";
import * as signupController from '../controllers/signupController.ts';
import { requireAuth, requireRole, requireSelfOrAdmin } from "../middleware/requireAuth.ts";

const router = Router();

router.use(requireAuth);

router.get("/", requireRole("admin"), volunteerController.getVolunteers);
router.get("/:id", requireSelfOrAdmin, volunteerController.getVolunteerById);
router.post("/", requireRole("admin"), volunteerController.createVolunteer);
router.patch("/:id", requireSelfOrAdmin, volunteerController.updateVolunteer);
router.delete("/:id", requireRole("admin"), volunteerController.deleteVolunteer);

//signups
router.get("/:id/summary", requireSelfOrAdmin, signupController.getVolunteerSignupSummary);
router.get("/:id/signups", requireSelfOrAdmin, signupController.getVolunteerSignups);

export default router;