import { PrismaClient } from "@prisma/client";
import pThrottle from "p-throttle";

/**
 *
 * @param {string} placeId
 * @param {string} apiKey
 *
 * @returns {Promise<{value: string, error: null, errorMessage: null}|{value: null, error: "UNKNOWN"|"NOT_FOUND", errorMessage: string}>}
 */
async function getNextPlaceId(placeId, apiKey) {
  const placeIdEncoded = encodeURIComponent(placeId);
  const url = `https://places.googleapis.com/v1/places/${placeIdEncoded}`;

  const headers = new Headers();
  headers.set("X-Goog-Api-Key", apiKey);
  headers.set("X-Goog-FieldMask", "id");
  headers.set("Accept-Language", "en");

  const response = await fetch(url, { headers });
  const responseBody = await response.json();
  if (response.ok) {
    const id = responseBody.id;
    if (typeof id === "string") {
      return { value: id, error: null, errorMessage: null };
    } else {
      return {
        value: null,
        error: "UNKNOWN",
        errorMessage: "field required: id",
      };
    }
  }

  if (response.status === 404) {
    return { value: null, error: "NOT_FOUND", errorMessage: "not found" };
  }

  return {
    value: null,
    error: "UNKNOWN",
    errorMessage: "status: " + response.status + " " + response.statusText,
  };
}

async function* iteratePlaces() {
  const placeModel = new PrismaClient().gPlace;

  let listing = await placeModel.findMany({
    take: 4,
    where: {
      place_id: { not: null },
    },

    select: {
      id: true,
      place_id: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (listing.length === 0) {
    return;
  }

  for (const listingItem of listing) {
    if (listingItem.place_id !== null) {
      yield listingItem.place_id;
    }
  }

  const lastPlace = listing[listing.length - 1];
  if (lastPlace === undefined) {
    return;
  }

  let currentId = lastPlace.id;

  while (true) {
    listing = await placeModel.findMany({
      take: 4,
      skip: 1, // Skip the cursor
      cursor: {
        id: currentId,
      },
      where: {
        place_id: { not: null },
      },
      select: {
        id: true,
        place_id: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    if (listing.length === 0) {
      break;
    }

    for (const listingItem of listing) {
      if (listingItem.place_id !== null) {
        yield listingItem.place_id;
      }
    }

    const lastPlace = listing[listing.length - 1];
    if (lastPlace === undefined) {
      break;
    }

    currentId = lastPlace.id;
  }
}

/**
 *
 * @param {string} placeId
 * @param {string} apiKey
 * @param {PrismaClient} prismaClient
 */
async function refreshPlaceId(placeId, apiKey, prismaClient) {
  const getNextPlaceIdResult = await getNextPlaceId(placeId, apiKey);
  if (getNextPlaceIdResult.error === "NOT_FOUND") {
    console.warn("place not found: " + placeId);
    return;
  }
  if (getNextPlaceIdResult.error !== null) {
    console.error(
      "failed to udpate place id: " + getNextPlaceIdResult.errorMessage
    );
    return;
  }

  const nextPlaceId = getNextPlaceIdResult.value;

  // if (nextPlaceId === placeId) {
  //   return;
  // }

  await prismaClient.gPlace.update({
    where: {
      place_id: placeId,
    },
    data: {
      place_id: nextPlaceId,
    },
    select: { id: true },
  });

  await prismaClient.placeUrl.updateMany({
    where: {
      g_place_id: placeId,
    },
    data: {
      g_place_id: nextPlaceId,
    },
  });

  console.info(`place id updated: ${placeId} -> ${nextPlaceId}`);
}

// https://developers.google.com/maps/documentation/places/web-service/place-id#refresh-id
async function main() {
  const prismaClient = new PrismaClient();
  const apiKey = process.env.GOOGLE_PLACES_NEW_API_KEY;
  if (apiKey === undefined) {
    process.exitCode = 1;
    console.error("env var required: GOOGLE_PLACES_NEW_API_KEY");
    return;
  }

  const limit = pThrottle({ limit: 1, interval: 1000 });

  const refreshPlaceIdThrottled = limit(refreshPlaceId);

  for await (const placeId of iteratePlaces()) {
    await refreshPlaceIdThrottled(placeId, apiKey, prismaClient);
  }
}

main().catch((error) => {
  process.exitCode = 1;
  console.error(error);
});
