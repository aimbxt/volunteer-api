import { type Request, type Response } from "express";
import * as authService from "../services/authService.ts";
import * as volunteerService from "../services/volunteerService.ts";
import { registerSchema, loginSchema } from "../validators/authValidator.ts";

export async function register(req: Request, res: Response) {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }
    const { volunteer, token } = await authService.register(result.data);
    return res.status(201).json({ volunteer, token });
}

export async function login(req: Request, res: Response) {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }
    const { volunteer, token } = await authService.login(result.data);
    return res.status(200).json({ volunteer, token });
}

export async function getMe(req: Request, res: Response) {
    if (!req.user) {
        return res.status(401).json({ error: "missing authentication token" });
    }
    const volunteer = await volunteerService.getVolunteerById(req.user.id);
    if (!volunteer) {
        return res.status(404).json({ error: "volunteer not found" });
    }
    return res.status(200).json(volunteer);
}