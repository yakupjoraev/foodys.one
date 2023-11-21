import { Translate } from "next-translate";
import { object, string, boolean } from "zod";

export function createContactUsFormSchema(t: Translate) {
  return object({
    name: string(),
    phone: string(),
    email: string().email(t("textEmailRequiredError")),
    message: string().min(1, t("textFieldRequiredError")),
    agreementConfirmed: boolean().refine((val) => val === true, {
      message: t("textAgreementRequiredError"),
    }),
  });
}
