import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { Portal } from "../Portal";

export interface CookiesModalProps {
  open: boolean;
  onClose: (agreed?: boolean) => void;
}

export function CookiesModal(props: CookiesModalProps) {
  const { t, lang } = useTranslation("common");

  return (
    <Portal rootId="modal">
      <div className={classNames("modal modal--large", !!props.open && "show")}>
        <div className="modal-content">
          <span
            className="close-modal-btn"
            role="button"
            onClick={() => void props.onClose(false)}
          >
            {t("buttonCookiesNotAccept")}
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
          <form className="modal-content__form" action="#">
            <Link
              className="modal-content__logo"
              href="/"
              onClick={() => {
                props.onClose();
              }}
            >
              <img
                src={
                  lang === "fr"
                    ? "/img/icons/fr/foodys-logo.svg"
                    : "/img/icons/foodys-logo.svg"
                }
                alt="Foodys"
              />
            </Link>
            <div className="modal-content__texts">
              <p className="modal-content__text">{t("textCookiesContent")}</p>
              <Link className="modal-content__texts-policy" href="/cookies">
                Our Cookie Policy
              </Link>
            </div>
            <div className="input__border" />
            <div className="modal-content__btns">
              <Link
                className="modal-content__btn modal-content__btn-outline"
                href="/cookies"
              >
                {t("buttonLearnMore")}
              </Link>
              <button
                type="button"
                className="modal-content__btn"
                onClick={() => props.onClose(true)}
              >
                {t("buttonAgreeAndClose")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}
