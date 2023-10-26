import { object, string, literal } from "zod";

export const authFormSchema = object({
  login: string().nonempty(),
  password: string().nonempty(),
  agreementConfirmed: literal(true),
});
