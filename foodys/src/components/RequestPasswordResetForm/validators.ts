import { object, string } from "zod";

export const requestPasswordResetFormSchema = object({
  email: string().email(),
});
