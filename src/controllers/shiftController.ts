import { type Request, type Response } from "express";
import mongoose from "mongoose";
import * as shiftService from '../services/shiftService.ts';
import { CreateShiftSchema, UpdateShiftSchema } from "../validators/shiftValidator.ts";

export async function createShift(req: Request, res: Response) {
    const result = CreateShiftSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }
    const shift = await shiftService.createShift(result.data);
    return res.status(201).json(shift);
}

export async function getShifts(req: Request, res: Response) {
    const shifts = await shiftService.getShifts();
    return res.status(200).json(shifts);
}

export async function getShiftById(req: Request, res: Response) {
    const id = req.params.id;
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "invalid id parameter" });
    }
    const shift = await shiftService.getShiftById(id);
    if (!shift) {
        return res.status(404).json({ error: "shift not found" });
    }
    return res.status(200).json(shift);
}

export async function updateShift(req: Request, res: Response) {
    const result = UpdateShiftSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ error: "Invalid request body" });
    }
    const id = req.params.id;
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "invalid id parameter" });
    }
    const shift = await shiftService.updateShift(id, result.data);
    if (!shift) {
        return res.status(404).json({ error: "shift not found" });
    }
    return res.status(200).json(shift);
}

export async function deleteShift(req: Request, res: Response) {
    const id = req.params.id;
    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "invalid id parameter" });
    }
    const shift = await shiftService.deleteShift(id);
    if (!shift) {
        return res.status(404).json({ error: "shift not found" });
    }
    return res.status(200).json(shift);
}