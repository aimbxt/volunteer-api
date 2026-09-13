import { Router } from "express";
import * as volunteerController from "../controllers/volunteerController.ts";

const router = Router();

router.get("/", volunteerController.getVolunteers);
router.get("/:id", volunteerController.getVolunteerById);
router.post("/", volunteerController.createVolunteer);
router.patch("/:id", volunteerController.updateVolunteer);
router.delete("/:id", volunteerController.deleteVolunteer);

export default router;