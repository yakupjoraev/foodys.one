import { env } from "~/env.mjs";
import { gmClient } from "~/server/gm-client";
import { Place, PlaceReview } from "~/server/gm-client/types";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "~/server/db";
import { removeNulls } from "~/utils/remove-nulls";
import { removeUndefined } from "~/utils/remove-undefined";
import { createPlaceUrlByGPlace } from "./place-url";
import { createGReviewHash } from "~/utils/review-hash";

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
  favorite?: boolean;
  delivery?: boolean;
  dine_in?: boolean;
  takeout?: boolean;
  curbside_pickup?: boolean;
  url?: string;
}

export interface PlaceListing {
  results: PlaceListingItem[];
  page: number;
  pages: number;
  total: number;
}

export type PlaceReviewResource = PlaceReview & { id: string; hash: string };

export type PlaceResource = Omit<Place, "reviews"> & {
  reviews: PlaceReviewResource[];
};

export function createPlaceListingItem(place: Place): PlaceListingItem {
  let photos: string[] | undefined = undefined;

  if (place.photos && place.photos.length > 0) {
    let length = place.photos.length;
    if (length > 4) {
      length = 4;
    }
    photos = [];
    for (let i = 0; i < length; i++) {
      const photo = place.photos[i];
      if (photo === undefined) {
        break;
      }
      const photoReference = photo.photo_reference;
      const photoUrl = PHOTOS_ENDPOINT + encodeURIComponent(photoReference);
      photos.push(photoUrl);
    }
  }

  return removeUndefined({
    formatted_address: place.formatted_address,
    name: place.name,
    place_id: place.place_id,
    rating: place.rating,
    user_rating_total: place.user_ratings_total,
    price_level: place.price_level,
    photos: photos,
    delivery: place.delivery,
    dine_in: place.dine_in,
    takeout: place.takeout,
    curbside_pickup: place.curbside_pickup,
  });
}

export async function applyFavoritiesToPlaceItems(
  places: PlaceListingItem[],
  db: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  userId: string
): Promise<PlaceListingItem[]> {
  const nextPlaces: PlaceListingItem[] = [];
  const ids: string[] = [];
  for (const { place_id: placeId } of places) {
    if (placeId === undefined) {
      continue;
    }
    ids.push(placeId);
  }
  if (ids.length > 0) {
    const favorities = await db.favoriteGPlace.findMany({
      where: {
        place_id: { in: ids },
        user_id: userId,
      },
      select: {
        place_id: true,
      },
    });
    const favoriteIds = favorities.map(({ place_id: placeId }) => placeId);
    for (const place of places) {
      if (
        place.place_id !== undefined &&
        favoriteIds.includes(place.place_id)
      ) {
        const nextPlace = { ...place };
        nextPlace.favorite = true;
        nextPlaces.push(nextPlace);
      } else {
        nextPlaces.push(place);
      }
    }
  }
  return nextPlaces;
}

export async function createPlaceResourceByPlaceId(
  placeId: string
): Promise<PlaceResource | null> {
  const existsPlace = await db.gPlace.findFirst({
    where: {
      place_id: placeId,
    },
    include: {
      reviews: true,
    },
  });
  if (existsPlace !== null) {
    const { created_at, updated_at, ...rest } = existsPlace;
    return removeNulls(rest);
  }

  const placeDetails = await gmClient.placeDetails({
    queries: {
      place_id: placeId,
      key: env.GOOGLE_MAPS_API_KEY,
    },
  });

  const fetchedPlace = placeDetails.result;
  if (!fetchedPlace) {
    return null;
  }

  if (fetchedPlace.place_id === undefined) {
    return null;
  }

  const reviewsWithHash: (PlaceReview & { hash: string })[] = [];
  if (fetchedPlace.reviews) {
    for (const review of fetchedPlace.reviews) {
      const { author_name, text, time } = review;
      const hash = createGReviewHash(
        author_name,
        text ?? "",
        time,
        fetchedPlace.place_id
      );
      reviewsWithHash.push({
        ...review,
        hash,
      });
    }
  }

  let createdPlace;
  try {
    createdPlace = await db.gPlace.create({
      data: {
        ...fetchedPlace,
        reviews: { create: reviewsWithHash },
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const existsPlace = await db.gPlace.findFirst({
        where: {
          place_id: placeId,
        },
        include: {
          reviews: true,
        },
      });
      if (existsPlace !== null) {
        const { created_at, updated_at, ...rest } = existsPlace;
        return removeNulls(rest);
      } else {
        return null;
      }
    } else {
      throw error;
    }
  }

  const createdReviews = await db.gPlaceReview.findMany({
    where: {
      g_place_id: createdPlace.id,
    },
  });
  {
    const { created_at, updated_at, ...rest } = createdPlace;
    return removeNulls({
      ...rest,
      reviews: createdReviews,
    });
  }
}

export async function fetchAllFavoriteGPlaces(
  userId: string
): Promise<PlaceListingItem[]> {
  const favoritePlaces = await db.favoriteGPlace.findMany({
    where: {
      user_id: userId,
    },
    select: {
      place_id: true,
    },
  });
  if (favoritePlaces.length === 0) {
    return [];
  }

  const favoriteIds = favoritePlaces.map(({ place_id }) => place_id);

  const placeListingItems: PlaceListingItem[] = [];
  for (const id of favoriteIds) {
    const place = await createPlaceResourceByPlaceId(id);

    if (place === null) {
      continue;
    }

    const listingItem = createPlaceListingItem(place);
    listingItem.favorite = true;
    const placeUrl = await createPlaceUrlByGPlace(place);
    if (placeUrl !== null) {
      listingItem.url = placeUrl;
    }
    placeListingItems.push(listingItem);
  }

  return placeListingItems;
}

export async function isGplaceFavorite(
  gPlaceId: string,
  userId: string
): Promise<boolean> {
  const favoritePlace = await db.favoriteGPlace.findFirst({
    where: {
      user_id: userId,
      place_id: gPlaceId,
    },
  });

  return favoritePlace !== null;
}
