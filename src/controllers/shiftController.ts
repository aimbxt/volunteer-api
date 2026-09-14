import { type Request, type Response } from "express";
import * as shiftService from '../services/shiftService.ts';

export async function createShift(req: Request, res: Response) {
    try {
        const shift = await shiftService.createShift(req.body);
        return res.status(201).json(shift);
    } catch (err) {
        res.status(500).json({ error: "Failed to create shift" });
    }
}

export async function getShifts(req: Request, res: Response) {
    try {
        const shifts = await shiftService.getShifts();
        return res.status(200).json(shifts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch shifts" });
    }
}

export async function getShiftById(req: Request, res: Response) {
    try {
        if (Array.isArray(req.params.id)) {
            return res.status(400).json({ error: "id must be a single value" });
        }
        const id = req.params.id;
        const shift = await shiftService.getShiftById(id);
        if (!shift) {
            return res.status(404).json({ error: "shift not found" });
        }
        return res.status(200).json(shift);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch shift" });
    }
}

export async function updateShift(req: Request, res: Response) {
    try {
        if (Array.isArray(req.params.id)) {
            return res.status(400).json({ error: "id must be a single value" });
        }
        const id = req.params.id;
        const shift = await shiftService.updateShift(id, req.body);
        if (!shift) {
            return res.status(404).json({ error: "shift not found" });
        }
        return res.status(200).json(shift);
    } catch (err) {
        res.status(500).json({ error: "Failed to update shift" });
    }
}

export async function deleteShift(req: Request, res: Response) {
    try {
        if (Array.isArray(req.params.id)) {
            return res.status(400).json({ error: "id must be a single value" });
        }
        const id = req.params.id;
        const shift = await shiftService.deleteShift(id);
        if (!shift) {
            return res.status(404).json({ error: "shift not found" });
        }
        return res.status(200).json(shift);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete shift" });
    }
}