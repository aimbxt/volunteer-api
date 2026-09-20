import { Shift } from "../models/shift.ts";

type CreateShiftInput = { title: string; description?: string; location: string; startTime: Date; endTime: Date; capacity: number; }
export async function createShift(data: CreateShiftInput) {
    return await Shift.create(data);
}

export async function getShifts() {
    return await Shift.find();
}

export async function getUpcomingShifts() {
    return await Shift.find({
        startTime: { $gte: new Date() }
    }).sort({ startTime: 1 });
}

export async function getShiftById(id: string) {
    return await Shift.findById(id);
}

export async function updateShift(id: string, data: Partial<{ title: string; description: string; location: string; startTime: Date; endTime: Date; capacity: number }>) {
    const shift = await getShiftById(id);
    if (shift) {
        Object.assign(shift, data);
        await shift.save();
    }
    return shift;
}

export async function deleteShift(id: string) {
    const deleted = await Shift.findByIdAndDelete(id);
    return deleted;
}
