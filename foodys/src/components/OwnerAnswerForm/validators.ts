import { object, string } from "zod";

export const ownerAnswerFormSchema = object({
  answer: string().min(1).max(500),
});
