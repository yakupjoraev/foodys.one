import { db } from "~/server/db";
import {
  countGPlaceReviewLikes,
  filterLikedGPlaceReviewIds,
} from "./g-place-review-like";
import { removeNulls } from "~/utils/remove-nulls";
import { type Lang, type GPlaceReview } from "@prisma/client";
import { type OwnerAnswerResource } from "./g-place-review-answer";

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
  ownerAnswers?: OwnerAnswerResource[];
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
  lang: Lang,
  userId?: string
) {
  let gLanguage: "fr" | "en";
  switch (lang) {
    case "FR": {
      gLanguage = "fr";
      break;
    }
    case "EN": {
      gLanguage = "en";
      break;
    }
  }

  const reviews = await db.gPlaceReview.findMany({
    where: {
      g_place_id: gPlaceId,
      language: gLanguage,
    },
    include: {
      g_place_review_answer: {
        include: {
          user: true,
        },
      },
    },
  });

  reviews.sort((a, b) => {
    const aValue: number = a.local_author_id === null ? 0 : 1;
    const bValue: number = b.local_author_id === null ? 0 : 1;
    return bValue - aValue;
  });

  const resources: PlaceReviewResource[] = reviews.map((review) => {
    const ownerAnswers: OwnerAnswerResource[] =
      review.g_place_review_answer.map((answer) => ({
        id: answer.id,
        ownerName: answer.user.name ?? "",
        text: answer.text,
        time: Math.floor(answer.created_at.getTime() / 1000),
      }));
    const reviewResource = createResourceFromGPlaceReview(review);
    if (ownerAnswers.length) {
      reviewResource.ownerAnswers = ownerAnswers;
    }
    return reviewResource;
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
  reviewModel: GPlaceReview
): PlaceReviewResource {
  return removeNulls({
    id: reviewModel.id,
    author_name: reviewModel.author_name,
    rating: reviewModel.rating,
    time: reviewModel.time,
    author_url: reviewModel.author_url,
    language: reviewModel.language,
    original_language: reviewModel.original_language,
    profile_photo_url: reviewModel.profile_photo_url,
    text: reviewModel.text,
    translated: reviewModel.translated,
    liked: false,
    likes: 0,
  });
}
