import { useEffect, useState } from "react";
import { type PlaceOpeningHoursPeriod } from "~/server/gm-client/types";
import OpeningHours from "opening_hours";
import {
  encodeGooglePeriods,
  getForeignTime,
} from "~/server/api/utils/encode-periods";

const MILLISECONDS_PER_MINUTE = 60000;

export type GoogleOpeningHours =
  | {
      isOpen: true;
      closesAt?: string;
    }
  | {
      isOpen: false;
      opensAt?: string;
    };

export function useGoogleOpeningHours(
  periods?: PlaceOpeningHoursPeriod[],
  utcOffset?: number
): GoogleOpeningHours | null {
  const [openingHours, setOpeningHours] = useState<GoogleOpeningHours | null>(
    null
  );

  useEffect(() => {
    if (!periods) {
      setOpeningHours(null);
      return;
    }
    if (utcOffset === undefined) {
      setOpeningHours(null);
      return;
    }

    const openingHoursString = encodeGooglePeriods(periods);

    let oh: OpeningHours;
    try {
      oh = new OpeningHours(openingHoursString);
    } catch (error) {
      console.error(error);
      setOpeningHours(null);
      return;
    }

    const updateOpeningHours = () => {
      const now = new Date();
      const foreignNow = getForeignTime(now, utcOffset);

      const isOpen = oh.getState(foreignNow);

      if (isOpen) {
        let closesAtStr: string | undefined = undefined;
        const closesAt = oh.getNextChange(foreignNow);
        if (closesAt) {
          closesAtStr = formatTime(closesAt);
        }
        setOpeningHours({ isOpen, closesAt: closesAtStr });
      } else {
        let opensAtStr: string | undefined = undefined;
        const opensAt = oh.getNextChange(foreignNow);
        if (opensAt && opensAt.getDay() === foreignNow.getDay()) {
          opensAtStr = formatTime(opensAt);
        }
        setOpeningHours({ isOpen, opensAt: opensAtStr });
      }
    };

    updateOpeningHours();

    const intervalId = setInterval(() => {
      updateOpeningHours();
    }, MILLISECONDS_PER_MINUTE);

    return () => {
      clearInterval(intervalId);
    };
  }, [periods]);

  return openingHours;
}

function formatTime(date: Date) {
  let hours = date.getHours().toString();
  if (hours.length === 1) {
    hours = "0" + hours;
  }
  let minutes = date.getMinutes().toString();
  if (minutes.length === 1) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}
