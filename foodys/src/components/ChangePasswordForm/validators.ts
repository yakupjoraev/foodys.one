import { passwordStrength } from "check-password-strength";
import { object, string } from "zod";

export const changePasswordFormSchema = object({
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
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords don't match",
  path: ["passwordConfirm"],
});
