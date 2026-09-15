import { Shift } from "../models/Shift.ts";
import { Volunteer } from "../models/Volunteer.ts";
import { Signup } from "../models/Signup.ts";
import { NotFoundError, ConflictError } from "../errors.ts";


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

export async function cancelSignup(id: string) {
    const signup = await Signup.findById(id);
    if (!signup) {
        throw new NotFoundError("could not find signup");
    }
    const shift = await Shift.findById(signup.shift);
    if (!shift) {
        throw new NotFoundError("could not find shift");
    }
    if (signup.status == "confirmed") {
        const cancel = await Shift.findOneAndUpdate(
            { _id: shift.id, $expr: { $gt: ["$confirmedCount", 0] } },
            { $inc: { confirmedCount: -1 } }
        );
        signup.status = "cancelled";
        await signup.save();
        const candidate = await Signup.findOne({ shift: shift._id, status: "waitlisted"}).sort({ createdAt: 1 });
        if (!candidate) {
            return signup;
        }
        await Shift.findOneAndUpdate(
            { _id: shift.id, $expr: { $lt: ["$confirmedCount", "$capacity"] } },
            { $inc: { confirmedCount: 1 } }
        );
        candidate.status = "confirmed";
        await candidate.save();
        return signup;
    }
    if (signup.status == "cancelled") {
        //...
        throw new ConflictError("signup already cancelled");
    } 

    //waitlist
    if (signup.status == "waitlisted") {
        signup.status = "cancelled";
        await signup.save();
    }
    return signup;
}