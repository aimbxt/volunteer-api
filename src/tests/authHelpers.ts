import assert from "node:assert";
import request from "supertest";
import app from "../app.ts";
import { Volunteer, type VolunteerRole } from "../models/Volunteer.ts";

const TEST_PASSWORD = "testpassword1";

export async function createUser(name: string, email: string, role: VolunteerRole = "volunteer") {
    const volunteer = await Volunteer.create({ name, email, password: TEST_PASSWORD, role });
    const res = await request(app).post("/api/auth/login").send({ email, password: TEST_PASSWORD });
    assert.strictEqual(res.status, 200, "test helper failed to log in");
    return { id: volunteer._id.toString(), auth: `Bearer ${res.body.token}` };
}