import {
  InputProps,
  Rating,
  SharedProps,
  ThinRoundedStar,
} from "@smastrom/react-rating";
import { RefAttributes, useState } from "react";
import style from "./style.module.css";
import useTranslation from "next-translate/useTranslation";
import { Translate } from "next-translate";

const itemStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: "#ffb700",
  inactiveFillColor: "#fbf1a9",
};

export type ReviewRatingInputProps = Pick<
  InputProps,
  "onChange" | "onBlur" | "onFocus" | "isRequired" | "isDisabled"
> &
  Pick<SharedProps, "id" | "value"> &
  RefAttributes<HTMLDivElement>;

export function ReviewRatingInput(props: ReviewRatingInputProps) {
  const { t } = useTranslation("common");
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className={style["review-rating-input"]}>
      <Rating
        className={style["review-rating-input__stars"]}
        itemStyles={itemStyles}
        id={props.id}
        value={props.value}
        isRequired={props.isRequired}
        isDisabled={props.isDisabled}
        onChange={props.onChange}
        onBlur={props.onBlur}
        onHoverChange={setHoveredRating}
      />
      {renderHelpText(hoveredRating || props.value, t)}
    </div>
  );
}

function renderHelpText(index: number, t: Translate) {
  switch (index) {
    case 1: {
      return (
        <div className={style["review-rating-input__help"]}>
          {t("textRatingTerrible")}
        </div>
      );
    }
    case 2: {
      return (
        <div className={style["review-rating-input__help"]}>
          {t("textRatingPoor")}
        </div>
      );
    }
    case 3: {
      return (
        <div className={style["review-rating-input__help"]}>
          {t("textRatingAverage")}
        </div>
      );
    }
    case 4: {
      return (
        <div className={style["review-rating-input__help"]}>
          {t("textRatingVeryGood")}
        </div>
      );
    }
    case 5: {
      return (
        <div className={style["review-rating-input__help"]}>
          {t("textRatingExcellent")}
        </div>
      );
    }
    default: {
      return null;
    }
  }
}
