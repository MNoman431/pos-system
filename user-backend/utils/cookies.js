const isProd = process.env.NODE_ENV === "production";
export const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,                 // prod: HTTPS required
  sameSite: isProd ? "none" : "lax",
  path: "/",
  // Optional: persistent cookie
  // maxAge: 24 * 60 * 60 * 1000, // 1 day
};
