import { object, string } from "zod";

export const authFormSchema = object({
  login: string().nonempty(),
  password: string().nonempty(),
});
