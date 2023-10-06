import { Establishment, Prisma } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { gmClient } from "~/server/gm-client";
import { Place } from "~/server/gm-client/types";

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
        rating: z.optional(
          z
            .array(
              z.union([
                z.literal(1),
                z.literal(2),
                z.literal(3),
                z.literal(4),
                z.literal(5),
              ])
            )
            .max(5)
        ),
        priceLevel: z.optional(
          z
            .array(
              z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
            )
            .max(4)
        ),
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
        const places = cachedResponse.places as Place[];
        return createResponse({
          page,
          pageSize: PAGE_SIZE,
          places,
          filterRating: input.rating,
          filterPriceLevel: input.priceLevel,
        });
      }

      const searchResponse = await gmClient.textSearch({
        queries: {
          query: input.query,
          location: PARIS_LOCATION,
          type: getEstablishmentGP(input.establishment),
          key: env.GOOGLE_MAPS_API_KEY,
        },
      });

      if (!searchResponse.results) {
        return {
          results: [],
          page: 1,
          pages: 1,
          total: 0,
        };
      }

      await db.textSearch.create({
        data: {
          query: normalizedQuery,
          places: searchResponse.results,
          establishment: getEstablishmentDB(input.establishment),
        },
      });

      return createResponse({
        page,
        pageSize: PAGE_SIZE,
        places: searchResponse.results,
        filterRating: input.rating,
        filterPriceLevel: input.priceLevel,
      });
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
) {
  switch (establishemnt) {
    case "restaurant": {
      return "restaurant";
    }
    case "coffeeAndTea": {
      return "cafe";
    }
    case "bar": {
      return "bar";
    }
  }
}

interface CreateResponseOpts {
  page: number;
  places: Place[];
  filterRating: (1 | 2 | 3 | 4 | 5)[] | undefined;
  filterPriceLevel: (1 | 2 | 3 | 4)[] | undefined;
  pageSize: number;
}

function createResponse(opts: CreateResponseOpts): PlaceListing {
  if (opts.places.length === 0) {
    return {
      results: [],
      page: 1,
      pages: 1,
      total: 0,
    };
  }

  let filteredPlaces: Iterable<Place> = opts.places;
  if (opts.filterRating) {
    filteredPlaces = filterPlacesByRating(filteredPlaces, opts.filterRating);
  }
  if (opts.filterPriceLevel) {
    filteredPlaces = filterPlacesByPriceLevel(
      filteredPlaces,
      opts.filterPriceLevel
    );
  }
  const places = Array.from(filteredPlaces);

  const pageTotal = Math.ceil(places.length / opts.pageSize);

  let normalizedPage = opts.page;
  if (normalizedPage < 1) {
    normalizedPage = 1;
  } else if (normalizedPage > pageTotal) {
    normalizedPage = pageTotal;
  }

  const startIndex = (normalizedPage - 1) * opts.pageSize;
  const endIndex = startIndex + opts.pageSize;
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
  const photos: string[] = [];

  if (place.photos) {
    for (const photo of place.photos) {
      const photoReference = photo.photo_reference;
      if (photoReference === undefined) {
        continue;
      }
      const photoUrl = PHOTOS_ENDPOINT + encodeURIComponent(photoReference);
      photos.push(photoUrl);
    }
  }
  return {
    formatted_address: place.formatted_address,
    name: place.name,
    place_id: place.place_id,
    rating: place.rating,
    user_rating_total: place.user_ratings_total,
    price_level: place.price_level,
    photos: photos.length ? photos : undefined,
  };
}

function* filterPlacesByRating(
  places: Iterable<Place>,
  filterRating: number[]
) {
  if (filterRating.length === 0) {
    yield* places;
  }
  for (const place of places) {
    if (place.rating === undefined) {
      continue;
    }
    const ratingInt = Math.floor(place.rating);
    if (filterRating.includes(ratingInt)) {
      yield place;
    }
  }
}

function* filterPlacesByPriceLevel(
  places: Iterable<Place>,
  filterPriceLevel: number[]
) {
  if (filterPriceLevel.length === 0) {
    yield* places;
  }
  for (const place of places) {
    if (place.price_level === undefined) {
      continue;
    }
    if (filterPriceLevel.includes(place.price_level)) {
      yield place;
    }
  }
}
