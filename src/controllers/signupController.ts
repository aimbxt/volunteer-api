import { type Request, type Response } from "express";
import * as signupService from '../services/signupService.ts';
import { ConflictError, NotFoundError } from "../errors.ts";

export async function createSignup(req: Request, res: Response) {
    try {
        const shiftId = req.params.id;
        const volunteerId = req.body.volunteerId;
        if (typeof volunteerId !== "string" || typeof shiftId !== "string") {
            return res.status(400).json({ error: "id must be a string" });
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
        if (typeof req.params.id !== "string") {
            return res.status(400).json({ error: "id must be a string" });
        }
        const signups = await signupService.getShiftSignups(req.params.id);
        return res.status(200).json(signups);
    } catch (err) {
        return res.status(500).json({ message: "failed to get shift signups" });
    }
}

export async function getVolunteerSignups(req: Request, res: Response) {
    try {
        if (typeof req.params.id !== "string") {
            return res.status(400).json({ error: "id must be a string" });
        }
        const signups = await signupService.getVolunteerSignups(req.params.id);
        return res.status(200).json(signups);
    } catch (err) {
        return res.status(500).json({ message: "failed to get volunteer signups" });
    }
}

export async function cancelSignup(req: Request, res: Response) {
    try {
        if (typeof req.params.id !== "string") {
            return res.status(400).json({ error: "id must be a string" });
        }
        const signup = await signupService.cancelSignup(req.params.id);
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