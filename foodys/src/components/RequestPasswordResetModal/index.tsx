import classNames from "classnames";
import {
  RequestPasswordResetForm,
  type RequestPasswordResetFormData,
} from "../RequestPasswordResetForm";
import { Portal } from "../Portal";
import { type RequestPasswordResetError } from "../RequestPasswordResetForm";

export { type RequestPasswordResetError } from "../RequestPasswordResetForm";

export interface RequetPasswordResetModalProps {
  open: boolean;
  loading?: boolean;
  error?: RequestPasswordResetError;
  onClose: () => void;
  onRequestPasswordReset: (email: string) => void;
}

export function RequetPasswordResetModal(props: RequetPasswordResetModalProps) {
  const handleRequestPasswordResetFormSubmit = (
    formData: RequestPasswordResetFormData
  ) => {
    props.onRequestPasswordReset(formData.email);
  };

  return (
    <Portal rootId="modal">
      <div className={classNames("modal", { show: props.open })}>
        <div className="modal-content">
          <span
            className="close-modal-btn"
            role="button"
            onClick={props.onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={33}
              height={33}
              viewBox="0 0 33 33"
              fill="none"
            >
              <circle cx="16.5" cy="16.5" r="16.5" fill="#F0F0F0" />
              <path
                d="M22 11L16.5 16.5L11 11"
                stroke="#A8ADB8"
                strokeWidth={2}
              />
              <path
                d="M11 22L16.5 16.5L22 22"
                stroke="#A8ADB8"
                strokeWidth={2}
              />
            </svg>
          </span>
          <RequestPasswordResetForm
            show={props.open}
            loading={props.loading}
            error={props.error}
            onSubmit={handleRequestPasswordResetFormSubmit}
          />
        </div>
      </div>
    </Portal>
  );
}
