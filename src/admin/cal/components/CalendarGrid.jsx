import { TimeColumn } from "./TimeColumn";
import { __ } from "@wordpress/i18n";
import { useActiveSchedule } from "../../../hooks";

const CalendarGrid = () => {
  const {
    schedule,
    loading: loadingSchedule,
    error: scheduleError,
  } = useActiveSchedule();

  if (loadingSchedule) {
    return (
      <div className="calendar-loading">
        <p>{__("Loading calendar...", "appointment-booking")}</p>
      </div>
    );
  }

  if (scheduleError) {
    return (
      <div className="calendar-error">
        <p>
          {__("Error loading calendar:", "appointment-booking")} {scheduleError}
        </p>
        {/* <button onClick={refetch}>{__("Retry", "appointment-booking")}</button> */}
      </div>
    );
  }
  return (
    <div className="calendar-grid">
      <TimeColumn schedule={schedule} />

      {/* {schedule.timeslots.map((day) => (
        <DayColumn key={day.date} day={day} />
      ))} */}
    </div>
  );
};

export { CalendarGrid };
