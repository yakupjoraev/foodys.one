import {
  PlaceInputType,
  PlaceType1,
} from "@googlemaps/google-maps-services-js";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { gmClient } from "~/server/google-maps";

const PARIS_LOCATION = "48.864716,2.349014";

export const placesRouter = createTRPCRouter({
  getPlaces: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const searchResponse = await gmClient.textSearch({
        params: {
          query: input.query,
          location: PARIS_LOCATION,
          type: PlaceType1.restaurant,
          key: env.GOOGLE_MAPS_API_KEY,
        },
      });
      return searchResponse.data;
    }),
});
