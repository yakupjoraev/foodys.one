import z from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "~/utils/mailer";
import format from "date-fns/format";
import { env } from "~/env.mjs";

const schema = z.object({
  name: z.optional(z.string()),
  phone: z.optional(z.string()),
  email: z.string(),
  message: z.string(),
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  if (method !== "POST") {
    return res.status(405).json({
      error: { message: `method ${method} not allowed` },
    });
  }

  const response = schema.safeParse(req.body);

  if (!response.success) {
    const { errors } = response.error;

    return res.status(400).json({
      error: { message: "invalid request", errors },
    });
  }

  const { name, phone, email, message } = response.data;

  sendEmail({
    to: env.FEEDBACK_EMAIL,
    subject: "User message",
    text: createMail(name, phone, email, message, new Date()),
  })
    .then(() => {
      res.status(200).json({ message: "OK" });
    })
    .catch((error) => {
      res.status(500).json({ message: "internal server error" });
    });
}

function createMail(
  name: string | undefined,
  phone: string | undefined,
  email: string,
  message: string,
  date: Date
) {
  let body = "The user sent a message via the contact form.";
  body += "\n";
  body += "\n";
  body += message
    .split("\n")
    .map((line) => "> " + line)
    .join("\n");
  body += "\n";
  body += "\n";
  body += "Contact details:";
  body += "\n";
  if (name) {
    body += "\n";
    body += "- Name: " + name;
  }
  if (phone) {
    body += "\n";
    body += "- Phone: " + phone;
  }
  body += "\n";
  body += "- E-mail: " + email;
  body += "\n";
  body += "\n";
  body += "Date: " + format(date, "dd/LL/yyyy HH:mm zzzz");

  return body;
}
