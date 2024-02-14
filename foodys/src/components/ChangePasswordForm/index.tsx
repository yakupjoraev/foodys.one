import { useEffect, useId, useMemo, useState } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createChangePasswordFromSchema } from "./validators";
import useTranslation from "next-translate/useTranslation";

export type ChangePasswordError =
  | { code: "TOKEN_NOT_FOUND" }
  | { code: "WEAK_PASSWORD" }
  | { code: "GENERAL" };
export interface ChangePasswordRequest {
  password: string;
  token: string;
}

interface RegisterFormData {
  password: string;
  passwordConfirm: string;
}

const DEFAULT_FORM_DATA: RegisterFormData = {
  password: "",
  passwordConfirm: "",
};

export interface RegisterFormProps {
  className?: string;
  loading?: boolean;
  show?: boolean;
  error?: ChangePasswordError;
  token: string;
  onChangePassword: (request: ChangePasswordRequest) => void;
}

export function ChangePasswordForm(props: RegisterFormProps) {
  const { t } = useTranslation("common");
  const passwordId = useId();
  const passwordConfirmId = useId();
  const changePasswordFormSchema = useMemo(
    () => createChangePasswordFromSchema(t),
    [t]
  );
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RegisterFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(changePasswordFormSchema),
  });

  useEffect(() => {
    reset(DEFAULT_FORM_DATA);
  }, [props.show]);

  useEffect(() => {
    if (props.error) {
      switch (props.error.code) {
        case "TOKEN_NOT_FOUND": {
          setError("root", { message: t("textPassResetLinkExpiredError") });
          break;
        }
        default: {
          setError("root", { message: t("textPasswordChangeError") });
          break;
        }
      }
    }
  }, [props.error]);

  const handleRegisterFormSubmit = handleSubmit((formData) => {
    props.onChangePassword({
      password: formData.password,
      token: props.token,
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
        <h3 className="modal-content__title">Change password</h3>
      </div>
      <div className="modal-content__inputs">
        <div className="input__group">
          <label className="input__label" htmlFor={passwordId}>
            {t("fieldNamePassword")}
          </label>
          <input
            className="input"
            type={passwordVisible ? "text" : "password"}
            placeholder={t("fieldNamePassword")}
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
            placeholder={t("textConfirmPassword")}
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
      <button
        className="modal-content__btn"
        type="submit"
        disabled={props.loading}
      >
        Reset
      </button>
    </form>
  );
}
