import { useEffect, useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAuthFormSchema } from "./validators";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";

export type AuthError =
  | { type: "unknown"; message?: string }
  | { type: "credentials" };

export interface AuthRequest {
  login: string;
  password: string;
}

interface AuthFormData {
  login: string;
  password: string;
  agreementConfirmed: boolean;
}

const DEFAULT_FORM_DATA: AuthFormData = {
  login: "",
  password: "",
  agreementConfirmed: false,
};

export interface AuthFormProps {
  className?: string;
  loading?: boolean;
  show?: boolean;
  error?: AuthError;
  onAuth: (opts: AuthRequest) => void;
  onNavRegister: () => void;
  onNavResetPassword: () => void;
}

export function AuthForm(props: AuthFormProps) {
  const { t } = useTranslation("common");
  const loginId = useId();
  const passwordId = useId();
  const agreementConfirmedId = useId();
  const authFormSchema = useMemo(() => createAuthFormSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<AuthFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(authFormSchema),
  });

  useEffect(() => {
    reset();
  }, [props.show]);

  useEffect(() => {
    if (props.error) {
      if (props.error.type === "credentials") {
        setError("root", { message: "Wrong login or password." });
      } else {
        setError("root", {
          message: props.error.message ?? "Failed to auth.",
        });
      }
    }
  }, [props.error]);

  const handleAuthFormSubmit = handleSubmit((formData) => {
    props.onAuth({
      login: formData.login,
      password: formData.password,
    });
  });

  return (
    <form
      className="modal-content__form"
      onSubmit={(ev) => void handleAuthFormSubmit(ev)}
    >
      <div className="modal-content__form-top">
        <Trans
          i18nKey="common:titleSignInForm"
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
          <label className="input__label" htmlFor={loginId}>
            {t("fieldNameEmail")}
          </label>
          <input
            className="input"
            type="text"
            placeholder="Example@mail.ru"
            id={loginId}
            disabled={props.loading}
            {...register("login")}
          />
          {errors.login?.message && (
            <p className="input__error">{errors.login.message}</p>
          )}
        </div>
        <div className="input__group">
          <label className="input__label" htmlFor={passwordId}>
            {t("fieldNamePassword")}
          </label>
          <input
            className="input"
            type="password"
            placeholder={t("fieldNamePassword")}
            id={passwordId}
            disabled={props.loading}
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="input__error">{errors.password.message}</p>
          )}

          <a
            className="input__forgetton"
            href="#"
            onClick={(ev) => {
              ev.preventDefault();
              props.onNavResetPassword();
            }}
          >
            {t("textForgottenPwd")}
          </a>
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
          <span>{t("textAgreeTermsAndCond")}</span>
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
        {t("buttonSignIn")}
      </button>
      <div className="modal-content__btn-remember">
        <Trans
          i18nKey="common:textCreateAccountInvit"
          components={[
            // eslint-disable-next-line react/jsx-key
            <a
              href="#"
              target="_blank"
              onClick={(ev) => {
                ev.preventDefault();
                props.onNavRegister();
              }}
            />,
          ]}
        />
      </div>
    </form>
  );
}
