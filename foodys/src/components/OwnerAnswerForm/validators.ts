import { type Translate } from "next-translate";
import { object, string } from "zod";

export function createOwnerAnswerFormSchema(t: Translate) {
  return object({
    answer: string()
      .min(1, t("textFieldRequiredError"))
      .max(500, t("textCharsMaxError", { max: 500 })),
  });
}
