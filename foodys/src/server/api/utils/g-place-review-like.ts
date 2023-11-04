import { Prisma } from "@prisma/client";
import { db } from "~/server/db";

export async function isGPlaceReviewLiked(
  gPlaceReviewId: string,
  userId: string
) {
  const likeCount = await db.gPlaceReviewLike.count({
    where: {
      user_id: userId,
      g_place_review_id: gPlaceReviewId,
    },
  });

  const liked = likeCount > 0;

  return liked;
}

export async function filterLikedGPlaceReviewIds(
  ids: string[],
  userId: string
): Promise<string[]> {
  const likes = await db.gPlaceReviewLike.findMany({
    where: {
      user_id: userId,
      g_place_review_id: { in: ids },
    },
    select: {
      g_place_review_id: true,
    },
  });

  const likedIds = likes.map(({ g_place_review_id }) => g_place_review_id);

  return likedIds;
}

export async function countGPlaceReviewLikes(gPlaceReviewId: string) {
  const likeCount = await db.gPlaceReviewLike.count({
    where: {
      g_place_review_id: gPlaceReviewId,
    },
  });

  return likeCount;
}

export async function createGPlaceReviewLike(
  gPlaceReviewId: string,
  userId: string
) {
  try {
    await db.gPlaceReviewLike.create({
      data: {
        user_id: userId,
        g_place_review_id: gPlaceReviewId,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
    } else {
      throw error;
    }
  }
}

export async function deleteGPlaceReviewLike(
  gPlaceReviewId: string,
  userId: string
) {
  await db.gPlaceReviewLike.deleteMany({
    where: {
      user_id: userId,
      g_place_review_id: gPlaceReviewId,
    },
  });
}
