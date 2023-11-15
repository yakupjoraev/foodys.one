import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestPasswordResetFormSchema } from "./validators";
import { useEffect, useId } from "react";

export type RequestPasswordResetError = { code: "USER_NOT_FOUND" };

export interface RequestPasswordResetFormProps {
  show: boolean;
  loading?: boolean;
  error?: RequestPasswordResetError;
  onSubmit: (formData: RequestPasswordResetFormData) => void;
}

export interface RequestPasswordResetFormData {
  email: string;
}

const DEFAULT_FORM_DATA: RequestPasswordResetFormData = {
  email: "",
};

export function RequestPasswordResetForm(props: RequestPasswordResetFormProps) {
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
      setError("email", { message: "User not found!" });
    }
  }, [props.error]);

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
      <h4 className="modal-content__subtitle">
        Enter your email address to get
        <br /> instructions on how to reset your password
      </h4>
      <div className="modal-content__inputs">
        <div className="input__border" />
        <div className="input__group">
          <label className="input__label" htmlFor={emailId}>
            Email
          </label>
          <input
            className="input"
            type="email"
            placeholder="Example@mail.ru"
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
        Confirm
      </button>
      <div className="modal-content__btn-remember">
        Remember your password?
        <a href="#" target="_blank">
          Back to login
        </a>
      </div>
    </form>
  );
}
