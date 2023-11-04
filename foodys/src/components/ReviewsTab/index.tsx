import useTranslation from "next-translate/useTranslation";
import { ReviewItem } from "./ReviewItem";
import { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { type PlaceResource } from "~/server/api/utils/g-place";
import { useHash } from "~/hooks/use-hash";
import { PlaceReviewResource } from "~/server/api/utils/g-place-review";

enum ReviewOrder {
  Relevant,
  Newest,
  Highest,
  Lowest,
}

export interface ReviewsTabProps {
  show: boolean;
  reviews?: PlaceReviewResource[];
  placeUrl: string;
  onUpdateLike: (reviewId: string, liked: boolean) => void;
}

export function ReviewsTab(props: ReviewsTabProps) {
  const { t } = useTranslation("common");
  const [sortOrder, setSortOrder] = useState(ReviewOrder.Relevant);
  const [highlightedId, setHightlightedId] = useState<string | null>(null);
  const [hash] = useHash();

  useEffect(() => {
    if (hash.startsWith("#rv") && hash.length > 3) {
      const nextHighlightedId = hash.slice(3);
      setHightlightedId(nextHighlightedId);
    } else {
      setHightlightedId(null);
    }
  }, [hash]);

  const reviews = useMemo(() => {
    if (!props.reviews) {
      return [];
    }
    return sortReviews(props.reviews, sortOrder);
  }, [props.reviews, sortOrder]);

  return (
    <div
      className="tabs__content-item"
      style={{ display: props.show ? "flex" : "none" }}
    >
      <div className="reviews-content">
        <div className="input__border" />
        <div className="reviews-content__filters reviews-content__sorts">
          <h4 className="reviews-content__filters-label">
            {t("titleReviews")}
          </h4>
          <div className="reviews-content__filters-list">
            <button
              className={classNames("reviews-content__filter", {
                active: sortOrder === ReviewOrder.Relevant,
              })}
              type="button"
              onClick={() => setSortOrder(ReviewOrder.Relevant)}
            >
              {t("textSortReviewMostRelevant")}
            </button>
            <button
              className={classNames("reviews-content__filter", {
                active: sortOrder === ReviewOrder.Newest,
              })}
              type="button"
              onClick={() => setSortOrder(ReviewOrder.Newest)}
            >
              {t("textSortReviewMostNewest")}
            </button>
            <button
              className={classNames("reviews-content__filter", {
                active: sortOrder === ReviewOrder.Highest,
              })}
              type="button"
              onClick={() => setSortOrder(ReviewOrder.Highest)}
            >
              {t("textSortReviewMostHighest")}
            </button>
            <button
              className={classNames("reviews-content__filter", {
                active: sortOrder === ReviewOrder.Lowest,
              })}
              type="button"
              onClick={() => setSortOrder(ReviewOrder.Lowest)}
            >
              {t("textSortReviewMostLowest")}
            </button>
          </div>
        </div>
        <div className="reviews-content__list">
          {reviews.length === 0
            ? "No reviews"
            : reviews.map((review, i) => {
                const highlighted =
                  highlightedId !== null && review.id === highlightedId;
                return (
                  <ReviewItem
                    review={review}
                    placeUrl={props.placeUrl}
                    highlighted={highlighted}
                    onUpdateLike={props.onUpdateLike}
                    key={i}
                  />
                );
              })}
        </div>
      </div>
    </div>
  );
}

function sortReviews(
  reviews: PlaceReviewResource[],
  order: ReviewOrder
): PlaceReviewResource[] {
  switch (order) {
    case ReviewOrder.Relevant: {
      return Array.from(reviews);
    }
    case ReviewOrder.Newest: {
      return Array.from(reviews).sort((a, b) => {
        return b.time - a.time;
      });
    }
    case ReviewOrder.Highest: {
      return Array.from(reviews).sort((a, b) => {
        return b.rating - a.rating;
      });
    }
    case ReviewOrder.Lowest: {
      return Array.from(reviews).sort((a, b) => {
        return a.rating - b.rating;
      });
    }
  }
}
