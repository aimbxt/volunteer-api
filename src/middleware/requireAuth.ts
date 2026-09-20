import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { UnauthorizedError, ForbiddenError } from "../errors.ts";
import { getJwtSecret } from "../config/env.ts";
import { type VolunteerRole } from "../models/Volunteer.ts";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                role: VolunteerRole;
            };
        }
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        throw new UnauthorizedError("missing authentication token");
    }

    const token = header.slice("Bearer ".length).trim();
    const secret = getJwtSecret();

    let payload: string | JwtPayload;

    try {
        payload = jwt.verify(token, secret);
    } catch {
        throw new UnauthorizedError("invalid or expired authentication token");
    }

    if (typeof payload === "string" || typeof payload.sub !== "string") {
        throw new UnauthorizedError("invalid authentication token");
    }

    const role = payload.role;

    if (role !== "volunteer" && role !== "admin") {
        throw new UnauthorizedError("invalid authentication token");
    }

    req.user = { id: payload.sub, role };
    next();
}

export function requireRole(...roles: VolunteerRole[]) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            throw new UnauthorizedError("missing authentication token");
        }

        if (!roles.includes(req.user.role)) {
            throw new ForbiddenError("insufficient permissions");
        }

        next();
    };
}