import { Shift } from "../models/Shift.ts";
import { Volunteer } from "../models/Volunteer.ts";
import { Signup } from "../models/Signup.ts";
import { NotFoundError } from "../errors.ts";


export async function createSignup(shiftId: string, volunteerId: string) {
    const volunteer = await Volunteer.findById(volunteerId);
    const shift = await Shift.findById(shiftId);
    if (!volunteer) {
        throw new NotFoundError("could not find volunteer");
    }
    if (!shift) {
        throw new NotFoundError("could not find shift");
    }
    const result = await Shift.findOneAndUpdate(
        { _id: shiftId, $expr: { $lt: ["$confirmedCount", "$capacity"] } },
        { $inc: { confirmedCount: 1 } }
    );
   return await Signup.create({
    volunteer: volunteer._id,
    shift: shift._id,
    status: result ? 'confirmed' : 'waitlisted',
  });
}

export async function getShiftSignups(id: string) {
    return await Signup.find({ shift: id });
}

export async function getVolunteerSignups(id: string) {
    return await Signup.find({ volunteer: id })
}