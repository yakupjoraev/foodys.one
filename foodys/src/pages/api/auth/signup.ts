import { NextApiRequest, NextApiResponse } from "next";
import z, { ZodError } from "zod";
import { passwordStrength } from "check-password-strength";
import { hashPassword } from "~/utils/hash";
import { db } from "../../../server/db";

const inputSchema = z.object({
  firstName: z.string().nonempty().max(256),
  lastName: z.string().nonempty().max(256),
  nickname: z.optional(
    z
      .string()
      .nonempty()
      .max(256)
      .regex(/^[a-z0-9_]*$/)
  ),
  email: z.string().email(),
  password: z.string().max(256),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(400).json({ success: false, message: "invalid method" });
    return;
  }

  let input;
  try {
    input = inputSchema.parse(req.body);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ success: false, message: error.message });
      return;
    } else {
      throw error;
    }
  }

  if (req.method === "POST") {
    const existsUser = await db.user.findFirst({
      where: { email: input.email },
    });
    if (existsUser) {
      res.status(409).json({
        success: false,
        message: "a user with the same email already exists",
      });
      return;
    }

    const strength = passwordStrength(input.password);
    if (strength.id <= 1) {
      res.status(400).json({
        success: false,
        message: "weak password",
      });
      return;
    }

    const passwordHash = await hashPassword(input.password);
    await db.user.create({
      data: {
        email: input.email,
        password: passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        nickname: input.nickname,
        name: `${input.firstName} ${input.lastName}`,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "user signed up successfuly" });
  }
}
