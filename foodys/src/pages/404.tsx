import useTranslation from "next-translate/useTranslation";
import Link from "next/link";

export default function NotFound() {
  const { t } = useTranslation("common");

  return (
    <div className="not-found">
      <div className="not-found__inner">
        <a href="/" className="not-found__logo">
          <img width="400" src="/img/icons/foodys-logo.svg" alt="" />
        </a>
        <div className="not-found__sum">404</div>
        <p className="not-found__text">{t("textPageNotFound")}</p>

        <Link className="not-found__link" href="/">
          {t("buttonGoToHomePage")}
        </Link>
      </div>
    </div>
  );
}
