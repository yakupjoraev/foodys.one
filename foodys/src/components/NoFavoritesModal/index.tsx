import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRef } from "react";
import { Portal } from "../Portal";

export interface NoFavoritesModalProps {
  open: boolean;
  onClose: () => void;
}

export function NoFavoritesModal(props: NoFavoritesModalProps) {
  const { t } = useTranslation("common");
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
    <Portal rootId="modal">
      <div
        className={classNames("modal", { show: props.open })}
        onClick={handleCoverClick}
      >
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
          <div className="modal-content__no-saved">
            <img
              src="/img/modal/big-heart.svg"
              alt="big-heart"
              width={121}
              height={121}
            />
            <h2 className="modal-content__crypto-title">
              {t("scrollOverScrollOverFavourites")}
            </h2>
          </div>
        </div>
      </div>
    </Portal>
  );
}
