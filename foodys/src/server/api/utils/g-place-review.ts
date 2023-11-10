import { db } from "~/server/db";
import {
  countGPlaceReviewLikes,
  filterLikedGPlaceReviewIds,
} from "./g-place-review-like";
import { removeNulls } from "~/utils/remove-nulls";
import { type GPlaceReview } from "@prisma/client";

export interface PlaceReviewResource {
  id: string;
  author_name: string;
  rating: number;
  time: number;
  author_url?: string;
  language?: string;
  original_language?: string;
  profile_photo_url?: string;
  text?: string;
  translated?: boolean;
  liked?: boolean;
  likes?: number;
}

export interface CreateLocalGPlaceReviewRequest {
  gPlaceId: string;
  rating: number;
  authorName: string;
  text: string;
  time?: number;
  language?: string;
  localAuthorId: string;
}

export async function getGPlaceReviewResources(
  gPlaceId: string,
  userId?: string
) {
  const reviews = await db.gPlaceReview.findMany({
    where: {
      g_place_id: gPlaceId,
    },
  });

  reviews.sort((a, b) => {
    const aValue: number = a.local_author_id === null ? 0 : 1;
    const bValue: number = b.local_author_id === null ? 0 : 1;
    return bValue - aValue;
  });

  const resources: PlaceReviewResource[] = reviews.map((review) => {
    return createResourceFromGPlaceReview(review);
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

export async function createLocalGPlaceReview(
  request: CreateLocalGPlaceReviewRequest
) {
  await db.gPlaceReview.create({
    data: {
      author_name: request.authorName,
      rating: request.rating,
      text: request.text,
      time: request.time ?? Math.floor(Date.now() / 1000),
      language: request.language,
      g_place_id: request.gPlaceId,
      local_author_id: request.localAuthorId,
    },
  });
}

export function createResourceFromGPlaceReview(
  placeModel: GPlaceReview
): PlaceReviewResource {
  return removeNulls({
    id: placeModel.id,
    author_name: placeModel.author_name,
    rating: placeModel.rating,
    time: placeModel.time,
    author_url: placeModel.author_url,
    language: placeModel.language,
    original_language: placeModel.original_language,
    profile_photo_url: placeModel.profile_photo_url,
    text: placeModel.text,
    translated: placeModel.translated,
    liked: false,
    likes: 0,
  });
}
