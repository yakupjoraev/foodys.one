import { number, object, string, boolean } from "zod";

export const reviewFormSchema = object({
  rating: number().min(1, "This field is required").max(5),
  review: string()
    .min(100, "Review must have a minimum of 100 characters")
    .max(500, "Review must have a maximum of 500 characters"),
  agreementConfirmed: boolean().refine((val) => val === true, {
    message: "Please agree to the terms above to continue.",
  }),
});
