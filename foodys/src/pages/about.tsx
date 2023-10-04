import { AboutSearch } from "~/components/AboutSearch";
import { Layout } from "~/components/Layout";
import { AboutPartners } from "~/components/AboutPartners";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";

export default function About() {
  const { t } = useTranslation("common");

  return (
    <Layout title="Foodys - About us">
      <main className="main">
        <section className="about">
          <div className="container">
            <div className="about__inner">
              <div className="about__info">
                <div className="about__info-main">
                  <h1 className="about__title">{t("titleAboutUs")}</h1>
                  <div className="about__descrs">
                    <Trans
                      i18nKey="common:textAboutUsContent"
                      components={[<p />, <p />, <p />]}
                    />
                  </div>
                </div>
                <div className="about__info-picture">
                  <img
                    className="about__info-pic"
                    src="/img/about/about__info-aragon.png"
                    alt="aragon telecom"
                  />
                </div>
                <div className="about__info-third">
                  <ul className="about__info-list">
                    <li className="about__info-item">
                      <a className="about__info-link" href="#">
                        <img
                          src="/img/about/about__info-1.png"
                          alt="partners"
                        />
                      </a>
                      <a className="about__info-link" href="#">
                        <img
                          src="/img/about/about__info-2.png"
                          alt="partners"
                        />
                      </a>
                      <a className="about__info-link" href="#">
                        <img
                          src="/img/about/about__info-3.png"
                          alt="partners"
                        />
                      </a>
                      <a className="about__info-link" href="#">
                        <img
                          src="/img/about/about__info-4.png"
                          alt="partners"
                        />
                      </a>
                      <a className="about__info-link" href="#">
                        <img
                          src="/img/about/about__info-5.png"
                          alt="partners"
                        />
                      </a>
                    </li>
                  </ul>
                  <a className="about__btn" href={t("urlLearnMoreAboutUs")}>
                    {t("buttonLearnMoreAboutUs")}
                  </a>
                </div>
              </div>
              <AboutPartners />
              <AboutSearch />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
