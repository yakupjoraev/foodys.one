import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createOwnerAnswerFormSchema } from "./validators";
import useTranslation from "next-translate/useTranslation";

export interface OwnerAnswerFormData {
  answer: string;
}

export interface OwnerAnswerFormProps {
  loading?: boolean;
  onSubmit: (formData: OwnerAnswerFormData) => void;
}

const DEFAULT_FORM_DATA: OwnerAnswerFormData = {
  answer: "",
};

export function OwnerAnswerForm(props: OwnerAnswerFormProps) {
  const { t } = useTranslation("common");
  const answerId = useId();
  const ownerAnswerFormSchema = useMemo(
    () => createOwnerAnswerFormSchema(t),
    [t]
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OwnerAnswerFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(ownerAnswerFormSchema),
  });

  const handleAnswerFormSubmit = handleSubmit((formData) => {
    if (!props.loading) {
      props.onSubmit(formData);
    }
  });

  return (
    <form
      className="reviews-content__answer"
      onSubmit={(ev) => void handleAnswerFormSubmit(ev)}
    >
      <div className="input__border" />
      <label className="reviews-content__answer-label" htmlFor={answerId}>
        {t("fieldNameAnswer")}
      </label>
      <textarea
        className="reviews-content__answer-textarea"
        id={answerId}
        placeholder={t("fieldNameAnswer")}
        disabled={props.loading}
        {...register("answer")}
      />
      {errors?.answer?.message && (
        <div className="reviews-content__answer-error">
          {errors.answer.message}
        </div>
      )}
      <button
        type="submit"
        className="restaurant__btn restaurant__btn--outline"
        disabled={props.loading}
      >
        {t("buttonSend")}
      </button>
    </form>
  );
}
