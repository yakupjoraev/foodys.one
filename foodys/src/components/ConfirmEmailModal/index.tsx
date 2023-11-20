import classNames from "classnames";
import { Portal } from "../Portal";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";

export interface ConfirmAccountModalProps {
  open: boolean;
  onClose: () => void;
  onResendEmail: () => void;
  onNavAuth: () => void;
}

export function ConfirmEmailModal(props: ConfirmAccountModalProps) {
  const { t } = useTranslation("common");

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
                {t("titleFinaliseInscription")}
              </h3>
            </div>
            <div className="input__border modal-content__texts" />
            <div className="modal-content__texts modal-content__texts--center">
              <p className="modal-content__text">
                {t("textFinaliseInscription")}
              </p>
              <p className="modal-content__text">
                <Trans
                  i18nKey="common:textSendEmailAgain"
                  components={[
                    // eslint-disable-next-line react/jsx-key
                    <a
                      className="modal-content__texts-policy"
                      href="#"
                      onClick={(ev) => {
                        ev.preventDefault();
                        props.onResendEmail();
                      }}
                    />,
                  ]}
                />
              </p>
              <p className="modal-content__text">
                <Trans
                  i18nKey="common:textAuthIfAccountIsActivated"
                  components={[
                    // eslint-disable-next-line react/jsx-key
                    <a
                      className="modal-content__texts-policy"
                      href="#"
                      onClick={(ev) => {
                        ev.preventDefault();
                        props.onNavAuth();
                      }}
                    />,
                  ]}
                />
              </p>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
