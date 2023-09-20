import classNames from "classnames";
import { useRef } from "react";
import { AuthForm, AuthRequest, AuthError } from "../AuthForm";

export { type AuthRequest, type AuthError } from "../AuthForm";

export interface AuthModalProps {
  open: boolean;
  error?: AuthError;
  loading?: boolean;
  onAuth: (opts: AuthRequest) => void;
  onClose: () => void;
}

export function AuthModal(props: AuthModalProps) {
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
      className={classNames("modal", !!props.open && "modal--show")}
      onClick={handleCoverClick}
    >
      <div className="modal-content" ref={modalContentRef}>
        <div className="modal-header">
          <button
            className="modal-close"
            type="button"
            aria-label="close"
            onClick={props.onClose}
          >
            <svg
              className="modal-close__icon"
              clipRule="evenodd"
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit={2}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                fillRule="nonzero"
              />
            </svg>
          </button>
        </div>
        <AuthForm
          className="modal-body"
          show={props.open}
          error={props.error}
          loading={props.loading}
          onAuth={props.onAuth}
        />
      </div>
    </div>
  );
}
