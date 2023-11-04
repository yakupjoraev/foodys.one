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
import { getGPlaceReviewResources } from "../utils/g-place-review";

export const reviewsRouter = createTRPCRouter({
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
});
