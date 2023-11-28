import {
  STAR_WHOLE,
  STAR_HALF,
  createRatingStarsModel,
} from "~/utils/rating-stars-model";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import en from "date-fns/locale/en-GB";
import fr from "date-fns/locale/fr";
import useTranslation from "next-translate/useTranslation";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { RWebShare } from "react-web-share";
import { type PlaceReviewResource } from "~/server/api/utils/g-place-review";
import { OwnerAnswerForm, OwnerAnswerFormData } from "../../OwnerAnswerForm";
import toast from "react-hot-toast";
import { useAuthTrigger } from "~/hooks/use-auth-trigger";

export interface ReviewItemProps {
  review: PlaceReviewResource;
  placeUrl: string;
  highlighted?: boolean;
  authentificated: boolean;
  onUpdateLike: (reviewId: string, liked: boolean) => void;
  onBlockReview: (reviewId: string) => void;
  onAnswerReview: (
    reviewId: string,
    text: string,
    cb: (success: boolean) => void
  ) => void;
}

export function ReviewItem(props: ReviewItemProps) {
  const { t, lang } = useTranslation("common");
  const [ownerAnswerFormVisible, setOwnerAnswerFormVisible] =
    useState<boolean>(false);
  const [ownerAnswerFormLoading, setOwnerAnswerFormLoading] =
    useState<boolean>(false);
  const triggerAuth = useAuthTrigger();

  const handleLikeBtnClick = () => {
    props.onUpdateLike(props.review.id, !props.review.liked);
  };

  const hanldeReportBtnClick = () => {
    props.onBlockReview(props.review.id);
  };

  const handleAnswerBtnClick = () => {
    if (props.authentificated) {
      setOwnerAnswerFormVisible(!ownerAnswerFormVisible);
    } else {
      toast.error(t("toastAuthRequired"));
      triggerAuth();
    }
  };

  const handleOwnerAnswerFormSubmit = (formData: OwnerAnswerFormData) => {
    setOwnerAnswerFormLoading(true);
    props.onAnswerReview(
      props.review.id,
      formData.answer,
      (success: boolean) => {
        setOwnerAnswerFormLoading(false);
        if (success) {
          setOwnerAnswerFormVisible(false);
        }
      }
    );
  };

  let dateLocale = en;
  if (lang === "fr") {
    dateLocale = fr;
  }

  const shareData: ShareData = useMemo(() => {
    const title = "Foodys - " + props.review.author_name;
    const nextUrl = new URL(props.placeUrl);
    nextUrl.hash = "#rv" + props.review.id;
    return {
      title,
      text: props.review.text,
      url: nextUrl.toString(),
    };
  }, [props.review, props.placeUrl]);

  return (
    <div
      className={classNames("reviews-content__item", {
        "reviews-content__item--highlighted": props.highlighted,
      })}
      data-id={props.review.id}
    >
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
        <span
          className={classNames("reviews-content__action", {
            "reviews-content__action--highlighted": props.review.liked,
          })}
          onClick={handleLikeBtnClick}
          role="button"
        >
          <svg
            className="reviews-contnt__action-icon"
            width="18"
            height="18"
            viewBox="0 0 18 18"
          >
            <path d="M15 6H10.791L11.6332 3.47475C11.7847 3.01875 11.7082 2.51325 11.427 2.12325C11.1457 1.73325 10.6897 1.5 10.209 1.5H9C8.77725 1.5 8.5665 1.599 8.42325 1.77L4.89825 6H3C2.17275 6 1.5 6.67275 1.5 7.5V14.25C1.5 15.0772 2.17275 15.75 3 15.75H12.9802C13.2854 15.749 13.5831 15.6554 13.8339 15.4816C14.0847 15.3077 14.2769 15.0619 14.385 14.7765L16.4527 9.26325C16.4841 9.17904 16.5001 9.08987 16.5 9V7.5C16.5 6.67275 15.8272 6 15 6ZM3 7.5H4.5V14.25H3V7.5ZM15 8.86425L12.9802 14.25H6V7.0215L9.351 3H10.2105L9.039 6.51225C9.00097 6.62499 8.99036 6.74516 9.00806 6.86282C9.02575 6.98047 9.07124 7.09222 9.14075 7.18878C9.21025 7.28534 9.30178 7.36395 9.40774 7.41807C9.51369 7.47219 9.63102 7.50028 9.75 7.5H15V8.86425Z" />
          </svg>
          <span>{props.review.likes ?? 0}</span>
        </span>
        <RWebShare data={shareData}>
          <span className="reviews-content__action">
            <img src="/img/icons/share.svg" alt="share" />
            <span>{t("buttonShareReview")}</span>
          </span>
        </RWebShare>
        <span
          className="reviews-content__action"
          onClick={hanldeReportBtnClick}
        >
          <img src="/img/icons/no-see.svg" alt="no-see" />
          <span>{t("buttonReportReview")}</span>
        </span>
        <span
          className="reviews-content__action"
          onClick={handleAnswerBtnClick}
        >
          <img src="/img/icons/basket.svg" alt="basket" />
          <span>{t("buttonBusinessOwner")}</span>
        </span>
      </div>
      {ownerAnswerFormVisible && (
        <OwnerAnswerForm
          loading={ownerAnswerFormLoading}
          onSubmit={handleOwnerAnswerFormSubmit}
        />
      )}
      {props.review.ownerAnswers?.length && (
        <div className="review-content__owner-answers">
          {props.review.ownerAnswers.map((response) => {
            return (
              <div className="review-content__owner-answer" key={response.id}>
                <div className="review-content__owner">
                  <div className="review-content__owner-title">
                    {t("textOwnerResponded", { name: response.ownerName })}
                  </div>
                  <div className="review-content__owner-subtitle">
                    {formatDistanceToNow(response.time * 1000, {
                      locale: dateLocale,
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="reviews-content__owner-answer-text">
                  {response.text}
                </div>
              </div>
            );
          })}
        </div>
      )}
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
