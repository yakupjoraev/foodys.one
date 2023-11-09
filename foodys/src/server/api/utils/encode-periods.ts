import { type PlaceOpeningHoursPeriod } from "~/server/gm-client/types";

const MILLISECONDS_PER_MINUTE = 60000;

const DAYS: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function encodeGooglePeriods(
  periods: PlaceOpeningHoursPeriod[]
): string {
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

export function getForeignTime(date: Date, utcOffset: number) {
  const foreignNow = new Date(
    date.getTime() -
      (utcOffset * -1 * MILLISECONDS_PER_MINUTE -
        date.getTimezoneOffset() * MILLISECONDS_PER_MINUTE)
  );

  return foreignNow;
}
