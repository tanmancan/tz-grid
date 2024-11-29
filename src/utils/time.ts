import { TimeZones } from "./timezones";

export const now = () => new Date();
export const LOCAL_TZ = Intl.DateTimeFormat().resolvedOptions()
  .timeZone as TimeZones;

export enum DateFormat {
  EN_US = "en-US",
  EN_BG = "en-GB",
}

export interface ITimeMetadata {
  timeZone: TimeZones;
  time12hr: string;
  time24hr: string;
}

export const formatDate = (
  d: Date | string,
  hr24: boolean = false,
  timeZone: TimeZones
) =>
  new Intl.DateTimeFormat(hr24 ? DateFormat.EN_BG : DateFormat.EN_US, {
    timeStyle: "long",
    timeZone,
    hourCycle: hr24 ? "h24" : "h12",
  }).format(new Date(d));

export const format12Hour = (
  time: Date,
  timeZone: TimeZones = TimeZones["America/New_York"]
) => formatDate(time, false, timeZone);

export const format24Hour = (
  time: Date,
  timeZone: TimeZones = TimeZones["America/New_York"]
) => formatDate(time, true, timeZone);

export const getFormattedTime = (
  time: Date | string = now(),
  timeZone: TimeZones = LOCAL_TZ
): ITimeMetadata => {
  return {
    timeZone: timeZone,
    time12hr: format12Hour(new Date(time), timeZone),
    time24hr: format24Hour(new Date(time), timeZone),
  };
};

const timeAtMidnight = +new Date("2024-01-01T00:00:00Z");
const ONE_HOUR_IN_SECONDS = 60 * 60 * 1000;
const buildTimeList = () => {
  const timeList: number[] = [];
  for (let i = 1; i <= 24; i++) {
    const hrOffset = ONE_HOUR_IN_SECONDS * i;
    timeList.push(timeAtMidnight + hrOffset);
  }

  return timeList;
};

export const TIME_LIST = buildTimeList();

export const DEFAULT_TIMEZONES = [
  TimeZones["Australia/Sydney"],
  TimeZones["America/Los_Angeles"],
  TimeZones["America/Denver"],
  TimeZones["America/Chicago"],
  TimeZones["America/New_York"],
  TimeZones["Europe/Dublin"],
  TimeZones["Asia/Kolkata"],
];

export const isCurrentHour = (da: Date, db: Date): boolean => {
  const aHr = da.getUTCHours();
  const bHr = db.getUTCHours();
  return aHr === bHr;
};
