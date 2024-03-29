import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRequestPasswordResetFormSchema } from "./validators";
import { useEffect, useId, useMemo } from "react";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

export type RequestPasswordResetError = { code: "USER_NOT_FOUND" };

export interface RequestPasswordResetFormProps {
  show: boolean;
  loading?: boolean;
  error?: RequestPasswordResetError;
  onSubmit: (formData: RequestPasswordResetFormData) => void;
  onNavAuth: () => void;
}

export interface RequestPasswordResetFormData {
  email: string;
}

const DEFAULT_FORM_DATA: RequestPasswordResetFormData = {
  email: "",
};

export function RequestPasswordResetForm(props: RequestPasswordResetFormProps) {
  const { t } = useTranslation("common");
  const requestPasswordResetFormSchema = useMemo(
    () => createRequestPasswordResetFormSchema(t),
    [t]
  );
  const emailId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RequestPasswordResetFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(requestPasswordResetFormSchema),
  });

  useEffect(() => {
    if (props.error) {
      setError("email", { message: t("toastUserNotFound") });
    }
  }, [props.error, setError, t]);

  const handleRequestPasswordResetFormSubmit = handleSubmit((formData) => {
    if (props.loading) {
      return;
    }
    props.onSubmit(formData);
  });

  return (
    <form
      className="modal-content__form"
      onSubmit={(ev) => void handleRequestPasswordResetFormSubmit(ev)}
    >
      <h3 className="modal-content__title">Forgot password?</h3>
      <h4 className="modal-content__subtitle">{t("textResetPassword")}</h4>
      <div className="modal-content__inputs">
        <div className="input__border" />
        <div className="input__group">
          <label className="input__label" htmlFor={emailId}>
            {t("fieldNameEmail")}
          </label>
          <input
            className="input"
            type="email"
            id={emailId}
            disabled={props.loading}
            {...register("email")}
          />{" "}
          {errors.email?.message && (
            <p className="input__error">{errors.email.message}</p>
          )}
        </div>

        <div className="input__border" />
      </div>
      <button
        type="submit"
        className="modal-content__btn"
        disabled={props.loading}
      >
        {t("buttonConfirm")}
      </button>
      <div className="modal-content__btn-remember">
        <Trans
          i18nKey="common:textRememberPassword"
          components={[
            // eslint-disable-next-line react/jsx-key
            <a
              href="#"
              onClick={(ev) => {
                ev.preventDefault();
                props.onNavAuth();
              }}
            />,
          ]}
        />
      </div>
    </form>
  );
}
