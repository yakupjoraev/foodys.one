import useTranslation from "next-translate/useTranslation";
import { type Translate } from "next-translate";
import { useState } from "react";
import { Popover } from "react-tiny-popover";
import classNames from "classnames";
import style from "./style.module.css";

export interface AccountDropdownProps {
  popoverContainerStyle?: Partial<CSSStyleDeclaration>;
  authentificated?: boolean;
  onLogInBtnClick?: () => void;
  onLogOutBtnClick?: () => void;
  onRegisterBtnClick?: () => void;
}

export function AccountDropdown(props: AccountDropdownProps) {
  const { t } = useTranslation("common");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClickOutside = () => {
    setPopoverOpen(false);
  };

  const handleMainBtnClick = () => {
    setPopoverOpen(!popoverOpen);
  };

  const menu = (
    <ul className={style["account-dropdown"]}>
      {props.authentificated ? (
        <li
          className={classNames(
            style["account-dropdown__item"],
            style["account-dropdown__item--last-child"]
          )}
        >
          <button
            className={style["account-dropdown__button"]}
            onClick={props.onLogOutBtnClick}
          >
            {t("buttonSignOut")}
          </button>
        </li>
      ) : (
        <>
          <li className={style["account-dropdown__item"]}>
            <button
              className={style["account-dropdown__button"]}
              onClick={props.onLogInBtnClick}
            >
              {t("buttonSignIn")}
            </button>
          </li>
          <li
            className={classNames(
              style["account-dropdown__item"],
              style["account-dropdown__item--last-child"]
            )}
          >
            <button
              className={style["account-dropdown__button"]}
              onClick={props.onRegisterBtnClick}
            >
              {t("buttonSignUp")}
            </button>
          </li>
        </>
      )}
    </ul>
  );

  return (
    <Popover
      isOpen={popoverOpen}
      positions={["bottom", "top", "left", "right"]}
      padding={5}
      align="end"
      onClickOutside={handleClickOutside}
      content={menu}
      containerStyle={props.popoverContainerStyle}
    >
      {renderMainBtn(t, handleMainBtnClick)}
    </Popover>
  );
}

function renderMainBtn(t: Translate, onClick: () => void) {
  return (
    <span className="menu__item-link" role="button" onClick={onClick}>
      <div className="menu__item-pic">
        <img src="/img/header/my-account.png" alt="my-account" loading="lazy" />
        <img
          src="/img/header/my-account-white.png"
          alt="my-account"
          loading="lazy"
        />
      </div>
      <div className="menu__item-free menu__item-free--grey">
        {t("scrollOverScrollOverComingSoon")}
      </div>
      {t("buttonMyAccount")}
      <img
        className="menu__item-link-arrow"
        src="/img/header/arrow-right.svg"
        alt=""
      />
    </span>
  );
}
