import classNames from "classnames";
import { useRef } from "react";

export interface CryptoModalProps {
  open: boolean;
  onClose: () => void;
}

export function CryptoModal(props: CryptoModalProps) {
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
      className={classNames("modal modal--large", { show: props.open })}
      onClick={handleCoverClick}
    >
      <div className="modal-content" ref={modalContentRef}>
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
            <h2 className="modal-content__crypto-title">
              Pay your restaurant <br />
              or delivery with crypto:
            </h2>
            <p className="modal-content__crypto-text">
              install for free the Paypolitan app and get in 2 minutes a virtual
              credit or debit card
            </p>
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
