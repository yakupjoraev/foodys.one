import { HeroSearch } from "~/components/HeroSearch";
import { Layout } from "~/components/Layout";
import Trans from "next-translate/Trans";
import { HomeBackground } from "~/components/HomeBackground";
import { useEffect, useRef, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getCookie, setCookie } from "cookies-next";
import { HeroUk } from "~/components/HeroUk";
import throttle from "lodash/throttle";

export const getServerSideProps = (async ({ query, res, req }) => {
  const FIRST_PICTURE_ID = 1;
  const LAST_PICTURE_ID = 7;

  const pictureIdFromQuery = query["pic"];
  if (typeof pictureIdFromQuery === "string") {
    const pictureId = parseInt(pictureIdFromQuery, 10);
    if (
      isNaN(pictureId) ||
      pictureId < FIRST_PICTURE_ID ||
      pictureId > LAST_PICTURE_ID
    ) {
      return { props: { picture: FIRST_PICTURE_ID } };
    } else {
      return {
        props: { picture: pictureId },
      };
    }
  }

  const pictureIdFromCookie = getCookie("pic", { res, req });
  if (pictureIdFromCookie !== undefined) {
    const pictureId = parseInt(pictureIdFromCookie, 10);
    if (
      isNaN(pictureId) ||
      pictureId < FIRST_PICTURE_ID ||
      pictureId > LAST_PICTURE_ID
    ) {
      return { props: { picture: FIRST_PICTURE_ID } };
    } else {
      let nextPictureId = pictureId + 1;
      if (nextPictureId > LAST_PICTURE_ID) {
        nextPictureId = FIRST_PICTURE_ID;
      }
      setCookie("pic", nextPictureId.toString(), { res, req });
      return { props: { picture: nextPictureId } };
    }
  }

  setCookie("pic", FIRST_PICTURE_ID.toString(), { req, res });
  return { props: { picture: FIRST_PICTURE_ID } };
}) satisfies GetServerSideProps<{ picture: number }>;

export default function Main(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(-1);

  useEffect(() => {
    if (footerRef.current === null) {
      return;
    }

    const footer = footerRef.current;

    const handleWindowResize = throttle(() => {
      setFooterHeight(footer.clientHeight);
    }, 200);

    setFooterHeight(footer.clientHeight);

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [footerRef.current]);

  return (
    <Layout
      className="main-page-body"
      headerClassName="header-second"
      footerClassName="footer-second"
      title="Foodys - Home"
      footerRef={footerRef}
    >
      {footerHeight !== -1 && <HomeBackground footerHeight={footerHeight} />}
      <main className="main">
        <section className="hero">
          <div className="container">
            <div className="hero__inner">
              <div className="hero__info">
                {renderHeroTitle(props.picture)}
                {renderHeroPicture(props.picture)}
                <HeroSearch />
              </div>
              <div className="hero__pictures">
                <HeroUk />
                <a className="hero__chatbot" href="#">
                  <picture>
                    <source
                      media="(max-width: 767px)"
                      srcSet="/img/main-page/chatbot-mobile.png"
                    />
                    <img src="/img/main-page/chatbot.png" alt="chatbot" />
                  </picture>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function renderHeroTitle(picId: number) {
  /* eslint-disable react/jsx-key */

  switch (picId) {
    case 1: {
      return (
        <h1 className="hero__title">
          <Trans
            i18nKey="common:titleJokeBurger"
            components={[<span />, <br />]}
          />
        </h1>
      );
    }
    case 2: {
      return (
        <h1 className="hero__title">
          <Trans i18nKey="common:titleJokeSushi" components={[<span />]} />
        </h1>
      );
    }
    case 3: {
      return (
        <h1 className="hero__title">
          <Trans i18nKey="common:titleJokeSalade" components={[<span />]} />
        </h1>
      );
    }
    case 4: {
      return (
        <h1 className="hero__title">
          <Trans i18nKey="common:titleJokeSteak" components={[<span />]} />
        </h1>
      );
    }
    case 5: {
      return (
        <h1 className="hero__title">
          <Trans i18nKey="common:titleJokePasta" components={[<span />]} />
        </h1>
      );
    }
    case 6: {
      return (
        <h1 className="hero__title">
          <Trans i18nKey="common:titleJokePizza" components={[<span />]} />
        </h1>
      );
    }
    case 7: {
      return (
        <h1 className="hero__title">
          <Trans i18nKey="common:titleJokeDessert" components={[<span />]} />
        </h1>
      );
    }
    default: {
      return (
        <h1 className="hero__title">
          <Trans
            i18nKey="common:titleJokeBurger"
            components={[<span />, <br />]}
          />
        </h1>
      );
    }
  }
}

function renderHeroPicture(picId: number) {
  switch (picId) {
    case 1: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-1.png" alt="#Burgers!" />
        </div>
      );
    }
    case 2: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-2.png" alt="#Sushi!" />
        </div>
      );
    }
    case 3: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-3.png" alt="#Salade!" />
        </div>
      );
    }
    case 4: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-4.png" alt="#Steak!" />
        </div>
      );
    }
    case 5: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-5.png" alt="#Shaghetti!" />
        </div>
      );
    }
    case 6: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-6.png" alt="#Pizza!" />
        </div>
      );
    }
    case 7: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-7.png" alt="#OnTop!" />
        </div>
      );
    }
    default: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/main-page-pic-1.png" />
        </div>
      );
    }
  }
}
