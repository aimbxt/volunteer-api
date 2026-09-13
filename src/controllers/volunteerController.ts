import { type Request, type Response } from "express";
import * as volunteerService from "../services/volunteerService.ts";

export async function createVolunteer(req: Request, res: Response) {
    try {
        const volunteer = await volunteerService.createVolunteer(req.body);
        return res.status(201).json(volunteer);
    } catch (err) {
        res.status(500).json({ error: "Failed to create volunteer" });
    }
}

export async function getVolunteers(req: Request, res: Response) {
    try {
        const volunteers = await volunteerService.getVolunteers();
        if (!volunteers) {
            return res.status(404).json({ error: "could not fetch volunteers" });
        }
        return res.status(200).json(volunteers); 
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch volunteers" });
    }
}

export async function getVolunteerById(req: Request, res: Response) {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
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
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const volunteer = await volunteerService.updateVolunteer(id, req.body);
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
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const volunteer = await volunteerService.deleteVolunteer(id);
        if (!volunteer) {
            return res.status(404).json({ error: "volunteer not found" });
        }
        return res.status(200).json(volunteer);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete volunteer" });
    }
}