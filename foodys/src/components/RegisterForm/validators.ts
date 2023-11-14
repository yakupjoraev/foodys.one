import { passwordStrength } from "check-password-strength";
import { object, optional, string, literal } from "zod";

export const registerFormSchema = object({
  firstName: string()
    .min(1, "This field is required")
    .max(256, "This field must have a maximum of 256 characters"),
  lastName: string()
    .min(1, "This field is required")
    .max(256, "This field must have a maximum of 256 characters"),
  nickname: string()
    .max(256, "This field must have a maximum of 256 characters")
    .regex(/^[a-z0-9_]*$/, "Allowed symbols: a-z, 0-9 and _"),
  email: string().email(),
  password: string()
    .min(8, "This field must have a minimum of 8 characters")
    .max(256, "This field must have a maximum of 256 characters")
    .refine(
      (val) => {
        return passwordStrength(val).id > 1;
      },
      {
        message:
          "Requires characters from the ranges a–z, A–Z, 0–9, and special symbols",
      }
    ),
  passwordConfirm: string(),
  agreementConfirmed: literal(true),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});
