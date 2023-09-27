import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { gmClient } from "~/server/google-maps";

export const placeRouter = createTRPCRouter({
  getPlace: publicProcedure
    .input(z.object({ placeId: z.string() }))
    .query(async ({ input }) => {
      const placeId = input.placeId;

      const placeDetails = await gmClient.placeDetails({
        params: {
          place_id: placeId,
          key: env.GOOGLE_MAPS_API_KEY,
        },
      });

      return placeDetails.data.result;
    }),
});
