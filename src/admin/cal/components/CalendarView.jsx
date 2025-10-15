import { __ } from "@wordpress/i18n";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";

const CalendarView = () => {
  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <CalendarHeader />
      </div>

      <CalendarGrid />
    </div>
  );
};

export { CalendarView };
