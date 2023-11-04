import { db } from "~/server/db";
import {
  countGPlaceReviewLikes,
  filterLikedGPlaceReviewIds,
} from "./g-place-review-like";
import { removeNulls } from "~/utils/remove-nulls";
import { type PlaceReview } from "~/server/gm-client/types";

export type PlaceReviewResource = PlaceReview & {
  id: string;
  hash: string;
  liked?: boolean;
  likes?: number;
};

export async function getGPlaceReviewResources(
  gPlaceId: string,
  userId?: string
) {
  const reviews = await db.gPlaceReview.findMany({
    where: {
      g_place_id: gPlaceId,
    },
  });

  const resources: PlaceReviewResource[] = reviews.map((review) => {
    return {
      ...removeNulls(review),
      liked: false,
      likes: 0,
    };
  });

  await Promise.all(
    resources.map(async (resource) => {
      resource.likes = await countGPlaceReviewLikes(resource.id);
    })
  );

  if (userId !== undefined && resources.length) {
    const ids = resources.map(({ id }) => id);
    const likedIds = await filterLikedGPlaceReviewIds(ids, userId);
    const likedIdSet = new Set(likedIds);
    resources.forEach((resource) => {
      resource.liked = likedIdSet.has(resource.id);
    });
  }

  return resources;
}
