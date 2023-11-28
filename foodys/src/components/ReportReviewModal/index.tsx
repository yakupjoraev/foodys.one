import classNames from "classnames";
import { Portal } from "../Portal";
import useTranslation from "next-translate/useTranslation";

export interface ReportReviewModalProps {
  open: boolean;
  onConfirm: (confirmed: boolean) => void;
}

export function ReportReviewModal(props: ReportReviewModalProps) {
  const { t } = useTranslation("common");

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
            <h4 className="modal-content__subtitle">
              {t("titleConfirmReviewReporting")}
            </h4>
            <div className="input__border"></div>
            <div className="modal-content__btns modal-content__btns-column">
              <button
                type="button"
                className="modal-content__btn"
                onClick={handleConfirmBtnClick}
              >
                {t("buttonConfirm")}
              </button>
              <button
                type="button"
                className="modal-content__btn modal-content__btn-outline"
                onClick={handleCloseBtnClick}
              >
                {t("buttonCancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
