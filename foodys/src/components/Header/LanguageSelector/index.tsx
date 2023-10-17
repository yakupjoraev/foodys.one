import { useState } from "react";
import { Popover } from "react-tiny-popover";
import style from "./style.module.css";
import classNames from "classnames";

export interface LanguageSelectorProps {
  locale: string;
  onChange: (locale: string) => void;
}

export function LanguageSelector(props: LanguageSelectorProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClickOutside = () => {
    setPopoverOpen(false);
  };

  const handleMainBtnClick = () => {
    setPopoverOpen(!popoverOpen);
  };

  const handleLangChange = (locale: string) => {
    setPopoverOpen(false);
    props.onChange(locale);
  };

  return (
    <Popover
      isOpen={popoverOpen}
      positions={["bottom", "top", "left", "right"]}
      padding={5}
      align="end"
      onClickOutside={handleClickOutside}
      content={renderLanguageMenu(handleLangChange)}
    >
      {renderMainBtn(props.locale, handleMainBtnClick)}
    </Popover>
  );
}

function renderMainBtn(locale: string, onClick: () => void): JSX.Element {
  switch (locale) {
    case "fr": {
      return (
        <button
          className="menu__item-link menu__item-link--languages"
          type="button"
          onClick={onClick}
        >
          <div className="menu__item-pic">
            <img src="/img/header/fr.svg" alt="" width={24} height={24} />
            <img src="/img/header/fr.svg" alt="" width={24} height={24} />
          </div>
          FR
        </button>
      );
    }
    case "en": {
      return (
        <button
          className="menu__item-link menu__item-link--languages"
          type="button"
          onClick={onClick}
        >
          <div className="menu__item-pic">
            <img src="/img/header/gb.svg" alt="" width={24} height={24} />
            <img src="/img/header/gb.svg" alt="" width={24} height={24} />
          </div>
          EN
        </button>
      );
    }
    default: {
      return (
        <button
          className="menu__item-link menu__item-link--languages"
          type="button"
          onClick={onClick}
        >
          {locale}
        </button>
      );
    }
  }
}

function renderLanguageMenu(onChange: (locale: string) => void) {
  return (
    <ul className={style["language-menu"]}>
      <li className={style["language-menu__item"]}>
        <button
          className={style["language-btn"]}
          type="button"
          onClick={() => void onChange("fr")}
        >
          <img
            className={style["language-btn__icon"]}
            src="/img/header/fr.svg"
            width={24}
            height={24}
          />
          Français
        </button>
      </li>
      <li
        className={classNames(
          style["language-menu__item"],
          style["language-menu__item--last-child"]
        )}
      >
        <button
          className={style["language-btn"]}
          type="button"
          onClick={() => void onChange("en")}
        >
          <img
            className={style["language-btn__icon"]}
            src="/img/header/gb.svg"
            width={24}
            height={24}
          />
          English
        </button>
      </li>
    </ul>
  );
}
