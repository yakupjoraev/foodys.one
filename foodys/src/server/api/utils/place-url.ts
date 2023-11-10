import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { db } from "~/server/db";
import slugify from "slugify";
import { type AddressComponent, type Place } from "~/server/gm-client/types";

export async function createPlaceUrlByGPlace(
  place: Omit<Place, "reviews">
): Promise<string | null> {
  const placeId: string | undefined = place.place_id;
  if (placeId === undefined) {
    return null;
  }
  const name: string = place.name ?? "unknown";
  let country = "unknown";
  let city = "unknown";
  if (place.address_components) {
    country =
      getCountryFromAddressComponents(place.address_components) ?? "unknown";
    city = getCityFromAddressComponents(place.address_components) ?? "unknown";
  }

  return createPlaceUrl(country, city, name, placeId);
}

export async function createPlaceUrl(
  country: string,
  city: string,
  placeName: string,
  gPlaceId: string
): Promise<string> {
  const baseUrl =
    "/" +
    slugify(country, { lower: true }) +
    "/" +
    slugify(city, { lower: true }) +
    "/" +
    slugify(placeName, { lower: true });
  let attempt = 1;
  let uniqueUrl = baseUrl;
  while (true) {
    const urlRecord = await db.placeUrl.findFirst({
      where: {
        g_place_id: gPlaceId,
      },
    });
    if (urlRecord) {
      return urlRecord.url;
    }
    let newUrlRecord;
    try {
      newUrlRecord = await db.placeUrl.create({
        data: {
          g_place_id: gPlaceId,
          url: uniqueUrl,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        attempt++;
        uniqueUrl = baseUrl + "-" + attempt.toString();
        continue;
      }
      throw error;
    }
    return newUrlRecord.url;
  }
}

function getCountryFromAddressComponents(
  addressComponents: AddressComponent[]
) {
  for (const addressComponent of addressComponents) {
    if (addressComponent.types.includes("country")) {
      return addressComponent.long_name;
    }
  }
  return null;
}

function getCityFromAddressComponents(addressComponents: AddressComponent[]) {
  for (const addressComponent of addressComponents) {
    if (addressComponent.types.includes("locality")) {
      return addressComponent.long_name;
    }
  }
  return null;
}
