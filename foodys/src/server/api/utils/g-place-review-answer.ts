import { db } from "~/server/db";

export interface OwnerAnswerResource {
  id: string;
  ownerName: string;
  text: string;
  time: number;
}

export async function createGPlaceReviewAnswer(
  userId: string,
  gPlaceReviewId: string,
  text: string
) {
  return await db.gPlaceReviewAnswer.create({
    data: {
      text: text,
      g_place_review_id: gPlaceReviewId,
      user_id: userId,
    },
  });
}
