import { passwordStrength } from "check-password-strength";
import { object, optional, string, literal } from "zod";

export const registerFormSchema = object({
  firstName: string().nonempty().max(256),
  lastName: string().nonempty().max(256),
  nickname: optional(
    string()
      .nonempty()
      .max(256)
      .regex(/^[a-z0-9_]*$/, "allowed symbols: a-z, 0-9 and _")
  ),
  email: string().email(),
  password: string()
    .min(8)
    .max(256)
    .refine(
      (val) => {
        return passwordStrength(val).id > 1;
      },
      {
        message:
          "Requires characters from the ranges a–z, A–Z, 0–9, and special symbols.",
      }
    ),
  passwordConfirm: string(),
  agreementConfirmed: literal(true),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});
