import { type Request, type Response } from "express";
import mongoose from "mongoose";
import * as signupService from '../services/signupService.ts';
import { ConflictError, NotFoundError } from "../errors.ts";
import { SignupSchema } from "../validators/signupValidator.ts";

export async function createSignup(req: Request, res: Response) {
    try {
        const result = SignupSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        const shiftId = req.params.id;
        const volunteerId = result.data.volunteerId;
        if (typeof shiftId !== "string" || !mongoose.Types.ObjectId.isValid(shiftId) ||
            typeof volunteerId !== "string" || !mongoose.Types.ObjectId.isValid(volunteerId)) {
            return res.status(400).json({ error: "invalid id parameter" });
        }
        const signup = await signupService.createSignup(shiftId, volunteerId);
        return res.status(201).json(signup);
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).json({ message: "could not find shift or volunteer" });
        } else if (err instanceof ConflictError) {
            return res.status(409).json({ message: "signup has conflicting status"});
        } else {
            return res.status(500).json({ message: "failed to create signup" });
        }
    }
}

export async function getShiftSignups(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "invalid id parameter" });
        }
        const signups = await signupService.getShiftSignups(id);
        return res.status(200).json(signups);
    } catch (err) {
        return res.status(500).json({ message: "failed to get shift signups" });
    }
}

export async function getVolunteerSignups(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "invalid id parameter" });
        }
        const signups = await signupService.getVolunteerSignups(id);
        return res.status(200).json(signups);
    } catch (err) {
        return res.status(500).json({ message: "failed to get volunteer signups" });
    }
}

export async function cancelSignup(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "invalid id parameter" });
        }
        const signup = await signupService.cancelSignup(id);
        return res.status(200).json(signup);
    } catch (err) {
        if (err instanceof NotFoundError) {
            return res.status(404).json({ message: "could not find shift or signup" });
        } else if (err instanceof ConflictError) {
            return res.status(409).json({ message: "signup has conflicting status"});
        } else {
            return res.status(500).json({ message: "failed to cancel signup" });
        }
    }
}