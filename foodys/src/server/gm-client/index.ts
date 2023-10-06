import { Zodios } from "@zodios/core";
import { z } from "zod";
import {
  placesDetailsResponseSchema,
  placesTextSearchResponseSchema,
} from "./schemas";

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
  },
]);
