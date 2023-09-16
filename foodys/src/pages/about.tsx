import Head from "next/head";

export default function About() {
  return (
    <div className="main__body">
      <Head>
        <title>Foodys</title>
        <link rel="styleheet" href="https://yakupjoraev.github.io/foodys.one/front/build/css/style.min.css" />
      </Head>
      {/* Header */}
      <header className="header">
        {/* Navbar */}
        <nav className="nav">
          <div className="container">
            <div className="navbar">
              <div className="logo">
                <a href="/">
                  <img src="/img/icons/header-logo.svg" alt="logo" />
                </a>
              </div>
              <ul className="menu">
                <li className="menu__item menu__item--searching">
                  <input
                    className="menu__item-search"
                    type="search"
                    placeholder="City, cuisine or restaurant name"
                  />
                  <img
                    className="menu__item-search-icon"
                    src="/img/icons/glass.svg"
                    alt=""
                  />
                </li>
                <li className="menu__item">
                  <a href="#" className="menu__item-link" data-scroll="">
                    <div className="menu__item-pic">
                      <img src="/img/header/home.png" alt="home " />
                    </div>
                    Home
                  </a>
                </li>
                <li className="menu__item">
                  <a
                    href="#"
                    className="menu__item-link menu__item-link--list-my-business"
                    data-scroll=""
                  >
                    <div className="menu__item-free">FREE</div>
                    <div className="menu__item-pic">
                      <img
                        src="/img/header/list-my-buiseness.png"
                        alt="list-my-buiseness"
                      />
                    </div>
                    List my Business
                  </a>
                </li>
                <li className="menu__item">
                  <a href="#" className="menu__item-link" data-scroll="">
                    <div className="menu__item-pic">
                      <img src="/img/header/favorite.png" alt="favorite" />
                    </div>
                    Favourites
                  </a>
                </li>
                <li className="menu__item">
                  <a href="#" className="menu__item-link" data-scroll="">
                    <div className="menu__item-pic">
                      <img src="/img/header/my-account.png" alt="my-account" />
                    </div>
                    My account
                  </a>
                </li>
                <li className="menu__item">
                  <a
                    href="#"
                    className="menu__item-link menu__item-link--languages"
                    data-scroll=""
                  >
                    <div className="menu__item-pic">
                      <img src="/img/header/en.png" alt="" />
                    </div>
                    EN
                  </a>
                </li>
              </ul>
              <div className="burger">
                <span />
              </div>
            </div>
          </div>
        </nav>
      </header>
      {/* Main Page */}
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
                      {" "}
                      During the pandemic in 2020, we launched Aragon Telecom
                      Labs, our innovative R&amp;D department, exploring new
                      solutions in telecommunications.
                    </p>
                    <p>
                      {" "}
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
                <div className="about__partners-slider swiper mySwiper swiper-initialized swiper-horizontal swiper-backface-hidden">
                  <div
                    className="about__partners-wrapper swiper-wrapper"
                    id="swiper-wrapper-5eb059442e95db54"
                    aria-live="polite"
                  >
                    <div
                      className="about__partners-slide swiper-slide swiper-slide-active"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="1 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-1.png"
                        alt=""
                        width={230}
                        height={38}
                      />
                    </div>
                    <div
                      className="about__partners-slide swiper-slide swiper-slide-next"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="2 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-2.svg"
                        alt=""
                        width={101}
                        height={32}
                      />
                    </div>
                    <div
                      className="about__partners-slide swiper-slide"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="3 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-3.png"
                        alt=""
                        width={239}
                        height={28}
                      />
                    </div>
                    <div
                      className="about__partners-slide swiper-slide"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="4 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-4.png"
                        alt=""
                        width={237}
                        height={82}
                      />
                    </div>
                    <div
                      className="about__partners-slide swiper-slide"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="5 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-1.png"
                        alt=""
                        width={230}
                        height={38}
                      />
                    </div>
                    <div
                      className="about__partners-slide swiper-slide"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="6 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-2.svg"
                        alt=""
                        width={101}
                        height={32}
                      />
                    </div>
                    <div
                      className="about__partners-slide swiper-slide"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="7 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-3.png"
                        alt=""
                        width={239}
                        height={28}
                      />
                    </div>
                    <div
                      className="about__partners-slide swiper-slide"
                      style={{ width: 280, marginRight: 24 }}
                      role="group"
                      aria-label="8 / 8"
                    >
                      <img
                        className="about__partners-pic"
                        src="/img/about/about__partners-4.png"
                        alt=""
                        width={237}
                        height={82}
                      />
                    </div>
                  </div>
                  <div
                    className="about__partners-arrow about__partners-arrow--prev swiper-button-disabled"
                    tabIndex={-1}
                    role="button"
                    aria-label="Previous slide"
                    aria-controls="swiper-wrapper-5eb059442e95db54"
                    aria-disabled="true"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={21}
                      viewBox="0 0 14 21"
                      fill="none"
                    >
                      <path
                        d="M12 2L4 10.5L12 19"
                        stroke="#A8ADB8"
                        strokeWidth={5}
                      />
                    </svg>
                  </div>
                  <div
                    className="about__partners-arrow about__partners-arrow--next"
                    tabIndex={0}
                    role="button"
                    aria-label="Next slide"
                    aria-controls="swiper-wrapper-5eb059442e95db54"
                    aria-disabled="false"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={14}
                      height={21}
                      viewBox="0 0 14 21"
                      fill="none"
                    >
                      <path
                        d="M2 2L10 10.5L2 19"
                        stroke="#A8ADB8"
                        strokeWidth={5}
                      />
                    </svg>
                  </div>
                  <span
                    className="swiper-notification"
                    aria-live="assertive"
                    aria-atomic="true"
                  />
                </div>
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
      {/* Footer */}
    </div>
  );
}
