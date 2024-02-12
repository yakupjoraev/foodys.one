import { env } from "~/env.mjs";
import { gmClient } from "~/server/gm-client";
import {
  GApiPlace,
  GApiPlaceOpeningHoursPeriod,
  GApiPlaceReview,
} from "~/server/gm-client/types";
import { GPlaceReview, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { db } from "~/server/db";
import { removeNulls } from "~/utils/remove-nulls";
import { removeUndefined } from "~/utils/remove-undefined";
import { createPlaceUrlByGPlace } from "./place-url";
import { createGReviewHash } from "~/utils/review-hash";
import { PlaceReviewResource } from "./g-place-review";

const PREVIEW_ENDPOINT = "https://foodys.freeblock.site/place-photos";
const PREVIEW_PRESETS: { preset: string; scale: number }[] = [
  { preset: "cover_168x168", scale: 1 },
  { preset: "cover_336x336", scale: 2 },
  { preset: "cover_672x672", scale: 4 },
];
const DEFAULT_PREVIEW_PRESET = "cover_168x168";

export interface PlaceListingItem {
  formatted_address?: string;
  name?: string;
  place_id?: string;
  rating?: number;
  user_rating_total?: number;
  price_level?: number;
  photos?: { src: string; srcSet?: string }[];
  favorite?: boolean;
  delivery?: boolean;
  dine_in?: boolean;
  takeout?: boolean;
  curbside_pickup?: boolean;
  url?: string;
  location?: { lat: number; lng: number };
  opening_periods?: GApiPlaceOpeningHoursPeriod[];
  utc_offset?: number;
  has_tracked_phone?: boolean;
}

export interface PlaceListing {
  results: PlaceListingItem[];
  page: number;
  pages: number;
  total: number;
}

export type PlaceResource = Omit<GApiPlace, "reviews"> & {
  id: string;
  reviews: PlaceReviewResource[];
};

export function createPlaceListingItem(
  place: Omit<GApiPlace, "reviews">
): PlaceListingItem {
  let photos: { src: string; srcSet?: string }[] | undefined = undefined;

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
      const preview = createPlacePreviewByPhotoReference(photoReference);
      photos.push(preview);
    }
  }

  let hasTrackedPhone = false;
  if (place.international_phone_number && place.address_components) {
    const countryComponent = place.address_components.find((ac) =>
      ac.types.includes("country")
    );
    if (
      countryComponent !== undefined &&
      countryComponent.short_name === "FR"
    ) {
      hasTrackedPhone = true;
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
    location: place.geometry?.location,
    opening_periods: place.opening_hours?.periods,
    utc_offset: place.utc_offset,
    has_tracked_phone: hasTrackedPhone,
  });
}

export function createPlacePreviewByPhotoReference(
  googlePhotoReference: string
) {
  const photoReferencePath = encodeURIComponent(googlePhotoReference);
  const photoUrl =
    PREVIEW_ENDPOINT + "/" + DEFAULT_PREVIEW_PRESET + "/" + photoReferencePath;
  const srcSet = PREVIEW_PRESETS.map(
    ({ preset, scale }) =>
      PREVIEW_ENDPOINT +
      "/" +
      preset +
      "/" +
      photoReferencePath +
      " " +
      scale.toString() +
      "x"
  ).join(", ");
  return { src: photoUrl, srcSet };
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

export async function createPlaceResourceByGoogleId(
  placeId: string
): Promise<PlaceResource | null> {
  const existsPlace = await db.gPlace.findFirst({
    where: {
      place_id: placeId,
    },
  });
  if (existsPlace !== null) {
    const { created_at, updated_at, ...rest } = existsPlace;
    return { ...removeNulls(rest), reviews: [] };
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

  const reviewModels: Omit<GPlaceReview, "id" | "g_place_id">[] = [];
  if (fetchedPlace.reviews) {
    for (const review of fetchedPlace.reviews) {
      const { author_name, text, time } = review;
      const hash = createGReviewHash(
        author_name,
        text ?? "",
        time,
        fetchedPlace.place_id
      );
      reviewModels.push({
        author_name: review.author_name,
        rating: review.rating,
        time: review.time,
        author_url: review.author_url ?? null,
        language: review.language ?? null,
        original_language: review.original_language ?? null,
        profile_photo_url: review.profile_photo_url ?? null,
        text: review.text ?? null,
        translated: review.translated ?? null,
        local_author_id: null,
        hash,
      });
    }
  }

  let createdPlace;
  try {
    createdPlace = await db.gPlace.create({
      data: {
        ...fetchedPlace,
        reviews: { create: reviewModels },
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

  {
    const { created_at, updated_at, ...rest } = createdPlace;
    return removeNulls({
      ...rest,
      reviews: [],
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
    const place = await createPlaceResourceByGoogleId(id);

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

export async function isGPlaceFavorite(
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
