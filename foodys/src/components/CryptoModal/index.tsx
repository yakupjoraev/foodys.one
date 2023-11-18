import classNames from "classnames";
import Trans from "next-translate/Trans";

export interface CryptoModalProps {
  open: boolean;
  onClose: () => void;
}

export function CryptoModal(props: CryptoModalProps) {
  return (
    <div className={classNames("modal modal--large", { show: props.open })}>
      <div className="modal-content">
        <span className="close-modal-btn" onClick={props.onClose}>
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
        <div className="modal-content__crypto">
          <img
            className="modal-content__crypto-pic"
            src="/img/crypto-pay.png"
            alt="crypto pay"
          />
          <div className="modal-content__crypto-info">
            <div className="modal-content__crypto-label">
              <img src="/img/crypto-label.svg" alt="crypto label" />
            </div>
            <Trans
              i18nKey="common:textPayInCryptoInvit"
              components={[
                // eslint-disable-next-line react/jsx-key
                <h2 className="modal-content__crypto-title" />,
                // eslint-disable-next-line react/jsx-key
                <br />,
                // eslint-disable-next-line react/jsx-key
                <p className="modal-content__crypto-text" />,
              ]}
            />
            <div className="modal-content__crypto-stores">
              <img
                className="modal-content__crypto-payoliton"
                src="/img/payoliton.png"
                alt="payoliton"
              />
              <ul className="modal-content__crypto-list">
                <li className="modal-content__crypto-item">
                  <a className="modal-content__crypto-link" href="#">
                    <img src="/img/appstore.svg" alt="appstore" />
                  </a>
                </li>
                <li className="modal-content__crypto-item">
                  <a className="modal-content__crypto-link" href="#">
                    <img src="/img/googleplay.svg" alt="googleplay" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
