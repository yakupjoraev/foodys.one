import { useEffect, useState } from "react";
import { type PlaceOpeningHoursPeriod } from "~/server/gm-client/types";
import OpeningHours from "opening_hours";

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

    const openingHoursString = createOpeningHoursString(periods);

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
      const foreignNow = new Date(
        now.getTime() -
          (utcOffset * -1 * MILLISECONDS_PER_MINUTE -
            now.getTimezoneOffset() * MILLISECONDS_PER_MINUTE)
      );

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

    const intervalId = setTimeout(() => {
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

function createOpeningHoursString(periods: PlaceOpeningHoursPeriod[]): string {
  if (periods.length === 1) {
    const firstPeriod = periods[0];
    if (firstPeriod === undefined) {
      throw new Error("failed to pick first period");
    }
    if (
      firstPeriod.close === undefined &&
      firstPeriod.open.day === 0 &&
      firstPeriod.open.time === "0000"
    ) {
      return "24/7";
    }
  }

  const chunks: string[] = [];
  for (const period of periods) {
    const { close, open } = period;
    if (!close) {
      throw new Error('field required: "close"');
    }
    const dayName = DAYS[open.day];
    if (dayName === undefined) {
      throw new Error("unexpected day index: " + open.day);
    }
    const openTime = open.time.slice(0, 2) + ":" + open.time.slice(2);
    const closeTime = close.time.slice(0, 2) + ":" + close.time.slice(2);
    chunks.push(dayName + " " + openTime + "-" + closeTime);
  }

  const encodedPeriod = chunks.join(";");

  return encodedPeriod;
}

const DAYS: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
