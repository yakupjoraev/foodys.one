import type { z } from "zod";
import {
  searchTextResponseSchema,
  searchTextRequestSchema,
  searchTextErrorSchema,
} from "./schemas";
import { env } from "~/env.mjs";

export type * from "./types";
export * from "./constants";

export type SearchTextRequest = z.infer<typeof searchTextRequestSchema>;

const API_URL = "https://places.googleapis.com";

export async function searchTextNew(request: SearchTextRequest) {
  const requestBody = searchTextRequestSchema.parse(request);
  const requestBodyStr = JSON.stringify(requestBody);

  const endpointUrl = new URL("/v1/places:searchText", API_URL);

  const headers = new Headers();
  headers.set("X-Goog-Api-Key", env.GOOGLE_PLACES_NEW_API_KEY);
  headers.set("X-Goog-FieldMask", "places.id");
  headers.set("Content-Type", "application/json");

  const apiResponse = await fetch(endpointUrl, {
    method: "POST",
    headers,
    body: requestBodyStr,
  });

  const responseBody: unknown = await apiResponse.json();

  if (!apiResponse.ok) {
    const { error } = searchTextErrorSchema.parse(responseBody);
    throw new Error("failed to search: " + error.message);
  }

  const searchTextResponse = searchTextResponseSchema.parse(responseBody);

  return searchTextResponse;
}
