export const STAR_WHOLE = 0;
export const STAR_HALF = 1;
export const STAR_EMPTY = 2;

export type StarType = typeof STAR_WHOLE | typeof STAR_HALF | typeof STAR_EMPTY;

export type RatingModel = [StarType, StarType, StarType, StarType, StarType];

export function createRatingStarsModel(rating: number): RatingModel {
  const ratingModel: RatingModel = [
    STAR_EMPTY,
    STAR_EMPTY,
    STAR_EMPTY,
    STAR_EMPTY,
    STAR_EMPTY,
  ];

  for (let starIndex = 0; starIndex < 5; starIndex++) {
    const starValue = starIndex + 1;
    if (starValue <= rating) {
      ratingModel[starIndex] = STAR_WHOLE;
      continue;
    }
    if (Math.round(rating) === starValue) {
      ratingModel[starIndex] = STAR_HALF;
    }
    break;
  }

  return ratingModel;
}
