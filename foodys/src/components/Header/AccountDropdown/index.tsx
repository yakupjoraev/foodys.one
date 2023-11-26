import useTranslation from "next-translate/useTranslation";
import { type Translate } from "next-translate";
import { useEffect, useMemo, useState } from "react";
import { Popover } from "react-tiny-popover";
import classNames from "classnames";
import style from "./style.module.css";
import { useWindowSize } from "@uidotdev/usehooks";
import { BREAKDOWN_992 } from "~/components/Layout";

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
  const [mobileMode, setMobileMode] = useState(false);
  const winSize = useWindowSize();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (winSize?.width !== null && winSize.width < BREAKDOWN_992) {
      setMobileMode(true);
    } else {
      setMobileMode(false);
    }
  }, [winSize]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (winSize?.width === null || winSize.width >= BREAKDOWN_992) {
      setPopoverOpen(false);
    }
  }, [winSize]);

  const handleClickOutside = () => {
    setPopoverOpen(false);
  };

  const handleMainBtnClick = () => {
    if (winSize?.width === null || winSize.width < BREAKDOWN_992) {
      if (!props.authentificated) {
        props.onLogInBtnClick && props.onLogInBtnClick();
      } else {
        props.onLogOutBtnClick && props.onLogOutBtnClick();
      }
    } else {
      setPopoverOpen(!popoverOpen);
    }
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
      <span
        className="menu__item-link"
        role="button"
        onClick={handleMainBtnClick}
      >
        <div className="menu__item-pic">
          <img
            src={
              props.authentificated
                ? "/img/header/my-account-active.svg"
                : "/img/header/my-account.svg"
            }
            alt="my-account"
            loading="lazy"
          />
          <img
            src={
              props.authentificated
                ? "/img/header/my-account-white-active.svg"
                : "/img/header/my-account-white.png"
            }
            alt="my-account"
            loading="lazy"
          />
        </div>
        {mobileMode && props.authentificated
          ? t("buttonSignOut")
          : t("buttonMyAccount")}
        <img
          className="menu__item-link-arrow"
          src="/img/header/arrow-right.svg"
          alt=""
        />
      </span>
    </Popover>
  );
}
