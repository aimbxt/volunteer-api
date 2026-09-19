import { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.ts";
import { Volunteer } from "../models/Volunteer.ts";
import { Shift } from "../models/Shift.ts";
import { Signup } from "../models/Signup.ts";

describe("Shift Signups API Lifecycle", () => {
  let mongod: MongoMemoryServer;

  before(async () => {
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

  it("should confirm a signup when the shift is under capacity", async () => {
    const alice = await Volunteer.create({ name: "Alice", email: "alice@test.com" });
    const shift = await Shift.create({
      title: "Sorting", location: "Downtown",
      startTime: new Date("2026-10-01T09:00:00Z"),
      endTime: new Date("2026-10-01T12:00:00Z"),
      capacity: 1,
    });

    const res = await request(app)
      .post(`/api/shifts/${shift._id}/signups`)
      .send({ volunteerId: alice._id.toString() });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.status, "confirmed");
  });

  it("should include remaining capacity details on shift responses", async () => {
    const alice = await Volunteer.create({ name: "Alice", email: "alice@test.com" });
    const shift = await Shift.create({
      title: "Sorting", location: "Downtown",
      startTime: new Date("2026-10-01T09:00:00Z"),
      endTime: new Date("2026-10-01T12:00:00Z"),
      capacity: 2,
    });

    await request(app)
      .post(`/api/shifts/${shift._id}/signups`)
      .send({ volunteerId: alice._id.toString() });

    const res = await request(app).get(`/api/shifts/${shift._id}`);

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.confirmedCount, 1);
    assert.strictEqual(res.body.spotsLeft, 1);
    assert.strictEqual(res.body.isFull, false);
  });

  it("should waitlist a signup when the shift is at full capacity", async () => {
    const alice = await Volunteer.create({ name: "Alice", email: "alice@test.com" });
    const bob = await Volunteer.create({ name: "Bob", email: "bob@test.com" });
    const shift = await Shift.create({
      title: "Sorting", location: "Downtown",
      startTime: new Date("2026-10-01T09:00:00Z"),
      endTime: new Date("2026-10-01T12:00:00Z"),
      capacity: 1,
    });

    // Alice takes the only spot — go through the real API so confirmedCount
    // actually gets incremented, same as it would in production.
    const aliceSignup = await request(app)
      .post(`/api/shifts/${shift._id}/signups`)
      .send({ volunteerId: alice._id.toString() });
    assert.strictEqual(aliceSignup.body.status, "confirmed");

    // Bob tries to sign up for the now-full shift
    const res = await request(app)
      .post(`/api/shifts/${shift._id}/signups`)
      .send({ volunteerId: bob._id.toString() });

    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.status, "waitlisted");
  });

  it("should promote a waitlisted user when a confirmed user cancels", async () => {
    const alice = await Volunteer.create({ name: "Alice", email: "alice@test.com" });
    const bob = await Volunteer.create({ name: "Bob", email: "bob@test.com" });
    const shift = await Shift.create({
      title: "Sorting", location: "Downtown",
      startTime: new Date("2026-10-01T09:00:00Z"),
      endTime: new Date("2026-10-01T12:00:00Z"),
      capacity: 1,
    });

    const aliceSignup = await request(app)
      .post(`/api/shifts/${shift._id}/signups`)
      .send({ volunteerId: alice._id.toString() });
    const bobSignup = await request(app)
      .post(`/api/shifts/${shift._id}/signups`)
      .send({ volunteerId: bob._id.toString() });
    assert.strictEqual(aliceSignup.body.status, "confirmed");
    assert.strictEqual(bobSignup.body.status, "waitlisted");

    // Alice cancels
    const cancelRes = await request(app)
      .patch(`/api/signups/${aliceSignup.body._id}/cancel`);
    assert.strictEqual(cancelRes.status, 200);
    assert.strictEqual(cancelRes.body.status, "cancelled");

    // Check if Bob got promoted
    const roster = await request(app).get(`/api/shifts/${shift._id}/signups`);
    const bobsEntry = roster.body.find((s: any) => s._id === bobSignup.body._id);
    assert.strictEqual(bobsEntry.status, "confirmed");
  });

  it("should return a 409 conflict when trying to cancel an already cancelled signup", async () => {
    const alice = await Volunteer.create({ name: "Alice", email: "alice@test.com" });
    const shift = await Shift.create({
      title: "Sorting", location: "Downtown",
      startTime: new Date("2026-10-01T09:00:00Z"),
      endTime: new Date("2026-10-01T12:00:00Z"),
      capacity: 1,
    });

    const aliceSignup = await request(app)
      .post(`/api/shifts/${shift._id}/signups`)
      .send({ volunteerId: alice._id.toString() });
    assert.strictEqual(aliceSignup.body.status, "confirmed");

    const firstCancel = await request(app)
      .patch(`/api/signups/${aliceSignup.body._id}/cancel`);
    assert.strictEqual(firstCancel.status, 200);

    const doubleCancel = await request(app)
      .patch(`/api/signups/${aliceSignup.body._id}/cancel`);

    assert.strictEqual(doubleCancel.status, 409);
  });
});