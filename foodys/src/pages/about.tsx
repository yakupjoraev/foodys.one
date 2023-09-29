import { AboutSearch } from "~/components/AboutSearch";
import { Layout } from "~/components/Layout";
import { AboutPartners } from "~/components/AboutPartners";

export default function About() {
  return (
    <Layout title="Foodys - About us">
      <main className="main">
        <section className="about">
          <div className="container">
            <div className="about__inner">
              <div className="about__info">
                <div className="about__info-main">
                  <h1 className="about__title">About us</h1>
                  <div className="about__descrs">
                    <p>
                      Foodys.one is a consumer portal for restaurants powered by
                      Aragon Telecom Group. Our group was founded back in 2008
                      by a group of experienced managers and entrepreneurs with
                      a background of telecommunications and engineering. Aragon
                      Telecom France, part of the Aragon Telecom Group, has a
                      full telecommunications operators license provided by the
                      French telecommunications regulator ARCEP.
                    </p>
                    <p>
                      During the pandemic in 2020, we launched Aragon Telecom
                      Labs, our innovative R&amp;D department, exploring new
                      solutions in telecommunications.
                    </p>
                    <p>
                      In 2022, Aragon Telecom Group launched a new series of
                      consumer portals and directories being part of our “Point
                      One” family. The different portals will be launched over
                      the next 3 years. Our management team is built of former
                      top managers of reknown directories and directory
                      assistance services with a large track record.
                    </p>
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
                  <a className="about__btn" href="#">
                    Learn more about us
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
