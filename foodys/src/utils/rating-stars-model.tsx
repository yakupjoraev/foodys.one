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

  for (let i = 0; i < 5; i++) {
    if (i < rating) {
      ratingModel[i] = STAR_WHOLE;
    } else {
      const left = rating - i - 1;
      if (left >= 0.5) {
        ratingModel[i] = STAR_HALF;
      }
      break;
    }
  }

  return ratingModel;
}
