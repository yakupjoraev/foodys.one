import { PlaceType1 } from "@googlemaps/google-maps-services-js";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { gmClient } from "~/server/google-maps";
import { nullsToUndefined } from "~/utils/nulls-to-undefined";

const PARIS_LOCATION = "48.864716,2.349014";

const PAGE_SIZE = 10;

const storedPlaceSchema = z.object({
  formatted_address: z.optional(z.string()),
  name: z.optional(z.string()),
  place_id: z.optional(z.string()),
  price_level: z.optional(z.number()),
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

export interface GetPlacesResponse {
  results: StoredPlace[];
  page: number;
  pages: number;
  total: number;
}

export const placesRouter = createTRPCRouter({
  getPlaces: publicProcedure
    .input(z.object({ query: z.string(), page: z.optional(z.number().min(1)) }))
    .query(async ({ input }): Promise<GetPlacesResponse> => {
      const page = input.page || 1;

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
        return createResponse(page, results, PAGE_SIZE);
      }

      const searchResponse = await gmClient.textSearch({
        params: {
          query: input.query,
          location: PARIS_LOCATION,
          type: PlaceType1.restaurant,
          key: env.GOOGLE_MAPS_API_KEY,
        },
      });

      const results = storedPlaceListSchema.parse(searchResponse.data.results);

      await db.textSearch.create({
        data: {
          query: normalizedQuery,
          places: results,
        },
      });

      return createResponse(page, results, PAGE_SIZE);
    }),
});

function normalizeQuery(query: string) {
  return query.replace(/\s+/g, " ").toLowerCase();
}

function createResponse(
  page: number,
  results: StoredPlace[],
  pageSize: number
): GetPlacesResponse {
  if (results.length === 0) {
    return {
      results: [],
      page: 1,
      pages: 1,
      total: 0,
    };
  }

  const pageTotal = Math.ceil(results.length / pageSize);

  let normalizedPage = page;
  if (normalizedPage < 1) {
    normalizedPage = 1;
  } else if (normalizedPage > pageTotal) {
    normalizedPage = pageTotal;
  }

  const startIndex = (normalizedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const resultsSlice = results.slice(startIndex, endIndex);

  return {
    results: resultsSlice,
    page: normalizedPage,
    pages: pageTotal,
    total: results.length,
  };
}
