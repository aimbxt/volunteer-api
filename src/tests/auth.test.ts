import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.ts";
import { Volunteer } from "../models/Volunteer.ts";
import { Shift } from "../models/shift.ts";
import { Signup } from "../models/Signup.ts";
import { createUser } from "./authHelpers.ts";

describe("Authentication", () => {
  let mongod: MongoMemoryServer;

  before(async () => {
    process.env.JWT_SECRET = "test-secret";
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
  });

  after(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  beforeEach(async () => {
    await Volunteer.deleteMany({});
    await Shift.deleteMany({});
    await Signup.deleteMany({});
  });

  it("should register a volunteer and return a token without exposing the password", async () => {
    const res = await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "supersecret1" });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.volunteer.email, "alex@test.com");
    assert.strictEqual(res.body.volunteer.role, "volunteer");
    assert.strictEqual(res.body.volunteer.password, undefined);
    assert.ok(typeof res.body.token === "string");
  });

  it("should store the password as a hash, not plaintext", async () => {
    await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "supersecret1" });

    const stored = await Volunteer.findOne({ email: "alex@test.com" }).select("+password");
    assert.ok(stored?.password);
    assert.notStrictEqual(stored.password, "supersecret1");
    assert.ok(stored.password.startsWith("$2"));
  });

  it("should ignore a role supplied at registration", async () => {
    const res = await request(app).post("/api/auth/register")
      .send({ name: "Sneaky", email: "sneaky@test.com", password: "supersecret1", role: "admin" });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.volunteer.role, "volunteer");
  });

  it("should reject a duplicate email with 409", async () => {
    await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "supersecret1" });
    const res = await request(app).post("/api/auth/register")
      .send({ name: "Alex Again", email: "alex@test.com", password: "supersecret1" });

    assert.strictEqual(res.status, 409);
  });

  it("should reject a short password with 400", async () => {
    const res = await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "short" });

    assert.strictEqual(res.status, 400);
  });

  it("should log in with correct credentials", async () => {
    await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "supersecret1" });

    const res = await request(app).post("/api/auth/login")
      .send({ email: "alex@test.com", password: "supersecret1" });

    assert.strictEqual(res.status, 200);
    assert.ok(typeof res.body.token === "string");
  });

  it("should use an identical message for a wrong password and an unknown email", async () => {
    await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "supersecret1" });

    const wrongPassword = await request(app).post("/api/auth/login")
      .send({ email: "alex@test.com", password: "wrongpassword" });
    const unknownEmail = await request(app).post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "supersecret1" });

    assert.strictEqual(wrongPassword.status, 401);
    assert.strictEqual(unknownEmail.status, 401);
    assert.deepStrictEqual(wrongPassword.body, unknownEmail.body);
  });

  it("should reject a protected route with no token", async () => {
    const res = await request(app).get("/api/auth/me");
    assert.strictEqual(res.status, 401);
  });

  it("should reject a protected route with a malformed token", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer garbage");
    assert.strictEqual(res.status, 401);
  });

  it("should reject a token signed with the wrong secret", async () => {
    const registered = await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "supersecret1" });

    process.env.JWT_SECRET = "a-different-secret";
    const res = await request(app).get("/api/auth/me")
      .set("Authorization", `Bearer ${registered.body.token}`);
    process.env.JWT_SECRET = "test-secret";

    assert.strictEqual(res.status, 401);
  });

  it("should return the current volunteer for a valid token", async () => {
    const registered = await request(app).post("/api/auth/register")
      .send({ name: "Alex", email: "alex@test.com", password: "supersecret1" });

    const res = await request(app).get("/api/auth/me")
      .set("Authorization", `Bearer ${registered.body.token}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.email, "alex@test.com");
    assert.strictEqual(res.body.password, undefined);
  });

  it("should forbid a volunteer from signing up as someone else", async () => {
    const alice = await createUser("Alice", "alice@test.com");
    const bob = await createUser("Bob", "bob@test.com");
    const shift = await Shift.create({
      title: "Sorting", location: "Downtown",
      startTime: new Date("2030-10-01T09:00:00Z"),
      endTime: new Date("2030-10-01T12:00:00Z"), capacity: 5,
    });

    const res = await request(app).post(`/api/shifts/${shift._id}/signups`)
      .set("Authorization", alice.auth)
      .send({ volunteerId: bob.id });

    assert.strictEqual(res.status, 403);
  });

  it("should forbid a volunteer from cancelling someone else's signup", async () => {
    const alice = await createUser("Alice", "alice@test.com");
    const bob = await createUser("Bob", "bob@test.com");
    const shift = await Shift.create({
      title: "Sorting", location: "Downtown",
      startTime: new Date("2030-10-01T09:00:00Z"),
      endTime: new Date("2030-10-01T12:00:00Z"), capacity: 5,
    });

    const bobSignup = await request(app).post(`/api/shifts/${shift._id}/signups`)
      .set("Authorization", bob.auth).send({ volunteerId: bob.id });

    const res = await request(app).patch(`/api/signups/${bobSignup.body._id}/cancel`)
      .set("Authorization", alice.auth);

    assert.strictEqual(res.status, 403);
  });

  it("should forbid a volunteer from creating a shift but allow an admin", async () => {
    const alice = await createUser("Alice", "alice@test.com");
    const admin = await createUser("Admin", "admin@test.com", "admin");
    const body = {
      title: "New shift", location: "Downtown",
      startTime: "2030-11-01T09:00:00Z",
      endTime: "2030-11-01T12:00:00Z", capacity: 3,
    };

    const forbidden = await request(app).post("/api/shifts")
      .set("Authorization", alice.auth).send(body);
    assert.strictEqual(forbidden.status, 403);

    const allowed = await request(app).post("/api/shifts")
      .set("Authorization", admin.auth).send(body);
    assert.strictEqual(allowed.status, 201);
  });

  it("should forbid a volunteer from reading another volunteer's record", async () => {
    const alice = await createUser("Alice", "alice@test.com");
    const bob = await createUser("Bob", "bob@test.com");

    const own = await request(app).get(`/api/volunteers/${alice.id}`)
      .set("Authorization", alice.auth);
    assert.strictEqual(own.status, 200);

    const other = await request(app).get(`/api/volunteers/${bob.id}`)
      .set("Authorization", alice.auth);
    assert.strictEqual(other.status, 403);
  });

  it("should never expose password hashes in the admin volunteer list", async () => {
    await createUser("Alice", "alice@test.com");
    const admin = await createUser("Admin", "admin@test.com", "admin");

    const res = await request(app).get("/api/volunteers")
      .set("Authorization", admin.auth);

    assert.strictEqual(res.status, 200);
    for (const volunteer of res.body) {
      assert.strictEqual(volunteer.password, undefined);
    }
  });
});