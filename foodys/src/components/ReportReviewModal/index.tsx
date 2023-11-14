import classNames from "classnames";
import { Portal } from "../Portal";

export interface ReportReiewModalProps {
  open: boolean;
  onConfirm: (confirmed: boolean) => void;
}

export function ReportReviewModal(props: ReportReiewModalProps) {
  const handleConfirmBtnClick = () => {
    props.onConfirm(true);
  };

  const handleCloseBtnClick = () => {
    props.onConfirm(false);
  };

  return (
    <Portal rootId="modal">
      <div className={classNames("modal", { show: props.open })}>
        <div className="modal-content">
          <span
            className="close-modal-btn"
            role="button"
            onClick={handleCloseBtnClick}
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
            <div className="modal-content__btns modal-content__btns-column">
              <h4 className="modal-content__subtitle">
                Please confirm reporting the review.
              </h4>
              <button
                type="button"
                className="modal-content__btn"
                onClick={handleConfirmBtnClick}
              >
                Confirm
              </button>
              <button
                type="button"
                className="modal-content__btn modal-content__btn-outline"
                onClick={handleCloseBtnClick}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
