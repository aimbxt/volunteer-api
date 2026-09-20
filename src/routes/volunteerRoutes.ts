import { Router } from "express";
import * as volunteerController from "../controllers/volunteerController.ts";
import * as signupController from '../controllers/signupController.ts';

const router = Router();

router.get("/", volunteerController.getVolunteers);
router.get("/:id", volunteerController.getVolunteerById);
router.post("/", volunteerController.createVolunteer);
router.patch("/:id", volunteerController.updateVolunteer);
router.delete("/:id", volunteerController.deleteVolunteer);

//signups
router.get("/:id/summary", signupController.getVolunteerSignupSummary);
router.get("/:id/signups", signupController.getVolunteerSignups);

export default router;