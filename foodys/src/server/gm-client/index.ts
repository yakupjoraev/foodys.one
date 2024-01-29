import { Zodios } from "@zodios/core";
import { z } from "zod";
import {
  placesDetailsResponseSchema,
  placesTextSearchResponseSchema,
} from "./schemas";
import { pluginRateLimit } from "./rate-limit-plugin";

export const gmClient = new Zodios("https://maps.googleapis.com", [
  {
    method: "get",
    path: "/maps/api/place/textsearch/json",
    alias: "textSearch",
    parameters: [
      {
        name: "query",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "type",
        type: "Query",
        schema: z.optional(
          z.union([
            z.literal("restaurant"),
            z.literal("cafe"),
            z.literal("bar"),
          ])
        ),
      },
      {
        name: "location",
        type: "Query",
        schema: z.optional(z.string()),
      },
      {
        name: "region",
        type: "Query",
        schema: z.literal("fr"),
      },
      {
        name: "key",
        type: "Query",
        schema: z.optional(z.string()),
      },
    ],
    response: placesTextSearchResponseSchema,
  },
  {
    method: "get",
    path: "/maps/api/place/details/json",
    alias: "placeDetails",
    parameters: [
      {
        name: "place_id",
        type: "Query",
        schema: z.string(),
      },
      {
        name: "fields",
        type: "Query",
        schema: z.optional(z.string()),
      },
      {
        name: "key",
        type: "Query",
        schema: z.optional(z.string()),
      },
    ],
    response: placesDetailsResponseSchema,
    errors: [
      {
        status: "default",
        schema: z.object({
          error_message: z.string().optional(),
          html_attributions: z.string(),
          status: z.string(),
        }),
      },
    ],
  },
]);

gmClient.use(pluginRateLimit({ limit: 6000, interval: 60000 }));
