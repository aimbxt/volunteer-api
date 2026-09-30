# Volunteer API

A REST API for scheduling volunteer shifts, with capacity limits, waitlists, and JWT authentication.

## Stack

- TypeScript
- Node.js 24 with native TypeScript execution (no `tsx` or `ts-node`)
- Express 5
- MongoDB Atlas with Mongoose
- Zod for request validation
- JWT and bcrypt for authentication
- `node:test`, Supertest, and `mongodb-memory-server` for integration tests

## Features

- **Race-safe capacity:** Signups claim spots with an atomic `findOneAndUpdate`, so concurrent requests cannot overbook a shift.
- **Waitlists:** Signups made after a shift reaches capacity are waitlisted. When a confirmed volunteer cancels, the oldest waitlisted signup is promoted automatically.
- **Authentication and authorization:** Passwords are hashed with bcrypt. Stateless JWTs identify users, while role (`volunteer` or `admin`) and ownership checks protect routes.
- **Validation and error handling:** Zod validates request bodies. Typed errors are mapped to HTTP status codes by centralized error middleware.

## Data Model

- **Volunteer:** `name`, `email`
- **Shift:** `title`, `description?`, `location`, `startTime`, `endTime`, `capacity`, `confirmedCount`
- **Signup:** Junction collection containing `volunteer` (ref), `shift` (ref), and `status` (`confirmed`, `waitlisted`, or `cancelled`)

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```dotenv
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<output of: openssl rand -hex 32>
```

Start the development server:

```bash
npm run dev
```

## API Endpoints

Every route except registration and login requires an `Authorization: Bearer <token>` header.

| Method | Path | Access |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/me` | Any authenticated user |
| `GET` | `/api/shifts` | Any authenticated user |
| `GET` | `/api/shifts/upcoming` | Any authenticated user |
| `GET` | `/api/shifts/:id` | Any authenticated user |
| `POST` | `/api/shifts` | Admin |
| `PATCH` | `/api/shifts/:id` | Admin |
| `DELETE` | `/api/shifts/:id` | Admin |
| `POST` | `/api/shifts/:id/signups` | Self or admin |
| `GET` | `/api/shifts/:id/signups` | Admin |
| `PATCH` | `/api/signups/:id/cancel` | Owner or admin |
| `GET` | `/api/volunteers` | Admin |
| `POST` | `/api/volunteers` | Admin |
| `GET` | `/api/volunteers/:id` | Self or admin |
| `PATCH` | `/api/volunteers/:id` | Self or admin |
| `DELETE` | `/api/volunteers/:id` | Admin |
| `GET` | `/api/volunteers/:id/signups` | Self or admin |
| `GET` | `/api/volunteers/:id/summary` | Self or admin |

Signups intentionally do not have full CRUD endpoints. There is no `DELETE` endpoint; cancelled signups are retained for audit history and waitlist promotion.

## Validation and Error Handling

Zod schemas in `src/validators/` validate request bodies before they reach a service. Validation includes:

- A cross-field check requiring `endTime` to be later than `startTime`
- ObjectId format checks
- Separate guards for route parameters

Services throw typed errors such as `NotFoundError` and `ConflictError`. Centralized error middleware in `app.ts` converts them to `404`, `409`, or `500` responses, so controllers do not need individual `try`/`catch` blocks.

## Testing

Integration tests use `node:test`, Supertest, and an in-memory MongoDB instance provided by `mongodb-memory-server`. They cover authentication and authorization, concurrent signups, and waitlist promotion.

```bash
npm test
```

## Available Scripts

```bash
npm run dev        # Run src/server.ts directly without a build step
npm run typecheck  # Check TypeScript types
npm run build      # Build the project
npm test           # Run the test suite
npm start          # Start the built application
```

## Known Limitations

- Overlapping shifts for the same volunteer are not detected.
- JWTs cannot be revoked before they expire (seven days).
- Login does not have rate limiting.
