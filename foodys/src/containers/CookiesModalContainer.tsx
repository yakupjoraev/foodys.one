import { useEffect, useRef, useState } from "react";
import { CookiesModal } from "~/components/CookiesModal";

const OFFSET_Y = 100;
const THROTTLE_TIMEOUT = 1000;
const COOKIES_AGREED_KEY = "cookies_agreed";

export function CookiesModalContainer() {
  const [open, setOpen] = useState(false);
  const dataCollected = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const cookiesAgreedValue = localStorage.getItem(COOKIES_AGREED_KEY);
    if (cookiesAgreedValue !== null) {
      dataCollected.current = true;
      return;
    }

    let timerId = 0;

    const handleScrollThrottled = () => {
      timerId = 0;
      if (window.scrollY >= OFFSET_Y) {
        setOpen(true);
      }
    };

    const handleScroll = () => {
      if (dataCollected.current) {
        return;
      }
      if (timerId !== 0) {
        window.clearTimeout(timerId);
      }
      timerId = window.setTimeout(handleScrollThrottled, THROTTLE_TIMEOUT);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClose = (agreed?: boolean) => {
    setOpen(false);
    if (agreed !== undefined) {
      localStorage.setItem(COOKIES_AGREED_KEY, agreed ? "true" : "false");
      dataCollected.current = true;
    }
  };

  return <CookiesModal open={open} onClose={handleClose} />;
}
