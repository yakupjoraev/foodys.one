export type GApiPlacesSearchStatus =
  | "OK"
  | "ZERO_RESULTS"
  | "INVALID_REQUEST"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR";

export type GApiPlacesDetailsStatus =
  | "OK"
  | "ZERO_RESULTS"
  | "NOT_FOUND"
  | "INVALID_REQUEST"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR";

export interface GApiPlacesTextSearchResponse {
  html_attributions: Array<string>;
  results: Array<GApiPlace>;
  status: GApiPlacesSearchStatus;
  error_message?: string;
  info_messages?: Array<string>;
  next_page_token?: string;
}

export interface GApiPlacesDetailsResponse {
  html_attributions: Array<string>;
  result?: GApiPlace;
  status: GApiPlacesDetailsStatus;
  info_messages?: Array<string>;
  error_message?: string;
}

export interface GApiPlace {
  address_components?: Array<GApiAddressComponent>;
  adr_address?: string;
  business_status?: string;
  curbside_pickup?: boolean;
  current_opening_hours?: GApiPlaceOpeningHours;
  delivery?: boolean;
  dine_in?: boolean;
  editorial_summary?: GApiPlaceEditorialSummary;
  formatted_address?: string;
  formatted_phone_number?: string;
  geometry?: GApiGeometry;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  international_phone_number?: string;
  name?: string;
  opening_hours?: GApiPlaceOpeningHours;
  photos?: Array<GApiPlacePhoto>;
  place_id?: string;
  plus_code?: GApiPlusCode;
  price_level?: number;
  rating?: number;
  reservable?: boolean;
  reviews?: Array<GApiPlaceReview>;
  secondary_opening_hours?: Array<GApiPlaceOpeningHours>;
  serves_beer?: boolean;
  serves_breakfast?: boolean;
  serves_brunch?: boolean;
  serves_dinner?: boolean;
  serves_lunch?: boolean;
  serves_vegetarian_food?: boolean;
  serves_wine?: boolean;
  takeout?: boolean;
  types?: Array<string>;
  url?: string;
  user_ratings_total?: number;
  utc_offset?: number;
  vicinity?: string;
  website?: string;
  wheelchair_accessible_entrance?: boolean;
}

export interface GApiAddressComponent {
  long_name: string;
  short_name: string;
  types: Array<string>;
}

export interface GApiPlaceEditorialSummary {
  language?: string;
  overview?: string;
}

export interface GApiGeometry {
  location: GApiLatLngLiteral;
  viewport: GApiBounds;
}

export interface GApiLatLngLiteral {
  lat: number;
  lng: number;
}

export interface GApiBounds {
  northeast: GApiLatLngLiteral;
  southwest: GApiLatLngLiteral;
}

export interface GApiPlaceOpeningHours {
  open_now?: boolean;
  periods?: Array<GApiPlaceOpeningHoursPeriod>;
  special_days?: Array<GApiPlaceSpecialDay>;
  type?: string;
  weekday_text?: Array<string>;
}

export interface GApiPlaceOpeningHoursPeriod {
  open: GApiPlaceOpeningHoursPeriodDetail;
  close?: GApiPlaceOpeningHoursPeriodDetail;
}

export interface GApiPlaceSpecialDay {
  date?: string;
  exceptional_hours?: boolean;
}

export interface GApiPlaceOpeningHoursPeriodDetail {
  day: number;
  time: string;
  date?: string;
  truncated?: boolean;
}

export interface GApiPlacePhoto {
  height: number;
  html_attributions: Array<string>;
  photo_reference: string;
  width: number;
}

export interface GApiPlusCode {
  global_code: string;
  compound_code?: string;
}

export interface GApiPlaceReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  time: number;
  author_url?: string;
  language?: string;
  original_language?: string;
  profile_photo_url?: string;
  text?: string;
  translated?: boolean;
}
