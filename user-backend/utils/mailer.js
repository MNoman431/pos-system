// mailer.js
import nodemailer from "nodemailer";

const {
  SMTP_HOST = "sandbox.smtp.mailtrap.io",
  SMTP_PORT = "587",
  SMTP_USER,
  SMTP_PASS,
  FROM_EMAIL,
  NODE_ENV,
} = process.env;

const PORT = Number(SMTP_PORT);
const SECURE = PORT === 465;

export const mailer = nodemailer.createTransport({
  host: SMTP_HOST,
  port: PORT,
  secure: SECURE,
  // Omit auth entirely when unconfigured so nodemailer skips AUTH negotiation
  // instead of hanging until connectionTimeout/greetingTimeout with undefined credentials.
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  connectionTimeout: 20_000,
  greetingTimeout: 20_000,
  socketTimeout: 20_000,
  logger: NODE_ENV !== "production",
  debug: NODE_ENV !== "production",
});

/**
 * Send email with optional attachments.
 * attachments: Array<{ filename: string, content: Buffer|string, contentType?: string, encoding?: string }>
 */
export const sendMail = async ({ to, subject, html, text, attachments }) => {
  const from = FROM_EMAIL || SMTP_USER;
  if (!from) {
    throw new Error("Cannot send email: set FROM_EMAIL or SMTP_USER in .env");
  }

  // Normalize attachments to a nodemailer-friendly structure
  const normalizedAttachments =
    attachments?.map((a) => {
      const isBuffer = Buffer.isBuffer(a.content);

      // Prefer base64 for Mailtrap reliability
      if (isBuffer) {
        return {
          filename: a.filename || "file.bin",
          content: a.content.toString("base64"),
          encoding: "base64",
          contentType: a.contentType || "application/octet-stream",
        };
      }

      // If already a base64/string content, respect provided encoding/contentType
      return {
        filename: a.filename || "file.bin",
        content: a.content,
        encoding: a.encoding, // e.g., "base64" if caller passed it
        contentType: a.contentType || "application/octet-stream",
      };
    }) || [];

  const info = await mailer.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments: normalizedAttachments.length ? normalizedAttachments : undefined,
  });

  if (NODE_ENV !== "production") {
    console.log(`[DEV] Email sent: ${info.messageId}`);
  }
  return info;
};

export const sendOTPEmail = async ({ to, otp, minutes = 10 }) => {
  const subject = "Your FancyPOS Password Reset Code";
  const text = `Your OTP is ${otp}. It will expire in ${minutes} minutes. If you did not request this, ignore this email.`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;">
      <h2 style="margin:0 0 8px;">Password Reset Code</h2>
      <p>Use the following code to reset your password:</p>
      <div style="display:inline-block;padding:12px 18px;border:1px solid #e5e7eb;border-radius:8px;background:#f9fafb;font-size:20px;letter-spacing:3px;font-weight:bold;">
        ${otp}
      </div>
      <p style="margin-top:10px;color:#555;">This code expires in <b>${minutes} minutes</b>.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
      <p style="font-size:12px;color:#777;">If you didn't request a reset, you can safely ignore this email.</p>
    </div>
  `;
  return sendMail({ to, subject, text, html });
};