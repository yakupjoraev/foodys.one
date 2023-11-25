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
  PlaceListingItem,
  PlaceResource,
  applyFavoritiesToPlaceItems,
  createPlaceListingItem,
  createPlaceResourceByGoogleId,
} from "../utils/g-place";
import { createPlaceUrlByGPlace } from "../utils/place-url";
import haversine from "haversine-distance";
import OpeningHours from "opening_hours";
import { encodeGooglePeriods, getForeignTime } from "../utils/encode-periods";

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
        let response = createResponse({
          page,
          pageSize: input.pageSize,
          places,
          filterRating: input.rating,
          filterPriceLevel: input.priceLevel,
          filterService: input.service,
          filterHours: input.hours,
          sortBy: input.sortBy,
          clientCoordinates: input.clientCoordinates,
        });
        response = await withFavorities(response, ctx);
        response = await withUrls(response, places);
        return response;
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
      let response = createResponse({
        page,
        pageSize: input.pageSize,
        places: searchResponse.results,
        filterRating: input.rating,
        filterPriceLevel: input.priceLevel,
        filterService: input.service,
        filterHours: input.hours,
        sortBy: input.sortBy,
        clientCoordinates: input.clientCoordinates,
      });
      response = await withFavorities(response, ctx);
      response = await withUrls(response, searchResponse.results);
      return response;
    }),

  getPlacesByGoogleId: publicProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ input }): Promise<PlaceListingItem[]> => {
      const cachedPlaces: PlaceResource[] = [];
      for (const id of input.ids) {
        const resource = await createPlaceResourceByGoogleId(id);
        if (resource) {
          cachedPlaces.push(resource);
        }
      }
      const listing = await Promise.all(
        cachedPlaces.map(async (place, i) => {
          const listingItem = createPlaceListingItem(place);
          const url = await createPlaceUrlByGPlace(place);
          if (url) {
            listingItem.url = url;
          }
          return listingItem;
        })
      );

      return listing;
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

async function withUrls(listing: PlaceListing, places: Place[]) {
  const nextListing = {
    ...listing,
  };

  const idToPlace = new Map<string, Place>();
  for (const place of places) {
    const id = place.place_id;
    if (id === undefined) {
      continue;
    }
    idToPlace.set(id, place);
  }

  nextListing.results = await Promise.all(
    listing.results.map(async (listingItem) => {
      const placeId = listingItem.place_id;
      if (placeId === undefined) {
        return listingItem;
      }
      const place = idToPlace.get(placeId);
      if (place === undefined) {
        return listingItem;
      }
      const url = await createPlaceUrlByGPlace(place);
      if (url === null) {
        return listingItem;
      }
      listingItem.url = url;

      return listingItem;
    })
  );

  return nextListing;
}

async function loadPlaceDetails(placeId: string) {
  const placeDetails = await gmClient.placeDetails({
    queries: {
      place_id: placeId,
      key: env.GOOGLE_MAPS_API_KEY,
      fields:
        "delivery,dine_in,takeout,curbside_pickup,address_components,geometry,opening_hours,utc_offset,photos",
    },
  });

  if (placeDetails.status !== "OK" || placeDetails.result === undefined) {
    return null;
  }

  const {
    delivery,
    dine_in,
    takeout,
    curbside_pickup,
    address_components,
    geometry,
    opening_hours,
    utc_offset,
    photos,
  } = placeDetails.result;

  return {
    delivery,
    dine_in,
    takeout,
    curbside_pickup,
    address_components,
    geometry,
    opening_hours,
    utc_offset,
    photos,
  };
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

function filterPlacesByHours(
  places: Iterable<Place>,
  filterHours: "anyTime" | "openNow" | "open24Hours"
): Iterable<Place> {
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

function* filterPlacesByOpenNow(places: Iterable<Place>) {
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
    if (utcOffset === undefined) {
      continue;
    }

    const foreignNow = getForeignTime(new Date(), utcOffset);

    console.log("FOREIGN", foreignNow.toString());
    console.log("PLACE NAME", place.name);

    const osmPeriods = encodeGooglePeriods(periods);
    const oh = new OpeningHours(osmPeriods);

    const openNow = oh.getState(foreignNow);
    if (openNow) {
      yield place;
    }
  }
}

function* filterPlacesBy24H(places: Iterable<Place>) {
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
  places: Place[],
  clientCoordinates: { lat: number; lng: number }
): Place[] {
  const placesWithDistance: { place: Place; distance: number }[] = places.map(
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

  const sortedPlaces: Place[] = placesWithDistance.map(({ place }) => place);

  return sortedPlaces;
}

function sortPlacesByPrice(places: Place[]): Place[] {
  const itemsWithoutPrice: Place[] = [];
  const placeAndPrice: [Place, number][] = [];

  for (const place of places) {
    const priceLevel = place.price_level;
    if (priceLevel === undefined) {
      itemsWithoutPrice.push(place);
    } else {
      placeAndPrice.push([place, priceLevel]);
    }
  }

  placeAndPrice.sort(([, a], [, b]) => a - b);

  let sortedPlaces: Place[] = placeAndPrice.map(([place]) => place);
  sortedPlaces = [...sortedPlaces, ...itemsWithoutPrice];

  return sortedPlaces;
}

function sortPlacesByRating(places: Place[]): Place[] {
  const itemsWithoutRating: Place[] = [];
  const placeAndRating: [Place, number][] = [];

  for (const place of places) {
    const rating = place.rating;
    if (rating === undefined) {
      itemsWithoutRating.push(place);
    } else {
      placeAndRating.push([place, rating]);
    }
  }

  placeAndRating.sort(([, a], [, b]) => b - a);

  let sortedPlaces: Place[] = placeAndRating.map(([place]) => place);
  sortedPlaces = [...sortedPlaces, ...itemsWithoutRating];

  return sortedPlaces;
}
