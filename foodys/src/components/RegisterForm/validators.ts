import { passwordStrength } from "check-password-strength";
import { type Translate } from "next-translate";
import { object, string, literal } from "zod";

export function createRegisterFormSchema(t: Translate) {
  return object({
    firstName: string()
      .min(1, t("textFieldRequiredError"))
      .max(256, t("textCharsMaxError", { max: 256 })),
    lastName: string()
      .min(1, t("textFieldRequiredError"))
      .max(256, t("textCharsMaxError", { max: 256 })),
    nickname: string()
      .max(256, t("textCharsMaxError", { max: 256 }))
      .regex(/^[a-z0-9_]*$/, t('textNicknameExplanation')),
    email: string().email(),
    password: string()
      .min(8, t("textCharsMinError", { min: 256 }))
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
    agreementConfirmed: literal(true, {
      errorMap: () => ({ message: t("textAgreementRequiredError") }),
    }),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: t("textPasswordsMatchError"),
    path: ["passwordConfirm"],
  });
}
