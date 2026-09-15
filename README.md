# Volunteer API

Backend API for volunteer shift signups. TypeScript, Express 5, MongoDB/Mongoose, Zod. No auth implemented yet.

## Stack

- Node 24 native TS execution (no `tsx`/`ts-node`)
- Express 5 + MongoDB Atlas via Mongoose
- Zod for request validation
- `node:test` + `supertest` + `mongodb-memory-server` for tests

## Data Model

- **Volunteer** — `name`, `email`
- **Shift** — `title`, `description?`, `location`, `startTime`, `endTime`, `capacity`, `confirmedCount`
- **Signup** — junction collection: `volunteer` (ref), `shift` (ref), `status` (`confirmed` | `waitlisted` | `cancelled`)

## Endpoints

```
Volunteer: POST/GET /api/volunteers, GET/PATCH/DELETE /api/volunteers/:id
Shift:     POST/GET /api/shifts, GET/PATCH/DELETE /api/shifts/:id
Signup:    POST /api/shifts/:id/signups        (create)
           GET  /api/shifts/:id/signups        (roster)
           GET  /api/volunteers/:id/signups    (a volunteer's signups)
           PATCH /api/signups/:id/cancel       (cancel)
```

Signup has no full CRUD, no `DELETE` — cancelled signups are kept for audit history and the promotion query.

## Error Handling

Custom `NotFoundError`/`ConflictError` thrown from services, caught by one centralized error middleware in `app.ts` (`404`/`409`/`500`). Controllers have no try/catch.

## Validation

Zod schemas in `src/validators/` validate request bodies before they hit a service — includes a cross-field check (`endTime > startTime`) and ObjectId format checks. Route params are guarded separately.

## Running

```bash
npm install
npm run dev        # src/server.ts directly, no build step
npm run typecheck
npm run build
npm test
```

Needs `.env` with `MONGODB_URI`.

## Known Limitations

- No auth — any request can cancel any signup by id.
- No shift-time-overlap checking across a volunteer's signups.
