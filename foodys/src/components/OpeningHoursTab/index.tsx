import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";

export interface PlaceOpeningHoursPeriod {
  open?: PlaceOpeningHoursPeriodDetail;
  close?: PlaceOpeningHoursPeriodDetail;
}

export interface PlaceOpeningHoursPeriodDetail {
  day?: number;
  time?: string;
  date?: string;
  truncated?: boolean;
}

export interface OpeningHoursTabProps {
  periods: PlaceOpeningHoursPeriod[];
  show: boolean;
}

export function OpeningHoursTab(props: OpeningHoursTabProps) {
  const { t } = useTranslation("common");
  return (
    <div
      className="tabs__content-item"
      style={{
        display: props.show ? "flex" : "none",
      }}
    >
      <div className="opening-hours">
        {renderOpeningHours(props.periods, t)}
      </div>
    </div>
  );
}

function renderOpeningHours(periods: PlaceOpeningHoursPeriod[], t: Translate) {
  const openingPeriods = new Array(7);
  openingPeriods.fill(null);

  periods.forEach((period) => {
    const openDay = period.open?.day;
    const openTime = period.open?.time;
    if (openDay === undefined || openTime === undefined) {
      return null;
    }
    let closeTime = period.close?.time;
    if (closeTime === undefined) {
      closeTime = "0000";
    }

    const weekDayLabel = getWeekDayLabel(openDay, t);
    if (weekDayLabel === null) {
      return null;
    }

    const openPeriod =
      openTime.slice(0, 2) +
      ":" +
      openTime.slice(2) +
      "-" +
      closeTime.slice(0, 2) +
      ":" +
      closeTime.slice(2);

    const dayIndex = openDay - 1;

    openingPeriods[dayIndex] = openPeriod;
  });

  const schedule = openingPeriods.map((period, dayIndex) => {
    const label = getWeekDayLabel(dayIndex, t);
    if (period === null) {
      return (
        <div className="opening-hours__item" key={dayIndex}>
          <p className="opening-hours__day">{label}</p>
          <p className="opening-hours__day">Closed</p>
        </div>
      );
    } else {
      return (
        <div className="opening-hours__item" key={dayIndex}>
          <p className="opening-hours__day">{label}</p>
          <p className="opening-hours__time">{period}</p>
        </div>
      );
    }
  });

  return schedule;
}

function getWeekDayLabel(weekDay: number, t: Translate): string | null {
  switch (weekDay) {
    case 0: {
      return t("textOpeningHoursMonday");
    }
    case 1: {
      return t("textOpeningHoursTuesday");
    }
    case 2: {
      return t("textOpeningHoursWednesday");
    }
    case 3: {
      return t("textOpeningHoursThursday");
    }
    case 4: {
      return t("textOpeningHoursFriday");
    }
    case 5: {
      return t("textOpeningHoursSaturday");
    }
    case 6: {
      return t("textOpeningHoursSunday");
    }
    default: {
      return null;
    }
  }
}
