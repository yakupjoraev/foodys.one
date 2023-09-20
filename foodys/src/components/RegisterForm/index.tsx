import { useEffect, useId, useState } from "react";
import classNames from "classnames";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerFormSchema } from "./validators";

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
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RegisterFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(registerFormSchema),
  });

  useEffect(() => {
    reset();
    setShowPassword(false);
  }, [props.show]);

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
    <form
      className={classNames("auth-form", props.className)}
      onSubmit={handleRegisterFormSubmit}
    >
      <div className="auth-form__header">Create account</div>
      <div className="control">
        <label className="control__label" htmlFor={firstNameId}>
          First name*
        </label>
        <input
          className="control__input"
          type="text"
          id={firstNameId}
          placeholder="First name"
          disabled={props.loading}
          {...register("firstName")}
        />
        {errors.firstName?.message && (
          <div className="control__error">{errors.firstName.message}</div>
        )}
      </div>

      <div className="control">
        <label className="control__label" htmlFor={lastNameId}>
          Last name*
        </label>
        <input
          className="control__input"
          type="text"
          id={lastNameId}
          placeholder="Last name"
          disabled={props.loading}
          {...register("lastName")}
        />
        {errors.lastName?.message && (
          <div className="control__error">{errors.lastName.message}</div>
        )}
      </div>

      <div className="control">
        <label className="control__label" htmlFor={nicknameId}>
          Nickname
        </label>
        <input
          className="control__input"
          type="text"
          id={nicknameId}
          placeholder="Nickname"
          disabled={props.loading}
          autoComplete="username"
          {...register("nickname")}
        />
        {errors.nickname?.message && (
          <div className="control__error">{errors.nickname.message}</div>
        )}
      </div>
      <div className="control">
        <label className="control__label" htmlFor={emailId}>
          E-mail*
        </label>
        <input
          className="control__input"
          type="email"
          id={emailId}
          placeholder="E-mail"
          disabled={props.loading}
          autoComplete="email"
          {...register("email")}
        />
        {errors.email?.message && (
          <div className="control__error">{errors.email.message}</div>
        )}
      </div>
      <div className="control">
        <label className="control__label" htmlFor={passwordId}>
          Password*
        </label>
        <div className="input-wrapper">
          <input
            className="control__input input-wrapper__input input-wraper__input--has-icon-right"
            type={showPassword ? "text" : "password"}
            id={passwordId}
            placeholder="Create password"
            disabled={props.loading}
            autoComplete="new-password"
            {...register("password")}
          />
          <button
            className="input-wrapper__btn input-wrapper__btn--right"
            type="button"
            onClick={() => void setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <svg
                className="input-wrapper__btn-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M8.137 15.147c-.71-.857-1.146-1.947-1.146-3.147 0-2.76 2.241-5 5-5 1.201 0 2.291.435 3.148 1.145l1.897-1.897c-1.441-.738-3.122-1.248-5.035-1.248-6.115 0-10.025 5.355-10.842 6.584.529.834 2.379 3.527 5.113 5.428l1.865-1.865zm6.294-6.294c-.673-.53-1.515-.853-2.44-.853-2.207 0-4 1.792-4 4 0 .923.324 1.765.854 2.439l5.586-5.586zm7.56-6.146l-19.292 19.293-.708-.707 3.548-3.548c-2.298-1.612-4.234-3.885-5.548-6.169 2.418-4.103 6.943-7.576 12.01-7.576 2.065 0 4.021.566 5.782 1.501l3.501-3.501.707.707zm-2.465 3.879l-.734.734c2.236 1.619 3.628 3.604 4.061 4.274-.739 1.303-4.546 7.406-10.852 7.406-1.425 0-2.749-.368-3.951-.938l-.748.748c1.475.742 3.057 1.19 4.699 1.19 5.274 0 9.758-4.006 11.999-8.436-1.087-1.891-2.63-3.637-4.474-4.978zm-3.535 5.414c0-.554-.113-1.082-.317-1.562l.734-.734c.361.69.583 1.464.583 2.296 0 2.759-2.24 5-5 5-.832 0-1.604-.223-2.295-.583l.734-.735c.48.204 1.007.318 1.561.318 2.208 0 4-1.792 4-4z" />
              </svg>
            ) : (
              <svg
                className="input-wrapper__btn-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fillRule="evenodd"
                clipRule="evenodd"
              >
                <path d="M12.01 20c-5.065 0-9.586-4.211-12.01-8.424 2.418-4.103 6.943-7.576 12.01-7.576 5.135 0 9.635 3.453 11.999 7.564-2.241 4.43-6.726 8.436-11.999 8.436zm-10.842-8.416c.843 1.331 5.018 7.416 10.842 7.416 6.305 0 10.112-6.103 10.851-7.405-.772-1.198-4.606-6.595-10.851-6.595-6.116 0-10.025 5.355-10.842 6.584zm10.832-4.584c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 1c2.208 0 4 1.792 4 4s-1.792 4-4 4-4-1.792-4-4 1.792-4 4-4z" />
              </svg>
            )}
          </button>
        </div>
        {errors.password?.message && (
          <div className="control__error">{errors.password.message}</div>
        )}
      </div>
      {errors.root?.message && (
        <div className="auth-form__error">{errors.root.message}</div>
      )}
      <div className="auth-form__footer">
        <button
          className="btn btn--inverted auth-form__submit"
          type="submit"
          disabled={props.loading}
        >
          Create my account
        </button>
      </div>
    </form>
  );
}
