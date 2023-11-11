import { useRef, useEffect, useState, PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export type PortalProps = PropsWithChildren<{ rootId: string }>;

export function Portal(props: PortalProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const root = document.getElementById(props.rootId);
    if (root !== null && root instanceof HTMLDivElement) {
      ref.current = root;
      setMounted(true);
    }
  }, [props.rootId]);

  return mounted && ref.current
    ? createPortal(props.children, ref.current)
    : null;
}
