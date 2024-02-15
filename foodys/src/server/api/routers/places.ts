import {
  Establishment,
  type TextSearch,
  type GPlace,
  type Prisma,
  type PrismaClient,
  type Lang,
} from "@prisma/client";
import { type DefaultArgs } from "@prisma/client/runtime/library";
import { type Session } from "next-auth";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { gmClient } from "~/server/gm-client";
import { type GApiPlace } from "~/server/gm-client/types";
import {
  type PlaceListing,
  type PlaceListingItem,
  applyFavoritiesToPlaceItems,
  createGPlaceByExternalId,
  createPlaceListingItem,
} from "../utils/g-place";
import { createPlaceUrlByGPlace } from "../utils/place-url";
import haversine from "haversine-distance";
import OpeningHours from "opening_hours";
import { encodeGooglePeriods, getForeignTime } from "../utils/encode-periods";
import { removeNulls } from "~/utils/remove-nulls";

const PARIS_LOCATION = "48.864716,2.349014";

const DEFAULT_PAGE_SIZE = 10;

export const placesRouter = createTRPCRouter({
  getPlaces: publicProcedure
    .input(
      z.object({
        lang: z.union([z.literal("FR"), z.literal("EN")]),
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
        sortBy: z.optional(
          z.union([
            z.literal("relevance"),
            z.literal("distance"),
            z.literal("price"),
            z.literal("rating"),
          ])
        ),
        clientCoordinates: z.optional(
          z.object({
            lat: z.number(),
            lng: z.number(),
          })
        ),
        hours: z.optional(
          z.union([
            z.literal("anyTime"),
            z.literal("openNow"),
            z.literal("open24Hours"),
          ])
        ),
      })
    )
    .query(async ({ input, ctx }): Promise<PlaceListing> => {
      ctx.session;

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

      let cachedResponse: TextSearch | null = await db.textSearch.findFirst({
        where: {
          query: normalizedQuery,
          establishment: getEstablishmentDB(input.establishment),
        },
      });

      if (cachedResponse === null) {
        const searchResponse = await gmClient.textSearch({
          queries: {
            query: input.query,
            location: PARIS_LOCATION,
            type: getEstablishmentGP(input.establishment),
            region: "fr",
            key: env.GOOGLE_MAPS_API_KEY,
          },
        });

        if (searchResponse.results) {
          cachedResponse = await db.textSearch.create({
            data: {
              query: normalizedQuery,
              places: searchResponse.results,
              establishment: getEstablishmentDB(input.establishment),
            },
          });
        }
      }

      if (cachedResponse === null) {
        return {
          results: [],
          page: 1,
          pages: 1,
          total: 0,
        };
      }

      const gPlaces = await createGPlacesByTextSearch(
        cachedResponse,
        input.lang
      );

      let gPlacesEn: GPlace[];
      if (input.lang === "EN") {
        gPlacesEn = gPlaces;
      } else {
        gPlacesEn = await createGPlacesByTextSearch(cachedResponse, "EN");
      }

      let response = createResponse({
        page,
        pageSize: input.pageSize,
        places: gPlaces,
        filterRating: input.rating,
        filterPriceLevel: input.priceLevel,
        filterService: input.service,
        filterHours: input.hours,
        sortBy: input.sortBy,
        clientCoordinates: input.clientCoordinates,
      });
      response = await withFavorities(response, ctx);
      response = await withUrls(response, gPlacesEn);

      return response;
    }),

  getPlacesByGoogleId: publicProcedure
    .input(
      z.object({
        lang: z.union([z.literal("FR"), z.literal("EN")]),
        ids: z.array(z.string()),
      })
    )
    .query(async ({ input }): Promise<PlaceListingItem[]> => {
      const gPlaces: GPlace[] = await createGPlacesByExternalIdBatch(
        input.ids,
        input.lang
      );
      let placesEn: GPlace[];
      if (input.lang === "EN") {
        placesEn = gPlaces;
      } else {
        placesEn = await createGPlacesByExternalIdBatch(input.ids, "EN");
      }

      const listing = gPlaces.map((place) => createPlaceListingItem(place));

      const externalIdToUrl = new Map<string, string>();
      await Promise.all(
        placesEn.map(async (placeEn) => {
          const url = await createPlaceUrlByGPlace(placeEn);
          if (url !== null && placeEn.place_id) {
            externalIdToUrl.set(placeEn.place_id, url);
          }
        })
      );

      listing.forEach((listingItem) => {
        if (!listingItem.place_id) {
          return;
        }
        const url = externalIdToUrl.get(listingItem.place_id);
        if (url !== undefined) {
          listingItem.url = url;
        }
      });

      return listing;
    }),
});

async function createGPlacesByTextSearch(textSearch: TextSearch, lang: Lang) {
  const gApiPlaces = textSearch.places as GApiPlace[];

  const externalIds: string[] = [];
  for (const gApiPlace of gApiPlaces) {
    if (gApiPlace.place_id !== undefined) {
      externalIds.push(gApiPlace.place_id);
    }
  }

  const gPlaces: GPlace[] = await createGPlacesByExternalIdBatch(
    externalIds,
    lang
  );

  return gPlaces;
}

async function createGPlacesByExternalIdBatch(
  externalIds: string[],
  lang: Lang
) {
  const gPlaces: GPlace[] = [];
  const gPlacesRaw: (GPlace | null)[] = await Promise.all(
    externalIds.map((externalId) => createGPlaceByExternalId(externalId, lang))
  );
  for (const gPlace of gPlacesRaw) {
    if (gPlace !== null) {
      gPlaces.push(gPlace);
    }
  }

  return gPlaces;
}

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

async function withUrls(listing: PlaceListing, placesEn: GPlace[]) {
  const nextListing = {
    ...listing,
  };

  const idToPlaceEn = new Map<string, GPlace>();
  for (const place of placesEn) {
    const id = place.place_id;
    if (id === null) {
      continue;
    }
    idToPlaceEn.set(id, place);
  }

  nextListing.results = await Promise.all(
    listing.results.map(async (listingItem) => {
      const placeId = listingItem.place_id;
      if (placeId === undefined) {
        return listingItem;
      }
      const placeEn = idToPlaceEn.get(placeId);
      if (placeEn === undefined) {
        return listingItem;
      }

      const url = await createPlaceUrlByGPlace(placeEn);
      if (url === null) {
        return listingItem;
      }
      listingItem.url = url;

      return listingItem;
    })
  );

  return nextListing;
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
  places: GPlace[];
  filterRating: (1 | 2 | 3 | 4 | 5)[] | undefined;
  filterPriceLevel: (1 | 2 | 3 | 4)[] | undefined;
  filterService?: ("delivery" | "dine_in" | "takeout" | "curbside_pickup")[];
  filterHours?: "anyTime" | "openNow" | "open24Hours";
  pageSize: number;
  sortBy?: "relevance" | "distance" | "price" | "rating";
  clientCoordinates?: { lat: number; lng: number };
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

  let filteredPlaces: Iterable<GPlace> = opts.places;
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
  if (opts.filterHours) {
    filteredPlaces = filterPlacesByHours(filteredPlaces, opts.filterHours);
  }
  let places = Array.from(filteredPlaces);
  if (opts.sortBy === "distance" && opts.clientCoordinates) {
    places = sortPlacesByRating(places);
    places = sortPlacesByDistance(places, opts.clientCoordinates);
  } else if (opts.sortBy === "price") {
    places = sortPlacesByRating(places);
    places = sortPlacesByPrice(places);
  } else if (opts.sortBy === "rating") {
    places = sortPlacesByRating(places);
  }

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
  places: Iterable<GPlace>,
  filterRating: number[]
) {
  if (filterRating.length === 0) {
    yield* places;
  }
  for (const place of places) {
    if (place.rating === null) {
      continue;
    }
    const ratingInt = Math.floor(place.rating);
    if (filterRating.includes(ratingInt)) {
      yield place;
    }
  }
}

function* filterPlacesByPriceLevel(
  places: Iterable<GPlace>,
  filterPriceLevel: number[]
) {
  if (filterPriceLevel.length === 0) {
    yield* places;
  }
  for (const place of places) {
    if (place.price_level === null) {
      continue;
    }
    if (filterPriceLevel.includes(place.price_level)) {
      yield place;
    }
  }
}

function* filterPlacesByService(
  places: Iterable<GPlace>,
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

function filterPlacesByHours(
  places: Iterable<GPlace>,
  filterHours: "anyTime" | "openNow" | "open24Hours"
): Iterable<GPlace> {
  console.log("FILTER BY: " + filterHours);
  switch (filterHours) {
    case "anyTime": {
      return places;
    }
    case "openNow": {
      return filterPlacesByOpenNow(places);
    }
    case "open24Hours": {
      return filterPlacesBy24H(places);
    }
  }
}

function* filterPlacesByOpenNow(places: Iterable<GPlace>) {
  for (const place of places) {
    const periods = place.opening_hours?.periods;
    if (!periods) {
      continue;
    }
    let open24H = false;
    if (periods.length === 1) {
      const firstPeriod = periods[0];
      if (!firstPeriod) {
        continue;
      }
      open24H =
        firstPeriod.open.day === 0 &&
        !firstPeriod.close &&
        firstPeriod.open.time === "0000";
    }
    if (open24H) {
      yield place;
      continue;
    }

    const utcOffset = place.utc_offset;
    if (utcOffset === null) {
      continue;
    }

    const foreignNow = getForeignTime(new Date(), utcOffset);

    const osmPeriods = encodeGooglePeriods(removeNulls(periods));
    const oh = new OpeningHours(osmPeriods);

    const openNow = oh.getState(foreignNow);
    if (openNow) {
      yield place;
    }
  }
}

function* filterPlacesBy24H(places: Iterable<GPlace>) {
  for (const place of places) {
    const periods = place.opening_hours?.periods;
    if (!periods) {
      continue;
    }
    let open24H = false;
    if (periods.length === 1) {
      const firstPeriod = periods[0];
      if (!firstPeriod) {
        continue;
      }
      open24H =
        firstPeriod.open.day === 0 &&
        !firstPeriod.close &&
        firstPeriod.open.time === "0000";
    }
    if (open24H) {
      yield place;
    }
  }
}

function sortPlacesByDistance(
  places: GPlace[],
  clientCoordinates: { lat: number; lng: number }
): GPlace[] {
  const placesWithDistance: { place: GPlace; distance: number }[] = places.map(
    (place) => {
      const placeCoordinates = place.geometry?.location;
      if (!placeCoordinates) {
        return { place, distance: Infinity };
      }
      const distance = haversine(clientCoordinates, placeCoordinates);
      return { place, distance };
    }
  );

  placesWithDistance.sort(({ distance: a }, { distance: b }) => a - b);

  const sortedPlaces: GPlace[] = placesWithDistance.map(({ place }) => place);

  return sortedPlaces;
}

function sortPlacesByPrice(places: GPlace[]): GPlace[] {
  const itemsWithoutPrice: GPlace[] = [];
  const placeAndPrice: [GPlace, number][] = [];

  for (const place of places) {
    const priceLevel = place.price_level;
    if (priceLevel === null) {
      itemsWithoutPrice.push(place);
    } else {
      placeAndPrice.push([place, priceLevel]);
    }
  }

  placeAndPrice.sort(([, a], [, b]) => a - b);

  let sortedPlaces: GPlace[] = placeAndPrice.map(([place]) => place);
  sortedPlaces = [...sortedPlaces, ...itemsWithoutPrice];

  return sortedPlaces;
}

function sortPlacesByRating(places: GPlace[]): GPlace[] {
  const itemsWithoutRating: GPlace[] = [];
  const placeAndRating: [GPlace, number][] = [];

  for (const place of places) {
    const rating = place.rating;
    if (rating === null) {
      itemsWithoutRating.push(place);
    } else {
      placeAndRating.push([place, rating]);
    }
  }

  placeAndRating.sort(([, a], [, b]) => b - a);

  let sortedPlaces: GPlace[] = placeAndRating.map(([place]) => place);
  sortedPlaces = [...sortedPlaces, ...itemsWithoutRating];

  return sortedPlaces;
}
