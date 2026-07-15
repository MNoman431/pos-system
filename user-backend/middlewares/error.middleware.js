
import { HttpError } from "../utils/httpError.js";

export function errorHandler(err, _req, res, _next) {
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Email already exists" });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message, code: err.code });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({ message: "Internal server error" });
}
