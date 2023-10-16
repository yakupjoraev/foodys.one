import { env } from "~/env.mjs";
import { gmClient } from "~/server/gm-client";
import { Place } from "~/server/gm-client/types";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "~/server/db";
import { removeNulls } from "~/utils/remove-nulls";
import { removeUndefined } from "~/utils/remove-undefined";

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
}

export interface PlaceListing {
  results: PlaceListingItem[];
  page: number;
  pages: number;
  total: number;
}

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

export async function fetchGPlaceByPlaceId(
  placeId: string
): Promise<Place | null> {
  const existsPlace = await db.gPlace.findFirst({
    where: {
      place_id: placeId,
    },
  });

  if (existsPlace !== null) {
    const { id, created_at, updated_at, ...rest } = existsPlace;
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

  try {
    await db.gPlace.create({
      data: fetchedPlace,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return fetchedPlace;
    } else {
      throw error;
    }
  }

  return fetchedPlace;
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
    const place = await fetchGPlaceByPlaceId(id);
    if (place !== null) {
      const listingItem = createPlaceListingItem(place);
      listingItem.favorite = true;
      placeListingItems.push(listingItem);
    }
  }

  return placeListingItems;
}
