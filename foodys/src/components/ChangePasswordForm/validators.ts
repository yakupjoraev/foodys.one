import { passwordStrength } from "check-password-strength";
import { Translate } from "next-translate";
import { object, string } from "zod";

export function createChangePasswordFromSchema(t: Translate) {
  return object({
    password: string()
      .min(8, t("textCharsMinError", { min: 8 }))
      .max(256, t("textCharsMaxError", { max: 256 }))
      .refine(
        (val) => {
          return passwordStrength(val).id > 1;
        },
        {
          message: t("textPassCharsError"),
        }
      ),
    passwordConfirm: string(),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: t("textPasswordsMatchError"),
    path: ["passwordConfirm"],
  });
}
