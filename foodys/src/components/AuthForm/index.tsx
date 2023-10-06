import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormSchema } from "./validators";
import { toast } from "react-hot-toast";

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
    <form className="modal-content__form" onSubmit={handleAuthFormSubmit}>
      <div className="modal-content__form-top">
        <h3 className="modal-content__title">Already a member?</h3>
        <h2 className="modal-content__title-main">Sign in!</h2>
      </div>
      <div className="modal-content__inputs">
        <div className="input__group">
          <label className="input__label" htmlFor={loginId}>
            Email*
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
            Password*
          </label>
          <input
            className="input"
            type="password"
            placeholder="   Password*"
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
              toast("NOT IMPLEMENTED");
            }}
          >
            Forgotten your password?
          </a>
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
        Sign in
      </button>
      <div className="modal-content__btn-remember">
        New over here?
        <a
          href="#"
          target="_blank"
          onClick={(ev) => {
            ev.preventDefault();
            toast("NOT IMPLEMENTED");
          }}
        >
          Create your account in 20 seconds !
        </a>
      </div>
      <div className="input__checkbox-group">
        <input className="input__checkbox" type="checkbox" id="checkbox1" />
        <label className="input__label" htmlFor="checkbox1">
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
