import { useEffect, useId, useState } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "./validators";
import { error } from "console";

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
}

const DEFAULT_FORM_DATA: RegisterFormData = {
  firstName: "",
  lastName: "",
  nickname: "",
  email: "",
  password: "",
};

export interface RegisterFormProps {
  className?: string;
  loading?: boolean;
  error?: RegisterError;
  show?: boolean;
  onRegister: (opts: RegisterRequest) => void;
}

export function RegisterForm(props: RegisterFormProps) {
  const firstNameId = useId();
  const lastNameId = useId();
  const nicknameId = useId();
  const emailId = useId();
  const passwordId = useId();
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
          message: "A user with the same nickanme or email already exists!",
        });
      } else {
        setError("root", {
          message: props.error.message || "Failed to register.",
        });
      }
    }
  }, [props.error]);

  const handleRegisterFormSubmit = handleSubmit((formData) => {
    props.onRegister({
      firstName: formData.firstName,
      lastName: formData.lastName,
      nickname: formData.nickname,
      email: formData.email,
      password: formData.password,
    });
  });

  return (
    <form className="modal-content__form" onSubmit={handleRegisterFormSubmit}>
      <div className="modal-content__form-top">
        <h3 className="modal-content__title">New over here?</h3>
        <h2 className="modal-content__title-main">Create account</h2>
      </div>
      <div className="modal-content__inputs">
        <div className="input__group">
          <label className="input__label" htmlFor={firstNameId}>
            First name*
          </label>
          <input
            className="input"
            type="text"
            placeholder="First name"
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
            Last name*
          </label>
          <input
            className="input"
            type="text"
            placeholder="Last-name"
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
            Nickname*
          </label>
          <input
            className="input"
            type="text"
            placeholder="Nickname"
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
            Email*
          </label>
          <input
            className="input"
            type="email"
            placeholder="Example@mail.ru"
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
            Password*
          </label>
          <input
            className="input"
            type="password"
            placeholder="Password*"
            id={passwordId}
            disabled={props.loading}
            {...register("password")}
          />
          {errors.password?.message && (
            <p className="input__error">{errors.password.message}</p>
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
        Create my account
      </button>
      <div className="modal-content__btn-remember">
        Already have an account on Foodys.one?
        <a href="#" target="_blank">
          {" "}
          Sign in
        </a>
      </div>
      <div className="input__checkbox-group">
        <input className="input__checkbox" type="checkbox" id="checkbox2" />
        <label className="input__label" htmlFor="checkbox2">
          <div className="input__checkbox-decor"> </div>
          <span>
            By proceeding, you agree to our Terms of Use and confirm you have
            read our Privacy and Cookies Statement.
          </span>
        </label>
      </div>
    </form>
  );
}
