import { CalendarHeader } from "./CalendarHeader";
import { CalendarGrid } from "./CalendarGrid";
import { CalendarGuide } from "./CalendarGuide";

const CalendarView = () => {
  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <CalendarHeader />
      </div>

      <CalendarGuide />

      <CalendarGrid />
    </div>
  );
};

export { CalendarView };
