import { useEffect, useState } from "react";

function getInitialHash() {
  if (typeof window === "undefined") {
    return "";
  }
  return window.location.hash;
}

export function useHash(): [string, (hash: string) => void] {
  const [hash, setHash] = useState<string>(getInitialHash);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleHashChange = (ev: HashChangeEvent) => {
      const newURL = new URL(ev.newURL);
      const nextHash = newURL.hash;
      setHash(nextHash);
    };

    setHash(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const updateHash = (nextHash: string) => {
    if (typeof window === "undefined") {
      return;
    }
    if (!/^#[a-z0-9_\-]+$/.test(nextHash)) {
      return;
    }
    setHash(nextHash);
    history.replaceState(undefined, "", nextHash);
  };

  return [hash, updateHash];
}
