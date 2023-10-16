import useTranslation from "next-translate/useTranslation";

export function DashboardAside() {
  const { t } = useTranslation("common");

  return (
    <aside className="dashboard__aside">
      <a className="dashboard__aside-link" href="#">
        <img src="/img/dashboard/aside-pic.png" alt="aside pic reclame" />
      </a>
      <div className="dashboard__aside-footer">
        <p className="dashboard__aside-text">As an advertisement</p>
        <a className="dashboard__aside-more" target="_blank" href="#">
          {t("buttonLearnMore")}
        </a>
      </div>
    </aside>
  );
}
