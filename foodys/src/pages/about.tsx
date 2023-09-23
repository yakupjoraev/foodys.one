import classNames from "classnames";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export default function About() {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991.98) {
        setMobileExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={classNames("main__body", { locked: mobileExpanded })}>
      <Head>
        <title>Foodys</title>
        <link rel="stylesheet" href="/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
      </Head>
      <Header
        mobileMenuExpanded={mobileExpanded}
        onToggleMobileMenu={() => setMobileExpanded(!mobileExpanded)}
      />
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
              <div className="about__partners">
                <h2 className="about__partners-title about__title">
                  Our partners
                </h2>
                <Swiper
                  className="about__partners-slider mySwiper"
                  spaceBetween={24}
                  slidesPerView={4}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  navigation={{
                    nextEl: ".about__partners-arrow--next",
                    prevEl: ".about__partners-arrow--prev",
                  }}
                  breakpoints={{
                    // when window width is >= 320px
                    320: {
                      spaceBetween: 12,
                      slidesPerView: 2,
                    },
                    // when window width is >= 480px
                    767: {
                      spaceBetween: 16,
                      slidesPerView: 3,
                    },
                    // when window width is >= 640px
                    992: {
                      spaceBetween: 24,
                      slidesPerView: 4,
                    },
                  }}
                  wrapperClass="about__partners-wrapper"
                >
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-1.png"
                      alt=""
                      width={230}
                      height={38}
                    />
                  </SwiperSlide>
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-2.svg"
                      alt=""
                      width={101}
                      height={32}
                    />
                  </SwiperSlide>
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-3.png"
                      alt=""
                      width={239}
                      height={28}
                    />
                  </SwiperSlide>
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-4.png"
                      alt=""
                      width={237}
                      height={82}
                    />
                  </SwiperSlide>
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-1.png"
                      alt=""
                      width={230}
                      height={38}
                    />
                  </SwiperSlide>
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-2.svg"
                      alt=""
                      width={101}
                      height={32}
                    />
                  </SwiperSlide>
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-3.png"
                      alt=""
                      width={239}
                      height={28}
                    />
                  </SwiperSlide>
                  <SwiperSlide className="about__partners-slide">
                    <img
                      className="about__partners-pic"
                      src="/img/about/about__partners-4.png"
                      alt=""
                      width={237}
                      height={82}
                    />
                  </SwiperSlide>
                </Swiper>
              </div>
              <form action="#" className="about__find">
                <div className="about__find-inner">
                  <div className="about__find-picture">
                    <img
                      className="about__find-pic"
                      src="/img/about/about__find-burger.png"
                      alt="burger"
                    />
                  </div>
                  <div className="about__find-searching">
                    <p className="about__find-label">
                      Find a restaurant or a delivery:
                    </p>
                    <div className="about__find-search">
                      <input
                        className="about__find-seacrh-input"
                        type="search"
                        placeholder="City, cuisine or restaurant name"
                      />
                      <img
                        className="about__find-search-icon"
                        src="/img/icons/glass.svg"
                        alt="glass"
                      />
                    </div>
                    <button type="button" className="about__find-btn">
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
