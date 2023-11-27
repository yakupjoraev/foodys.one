import { HeroSearch } from "~/components/HeroSearch";
import { Layout } from "~/components/Layout";
import Trans from "next-translate/Trans";
import { HomeBackground } from "~/components/HomeBackground";
import { useEffect, useRef, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getCookie, setCookie } from "cookies-next";
import { HeroUk } from "~/components/HeroUk";
import { ChangePasswordModalContainer } from "~/containers/ChangePasswordModalContainer";
import { PasswordChangedModal } from "~/components/PasswordChangedModal";
import { useRouter } from "next/router";
import { EmailConfirmedModal } from "~/components/EmailConfirmedModal";
import { api } from "~/utils/api";
import { useBus } from "react-bus";
import toast from "react-hot-toast";
import { HeroChatContainer } from "~/containers/HeroChatContainer";
import useTranslation from "next-translate/useTranslation";

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = (async ({ query, res, req }) => {
  const FIRST_PICTURE_ID = 1;
  const LAST_PICTURE_ID = 7;

  const pictureIdFromQuery = query.pic;
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
  const { t } = useTranslation("common");
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(-1);
  const [changePasswordModalOpened, setChangePasswordModalOpened] =
    useState(false);
  const [passwordChangedModalOpened, setPasswordChangedModalOpened] =
    useState(false);
  const [passwordResetToken, setPasswordResetToken] = useState<string | null>(
    null
  );
  const [confirmEmailToken, setEmailConfirmToken] = useState<string | null>(
    null
  );
  const [emailConfirmedModalOpened, setEmailConfirmedModalOpened] =
    useState(false);

  const bus = useBus();

  const confirmUserEmail = api.auth.confirmUserEmail.useMutation();

  useEffect(() => {
    if (footerRef.current === null) {
      return;
    }

    const footer = footerRef.current;

    const handleWindowResize = () => {
      const rect = footer.getBoundingClientRect();
      setFooterHeight(rect.height);
    };

    setFooterHeight(footer.clientHeight);

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [footerRef.current]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const searchParams = new URLSearchParams(location.search);
    const nextPasswordResetToken = searchParams.get("reset");
    setPasswordResetToken(nextPasswordResetToken);
    if (nextPasswordResetToken !== null) {
      setChangePasswordModalOpened(true);
    }
    const nextEmailConfirmToken = searchParams.get("confirm");
    setEmailConfirmToken(nextEmailConfirmToken);
  }, []);

  useEffect(() => {
    if (confirmEmailToken === null) {
      return;
    }
    const toastId = toast.loading(t("toastLoading"));

    confirmUserEmail
      .mutateAsync({ token: confirmEmailToken })
      .then((result) => {
        if (result.code === "SUCCESS") {
          setEmailConfirmedModalOpened(true);
          toast.remove(toastId);
        } else if (
          result.code === "TOKEN_NOT_FOUND" ||
          result.code === "USER_NOT_FOUND"
        ) {
          toast.error(t("toastConfLinkNotActive"), { id: toastId });
        } else {
          toast.error(t("toastFailedConfirmEmail"), { id: toastId });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(t("toastFailedConfirmEmail"), { id: toastId });
      });
  }, [confirmEmailToken]);

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
                <HeroChatContainer />
              </div>
            </div>
          </div>
        </section>
      </main>
      <ChangePasswordModalContainer
        open={changePasswordModalOpened}
        token={passwordResetToken ?? ""}
        onClose={() => {
          setChangePasswordModalOpened(false);
          void router.replace("/");
        }}
        onPasswordChanged={() => {
          setChangePasswordModalOpened(false);
          setPasswordChangedModalOpened(true);
        }}
      />
      <PasswordChangedModal
        open={passwordChangedModalOpened}
        onClose={() => {
          setPasswordChangedModalOpened(false);
          void router.replace("/");
        }}
        onNavAuth={() => {
          setPasswordChangedModalOpened(false);
          void router.replace("/");
          bus.emit("auth");
        }}
      />
      <EmailConfirmedModal
        open={emailConfirmedModalOpened}
        onClose={() => {
          setEmailConfirmedModalOpened(false);
          void router.replace("/");
        }}
        onNavAuth={() => {
          setEmailConfirmedModalOpened(false);
          void router.replace("/");
          bus.emit("auth");
        }}
      />
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
          <img src="/img/main-page/hero/burgers.png" alt="#Burgers!" />
        </div>
      );
    }
    case 2: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/hero/sushi.png" alt="#Sushi!" />
        </div>
      );
    }
    case 3: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/hero/salade.png" alt="#Salade!" />
        </div>
      );
    }
    case 4: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/hero/steak.png" alt="#Steak!" />
        </div>
      );
    }
    case 5: {
      return (
        <div className="hero__picture hero__picture--pasta">
          <img src="/img/main-page/hero/spaghetti.png" alt="#Spaghetti!" />
        </div>
      );
    }
    case 6: {
      return (
        <div className="hero__picture hero__picture--pizza">
          <picture>
            <source
              media="(max-width:767px)"
              srcSet="/img/main-page/hero/mob/pizza.png"
            />
            <source
              media="(min-width:768px)"
              srcSet="/img/main-page/hero/pizza.png"
            />
            <img src="/img/main-page/hero/pizza.png" alt="#Pizza!" />
          </picture>
        </div>
      );
    }
    case 7: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/hero/dessert.png" alt="#OnTop!" />
        </div>
      );
    }
    default: {
      return (
        <div className="hero__picture">
          <img src="/img/main-page/hero/burgers.png" alt="#Burgers!" />
        </div>
      );
    }
  }
}
