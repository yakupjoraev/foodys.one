import { useId } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReviewRatingInput } from "~/components/ReviewRatingInput";
import { reviewFormSchema } from "./validators";

interface ReviewFormData {
  rating: number;
  review: string;
  agreementConfirmed: boolean;
}

const DEFAULT_FORM_DATA: ReviewFormData = {
  rating: 0,
  review: "",
  agreementConfirmed: false,
};

export interface ReviewFormSubmitData {
  rating: number;
  review: string;
}

export interface ReviewFormProps {
  loading?: boolean;
  onSubmit: (formData: ReviewFormSubmitData) => void;
}

export function ReviewForm(props: ReviewFormProps) {
  const starsId = useId();
  const reviewId = useId();
  const agreementId = useId();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ReviewFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(reviewFormSchema),
  });

  const handleReviewFormSubmit = handleSubmit((formData) => {
    props.onSubmit({
      rating: formData.rating,
      review: formData.review,
    });
  });

  return (
    <form
      className="review-page__form"
      onSubmit={(ev) => void handleReviewFormSubmit(ev)}
    >
      <div className="review-page__input-group">
        <label className="review-page__input-label" htmlFor={starsId}>
          How would you rate your experience?
        </label>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => {
            return (
              <ReviewRatingInput
                id={starsId}
                value={field.value}
                isDisabled={props.loading}
                onBlur={field.onBlur}
                onChange={field.onChange}
              />
            );
          }}
        />
        {errors.rating?.message && (
          <div className="review-page__input-error">
            {errors.rating.message}
          </div>
        )}
      </div>
      <div className="review-page__input-group">
        <label className="review-page__input-label" htmlFor={reviewId}>
          Write your review
        </label>
        <textarea
          className="review-page__textarea"
          id={reviewId}
          rows={10}
          disabled={props.loading}
          placeholder="This spot is great for a casual night out…"
          {...register("review")}
        />
        {errors.review?.message && (
          <div className="review-page__input-error">
            {errors.review.message}
          </div>
        )}
      </div>
      <div className="review-page__input-group">
        <div className="review-page__agreement">
          <label
            className="review-page__custom-checkbox-container"
            htmlFor={agreementId}
          >
            <input
              className="review-page__custom-checkbox-input"
              id={agreementId}
              type="checkbox"
              disabled={props.loading}
              {...register("agreementConfirmed")}
            />
            <span className="review-page__custom-checkbox-checkmark" />
          </label>
          <label htmlFor={agreementId}>
            I certify that this review is based on my own experience and is my
            genuine opinion of this restaurant, and that I have no personal or
            business relationship with this establishment, and have not been
            offered any incentive or payment originating from the establishment
            to write this review. I understand that Foodys.one has a
            zero-tolerance policy on fake reviews.
          </label>
        </div>
        {errors.agreementConfirmed?.message && (
          <div className="review-page__input-error">
            {errors.agreementConfirmed.message}
          </div>
        )}
      </div>
      <div className="review-page__btns">
        <button
          className="review-page__btn"
          type="submit"
          disabled={props.loading}
        >
          Save
        </button>
      </div>
    </form>
  );
}
