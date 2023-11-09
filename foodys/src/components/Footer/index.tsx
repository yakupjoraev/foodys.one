import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { forwardRef } from "react";
import classNames from "classnames";

export interface FooterProps {
  className?: string;
}

export const Footer = forwardRef<HTMLElement, FooterProps>(function Footer(
  props: FooterProps,
  ref
) {
  const { t } = useTranslation("common");

  return (
    <footer className={classNames("footer", props.className)} ref={ref}>
      <div className="container footer__container">
        <div className="footer__inner">
          <div className="footer__top">
            <nav className="footer__nav">
              <Link className="footer__nav-link" href="/about-us">
                {t("titleAboutUs")}
              </Link>
              <Link className="footer__nav-link" href="/terms-and-conditions">
                {t("titleTermsAndConditions")}
              </Link>
              <Link className="footer__nav-link" href="/cookies">
                {t("titleCookies")}
              </Link>
              <Link className="footer__nav-link" href="/privacy-policy">
                Privacy Policy
              </Link>
              <Link className="footer__nav-link" href="/contact-us">
                {t("textContactUs")}
              </Link>
            </nav>
            <span className="footer__country">
              <img src="/img/icons/footer-country.svg" alt="country icon" />
              <span>{t("titleFrance")}</span>
            </span>
          </div>
          <div className="footer__bottom">
            <div className="footer__info">
              <div className="footer__info-block">
                <span className="footer__info-link">
                  <img
                    src="/img/footer/info/cyprus-made.png"
                    alt="Cyprus Made"
                  />
                </span>
                <a
                  className="footer__info-link"
                  href="https://www.greekecommerce.gr"
                >
                  <img src="/img/footer/info/greca.png" alt="GRECA" />
                </a>
              </div>
              <div className="footer__info-block">
                <a
                  className="footer__info-link footer__info-link--telegram"
                  href="#"
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 1200 1227"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                      fill="white"
                    />
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
              </div>
            </div>
            <span className="footer__country footer__country--mob">
              <img src="/img/icons/footer-country.svg" alt="country icon" />
              <span>{t("titleFrance")}</span>
            </span>
            <div className="footer__partners">
              <ul className="footer__partners-list">
                <li className="footer__partners-item">
                  <span className="footer__partners-link">
                    <span className="footer__partners-link-cooming">
                      {t("scrollOverScrollOverComingSoon")}
                    </span>
                    <img
                      className="footer__partners-pic"
                      src="/img/footer/partners/horaires.svg"
                      alt="Horaires"
                    />
                  </span>
                </li>
                <li className="footer__partners-item">
                  <span className="footer__partners-link">
                    <span className="footer__partners-link-cooming">
                      {t("scrollOverScrollOverComingSoon")}
                    </span>
                    <img
                      className="footer__partners-pic"
                      src="/img/footer/partners/annuaire.svg"
                      alt="Annuire"
                    />
                  </span>
                </li>
                <li className="footer__partners-item">
                  <span className="footer__partners-link">
                    <span className="footer__partners-link-cooming">
                      {t("scrollOverScrollOverComingSoon")}
                    </span>
                    <img
                      className="footer__partners-pic"
                      src="/img/footer/partners/taxipolitan.svg"
                      alt="Taxipolitan"
                    />
                  </span>
                </li>
                <li className="footer__partners-item">
                  <a
                    className="footer__partners-link"
                    href="http://horlogeparlantepro.com"
                  >
                    <img
                      className="footer__partners-pic"
                      src="/img/footer/partners/horloge-parlante.svg"
                      alt="3200 Horloge parlante"
                    />
                  </a>
                </li>
              </ul>
              <div className="footer__copy">{t("textCopyright")}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});
