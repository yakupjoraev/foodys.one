import { AboutSearch } from "~/components/AboutSearch";
import { Layout } from "~/components/Layout";
import { AboutPartners } from "~/components/AboutPartners";
import useTranslation from "next-translate/useTranslation";
import Trans from "next-translate/Trans";
import { CookiesModalContainer } from "~/containers/CookiesModalContainer";
import Head from "next/head";
import { HreflangMeta } from "~/components/HreflangMeta";

const ABOUT_US_SCHEMA = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Foodys",
  "url": "https://foodys.one/about-us",
  "logo": "https://foodys.one/img/icons/fr/foodys-logo.svg",
  "contactPoint": {
      "@type": "ContactPoint",
      "email": "info@foodys.one",
      "contactType": "customer service"
  },
  "sameAs": [
      "https://twitter.com/FoodysOne",
      "https://www.linkedin.com/company/foodys-one/"
  ]
}`;

export default function About() {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("pageTitleAboutUs")}>
      <Head>
        <meta name="robots" content="index, follow" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: ABOUT_US_SCHEMA }}
          key="organization-jsonld"
        ></script>
      </Head>
      <HreflangMeta />
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
                      // eslint-disable-next-line react/jsx-key
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
                      <span className="about__info-link">
                        <img src="/img/about/info/foodys.png" alt="Foodys" />
                      </span>
                      <span className="about__info-link">
                        <img
                          src="/img/about/info/horaires.png"
                          alt="Horaires"
                        />
                      </span>
                      <span className="about__info-link">
                        <img
                          src="/img/about/info/annuaire.png"
                          alt="Annuaire"
                        />
                      </span>
                      <span className="about__info-link">
                        <img
                          src="/img/about/info/taxipolitan.png"
                          alt="Taxipolitan"
                        />
                      </span>
                      <span className="about__info-link">
                        <img
                          src="/img/about/info/horloge-parlante.png"
                          alt="3200 Horloge parlante"
                        />
                      </span>
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
      <CookiesModalContainer />
    </Layout>
  );
}
