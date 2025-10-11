import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { CalendarHeader } from "./CalendarHeader";
import { WeekNavigation } from "./WeekNavigation";
import { CalendarGrid } from "./CalendarGrid";
import { useStartOfWeek } from "../hooks/useStartOfWeek";
import { useWeek } from "../hooks/useWeek";

const CalendarView = () => {
  const { startOfWeekIndex } = useStartOfWeek();
  const { weekDates, isCurrentWeek, goPrevWeek, goNextWeek, goToToday } =
    useWeek({ startOfWeekIndex });

  const today = useMemo(() => new Date(), []);

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <CalendarHeader
          title={__("Appointment Calendar", "appointment-booking")}
        />
        <WeekNavigation
          isCurrentWeek={isCurrentWeek}
          onPrev={goPrevWeek}
          onToday={goToToday}
          onNext={goNextWeek}
        />
      </div>

      <CalendarGrid
        weekDates={weekDates}
        today={today}
      />
    </div>
  );
};

export { CalendarView };
