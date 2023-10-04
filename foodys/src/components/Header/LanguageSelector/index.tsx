import { useState } from "react";
import { Popover } from "react-tiny-popover";
import style from "./style.module.css";
import classNames from "classnames";

export type LangCode = "FR" | "EN";

export interface LanguageSelectorProps {}

export function LanguageSelector(props: LanguageSelectorProps) {
  const [currentLang, setCurrentLang] = useState<LangCode>("FR");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClickOutside = () => {
    setPopoverOpen(false);
  };

  const handleMainBtnClick = () => {
    setPopoverOpen(!popoverOpen);
  };

  const handleLangChange = (lang: LangCode) => {
    setPopoverOpen(false);
    setCurrentLang(lang);
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
      {renderMainBtn(currentLang, handleMainBtnClick)}
    </Popover>
  );
}

function renderMainBtn(lang: "FR" | "EN", onClick: () => void): JSX.Element {
  switch (lang) {
    case "FR": {
      return (
        <button
          className="menu__item-link menu__item-link--languages"
          type="button"
          onClick={onClick}
        >
          <div className="menu__item-pic">
            <img src="/img/header/fr.svg" alt="" width={24} height={24} />
          </div>
          FR
        </button>
      );
    }
    case "EN": {
      return (
        <button
          className="menu__item-link menu__item-link--languages"
          type="button"
          onClick={onClick}
        >
          <div className="menu__item-pic">
            <img src="/img/header/gb.svg" alt="" width={24} height={24} />
          </div>
          EN
        </button>
      );
    }
  }
}

function renderLanguageMenu(onChange: (lang: LangCode) => void) {
  return (
    <ul className={style["language-menu"]}>
      <li className={style["language-menu__item"]}>
        <button
          className={style["language-btn"]}
          type="button"
          onClick={() => void onChange("FR")}
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
          onClick={() => void onChange("EN")}
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
