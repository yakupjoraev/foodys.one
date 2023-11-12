import nodemailer from "nodemailer";
import { env } from "../env.mjs";

interface EmailPayload {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail(emailPayload: EmailPayload) {
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT, 10),
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });
  return await transporter.sendMail({
    from: env.SMTP_FROM_EMAIL,
    ...emailPayload,
  });
}
