import { object, string, boolean, optional } from "zod";

export const contactUsFormSchema = object({
  name: string(),
  phone: string(),
  email: string().email(),
  message: string().min(1, "This field is required"),
  agreementConfirmed: boolean().refine((val) => val === true, {
    message: "Please agree to the terms above to continue.",
  }),
});
