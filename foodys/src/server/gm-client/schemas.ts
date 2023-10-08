import { z } from "zod";

export const placesSearchStatusSchema = z.union([
  z.literal("OK"),
  z.literal("ZERO_RESULTS"),
  z.literal("INVALID_REQUEST"),
  z.literal("OVER_QUERY_LIMIT"),
  z.literal("REQUEST_DENIED"),
  z.literal("UNKNOWN_ERROR"),
]);

export const placesDetailsStatusSchema = z.union([
  z.literal("OK"),
  z.literal("ZERO_RESULTS"),
  z.literal("NOT_FOUND"),
  z.literal("INVALID_REQUEST"),
  z.literal("OVER_QUERY_LIMIT"),
  z.literal("REQUEST_DENIED"),
  z.literal("UNKNOWN_ERROR"),
]);

export const addressComponentSchema = z.object({
  long_name: z.string(),
  short_name: z.string(),
  types: z.array(z.string()),
});

export const placeEditorialSummarySchema = z.object({
  language: z.string().optional(),
  overview: z.string().optional(),
});

export const latLngLiteralSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

export const boundsSchema = z.object({
  northeast: latLngLiteralSchema,
  southwest: latLngLiteralSchema,
});

export const placeSpecialDaySchema = z.object({
  date: z.string().optional(),
  exceptional_hours: z.boolean().optional(),
});

export const placeOpeningHoursPeriodDetailSchema = z.object({
  day: z.number(),
  time: z.string(),
  date: z.string().optional(),
  truncated: z.boolean().optional(),
});

export const placePhotoSchema = z.object({
  height: z.number(),
  html_attributions: z.array(z.string()),
  photo_reference: z.string(),
  width: z.number(),
});

export const plusCodeSchema = z.object({
  global_code: z.string(),
  compound_code: z.string().optional(),
});

export const placeReviewSchema = z.object({
  author_name: z.string(),
  rating: z.number(),
  relative_time_description: z.string(),
  time: z.number(),
  author_url: z.string().optional(),
  language: z.string().optional(),
  original_language: z.string().optional(),
  profile_photo_url: z.string().optional(),
  text: z.string().optional(),
  translated: z.boolean().optional(),
});

export const geometrySchema = z.object({
  location: latLngLiteralSchema,
  viewport: boundsSchema,
});

export const placeOpeningHoursPeriodSchema = z.object({
  open: placeOpeningHoursPeriodDetailSchema,
  close: placeOpeningHoursPeriodDetailSchema.optional(),
});

export const placeOpeningHoursSchema = z.object({
  open_now: z.boolean().optional(),
  periods: z.array(placeOpeningHoursPeriodSchema).optional(),
  special_days: z.array(placeSpecialDaySchema).optional(),
  type: z.string().optional(),
  weekday_text: z.array(z.string()).optional(),
});

export const placeSchema = z.object({
  address_components: z.array(addressComponentSchema).optional(),
  adr_address: z.string().optional(),
  business_status: z.string().optional(),
  curbside_pickup: z.boolean().optional(),
  current_opening_hours: placeOpeningHoursSchema.optional(),
  delivery: z.boolean().optional(),
  dine_in: z.boolean().optional(),
  editorial_summary: placeEditorialSummarySchema.optional(),
  formatted_address: z.string().optional(),
  formatted_phone_number: z.string().optional(),
  geometry: geometrySchema.optional(),
  icon: z.string().optional(),
  icon_background_color: z.string().optional(),
  icon_mask_base_uri: z.string().optional(),
  international_phone_number: z.string().optional(),
  name: z.string().optional(),
  opening_hours: placeOpeningHoursSchema.optional(),
  photos: z.array(placePhotoSchema).optional(),
  place_id: z.string().optional(),
  plus_code: plusCodeSchema.optional(),
  price_level: z.number().optional(),
  rating: z.number().optional(),
  reservable: z.boolean().optional(),
  reviews: z.array(placeReviewSchema).optional(),
  secondary_opening_hours: z.array(placeOpeningHoursSchema).optional(),
  serves_beer: z.boolean().optional(),
  serves_breakfast: z.boolean().optional(),
  serves_brunch: z.boolean().optional(),
  serves_dinner: z.boolean().optional(),
  serves_lunch: z.boolean().optional(),
  serves_vegetarian_food: z.boolean().optional(),
  serves_wine: z.boolean().optional(),
  takeout: z.boolean().optional(),
  types: z.array(z.string()).optional(),
  url: z.string().optional(),
  user_ratings_total: z.number().optional(),
  utc_offset: z.number().optional(),
  vicinity: z.string().optional(),
  website: z.string().optional(),
  wheelchair_accessible_entrance: z.boolean().optional(),
});

export const placesTextSearchResponseSchema = z.object({
  html_attributions: z.array(z.string()),
  results: z.array(placeSchema),
  status: placesSearchStatusSchema,
  error_message: z.string().optional(),
  info_messages: z.array(z.string()).optional(),
  next_page_token: z.string().optional(),
});

export const placesDetailsResponseSchema = z.object({
  html_attributions: z.array(z.string()),
  result: placeSchema.optional(),
  status: placesDetailsStatusSchema,
  info_messages: z.array(z.string()).optional(),
  error_message: z.string().optional(),
});
