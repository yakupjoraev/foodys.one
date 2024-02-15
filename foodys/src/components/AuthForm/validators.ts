import { type Translate } from "next-translate";
import { object, string, boolean } from "zod";

export function createAuthFormSchema(t: Translate) {
  return object({
    login: string().min(1, t("textFieldRequiredError")),
    password: string().min(1, t("textFieldRequiredError")),
    agreementConfirmed: boolean().refine((val) => val === true, {
      message: t("textAgreementRequiredError"),
    }),
  });
}
