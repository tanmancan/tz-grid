import { useCallback, useLayoutEffect, useState } from "react";
import {
  DEFAULT_TIMEZONES,
  getFormattedTime,
  isCurrentHour,
  LOCAL_TZ,
  now,
  TIME_LIST,
} from "../utils/time";
import { TimeZones } from "../utils/timezones";
import "./TimeGrid.css";

let rafId: number | null = null;
let tsLast: number = 0;

export const TimeGrid = () => {
  const [timeNow, setTimeNow] = useState(now());

  const handleTick: FrameRequestCallback = useCallback(
    (ts: number = 0): void => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        if (ts > tsLast + 1e3) {
          tsLast = ts;
          setTimeNow(now());
        }
        rafId = requestAnimationFrame(handleTick);
      }
    },
    []
  );

  useLayoutEffect(() => {
    rafId = requestAnimationFrame(handleTick);
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [setTimeNow, handleTick]);

  const localTime = getFormattedTime(timeNow, LOCAL_TZ);
  const localTimeUTC = getFormattedTime(timeNow, TimeZones.UTC);
  const timeZoneColumns = DEFAULT_TIMEZONES.map((tz) => {
    return (
      <div className="tz-col" key={tz}>
        <div className="tz-col-header">{tz}</div>
        {TIME_LIST.map((timeStamp) => {
          const dt = new Date(timeStamp);
          const activeCell = isCurrentHour(timeNow, dt);
          const formattedTimeLocal = getFormattedTime(dt, tz);
          const formattedTimeUTC = getFormattedTime(dt, TimeZones.UTC);
          return (
            <ul
              className={`tz-info ${activeCell ? "active" : ""}`}
              key={timeStamp}
            >
              <li>{formattedTimeLocal.time12hr}</li>
              <li>{formattedTimeLocal.time24hr}</li>
              <li>{formattedTimeUTC.time24hr}</li>
            </ul>
          );
        })}
      </div>
    );
  });

  return (
    <div className="tz-wrapper">
      <div className="tz-grid">{timeZoneColumns}</div>
      <div className="tz-header">
        <div className="tz-current">
          Local Time: {localTime.time12hr} {localTime.timeZone} |{" "}
          {localTime.time24hr} | {localTimeUTC.time24hr}
        </div>
      </div>
    </div>
  );
};
