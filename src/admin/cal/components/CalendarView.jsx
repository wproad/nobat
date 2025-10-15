import { __ } from "@wordpress/i18n";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

const CalendarView = ({ scheduleId }) => {
  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <CalendarHeader
          title={__("Scehdule Calendar", "appointment-booking")}
        />
      </div>

      <CalendarGrid scheduleId={scheduleId} />
    </div>
  );
};

export { CalendarView };
