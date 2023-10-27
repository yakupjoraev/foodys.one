import classNames from "classnames";
import Link from "next/link";
import { FormEvent, useId } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { LanguageSelector } from "./LanguageSelector";

export interface HeaderProps {
  className?: string;
  mobileMenuExpanded?: boolean;
  authStatus?: "authenticated" | "loading" | "unauthenticated";
  onToggleMobileMenu?: () => void;
  onLogInBtnClick?: () => void;
  onLogOutBtnClick?: () => void;
  onRegisterBtnClick?: () => void;
}

export function Header(props: HeaderProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryFormId = useId();

  const handleQueryFormSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const queryInput = ev.currentTarget.elements.namedItem("query");
    if (!queryInput) {
      return;
    }

    if (queryInput instanceof HTMLInputElement) {
      const value = queryInput.value;
      if (value) {
        void router.push(`/places?query=${encodeURIComponent(value)}`);
      }
    }
  };

  const handleLocaleChange = (locale: string) => {
    const { pathname, asPath, query } = router;
    void router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <header className={classNames("header", props.className)}>
      <nav className="nav">
        <div className="container">
          <div className="navbar">
            <div className="logo">
              <Link href="/">
                <img src="/img/icons/header-logo.svg" alt="logo" />
              </Link>
            </div>
            <ul
              className={classNames("menu", {
                active: props.mobileMenuExpanded,
              })}
            >
              <li
                className="menu__item--searching search-wrapper"
                data-search-wrapper=""
              >
                <form
                  id={queryFormId}
                  style={{ display: "none" }}
                  onSubmit={handleQueryFormSubmit}
                />
                <input
                  className="menu__item-search"
                  type="search"
                  placeholder={t("textSupportSearchExample")}
                  data-search-input=""
                  name="query"
                  form={queryFormId}
                />
                <img
                  className="menu__item-search-icon"
                  src="/img/icons/glass.svg"
                  alt=""
                />
                <button
                  className="menu__item-search-btn"
                  type="submit"
                  form={queryFormId}
                >
                  {t("buttonSearch")}
                </button>
              </li>
              <li className="menu__item" onClick={props.onToggleMobileMenu}>
                <Link href="/" className="menu__item-link" data-scroll="">
                  <div className="menu__item-pic">
                    <img src="/img/header/home.png" alt="home" loading="lazy" />
                    <img
                      src="/img/header/home-white.png"
                      alt="home"
                      loading="lazy"
                    />
                  </div>
                  {t("buttonHome")}
                  <img
                    className="menu__item-link-arrow"
                    src="/img/header/arrow-right.svg"
                    alt=""
                  />
                </Link>
              </li>
              <li className="menu__item" onClick={props.onToggleMobileMenu}>
                <a
                  href="#"
                  className="menu__item-link menu__item-link--list-my-business"
                  data-scroll=""
                >
                  <div className="menu__item-free menu__item-free--grey">
                    {t("scrollOverScrollOverComingSoon")}
                  </div>
                  <div className="menu__item-pic">
                    <picture>
                      <source
                        media="(max-width: 767px)"
                        srcSet="/img/header/list-my-buiseness-yellow.svg"
                      />
                      <img
                        src="/img/header/list-my-buiseness.png"
                        alt="list-my-buiseness"
                        loading="lazy"
                      />
                      <img
                        src="/img/header/list-my-buiseness-yellow.svg "
                        alt="list-my-buiseness"
                        loading="lazy"
                      />
                    </picture>
                  </div>
                  {t("buttonListMyBusiness")}
                  <img
                    className="menu__item-link-arrow"
                    src="/img/header/arrow-right.svg"
                    alt=""
                  />
                </a>
              </li>
              <li className="menu__item" onClick={props.onToggleMobileMenu}>
                <Link
                  href="/favorites"
                  className="menu__item-link"
                  data-scroll=""
                >
                  <div className="menu__item-pic">
                    <img
                      src="/img/header/favorite.png"
                      alt="favorite"
                      loading="lazy"
                    />
                    <img
                      src="/img/header/favorite-white.png"
                      alt="favorite"
                      loading="lazy"
                    />
                  </div>
                  {t("buttonFavourites")}
                  <img
                    className="menu__item-link-arrow"
                    src="/img/header/arrow-right.svg"
                    alt=""
                  />
                </Link>
              </li>
              <li className="menu__item" onClick={props.onToggleMobileMenu}>
                <a href="#" className="menu__item-link" data-scroll="">
                  <div className="menu__item-pic">
                    <img
                      src="/img/header/my-account.png"
                      alt="my-account"
                      loading="lazy"
                    />
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
                </a>
              </li>
              {(props.authStatus === "loading" ||
                props.authStatus === "unauthenticated") && (
                <li className="menu__item" onClick={props.onToggleMobileMenu}>
                  <span
                    className="menu__item-link"
                    data-scroll=""
                    role="button"
                    onClick={props.onLogInBtnClick}
                  >
                    {t("buttonSignIn")}
                    <img
                      className="menu__item-link-arrow"
                      src="/img/header/arrow-right.svg"
                      alt=""
                    />
                  </span>
                </li>
              )}
              {(props.authStatus === "unauthenticated" ||
                props.authStatus === "loading") && (
                <li className="menu__item" onClick={props.onToggleMobileMenu}>
                  <span
                    className="menu__item-link"
                    data-scroll=""
                    role="button"
                    onClick={props.onRegisterBtnClick}
                  >
                    Register
                    <img
                      className="menu__item-link-arrow"
                      src="/img/header/arrow-right.svg"
                      alt=""
                    />
                  </span>
                </li>
              )}
              {props.authStatus === "authenticated" && (
                <li className="menu__item" onClick={props.onToggleMobileMenu}>
                  <span
                    className="menu__item-link"
                    data-scroll=""
                    onClick={props.onLogOutBtnClick}
                  >
                    Sign Out
                    <img
                      className="menu__item-link-arrow"
                      src="/img/header/arrow-right.svg"
                      alt=""
                    />
                  </span>
                </li>
              )}
              {router.locale && (
                <li className="menu__item menu__item--desktop">
                  <LanguageSelector
                    locale={router.locale}
                    onChange={handleLocaleChange}
                  />
                </li>
              )}
              <li className="menu__item menu__item--mob">
                <a href="/about" className="menu__item-link" data-scroll="">
                  {t("titleAboutUs")}
                </a>
              </li>
              <li className="menu__item menu__item--mob">
                <a href="#" className="menu__item-link" data-scroll="">
                  {t("titleTermsAndConditions")}
                </a>
              </li>
              <li className="menu__item menu__item--mob">
                <a href="#" className="menu__item-link" data-scroll="">
                  Privacy Policy
                </a>
              </li>
              <li className="menu__item menu__item--mob">
                <a href="#" className="menu__item-link" data-scroll="">
                  {t("titleCookies")}
                </a>
              </li>
              <li className="menu__item menu__item--mob">
                <a href="#" className="menu__item-link" data-scroll="">
                  {t("textContactUs")}
                </a>
              </li>
              <li className="menu__item menu__item--mob menu__item-footer">
                <a className="menu__item-footer-link" href="#">
                  <img src="/img/header/menu__item-footer-1.png" alt="cyprus" />
                </a>
                <a className="menu__item-footer-link" href="#">
                  <img src="/img/header/menu__item-footer-2.png" alt="greca" />
                </a>
                <a
                  className="footer__info-link footer__info-link--telegram"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={19}
                    height={19}
                    viewBox="0 0 19 19"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_2671_785)">
                      <path
                        d="M0.805532 13.7129C1.54822 13.6222 2.30133 13.7199 3.04402 13.5979C3.41708 13.5386 3.75879 13.4131 4.09701 13.2806C3.26022 12.7437 2.50703 12.13 1.80626 11.3943C1.55522 11.1328 1.7365 10.6935 2.10263 10.683C2.40251 10.697 2.69538 10.6726 2.98126 10.6133C2.25249 9.68931 1.68766 8.69559 1.24835 7.57984C1.12983 7.27997 1.47846 6.97667 1.76092 7.06727C1.92478 7.13353 2.09213 7.17887 2.26299 7.21371C1.7435 5.96545 1.6354 4.70676 1.92478 3.32599C1.99103 3.00869 2.40943 2.93201 2.62213 3.14121C4.28878 4.77987 6.39475 5.5679 8.64716 5.94445C8.44839 4.40331 9.54329 2.76458 10.9798 2.22759C12.1723 1.78477 13.7727 2.08815 14.5746 3.09229C15.1116 2.75408 15.8542 2.64248 16.4505 2.53788C16.7642 2.48554 17.0676 2.79242 16.8828 3.10272C16.6666 3.46535 16.461 3.85233 16.2343 4.22196C16.6946 4.08594 17.1688 4.00226 17.643 3.943C17.9847 3.89767 18.1904 4.42416 17.9289 4.63336C17.3745 5.07617 16.8236 5.58174 16.2343 5.98622C16.2169 9.90178 15.0732 13.1863 11.5761 15.4143C8.66108 17.2763 3.24272 16.9625 0.707932 14.4277H0.704432C0.592835 14.3998 0.533575 14.3161 0.512656 14.2255C0.415055 14.079 0.484737 13.8978 0.613755 13.828C0.662593 13.7687 0.725352 13.7233 0.805532 13.7129Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2671_785">
                        <rect
                          width="17.5805"
                          height="17.5805"
                          fill="white"
                          transform="translate(0.466797 0.527344)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                <a className="footer__info-link footer__info-link--in" href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={17}
                    viewBox="0 0 18 17"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_2671_472)">
                      <path
                        d="M4.75981 5.74805H1.50198C1.35739 5.74805 1.24023 5.86526 1.24023 6.00979V16.4758C1.24023 16.6204 1.35739 16.7375 1.50198 16.7375H4.75981C4.90439 16.7375 5.02155 16.6204 5.02155 16.4758V6.00979C5.02155 5.86526 4.90439 5.74805 4.75981 5.74805Z"
                        fill="white"
                      />
                      <path
                        d="M3.13218 0.544922C1.94679 0.544922 0.982422 1.50825 0.982422 2.69232C0.982422 3.87693 1.94679 4.84062 3.13218 4.84062C4.31662 4.84062 5.28021 3.87687 5.28021 2.69232C5.28026 1.50825 4.31662 0.544922 3.13218 0.544922Z"
                        fill="white"
                      />
                      <path
                        d="M13.0468 5.48828C11.7384 5.48828 10.7711 6.05077 10.1844 6.6899V6.01015C10.1844 5.86561 10.0673 5.7484 9.9227 5.7484H6.80276C6.65817 5.7484 6.54102 5.86561 6.54102 6.01015V16.4761C6.54102 16.6207 6.65817 16.7379 6.80276 16.7379H10.0535C10.1981 16.7379 10.3152 16.6207 10.3152 16.4761V11.2979C10.3152 9.55296 10.7892 8.87316 12.0056 8.87316C13.3303 8.87316 13.4356 9.96296 13.4356 11.3877V16.4762C13.4356 16.6208 13.5527 16.7379 13.6973 16.7379H16.9492C17.0938 16.7379 17.211 16.6208 17.211 16.4762V10.7354C17.211 8.14075 16.7162 5.48828 13.0468 5.48828Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2671_472">
                        <rect
                          width="16.2281"
                          height="16.2281"
                          fill="white"
                          transform="translate(0.982422 0.527344)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                {router.locale && (
                  <LanguageSelector
                    locale={router.locale}
                    popoverContainerStyle={{ zIndex: "10" }}
                    onChange={handleLocaleChange}
                  />
                )}
              </li>
            </ul>
            <div
              className={classNames("burger", {
                "active-burger": props.mobileMenuExpanded,
              })}
              onClick={props.onToggleMobileMenu}
            >
              <span />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
