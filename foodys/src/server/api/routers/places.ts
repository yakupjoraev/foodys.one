import { Establishment, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Session } from "next-auth";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { gmClient } from "~/server/gm-client";
import { Place } from "~/server/gm-client/types";
import {
  PlaceListing,
  applyFavoritiesToPlaceItems,
  createPlaceListingItem,
} from "../utils/g-place";

const PARIS_LOCATION = "48.864716,2.349014";

const DEFAULT_PAGE_SIZE = 10;

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
        service: z.optional(
          z
            .array(
              z.union([
                z.literal("delivery"),
                z.literal("dine_in"),
                z.literal("takeout"),
                z.literal("curbside_pickup"),
              ])
            )
            .max(4)
        ),
        page: z.optional(z.number().min(1)),
        pageSize: z
          .union([z.literal(10), z.literal(20), z.literal(30)])
          .default(DEFAULT_PAGE_SIZE),
      })
    )
    .query(async ({ input, ctx }): Promise<PlaceListing> => {
      const page = input.page ?? 1;

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
        return withFavorities(
          createResponse({
            page,
            pageSize: input.pageSize,
            places,
            filterRating: input.rating,
            filterPriceLevel: input.priceLevel,
            filterService: input.service,
          }),
          ctx
        );
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

      for (const place of searchResponse.results) {
        if (place.place_id) {
          const placeDetails = await loadPlaceDetails(place.place_id);
          if (placeDetails) {
            Object.assign(place, placeDetails);
          }
        }
      }

      await db.textSearch.create({
        data: {
          query: normalizedQuery,
          places: searchResponse.results,
          establishment: getEstablishmentDB(input.establishment),
        },
      });

      return withFavorities(
        createResponse({
          page,
          pageSize: input.pageSize,
          places: searchResponse.results,
          filterRating: input.rating,
          filterPriceLevel: input.priceLevel,
          filterService: input.service,
        }),
        ctx
      );
    }),
});

async function withFavorities(
  listing: PlaceListing,
  ctx: {
    session: Session | null;
    db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  }
): Promise<PlaceListing> {
  if (ctx.session === null) {
    return listing;
  }

  const nextListing = {
    ...listing,
  };

  nextListing.results = await applyFavoritiesToPlaceItems(
    listing.results,
    ctx.db,
    ctx.session.user.id
  );

  return nextListing;
}

async function loadPlaceDetails(placeId: string) {
  const placeDetails = await gmClient.placeDetails({
    queries: {
      place_id: placeId,
      key: env.GOOGLE_MAPS_API_KEY,
      fields: "delivery,dine_in,takeout,curbside_pickup",
    },
  });

  if (placeDetails.status !== "OK" || placeDetails.result === undefined) {
    return null;
  }

  const { delivery, dine_in, takeout, curbside_pickup } = placeDetails.result;

  return { delivery, dine_in, takeout, curbside_pickup };
}

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
  filterService?: ("delivery" | "dine_in" | "takeout" | "curbside_pickup")[];
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
  if (opts.filterService) {
    filteredPlaces = filterPlacesByService(filteredPlaces, opts.filterService);
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

function* filterPlacesByService(
  places: Iterable<Place>,
  filterService: ("delivery" | "dine_in" | "takeout" | "curbside_pickup")[]
) {
  if (filterService.length === 0) {
    yield* places;
  }

  iteratePlaces: for (const place of places) {
    for (const key of filterService) {
      if (!place[key]) {
        continue iteratePlaces;
      }
    }
    yield place;
  }
}
