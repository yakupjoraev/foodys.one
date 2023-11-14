import { object, string, boolean } from "zod";

export const authFormSchema = object({
  login: string().min(1, "This field is required"),
  password: string().min(1, "This field is required"),
  agreementConfirmed: boolean().refine((val) => val === true, {
    message: "Please agree to the terms above to continue.",
  }),
});
