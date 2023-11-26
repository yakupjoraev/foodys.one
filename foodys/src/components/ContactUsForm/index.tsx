import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useMemo } from "react";
import useTranslation from "next-translate/useTranslation";
import { createContactUsFormSchema } from "./validators";

export interface ContactUsFormData {
  name?: string;
  phone?: string;
  email: string;
  message: string;
}

export interface ContactUsFormProps {
  show?: boolean;
  loading?: boolean;
  onSubmit: (request: ContactUsFormData) => void;
}

interface ContactUsFormDataInternal {
  name: string;
  phone: string;
  email: string;
  message: string;
  agreementConfirmed: boolean;
}

const DEFAULT_FORM_DATA: ContactUsFormDataInternal = {
  name: "",
  phone: "",
  email: "",
  message: "",
  agreementConfirmed: false,
};

export function ContactUsForm(props: ContactUsFormProps) {
  const { t } = useTranslation("common");
  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const messageId = useId();
  const agreementConfirmedId = useId();
  const contactUsFormSchema = useMemo(() => createContactUsFormSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ContactUsFormDataInternal>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(contactUsFormSchema),
  });

  useEffect(() => {
    reset(DEFAULT_FORM_DATA);
  }, [props.show]);

  const handleContactUsFormSubmit = handleSubmit((formData) => {
    if (props.loading) {
      return;
    }
    const nameNormalized = formData.name.trim();
    const phoneNormalized = formData.phone.trim();
    props.onSubmit({
      name: nameNormalized.length ? nameNormalized : undefined,
      phone: phoneNormalized.length ? phoneNormalized : undefined,
      email: formData.email,
      message: formData.message,
    });
  });

  return (
    <form
      className="modal-content__form"
      onSubmit={(ev) => void handleContactUsFormSubmit(ev)}
    >
      <div className="modal-content__form-top">
        <h2 className="modal-content__title-main">{t("textContactUs")}</h2>
      </div>
      <div className="modal-content__inputs">
        <div className="input__group">
          <label className="input__label" htmlFor={nameId}>
            Name
          </label>
          <input
            className="input"
            id={nameId}
            type="text"
            placeholder="Name"
            disabled={props.loading}
            {...register("name")}
          />
          {errors.name?.message && (
            <p className="input__error">{errors.name.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={phoneId}>
            {t("fieldNamePhoneNumber")}
          </label>
          <input
            className="input"
            id={phoneId}
            type="tel"
            placeholder={t("fieldNamePhoneNumber")}
            disabled={props.loading}
            {...register("phone")}
          />
          {errors.phone?.message && (
            <p className="input__error">{errors.phone.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={emailId}>
            {t("fieldNameEmail")}*
          </label>
          <input
            className="input"
            id={emailId}
            type="email"
            placeholder={t("fieldNameEmail")}
            disabled={props.loading}
            {...register("email")}
          />
          {errors.email?.message && (
            <p className="input__error">{errors.email.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={messageId}>
            {t("fieldNameMessage")}*
          </label>
          <textarea
            className="input input__textarea"
            id={messageId}
            disabled={props.loading}
            {...register("message")}
          />
          {errors.message?.message && (
            <p className="input__error">{errors.message.message}</p>
          )}
        </div>
        <div className="input__border" />
      </div>
      <div className="input__checkbox-group">
        <input
          className="input__checkbox"
          type="checkbox"
          id={agreementConfirmedId}
          disabled={props.loading}
          {...register("agreementConfirmed")}
        />
        <label className="input__label" htmlFor={agreementConfirmedId}>
          <div className="input__checkbox-decor"> </div>
          <span>{t("textAgreeTermsAndCond")}</span>
        </label>
        {errors.agreementConfirmed?.message && (
          <p className="input__error">{errors.agreementConfirmed.message}</p>
        )}
      </div>
      <button
        className="modal-content__btn"
        disabled={props.loading}
        type="submit"
      >
        {t("buttonSend")}
      </button>
    </form>
  );
}
