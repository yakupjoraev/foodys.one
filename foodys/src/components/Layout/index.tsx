import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { PropsWithChildren, RefObject, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { AboutSearch } from "~/components/AboutSearch";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { AuthModalContainer } from "~/containers/AuthModalContainer";
import { ContactUsModalContainer } from "~/containers/ContactUsModalContainer";
import { RegisterModalContainer } from "~/containers/RegisterModalContainer";
import { RequestPasswordResetModalContainer } from "~/containers/RequestPasswordResetModalContainer";
import { RequestSentModal } from "../RequestSentModal";
import { ConfirmAccountModalContainer } from "~/containers/ConfirmEmailModalContainer";

export type LayoutProps = PropsWithChildren<{
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
  title?: string;
  footerRef?: RefObject<HTMLElement>;
}>;

export function Layout(props: LayoutProps) {
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [authModalOpened, setAuthModalOpened] = useState(false);
  const [registerModalOpened, setRegisterModalOpened] = useState(false);
  const [contactUsModalOpened, setContactUsModalOpened] = useState(false);
  const [requestPasswordResetModalOpened, setRequestPasswordResetModalOpened] =
    useState(false);
  const [requestSentModalOpened, setRequestSentModalOpened] = useState(false);
  const [requestSentModalEmail, setRequestSentModalEmail] = useState<
    string | null
  >(null);
  const [confirmAccountModalOpened, setConfirmAccountModalOpened] =
    useState(false);
  const [confirmAccountModalEmail, setConfirmAccountModalEmail] = useState<
    string | null
  >(null);
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

  const handleLogInBtnClick = () => {
    setAuthModalOpened(true);
  };

  const handleRegisterBtnClick = () => {
    setRegisterModalOpened(true);
  };

  const handleLogOutBtnClick = () => {
    void signOut();
  };

  const handleToggleMobileMenu = () => {
    setMobileExpanded(!mobileExpanded);
  };

  const handleContactUsBtnClick = () => {
    setContactUsModalOpened(true);
  };

  return (
    <div
      className={classNames("main__body", props.className, {
        locked: mobileExpanded,
      })}
    >
      <Head>
        <title>{props.title ?? "Foodys"}</title>
        <link rel="stylesheet" href="/css/swiper-bundle.min.css" />
      </Head>
      <Header
        className={props.headerClassName}
        mobileMenuExpanded={mobileExpanded}
        authStatus={authStatus}
        onLogInBtnClick={handleLogInBtnClick}
        onRegisterBtnClick={handleRegisterBtnClick}
        onLogOutBtnClick={handleLogOutBtnClick}
        onToggleMobileMenu={handleToggleMobileMenu}
      />
      {props.children}
      <Footer
        className={props.footerClassName}
        ref={props.footerRef}
        onContactUsBtnClick={handleContactUsBtnClick}
      />
      <AuthModalContainer
        open={authModalOpened}
        onClose={() => {
          setAuthModalOpened(false);
        }}
        onNavRegister={() => {
          setAuthModalOpened(false);
          setRegisterModalOpened(true);
        }}
        onNavResetPassword={() => {
          setAuthModalOpened(false);
          setRequestPasswordResetModalOpened(true);
        }}
        onNavConfirmEmail={(email: string) => {
          setAuthModalOpened(false);
          setConfirmAccountModalEmail(email);
          setConfirmAccountModalOpened(true);
        }}
      />
      <RegisterModalContainer
        open={registerModalOpened}
        onClose={() => {
          setRegisterModalOpened(false);
        }}
        onNavAuth={() => {
          setRegisterModalOpened(false);
          setAuthModalOpened(true);
        }}
        onNavConfirmAccount={(email: string) => {
          setRegisterModalOpened(false);
          setConfirmAccountModalOpened(true);
          setConfirmAccountModalEmail(email);
        }}
      />
      <ConfirmAccountModalContainer
        open={confirmAccountModalOpened}
        email={confirmAccountModalEmail ?? ""}
        onClose={() => {
          setConfirmAccountModalOpened(false);
          setConfirmAccountModalEmail(null);
        }}
        onNavAuth={() => {
          setConfirmAccountModalOpened(false);
          setConfirmAccountModalEmail(null);
          setAuthModalOpened(true);
        }}
      />
      <ContactUsModalContainer
        open={contactUsModalOpened}
        onClose={() => {
          setContactUsModalOpened(false);
        }}
      />
      <RequestPasswordResetModalContainer
        open={requestPasswordResetModalOpened}
        onClose={() => {
          setRequestPasswordResetModalOpened(false);
        }}
        onRequestSent={(email: string) => {
          setRequestPasswordResetModalOpened(false);
          setRequestSentModalEmail(email);
          setRequestSentModalOpened(true);
        }}
      />
      <RequestSentModal
        open={requestSentModalOpened}
        email={requestSentModalEmail ?? ""}
        onClose={() => {
          setRequestSentModalOpened(false);
          setRequestSentModalEmail(null);
        }}
      />
    </div>
  );
}
