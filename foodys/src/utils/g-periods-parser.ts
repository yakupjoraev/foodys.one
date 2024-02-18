import { type GApiPlaceOpeningHoursPeriod } from "~/server/gm-client/types";

const WEEK_LENGTH = 7;

export interface WeekPeriod {
  openDay: number;
  closeDay: number;
  openHours: number;
  openMinutes: number;
  closeHours: number;
  closeMinutes: number;
}

export interface DayPeriod {
  day: number;
  openHours: number;
  openMinutes: number;
  closeHours: number;
  closeMinutes: number;
}

interface Time {
  hours: number;
  minutes: number;
}

export type GPeriodParserResultOk = {
  error: null;
  value: WeekPeriod;
};

export type GPeriodParserResultError = {
  error: string;
  value: null;
};

export type GPeriodParserResult =
  | GPeriodParserResultOk
  | GPeriodParserResultError;

export function parseWeekPeriod(
  period: GApiPlaceOpeningHoursPeriod
): GPeriodParserResult {
  const { close, open } = period;
  if (!close) {
    return createGPeriodParserResultError('field required: "close"');
  }

  if (open.day < 0 || open.day >= WEEK_LENGTH) {
    return createGPeriodParserResultError(
      "unexpected open day index: " + open.day
    );
  }
  if (close.day < 0 || close.day >= WEEK_LENGTH) {
    return createGPeriodParserResultError(
      "unexpected close day index: " + open.day
    );
  }

  const openTime = parseTime(open.time);
  if (openTime === null) {
    return createGPeriodParserResultError("failed to parse open time");
  }

  const closeTime = parseTime(close.time);
  if (closeTime === null) {
    return createGPeriodParserResultError("failed to parse close time");
  }

  return createGPeriodParserResultOk({
    openDay: open.day,
    closeDay: close.day,
    openHours: openTime.hours,
    openMinutes: openTime.minutes,
    closeHours: closeTime.hours,
    closeMinutes: closeTime.minutes,
  });
}

export function splitWeekPeriod(weekPeriod: WeekPeriod): DayPeriod[] {
  if (weekPeriod.openDay === weekPeriod.closeDay) {
    const dayPeriod: DayPeriod = {
      day: weekPeriod.openDay,
      openHours: weekPeriod.openHours,
      openMinutes: weekPeriod.openMinutes,
      closeHours: weekPeriod.closeHours,
      closeMinutes: weekPeriod.closeMinutes,
    };
    return [dayPeriod];
  }

  if (weekPeriod.openDay < weekPeriod.closeDay) {
    const dayPeriods: DayPeriod[] = [];
    dayPeriods.push({
      day: weekPeriod.openDay,
      openHours: weekPeriod.openHours,
      openMinutes: weekPeriod.openMinutes,
      closeHours: 23,
      closeMinutes: 59,
    });

    for (let i = weekPeriod.openDay + 1; i < weekPeriod.closeDay; i++) {
      dayPeriods.push({
        day: i,
        openHours: 0,
        openMinutes: 0,
        closeHours: 23,
        closeMinutes: 59,
      });
    }

    dayPeriods.push({
      day: weekPeriod.closeDay,
      openHours: 0,
      openMinutes: 0,
      closeHours: weekPeriod.closeHours,
      closeMinutes: weekPeriod.closeMinutes,
    });

    return dayPeriods;
  } else {
    const dayPeriods: DayPeriod[] = [];

    dayPeriods.push({
      day: weekPeriod.openDay,
      openHours: weekPeriod.openHours,
      openMinutes: weekPeriod.openMinutes,
      closeHours: 23,
      closeMinutes: 59,
    });

    for (let i = weekPeriod.openDay + 1; i < WEEK_LENGTH; i++) {
      dayPeriods.push({
        day: i,
        openHours: 0,
        openMinutes: 0,
        closeHours: 23,
        closeMinutes: 59,
      });
    }
    if (weekPeriod.closeDay > 0) {
      for (let i = 0; i < weekPeriod.closeDay; i++) {
        dayPeriods.push({
          day: i,
          openHours: 0,
          openMinutes: 0,
          closeHours: 23,
          closeMinutes: 59,
        });
      }
    }

    dayPeriods.push({
      day: weekPeriod.closeDay,
      openHours: 0,
      openMinutes: 0,
      closeHours: weekPeriod.closeHours,
      closeMinutes: weekPeriod.closeMinutes,
    });

    return dayPeriods;
  }
}

function createGPeriodParserResultOk(value: WeekPeriod): GPeriodParserResultOk {
  return { error: null, value: value };
}

function createGPeriodParserResultError(
  message: string
): GPeriodParserResultError {
  return { error: message, value: null };
}

function parseTime(time: string): Time | null {
  const hoursStr = time.slice(0, 2);
  const minutesStr = time.slice(2);

  const hours = parseInt(hoursStr, 10);
  if (isNaN(hours) || hours < 0 || hours > 23) {
    return null;
  }
  const minutes = parseInt(minutesStr, 10);
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    return null;
  }

  return { hours, minutes };
}
