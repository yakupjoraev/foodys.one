import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { createRegisterFormSchema } from "./validators";
import Link from "next/link";

export type RegisterError =
  | { type: "unknown"; message?: string }
  | { type: "user_exists" };

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  password: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  password: string;
  passwordConfirm: string;
  agreementConfirmed: boolean;
}

const DEFAULT_FORM_DATA: RegisterFormData = {
  firstName: "",
  lastName: "",
  nickname: "",
  email: "",
  password: "",
  passwordConfirm: "",
  agreementConfirmed: false,
};

export interface RegisterFormProps {
  className?: string;
  loading?: boolean;
  error?: RegisterError;
  show?: boolean;
  onRegister: (opts: RegisterRequest) => void;
  onNavAuth: () => void;
}

export function RegisterForm(props: RegisterFormProps) {
  const { t } = useTranslation("common");
  const firstNameId = useId();
  const lastNameId = useId();
  const nicknameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const passwordConfirmId = useId();
  const agreementConfirmedId = useId();
  const registerFormSchema = createRegisterFormSchema(t);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(registerFormSchema),
  });

  useEffect(() => {
    if (props.error) {
      if (props.error.type === "user_exists") {
        setError("root", {
          message: t("textUserExistsError"),
        });
      } else {
        setError("root", {
          message: props.error.message ?? t("textSignUpError"),
        });
      }
    }
  }, [props.error, setError, t]);

  const handleRegisterFormSubmit = handleSubmit((formData) => {
    props.onRegister({
      firstName: formData.firstName,
      lastName: formData.lastName,
      nickname: formData.nickname?.length ? formData.nickname : undefined,
      email: formData.email,
      password: formData.password,
    });
  });

  const handleShowPasswordBtnClick = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleShowPasswordConfirmBtnClick = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  return (
    <form
      className="modal-content__form"
      onSubmit={(ev) => void handleRegisterFormSubmit(ev)}
    >
      <div className="modal-content__form-top">
        <Trans
          i18nKey="common:titleCreateAccountForm"
          components={[
            // eslint-disable-next-line react/jsx-key
            <h3 className="modal-content__title" />,
            // eslint-disable-next-line react/jsx-key
            <h2 className="modal-content__title-main" />,
          ]}
        />
      </div>
      <div className="modal-content__inputs">
        <div className="input__group">
          <label className="input__label" htmlFor={firstNameId}>
            {t("fieldNameFirstName")}
          </label>
          <input
            className="input"
            type="text"
            id={firstNameId}
            disabled={props.loading}
            {...register("firstName")}
          />
          {errors.firstName?.message && (
            <p className="input__error">{errors.firstName.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={lastNameId}>
            {t("fieldNameLastName")}
          </label>
          <input
            className="input"
            type="text"
            id={lastNameId}
            disabled={props.loading}
            {...register("lastName")}
          />
          {errors.lastName?.message && (
            <p className="input__error">{errors.lastName.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={nicknameId}>
            {t("fieldNameNickname")}
          </label>
          <input
            className="input"
            type="text"
            id={nicknameId}
            disabled={props.loading}
            {...register("nickname")}
          />
          {errors.nickname?.message && (
            <p className="input__error">{errors.nickname.message}</p>
          )}
        </div>
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
          />
          {errors.email?.message && (
            <p className="input__error">{errors.email.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={passwordId}>
            {t("fieldNamePassword")}
          </label>
          <input
            className="input"
            type={passwordVisible ? "text" : "password"}
            id={passwordId}
            disabled={props.loading}
            {...register("password")}
          />
          <button
            type="button"
            className="input__view-btn form-eye"
            onClick={handleShowPasswordBtnClick}
          >
            {passwordVisible ? (
              <img src="/img/eye-close.svg" alt="" />
            ) : (
              <img src="/img/eye-open.svg" alt="" />
            )}
          </button>
          {errors.password?.message && (
            <p className="input__error">{errors.password.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={passwordConfirmId}>
            {t("textConfirmPassword")}
          </label>
          <input
            className="input"
            type={passwordConfirmVisible ? "text" : "password"}
            id={passwordConfirmId}
            disabled={props.loading}
            {...register("passwordConfirm")}
          />
          <button
            type="button"
            className="input__view-btn form-eye"
            onClick={handleShowPasswordConfirmBtnClick}
          >
            {passwordConfirmVisible ? (
              <img src="/img/eye-close.svg" alt="" />
            ) : (
              <img src="/img/eye-open.svg" alt="" />
            )}
          </button>
          {errors.passwordConfirm?.message && (
            <p className="input__error">{errors.passwordConfirm.message}</p>
          )}
        </div>
        {errors.root?.message && (
          <div className="modal-content__form-error">{errors.root.message}</div>
        )}
        <div className="input__border" />
      </div>
      <div className="input__checkbox-group">
        <input
          className="input__checkbox"
          type="checkbox"
          id={agreementConfirmedId}
          {...register("agreementConfirmed")}
        />
        <label className="input__label" htmlFor={agreementConfirmedId}>
          <div className="input__checkbox-decor"> </div>
          <span>
            {
              <Trans
                i18nKey="common:textAgreeTermsAndCond"
                components={[
                  // eslint-disable-next-line react/jsx-key
                  <Link href="/terms-and-conditions" />,
                  // eslint-disable-next-line react/jsx-key
                  <Link href="/cookies" />,
                ]}
              />
            }
          </span>
        </label>
        {errors.agreementConfirmed?.message && (
          <div className="input__error">
            {errors.agreementConfirmed.message}
          </div>
        )}
      </div>
      <button
        className="modal-content__btn"
        type="submit"
        disabled={props.loading}
      >
        {t("buttonCreateMyAcc")}
      </button>
      <div className="modal-content__btn-remember">
        <Trans
          i18nKey="common:textSignInInvit"
          components={[
            // eslint-disable-next-line react/jsx-key
            <a
              href="#"
              target="_blank"
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
