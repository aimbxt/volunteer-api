# Volunteer API
Backend API for volunteer shift signups. TypeScript, Express 5, MongoDB/Mongoose, Zod. No auth implemented yet.
REST API for scheduling volunteer shifts, with capacity limits, waitlists, and JWT authentication.
## Stack
**Stack:** TypeScript, Node 24, Express 5, MongoDB/Mongoose, Zod, JWT, bcrypt
- Node 24 native TS execution (no `tsx`/`ts-node`)
- Express 5 + MongoDB Atlas via Mongoose
- Zod for request validation
- `node:test` + `supertest` + `mongodb-memory-server` for tests
## Features
## Data Model
- **Race-safe capacity:** signups claim spots with atomic `findOneAndUpdate`, so concurrent requests can't overbook a shift.
- **Waitlist:** signups past capacity are waitlisted, and the oldest one is promoted automatically when a confirmed volunteer cancels.
- **Auth:** passwords hashed with bcrypt, stateless JWTs, and role (`volunteer` / `admin`) plus ownership checks on every protected route.
- **Validation and errors:** Zod validates request bodies; typed errors map to HTTP status codes in one middleware.
- **Volunteer** — `name`, `email`
- **Shift** — `title`, `description?`, `location`, `startTime`, `endTime`, `capacity`, `confirmedCount`
- **Signup** — junction collection: `volunteer` (ref), `shift` (ref), `status` (`confirmed` | `waitlisted` | `cancelled`)
## Setup
## Endpoints
```bash
npm install
npm run dev
```
Create a `.env` file in the project root:
```
Volunteer: POST/GET /api/volunteers, GET/PATCH/DELETE /api/volunteers/:id
Shift:     POST/GET /api/shifts, GET/PATCH/DELETE /api/shifts/:id
Signup:    POST /api/shifts/:id/signups        (create)
           GET  /api/shifts/:id/signups        (roster)
           GET  /api/volunteers/:id/signups    (a volunteer's signups)
           PATCH /api/signups/:id/cancel       (cancel)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<output of: openssl rand -hex 32>
```
Signup has no full CRUD, no `DELETE` — cancelled signups are kept for audit history and the promotion query.
Other scripts: `npm test`, `npm run typecheck`, `npm run build`, `npm start`.
## Error Handling
## Endpoints
Custom `NotFoundError`/`ConflictError` thrown from services, caught by one centralized error middleware in `app.ts` (`404`/`409`/`500`). Controllers have no try/catch.
Every route except register and login requires `Authorization: Bearer <token>`.
## Validation
| Method | Path | Access |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/auth/me` | Any user |
| GET | `/api/shifts`, `/api/shifts/upcoming`, `/api/shifts/:id` | Any user |
| POST, PATCH, DELETE | `/api/shifts`, `/api/shifts/:id` | Admin |
| POST | `/api/shifts/:id/signups` | Self or admin |
| GET | `/api/shifts/:id/signups` | Admin |
| PATCH | `/api/signups/:id/cancel` | Owner or admin |
| GET, PATCH | `/api/volunteers/:id` | Self or admin |
| GET | `/api/volunteers/:id/signups`, `/api/volunteers/:id/summary` | Self or admin |
| GET, POST | `/api/volunteers` | Admin |
| DELETE | `/api/volunteers/:id` | Admin |
Zod schemas in `src/validators/` validate request bodies before they hit a service — includes a cross-field check (`endTime > startTime`) and ObjectId format checks. Route params are guarded separately.
## Testing
## Running
Integration tests run against an in-memory MongoDB (`mongodb-memory-server`) using `node:test` and Supertest. They cover signup concurrency, waitlist promotion, and authentication and authorization.
```bash
npm install
npm run dev        # src/server.ts directly, no build step
npm run typecheck
npm run build
npm test
```
## Limitations
Needs `.env` with `MONGODB_URI`.
## Known Limitations
- No auth — any request can cancel any signup by id.
- No shift-time-overlap checking across a volunteer's signups.
- JWTs can't be revoked before they expire (7 days).
- Login has no rate limiting.
- Overlapping shifts for the same volunteer aren't detected.
