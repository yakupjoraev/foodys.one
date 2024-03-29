import { type Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import React from "react";

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
  const openingPeriods = new Array<string[]>(7);

  for (const period of periods) {
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

    const dayIndex = openDay;

    const prevPeriods = openingPeriods[dayIndex];
    if (prevPeriods === undefined) {
      openingPeriods[dayIndex] = [openPeriod];
    } else {
      prevPeriods.push(openPeriod);
    }
  }

  const shchedule = new Array<JSX.Element>(7);
  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const weekDayLabel = getWeekDayLabel(dayIndex, t);
    const periodLabels = openingPeriods[dayIndex];
    if (periodLabels === undefined || periodLabels.length === 0) {
      shchedule[dayIndex] = (
        <div className="opening-hours__item" key={dayIndex}>
          <p className="opening-hours__day">{weekDayLabel}</p>
          <p className="opening-hours__day">Closed</p>
        </div>
      );
    } else {
      const periodNodes: (JSX.Element | string)[] = [];
      periodLabels.forEach((label) => {
        if (periodNodes.length) {
          periodNodes.push(<br key={periodNodes.length} />);
        }
        periodNodes.push(
          <React.Fragment key={periodNodes.length}>{label}</React.Fragment>
        );
      });

      shchedule[dayIndex] = (
        <div className="opening-hours__item" key={dayIndex}>
          <p className="opening-hours__day">{weekDayLabel}</p>
          <p className="opening-hours__time">{periodNodes}</p>
        </div>
      );
    }
  }

  return shchedule;
}

function getWeekDayLabel(weekDay: number, t: Translate): string | null {
  switch (weekDay) {
    case 0: {
      return t("textOpeningHoursSunday");
    }
    case 1: {
      return t("textOpeningHoursMonday");
    }
    case 2: {
      return t("textOpeningHoursTuesday");
    }
    case 3: {
      return t("textOpeningHoursWednesday");
    }
    case 4: {
      return t("textOpeningHoursThursday");
    }
    case 5: {
      return t("textOpeningHoursFriday");
    }
    case 6: {
      return t("textOpeningHoursSaturday");
    }
    default: {
      return null;
    }
  }
}
