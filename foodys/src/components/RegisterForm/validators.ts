import { passwordStrength } from "check-password-strength";
import { object, optional, string } from "zod";

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
    .nonempty()
    .max(256)
    .refine(
      (val) => {
        return passwordStrength(val).id > 1;
      },
      { message: "password is weak" }
    ),
});
