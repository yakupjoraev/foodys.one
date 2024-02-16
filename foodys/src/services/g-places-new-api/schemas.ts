import { z } from "zod";

export const viewportCircleSchema = z.object({
  circle: z.object({
    center: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    radius: z.optional(z.number()),
  }),
});

export const priceLevelsSchema = z.array(
  z.union([
    z.literal("PRICE_LEVEL_UNSPECIFIED"), //	Place price level is unspecified or unknown.
    z.literal("PRICE_LEVEL_FREE"), // Place provides free services.
    z.literal("PRICE_LEVEL_INEXPENSIVE"), //	Place provides inexpensive services.
    z.literal("PRICE_LEVEL_MODERATE"), // Place provides moderately priced services.
    z.literal("PRICE_LEVEL_EXPENSIVE"), //	Place provides expensive services.
    z.literal("PRICE_LEVEL_VERY_EXPENSIVE"), //  Place provides very expensive services.
  ])
);

export const searchTextRequestSchema = z.object({
  textQuery: z.string(),
  includedType: z.optional(
    z.union([z.literal("restaurant"), z.literal("cafe"), z.literal("bar")])
  ),
  languageCode: z.optional(z.union([z.literal("fr"), z.literal("en")])),
  locationBias: z.optional(viewportCircleSchema),
  minRating: z.optional(z.number().min(0).max(5)),
  openNow: z.optional(z.boolean()),
  priceLevels: z.optional(priceLevelsSchema),
  strictTypeFiltering: z.optional(z.boolean()),
});

export const searchTextResponseSchema = z.object({
  places: z.optional(
    z.array(
      z.object({
        id: z.string(),
      })
    )
  ),
});

export const searchTextErrorSchema = z.object({
  error: z.object({
    message: z.string(),
  }),
});
