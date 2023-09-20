import { useEffect, useId, useState } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema } from "./validators";

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
}

const DEFAULT_FORM_DATA: AuthFormData = {
  login: "",
  password: "",
};

export interface AuthFormProps {
  className?: string;
  loading?: boolean;
  show?: boolean;
  error?: AuthError;
  onAuth: (opts: AuthRequest) => void;
}

export function AuthForm(props: AuthFormProps) {
  const loginId = useId();
  const passwordId = useId();
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
          message: props.error.message || "Failed to auth.",
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
      className={classNames("auth-form", props.className)}
      onSubmit={handleAuthFormSubmit}
    >
      <div className="auth-form__header">Sign In</div>
      <div className="control">
        <label className="control__label" htmlFor={loginId}>
          Login*
        </label>
        <input
          className="control__input"
          type="text"
          id={loginId}
          placeholder="Nickname or email"
          disabled={props.loading}
          {...register("login")}
        />
        {errors.login?.message && (
          <div className="control__error">{errors.login.message}</div>
        )}
      </div>

      <div className="control">
        <label className="control__label" htmlFor={passwordId}>
          Password*
        </label>
        <input
          className="control__input"
          type="password"
          id={passwordId}
          placeholder="Password"
          disabled={props.loading}
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password?.message && (
          <div className="control__error">{errors.password.message}</div>
        )}
      </div>
      {errors.root?.message && (
        <div className="auth-form__error">{errors.root.message}</div>
      )}
      <div className="register-from__footer">
        <button
          className="btn btn--inverted auth-form__submit"
          type="submit"
          disabled={props.loading}
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
