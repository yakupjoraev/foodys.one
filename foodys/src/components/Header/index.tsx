import classNames from "classnames";
import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import { LanguageSelector } from "./LanguageSelector";
import { AccountDropdown } from "./AccountDropdown";
import { NoFavoritesModal } from "../NoFavoritesModal";
import { useClientFavorites } from "~/providers/favorites-provider";

export interface HeaderProps {
  className?: string;
  mobileMenuExpanded?: boolean;
  authStatus?: "authenticated" | "loading" | "unauthenticated";
  onOpenMibileMenu: () => void;
  onCloseMobileMenu: () => void;
  onLogInBtnClick?: () => void;
  onLogOutBtnClick?: () => void;
  onRegisterBtnClick?: () => void;
}

export function Header(props: HeaderProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const queryFormId = useId();
  const [noFavoritesModalOpen, setNoFavoritesModalOpen] = useState(false);
  const [favorites] = useClientFavorites();

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
        props.onCloseMobileMenu();
      }
    }
  };

  const handleLocaleChange = (locale: string) => {
    const { pathname, asPath, query } = router;
    void router.push({ pathname, query }, asPath, { locale });
  };

  const handleNoFavoritesModalClose = () => {
    setNoFavoritesModalOpen(false);
  };

  return (
    <header className={classNames("header", props.className)}>
      <NoFavoritesModal
        open={noFavoritesModalOpen}
        onClose={handleNoFavoritesModalClose}
      />
      <form
        id={queryFormId}
        style={{ display: "none" }}
        onSubmit={handleQueryFormSubmit}
      />
      <nav className="nav">
        <div className="container">
          <div className="navbar">
            <div className="logo">
              <Link href="/">
                <img src="/img/icons/foodys-logo.svg" alt="Foodys" />
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
              <li className="menu__item">
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
              <li className="menu__item">
                <span
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
                </span>
              </li>
              <li className="menu__item">
                <Link
                  href="/favorites"
                  className="menu__item-link"
                  data-scroll=""
                  onClick={(ev) => {
                    if (favorites.length === 0) {
                      ev.preventDefault();
                      setNoFavoritesModalOpen(true);
                    }
                  }}
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
              <li className="menu__item">
                <AccountDropdown
                  authentificated={props.authStatus === "authenticated"}
                  onLogInBtnClick={props.onLogInBtnClick}
                  onLogOutBtnClick={props.onLogOutBtnClick}
                  onRegisterBtnClick={props.onRegisterBtnClick}
                />
              </li>
              {router.locale && (
                <li className="menu__item menu__item--desktop">
                  <LanguageSelector
                    locale={router.locale}
                    onChange={handleLocaleChange}
                  />
                </li>
              )}
              <li className="menu__item menu__item--mob">
                <Link
                  href="/about-us"
                  className="menu__item-link"
                  data-scroll=""
                >
                  {t("titleAboutUs")}
                </Link>
              </li>
              <li className="menu__item menu__item--mob">
                <Link
                  href="/terms-and-conditions"
                  className="menu__item-link"
                  data-scroll=""
                >
                  {t("titleTermsAndConditions")}
                </Link>
              </li>
              <li className="menu__item menu__item--mob">
                <Link
                  href="/privacy-policy"
                  className="menu__item-link"
                  data-scroll=""
                >
                  {t("textPrivacyPolicy")}
                </Link>
              </li>
              <li className="menu__item menu__item--mob">
                <Link
                  href="/cookies"
                  className="menu__item-link"
                  data-scroll=""
                >
                  {t("titleCookies")}
                </Link>
              </li>
              <li className="menu__item menu__item--mob">
                <Link
                  href="/contact-us"
                  className="menu__item-link"
                  data-scroll=""
                >
                  {t("textContactUs")}
                </Link>
              </li>
              <li className="menu__item menu__item--mob menu__item-footer">
                <span className="menu__item-footer-link">
                  <img src="/img/header/menu__item-footer-1.png" alt="cyprus" />
                </span>
                <Link
                  className="menu__item-footer-link"
                  href="https://www.greekecommerce.gr"
                >
                  <img src="/img/header/menu__item-footer-2.png" alt="greca" />
                </Link>
                <Link
                  className="footer__info-link footer__info-link--telegram"
                  href="https://twitter.com/FoodysOne"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 1200 1227"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                      fill="white"
                    />
                  </svg>
                </Link>
                <Link
                  className="footer__info-link footer__info-link--in"
                  href="https://www.linkedin.com/company/foodys-one/"
                >
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
                </Link>
                {router.locale && (
                  <LanguageSelector
                    locale={router.locale}
                    popoverContainerStyle={{ zIndex: "100" }}
                    onChange={handleLocaleChange}
                  />
                )}
              </li>
            </ul>
            <div
              className={classNames("burger", {
                "active-burger": props.mobileMenuExpanded,
              })}
              onClick={() => {
                props.mobileMenuExpanded
                  ? props.onCloseMobileMenu()
                  : props.onOpenMibileMenu();
              }}
            >
              <span />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
