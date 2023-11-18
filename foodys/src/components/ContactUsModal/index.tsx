import classNames from "classnames";
import { ContactUsForm, type ContactUsFormData } from "../ContactUsForm";
export type { ContactUsFormData } from "../ContactUsForm";

export interface ContactUsModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (request: ContactUsFormData) => void;
}

export function ContactUsModal(props: ContactUsModalProps) {
  return (
    <div className={classNames("modal", { show: props.open })}>
      <div className="modal-content">
        <span className="close-modal-btn" role="button" onClick={props.onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={33}
            height={33}
            viewBox="0 0 33 33"
            fill="none"
          >
            <circle cx="16.5" cy="16.5" r="16.5" fill="#F0F0F0" />
            <path d="M22 11L16.5 16.5L11 11" stroke="#A8ADB8" strokeWidth={2} />
            <path d="M11 22L16.5 16.5L22 22" stroke="#A8ADB8" strokeWidth={2} />
          </svg>
        </span>
        <ContactUsForm
          show={props.open}
          loading={props.loading}
          onSubmit={props.onSubmit}
        />
      </div>
    </div>
  );
}
