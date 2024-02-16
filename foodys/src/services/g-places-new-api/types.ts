import type {
  PRICE_LEVEL_EXPENSIVE,
  PRICE_LEVEL_FREE,
  PRICE_LEVEL_INEXPENSIVE,
  PRICE_LEVEL_MODERATE,
  PRICE_LEVEL_UNSPECIFIED,
  PRICE_LEVEL_VERY_EXPENSIVE,
} from "./constants";

export type PriceLevel =
  | typeof PRICE_LEVEL_UNSPECIFIED
  | typeof PRICE_LEVEL_FREE
  | typeof PRICE_LEVEL_INEXPENSIVE
  | typeof PRICE_LEVEL_MODERATE
  | typeof PRICE_LEVEL_EXPENSIVE
  | typeof PRICE_LEVEL_VERY_EXPENSIVE;
