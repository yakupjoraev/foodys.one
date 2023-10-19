import { useEffect, useRef, useState } from "react";
import { Rectangle, rebuildTrapezoid } from "./trapezoid";
import throttle from "lodash/throttle";

export interface HomePageBackgroundProps {
  footerHeight: number;
}

export function HomeBackground(props: HomePageBackgroundProps) {
  const [backgroundVisible, setBackgroundVisible] = useState(false);
  const [clipPath, setClipPath] = useState<string | undefined>(undefined);
  const croppedLayoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (croppedLayoutRef.current === null) {
      return;
    }

    const layout = croppedLayoutRef.current;

    const renderTrapezoid = () => {
      const layoutWidth = layout.clientWidth;
      const layoutHeight = layout.clientHeight;

      if (!layoutHeight || !layoutHeight) {
        return;
      }

      const path = rebuildTrapezoid(new Rectangle(layoutWidth, layoutHeight));

      setClipPath(path === null ? undefined : `path("${path}")`);
    };

    const handleWindowResize = throttle(() => {
      renderTrapezoid();
    }, 200);

    renderTrapezoid();
    setBackgroundVisible(true);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [croppedLayoutRef.current]);

  return (
    <div
      className="main-page-background"
      style={{ visibility: backgroundVisible ? undefined : "hidden" }}
    >
      <div className="main-page-background__layout">
        <div className="main-page-background__body main-page-background__body--bottom" />
        <div
          className="main-page-background__footer main-page-background__footer--bottom"
          style={{ height: props.footerHeight }}
        ></div>
      </div>
      <div
        className="main-page-background__layout main-page-background__crop"
        data-path={clipPath}
        style={{ clipPath: clipPath }}
        ref={croppedLayoutRef}
      >
        <div className="main-page-background__body main-page-background__body--top" />
        <div
          className="main-page-background__footer main-page-background__footer--top"
          style={{ height: props.footerHeight }}
        ></div>
      </div>
    </div>
  );
}
