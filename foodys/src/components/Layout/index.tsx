import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { PropsWithChildren, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { AboutSearch } from "~/components/AboutSearch";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { AuthModalContainer } from "~/containers/AuthModalContainer";
import { RegisterModalContainer } from "~/containers/RegisterModalContainer";

export type LayoutProps = PropsWithChildren<{
  className?: string;
  title?: string;
}>;

export function Layout(props: LayoutProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [authModelOpened, setAuthModelOpened] = useState(false);
  const [registerModalOpened, setRegisterModalOpened] = useState(false);
  const { status: authStatus } = useSession();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth > 991.98) {
          setMobileExpanded(false);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const handleAuthModalClose = () => {
    setAuthModelOpened(false);
  };

  const handleRegisterModalClose = () => {
    setRegisterModalOpened(false);
  };

  const handleLogInBtnClick = () => {
    setAuthModelOpened(true);
  };

  const handleRegisterBtnClick = () => {
    setRegisterModalOpened(true);
  };

  const handleLogOutBtnClick = () => {
    signOut();
  };

  const handleToggleMobileMenu = () => {
    setMobileExpanded(!mobileExpanded);
  };

  const handleNavRegister = () => {
    setAuthModelOpened(false);
    setRegisterModalOpened(true);
  };

  return (
    <div
      className={classNames("main__body", props.className, {
        locked: mobileExpanded,
      })}
    >
      <Head>
        <title>{props.title || "Foodys"}</title>
        <link rel="stylesheet" href="/css/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
      </Head>
      <Header
        mobileMenuExpanded={mobileExpanded}
        authStatus={authStatus}
        onLogInBtnClick={handleLogInBtnClick}
        onRegisterBtnClick={handleRegisterBtnClick}
        onLogOutBtnClick={handleLogOutBtnClick}
        onToggleMobileMenu={handleToggleMobileMenu}
      />
      {props.children}
      <Footer />
      <AuthModalContainer
        open={authModelOpened}
        onClose={handleAuthModalClose}
        onNavRegister={handleNavRegister}
      />
      <RegisterModalContainer
        open={registerModalOpened}
        onClose={handleRegisterModalClose}
      />
    </div>
  );
}
