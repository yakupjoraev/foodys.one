import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import classNames from "classnames";

interface PaginatorProps {
  page: number;
  total: number;
  createUrl: (page: number) => string;
}

const NAV_LINK_LIMIT = 17;

export function Paginator(props: PaginatorProps) {
  const { t, lang } = useTranslation("common");

  if (props.page < 1 || props.total <= 1) {
    return null;
  }
  if (props.page > props.total) {
    return null;
  }

  const prevPage = props.page - 1;
  const nextPage = props.page + 1;

  const navLinks: JSX.Element[] = [];
  if (props.total <= NAV_LINK_LIMIT) {
    const endAt = props.total;
    for (let i = 1; i <= endAt; i++) {
      navLinks.push(renderNavLink(i, props.page, props.createUrl));
    }
  } else {
    const endAt = NAV_LINK_LIMIT - 2;
    for (let i = 1; i <= endAt; i++) {
      navLinks.push(renderNavLink(i, props.page, props.createUrl));
    }
    navLinks.push(
      <li className="nav-lists__item dots" key="dots">
        •••
      </li>
    );
    navLinks.push(
      <li
        className={
          props.page === props.total
            ? "nav-lists__item nav-lists__item--end active"
            : "nav-lists__item nav-lists__item--end"
        }
        key={"nav_link:" + props.total.toString()}
      >
        <Link className="nav-lists__link" href={props.createUrl(props.total)}>
          {props.total}
        </Link>
      </li>
    );
  }

  const wide = lang === "fr";

  return (
    <div className="nav-lists">
      {prevPage >= 1 ? (
        <Link
          className={classNames(
            "nav-lists__btn active",
            wide && "nav-lists__btn--wide"
          )}
          href={props.createUrl(prevPage)}
        >
          {t("textPreviousPage")}
        </Link>
      ) : (
        <span
          className={classNames(
            "nav-lists__btn",
            wide && "nav-lists__btn--wide"
          )}
        >
          {t("textPreviousPage")}
        </span>
      )}
      <ul className="nav-lists__list">{navLinks}</ul>
      {nextPage <= props.total ? (
        <Link
          className={classNames(
            "nav-lists__btn active",
            wide && "nav-lists__btn--wide"
          )}
          href={props.createUrl(nextPage)}
        >
          {t("textNextPage")}
        </Link>
      ) : (
        <span
          className={classNames(
            "nav-lists__btn",
            wide && "nav-lists__btn--wide"
          )}
        >
          {t("textNextPage")}
        </span>
      )}
    </div>
  );
}

function renderNavLink(
  page: number,
  currentPage: number,
  createUrl: (page: number) => string
) {
  return (
    <li
      className={
        page === currentPage ? "nav-lists__item active" : "nav-lists__item"
      }
      key={"nav_link:" + page.toString()}
    >
      <Link className="nav-lists__link" href={createUrl(page)}>
        {page.toString()}
      </Link>
    </li>
  );
}
