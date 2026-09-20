import { Router } from "express";
import * as authController from "../controllers/authController.ts";
import { requireAuth } from "../middleware/requireAuth.ts";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", requireAuth, authController.getMe);

export default router;