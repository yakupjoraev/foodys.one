import { type PlaceResource } from "~/server/api/utils/g-place";
import {
  type GApiPlaceOpeningHoursPeriod,
  type GApiAddressComponent,
  type GApiGeometry,
} from "~/server/gm-client/types";
import {
  type DayPeriod,
  parseWeekPeriod,
  splitWeekPeriod,
} from "./g-periods-parser";
import {
  type Restaurant,
  type PostalAddress,
  type GeoCoordinates,
  type Review,
  type WithContext,
} from "schema-dts";

const DAYS: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const ORGANIZATION_NAME = "Foodys";

export function createRestaurantJsonLd(
  place: PlaceResource,
  placeUrl: string
): WithContext<Restaurant> {
  const restaurant: WithContext<Restaurant> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
  };

  if (place.name) {
    restaurant.name = place.name;
  }

  if (place.address_components) {
    const postalAddress = createPostalAddress(place.address_components);
    if (postalAddress !== null) {
      restaurant.address = postalAddress;
    }
  }

  if (place.rating !== undefined && place.user_ratings_total !== undefined) {
    restaurant.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: place.rating,
      reviewCount: place.user_ratings_total,
    };
  }

  if (place.opening_hours?.periods !== undefined) {
    const openingHours = createOpeningHours(place.opening_hours.periods);
    if (openingHours !== null) {
      restaurant.openingHours = openingHours;
    }
  }

  if (place.price_level) {
    const priceRange = createPriceRange(place.price_level);
    if (priceRange !== null) {
      restaurant.priceRange = priceRange;
    }
  }

  if (place.website) {
    restaurant.url = place.website;
  }

  if (place.geometry) {
    restaurant.geo = createGeoCoordinates(place.geometry);
  }

  const review = createReview(place, placeUrl);
  if (review !== null) {
    restaurant.review = review;
  }

  return restaurant;
}

function createReview(place: PlaceResource, placeUrl: string): Review | null {
  if (place.editorial_summary?.overview === undefined) {
    return null;
  }

  const review: Review = {
    "@type": "Review",
    author: {
      "@type": "Organization",
      name: ORGANIZATION_NAME,
    },
    description: place.editorial_summary.overview,
    inLanguage: place.editorial_summary.language,
    url: placeUrl,
    datePublished: place.created_at,
  };

  if (place.rating !== undefined) {
    review.reviewRating = {
      "@type": "Rating",
      ratingValue: place.rating,
    };
  }

  return review;
}

function createGeoCoordinates(geomatry: GApiGeometry): GeoCoordinates {
  const { lat, lng } = geomatry.location;

  return {
    "@type": "GeoCoordinates",
    latitude: lat,
    longitude: lng,
  };
}

function createPriceRange(priceLevel: number): string | null {
  switch (priceLevel) {
    case 0: {
      return null;
    }
    case 1: {
      return "$";
    }
    case 2: {
      return "$$";
    }
    case 3: {
      return "$$$";
    }
    case 4: {
      return "$$$$";
    }
    default: {
      return null;
    }
  }
}

function createPostalAddress(
  addressComponents: GApiAddressComponent[]
): PostalAddress | null {
  let addressCountry: string | undefined = undefined; //country where restaurant is located
  let addressLocality: string | undefined = undefined; //city where restaurant is located
  let addressRegion: string | undefined = undefined; //region where restaurant is located
  let streetAddress: string | undefined = undefined; //street where restaurant is located
  let postalCode: string | undefined = undefined;

  let streetNumber: string | undefined = undefined;

  for (const component of addressComponents) {
    if (component.types.includes("country")) {
      addressCountry = component.long_name;
    } else if (component.types.includes("locality")) {
      addressLocality = component.long_name;
    } else if (component.types.includes("administrative_area_level_1")) {
      addressRegion = component.long_name;
    } else if (component.types.includes("route")) {
      streetAddress = component.long_name;
    } else if (component.types.includes("postal_code")) {
      postalCode = component.long_name;
    } else if (component.types.includes("street_number")) {
      streetNumber = component.long_name;
    }
  }

  if (streetNumber !== undefined && streetAddress !== undefined) {
    streetAddress = streetNumber + " " + streetAddress;
  }

  if (addressCountry !== undefined) {
    return {
      "@type": "PostalAddress",
      addressCountry, // country where restaurant is located
      addressLocality, // city where restaurant is located
      addressRegion, // region where restaurant is located
      streetAddress, // street where restaurant is located
      postalCode,
    };
  }

  return null;
}

function createOpeningHours(
  periods: GApiPlaceOpeningHoursPeriod[]
): string[] | null {
  if (periods.length === 1) {
    const firstPeriod = periods[0];
    if (firstPeriod === undefined) {
      throw new Error("failed to pick first period");
    }
    if (
      firstPeriod.close === undefined &&
      firstPeriod.open.day === 0 &&
      firstPeriod.open.time === "0000"
    ) {
      return ["Mo-Su"]; // 24/7
    }
  }

  const openingHoursLd: string[] = [];
  for (const period of periods) {
    const parsingResult = parseWeekPeriod(period);
    if (parsingResult.value === null) {
      return null;
    }
    const dayPeriods = splitWeekPeriod(parsingResult.value);
    for (const dayPeriod of dayPeriods) {
      const dayPeriodStr = formatDayPeriod(dayPeriod);
      openingHoursLd.push(dayPeriodStr);
    }
  }

  return openingHoursLd;
}

function formatDayPeriod(dayPeriod: DayPeriod): string {
  const day = DAYS[dayPeriod.day];
  if (day === undefined) {
    throw new Error("unexpected day index");
  }

  const openTime = formatTime(dayPeriod.openHours, dayPeriod.openMinutes);
  const closeTime = formatTime(dayPeriod.closeHours, dayPeriod.closeMinutes);
  const period = day + " " + openTime + "-" + closeTime;

  return period;
}

function formatTime(hours: number, minutes: number) {
  const time = formatHours(hours) + ":" + formatMinutes(minutes);
  return time;
}

function formatHours(hours: number) {
  return hours < 10 ? "0" + hours.toString() : hours.toString();
}

function formatMinutes(minutes: number) {
  return minutes < 10 ? "0" + minutes.toString() : minutes.toString();
}
