export type PlacesSearchStatus =
  | "OK"
  | "ZERO_RESULTS"
  | "INVALID_REQUEST"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR";

export type PlacesDetailsStatus =
  | "OK"
  | "ZERO_RESULTS"
  | "NOT_FOUND"
  | "INVALID_REQUEST"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "UNKNOWN_ERROR";

export interface PlacesTextSearchResponse {
  html_attributions?: Array<string>;
  results?: Array<Place>;
  status?: PlacesSearchStatus;
  error_message?: string;
  info_messages?: Array<string>;
  next_page_token?: string;
}

export interface PlacesDetailsResponse {
  html_attributions?: Array<string>;
  result?: Place;
  status?: PlacesDetailsStatus;
  info_messages?: Array<string>;
}

export interface Place {
  address_components?: Array<AddressComponent>;
  adr_address?: string;
  business_status?: string;
  curbside_pickup?: boolean;
  current_opening_hours?: PlaceOpeningHours;
  delivery?: boolean;
  dine_in?: boolean;
  editorial_summary?: PlaceEditorialSummary;
  formatted_address?: string;
  formatted_phone_number?: string;
  geometry?: Geometry;
  icon?: string;
  icon_background_color?: string;
  icon_mask_base_uri?: string;
  international_phone_number?: string;
  name?: string;
  opening_hours?: PlaceOpeningHours;
  photos?: Array<PlacePhoto>;
  place_id?: string;
  plus_code?: PlusCode;
  price_level?: number;
  rating?: number;
  reservable?: boolean;
  reviews?: Array<PlaceReview>;
  secondary_opening_hours?: Array<PlaceOpeningHours>;
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

export interface AddressComponent {
  long_name?: string;
  short_name?: string;
  types?: Array<string>;
}

export interface PlaceEditorialSummary {
  language?: string;
  overview?: string;
}

export interface Geometry {
  location?: LatLngLiteral;
  viewport?: Bounds;
}

export interface LatLngLiteral {
  lat?: number;
  lng?: number;
}

export interface Bounds {
  northeast?: LatLngLiteral;
  southwest?: LatLngLiteral;
}

export interface PlaceOpeningHours {
  open_now?: boolean;
  periods?: Array<PlaceOpeningHoursPeriod>;
  special_days?: Array<PlaceSpecialDay>;
  type?: string;
  weekday_text?: Array<string>;
}

export interface PlaceOpeningHoursPeriod {
  open?: PlaceOpeningHoursPeriodDetail;
  close?: PlaceOpeningHoursPeriodDetail;
}

export interface PlaceSpecialDay {
  date?: string;
  exceptional_hours?: boolean;
}

export interface PlaceOpeningHoursPeriodDetail {
  day?: number;
  time?: string;
  date?: string;
  truncated?: boolean;
}

export interface PlacePhoto {
  height?: number;
  html_attributions?: Array<string>;
  photo_reference?: string;
  width?: number;
}

export interface PlusCode {
  global_code?: string;
  compound_code?: string;
}

export interface PlaceReview {
  author_name?: string;
  rating?: number;
  relative_time_description?: string;
  time?: number;
  author_url?: string;
  language?: string;
  original_language?: string;
  profile_photo_url?: string;
  text?: string;
  translated?: boolean;
}
