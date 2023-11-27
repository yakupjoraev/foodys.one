import { Translate } from "next-translate";
import { object, string } from "zod";

export function createHeroChatFormSchema(t: Translate) {
  return object({
    name: string(),
    email: string().email(t("textEmailRequiredError")),
    message: string().min(1, t("textFieldRequiredError")),
  });
}
