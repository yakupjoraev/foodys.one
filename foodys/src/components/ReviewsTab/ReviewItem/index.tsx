import {
  STAR_WHOLE,
  STAR_HALF,
  createRatingStarsModel,
} from "~/utils/rating-stars-model";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import en from "date-fns/locale/en-GB";
import fr from "date-fns/locale/fr";
import useTranslation from "next-translate/useTranslation";
import toast from "react-hot-toast";
import { type PlaceReviewResource } from "~/server/api/utils/g-place";

export interface ReviewItemProps {
  review: PlaceReviewResource;
}

export function ReviewItem(props: ReviewItemProps) {
  const { lang } = useTranslation("common");

  const handleClick = () => {
    toast("NOT IMPLEMENTED");
  };

  let dateLocale = en;
  if (lang === "fr") {
    dateLocale = fr;
  }

  return (
    <div className="reviews-content__item" data-id={props.review.id}>
      <div className="reviews-content__user">
        <img
          className="reviews-content__user-avatar"
          src={props.review.profile_photo_url ?? "https://placehold.co/32x32"}
          alt="avatar"
        />
        <div className="reviews-content__user-info">
          <p className="reviews-content__user-name">
            {props.review.author_name}
          </p>
        </div>
      </div>
      <div className="reviews-content__commit">
        <div className="reviews-content__commit-top">
          <div className="reviews-content__commit-stars">
            {renderStars(props.review.rating)}
          </div>

          <div className="reviews-content__commit-age">
            {formatDistanceToNow(props.review.time * 1000, {
              locale: dateLocale,
              addSuffix: true,
            })}
          </div>
        </div>
        <div className="reviews-content__commit-text">{props.review.text}</div>
      </div>
      <div className="reviews-content__actions">
        <span className="reviews-content__action" onClick={handleClick}>
          <img src="/img/icons/like.svg" alt="like" />
          <span>1</span>
        </span>
        <span className="reviews-content__action" onClick={handleClick}>
          <img src="/img/icons/share.svg" alt="share" />
          <span>Share review</span>
        </span>
        <span className="reviews-content__action" onClick={handleClick}>
          <img src="/img/icons/no-see.svg" alt="no-see" />
          <span>Report the review</span>
        </span>
        <span className="reviews-content__action" onClick={handleClick}>
          <img src="/img/icons/basket.svg" alt="basket" />
          <span>Business owner? Reply</span>
        </span>
      </div>
    </div>
  );
}

function renderStars(rating: number) {
  const model = createRatingStarsModel(rating);
  return model.map((starType, i) => {
    switch (starType) {
      case STAR_WHOLE: {
        return (
          <img
            className="reviews-content__commit-star"
            src="/img/dashboard/star.svg"
            alt=""
            width="14"
            height="15"
            key={i}
          />
        );
      }
      case STAR_HALF: {
        return (
          <img
            className="reviews-content__commit-star"
            src="/img/dashboard/star-half.svg"
            alt=""
            width="14"
            height="15"
            key={i}
          />
        );
      }
      default: {
        return (
          <img
            className="reviews-content__commit-star"
            src="/img/dashboard/star-empty.svg"
            alt=""
            width="14"
            height="15"
            key={i}
          />
        );
      }
    }
  });
}
