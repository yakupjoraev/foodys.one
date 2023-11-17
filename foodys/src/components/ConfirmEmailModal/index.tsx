import classNames from "classnames";
import { Portal } from "../Portal";

export interface ConfirmAccountModalProps {
  open: boolean;
  onClose: () => void;
  onResendEmail: () => void;
  onNavAuth: () => void;
}

export function ConfirmEmailModal(props: ConfirmAccountModalProps) {
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
          <div className="modal-content__form">
            <div className="modal-content__form-top">
              <h3 className="modal-content__title">
                Finalise your inscription
              </h3>
            </div>
            <div className="input__border modal-content__texts" />
            <div className="modal-content__texts modal-content__texts--center">
              <p className="modal-content__text">
                An email has just been sent to your email address. To finalise
                your inscription, please check your mailbox to confirm your
                email and activate your account.
              </p>
              <p className="modal-content__text">
                No email received?{" "}
                <a
                  className="modal-content__texts-policy"
                  href="#"
                  onClick={(ev) => {
                    ev.preventDefault();
                    props.onResendEmail();
                  }}
                >
                  Send email again.
                </a>
              </p>
              <p className="modal-content__text">
                If you activated your email already, please{" "}
                <a
                  className="modal-content__texts-policy"
                  href="#"
                  onClick={(ev) => {
                    ev.preventDefault();
                    props.onNavAuth();
                  }}
                >
                  click here
                </a>{" "}
                to continue the navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
