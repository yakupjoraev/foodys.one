import { PlaceType1 } from "@googlemaps/google-maps-services-js";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { gmClient } from "~/server/google-maps";
import { nullsToUndefined } from "~/utils/nulls-to-undefined";

const PARIS_LOCATION = "48.864716,2.349014";

const storedPlaceSchema = z.object({
  formatted_address: z.optional(z.string()),
  name: z.optional(z.string()),
  place_id: z.optional(z.string()),
  rating: z.optional(z.number()),
  user_ratings_total: z.optional(z.number()),
  photos: z.optional(
    z.array(
      z.object({
        height: z.number(),
        html_attributions: z.array(z.string()),
        photo_reference: z.string(),
        width: z.number(),
      })
    )
  ),
});

const storedPlaceListSchema = z.array(storedPlaceSchema);

export type StoredPlace = z.infer<typeof storedPlaceSchema>;

export const placesRouter = createTRPCRouter({
  getPlaces: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(
      async ({ input }): Promise<{ results: StoredPlace[]; total: number }> => {
        const normalizedQuery = normalizeQuery(input.query);

        const cachedResponse = await db.textSearch.findFirst({
          where: {
            query: normalizedQuery,
          },
        });
        if (cachedResponse) {
          const results: StoredPlace[] = cachedResponse.places.map((place) => {
            return nullsToUndefined(place);
          });
          return { results, total: results.length };
        }

        const searchResponse = await gmClient.textSearch({
          params: {
            query: input.query,
            location: PARIS_LOCATION,
            type: PlaceType1.restaurant,
            key: env.GOOGLE_MAPS_API_KEY,
          },
        });

        const results = storedPlaceListSchema.parse(
          searchResponse.data.results
        );

        await db.textSearch.create({
          data: {
            query: normalizedQuery,
            places: results,
          },
        });

        return { results: results, total: results.length };
      }
    ),
});

function normalizeQuery(query: string) {
  return query.replace(/\s+/g, " ").toLowerCase();
}
