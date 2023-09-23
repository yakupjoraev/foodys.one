import classNames from "classnames";
import Head from "next/head";
import { PropsWithChildren, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { AboutSearch } from "~/components/AboutSearch";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export type LayoutProps = PropsWithChildren<{
  className?: string;
  title?: string;
}>;

export function Layout(props: LayoutProps) {
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
        onToggleMobileMenu={() => setMobileExpanded(!mobileExpanded)}
      />
      {props.children}
      <Footer />
    </div>
  );
}
