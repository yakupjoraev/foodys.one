import { Translate } from "next-translate";
import { object, string } from "zod";

export function createRequestPasswordResetFormSchema(t: Translate) {
  return object({
    email: string().email(t("textEmailRequiredError")),
  });
}
