import { type Request, type Response } from "express";
import mongoose from "mongoose";
import * as volunteerService from "../services/volunteerService.ts";
import { VolunteerSchema, updateVolunteerSchema } from "../validators/volunteerValidator.ts";

export async function createVolunteer(req: Request, res: Response) {
    try {
        const result = VolunteerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        const volunteer = await volunteerService.createVolunteer(result.data);
        return res.status(201).json(volunteer);
    } catch (err) {
        res.status(500).json({ error: "Failed to create volunteer" });
    }
}

export async function getVolunteers(req: Request, res: Response) {
    try {
        const volunteers = await volunteerService.getVolunteers();
        return res.status(200).json(volunteers); 
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch volunteers" });
    }
}

export async function getVolunteerById(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "invalid id parameter" });
        }
        const volunteer = await volunteerService.getVolunteerById(id);
        if (!volunteer) {
            return res.status(404).json({ error: "volunteer not found" });
        }
        return res.status(200).json(volunteer);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch volunteer" });
    }
}

export async function updateVolunteer(req: Request, res: Response) {
    try {
        const result = updateVolunteerSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: "Invalid request body" });
        }
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "invalid id parameter" });
        }
        const volunteer = await volunteerService.updateVolunteer(id, result.data);
        if (!volunteer) {
            return res.status(404).json({ error: "volunteer not found" });
        }
        return res.status(200).json(volunteer);
    } catch (err) {
        res.status(500).json({ error: "Failed to update volunteer" });
    }
}

export async function deleteVolunteer(req: Request, res: Response) {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "invalid id parameter" });
        }
        const volunteer = await volunteerService.deleteVolunteer(id);
        if (!volunteer) {
            return res.status(404).json({ error: "volunteer not found" });
        }
        return res.status(200).json(volunteer);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete volunteer" });
    }
}