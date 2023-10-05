import { Place, PlaceType1 } from "@googlemaps/google-maps-services-js";
import { Establishment, Prisma } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { gmClient } from "~/server/google-maps";

const PARIS_LOCATION = "48.864716,2.349014";

const PAGE_SIZE = 10;

const PHOTOS_ENDPOINT =
  "https://foodys.freeblock.site/place-photos/cover_168x168/";

export interface PlaceListingItem {
  formatted_address?: string;
  name?: string;
  place_id?: string;
  rating?: number;
  user_rating_total?: number;
  price_level?: number;
  photos?: string[];
}

export interface PlaceListing {
  results: PlaceListingItem[];
  page: number;
  pages: number;
  total: number;
}

export const placesRouter = createTRPCRouter({
  getPlaces: publicProcedure
    .input(
      z.object({
        query: z.string(),
        establishment: z.union([
          z.literal("restaurant"),
          z.literal("coffeeAndTea"),
          z.literal("bar"),
        ]),
        page: z.optional(z.number().min(1)),
      })
    )
    .query(async ({ input }): Promise<PlaceListing> => {
      const page = input.page || 1;

      const normalizedQuery = normalizeQuery(input.query);

      if (!normalizedQuery) {
        return {
          results: [],
          page: 1,
          pages: 1,
          total: 0,
        };
      }

      const cachedResponse = await db.textSearch.findFirst({
        where: {
          query: normalizedQuery,
          establishment: getEstablishmentDB(input.establishment),
        },
      });

      if (cachedResponse) {
        const places = cachedResponse.places as unknown as Place[];
        return createResponse(page, places, PAGE_SIZE);
      }

      const searchResponse = await gmClient.textSearch({
        params: {
          query: input.query,
          location: PARIS_LOCATION,
          type: getEstablishmentGP(input.establishment),
          key: env.GOOGLE_MAPS_API_KEY,
        },
      });

      await db.textSearch.create({
        data: {
          query: normalizedQuery,
          places: searchResponse.data.results as any[],
          establishment: getEstablishmentDB(input.establishment),
        },
      });

      return createResponse(page, searchResponse.data.results, PAGE_SIZE);
    }),
});

function normalizeQuery(query: string) {
  return query.replace(/\s+/g, " ").toLowerCase();
}

function getEstablishmentDB(
  establishemnt: "restaurant" | "coffeeAndTea" | "bar"
): Establishment {
  switch (establishemnt) {
    case "restaurant": {
      return Establishment.RESTAURANT;
    }
    case "coffeeAndTea": {
      return Establishment.COFFEE_AND_TEA;
    }
    case "bar": {
      return Establishment.BAR;
    }
  }
}

function getEstablishmentGP(
  establishemnt: "restaurant" | "coffeeAndTea" | "bar"
): PlaceType1 {
  switch (establishemnt) {
    case "restaurant": {
      return PlaceType1.restaurant;
    }
    case "coffeeAndTea": {
      return PlaceType1.cafe;
    }
    case "bar": {
      return PlaceType1.bar;
    }
  }
}

function createResponse(
  page: number,
  places: Place[],
  pageSize: number
): PlaceListing {
  if (places.length === 0) {
    return {
      results: [],
      page: 1,
      pages: 1,
      total: 0,
    };
  }

  const pageTotal = Math.ceil(places.length / pageSize);

  let normalizedPage = page;
  if (normalizedPage < 1) {
    normalizedPage = 1;
  } else if (normalizedPage > pageTotal) {
    normalizedPage = pageTotal;
  }

  const startIndex = (normalizedPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const placesSlice = places.slice(startIndex, endIndex);

  const placeListingItems = placesSlice.map((place) =>
    createPlaceListingItem(place)
  );

  return {
    results: placeListingItems,
    page: normalizedPage,
    pages: pageTotal,
    total: places.length,
  };
}

function createPlaceListingItem(place: Place): PlaceListingItem {
  let photos: string[] | undefined = undefined;

  if (place.photos) {
    photos = place.photos.map(
      (photo) => PHOTOS_ENDPOINT + encodeURIComponent(photo.photo_reference)
    );
  }

  return {
    formatted_address: place.formatted_address,
    name: place.name,
    place_id: place.place_id,
    rating: place.rating,
    user_rating_total: place.user_ratings_total,
    price_level: place.price_level,
    photos,
  };
}
