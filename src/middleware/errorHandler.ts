import { type Request, type Response, type NextFunction } from "express";
import { NotFoundError, ConflictError } from "../errors.ts";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  if (err instanceof ConflictError) {
    return res.status(409).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}