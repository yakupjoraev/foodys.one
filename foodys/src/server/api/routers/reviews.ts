import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  countGPlaceReviewLikes,
  createGPlaceReviewLike,
  deleteGPlaceReviewLike,
} from "../utils/g-place-review-like";
import {
  createLocalGPlaceReview,
  getGPlaceReviewResources,
} from "../utils/g-place-review";
import { createGPlaceReviewAnswer } from "../utils/g-place-review-answer";

export const reviewsRouter = createTRPCRouter({
  createGPlaceReview: protectedProcedure
    .input(
      z.object({
        placeId: z.string(),
        rating: z.number().min(1).max(5),
        review: z.string().min(100).max(500),
        language: z.optional(z.union([z.literal("en"), z.literal("fr")])),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const authorName = ctx.session.user.name ?? "";
      await createLocalGPlaceReview({
        gPlaceId: input.placeId,
        rating: input.rating,
        authorName: authorName,
        text: input.review,
        language: input.language,
        localAuthorId: userId,
      });
    }),
  likeGPlaceReview: protectedProcedure
    .input(z.object({ gPlaceReviewId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await createGPlaceReviewLike(input.gPlaceReviewId, userId);
    }),
  updateGPlaceReviewLike: protectedProcedure
    .input(z.object({ gPlaceReviewId: z.string().min(1), liked: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (input.liked) {
        await createGPlaceReviewLike(input.gPlaceReviewId, userId);
      } else {
        await deleteGPlaceReviewLike(input.gPlaceReviewId, userId);
      }
    }),
  unlikeGPlaceReview: protectedProcedure
    .input(z.object({ gPlaceReviewId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await deleteGPlaceReviewLike(input.gPlaceReviewId, userId);
    }),
  gPlaceReviewLikesCount: publicProcedure
    .input(z.object({ gPlaceReviewId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return countGPlaceReviewLikes(input.gPlaceReviewId);
    }),
  getGPlaceReviews: publicProcedure
    .input(z.object({ gPlaceId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      return getGPlaceReviewResources(input.gPlaceId, userId);
    }),
  createGPlaceReviewAnswer: protectedProcedure
    .input(
      z.object({
        gPlaceReviewId: z.string(),
        text: z.string().min(1).max(500),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      await createGPlaceReviewAnswer(userId, input.gPlaceReviewId, input.text);
    }),
});
