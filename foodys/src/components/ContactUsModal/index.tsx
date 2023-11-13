import classNames from "classnames";
import { useRef } from "react";
import { ContactUsForm, type ContactUsFormData } from "../ContactUsForm";
export type { ContactUsFormData } from "../ContactUsForm";

export interface ContactUsModalProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (request: ContactUsFormData) => void;
}

export function ContactUsModal(props: ContactUsModalProps) {
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleCoverClick = (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (modalContentRef.current === null) {
      return;
    }
    if (
      ev.target instanceof Element &&
      modalContentRef.current.contains(ev.target)
    ) {
      return;
    }
    props.onClose();
  };

  return (
    <div
      className={classNames("modal", { show: props.open })}
      onClick={handleCoverClick}
    >
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