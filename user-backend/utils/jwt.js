import jwt from "jsonwebtoken";
import { HttpError } from "./httpError.js";

export function createToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new HttpError(500, "JWT secret not configured");

  const expiresIn = process.env.JWT_EXPIRES || "1d";
  const payload = { sub: user._id, email: user.email };

  return jwt.sign(payload, secret, { expiresIn });
}
