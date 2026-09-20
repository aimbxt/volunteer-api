import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Volunteer, type IVolunteer, type VolunteerRole } from "../models/Volunteer.ts";
import { ConflictError, UnauthorizedError } from "../errors.ts";
import { getJwtSecret, JWT_EXPIRES_IN } from "../config/env.ts";

type RegisterInput = { name: string; email: string; password: string };
type LoginInput = { email: string; password: string };

function signToken(id: string, role: VolunteerRole): string {
    return jwt.sign({ sub: id, role }, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

function toPublicProfile(volunteer: IVolunteer) {
    return {
        id: String(volunteer._id),
        name: volunteer.name,
        email: volunteer.email,
        role: volunteer.role
    };
}

export async function register(data: RegisterInput) {
    const email = data.email.toLowerCase();
    const existing = await Volunteer.findOne({ email });

    if (existing) {
        throw new ConflictError("email is already registered");
    }

    const volunteer = await Volunteer.create({
        name: data.name,
        email,
        password: data.password,
        role: "volunteer"
    });

    return {
        volunteer: toPublicProfile(volunteer),
        token: signToken(String(volunteer._id), volunteer.role)
    };
}

export async function login(data: LoginInput) {
    const email = data.email.toLowerCase();
    const volunteer = await Volunteer.findOne({ email }).select("+password");

    if (!volunteer || !volunteer.password) {
        throw new UnauthorizedError("invalid email or password");
    }

    const matches = await bcrypt.compare(data.password, volunteer.password);

    if (!matches) {
        throw new UnauthorizedError("invalid email or password");
    }

    return {
        volunteer: toPublicProfile(volunteer),
        token: signToken(String(volunteer._id), volunteer.role)
    };
}