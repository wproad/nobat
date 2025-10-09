import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";
import { CalendarHeader } from "./CalendarHeader";
import { WeekNavigation } from "./WeekNavigation";
import { CalendarGrid } from "./CalendarGrid";
import { useAppointments } from "../hooks/useAppointments";
import { useSlotTemplate } from "../hooks/useSlotTemplate";
import { useStartOfWeek } from "../hooks/useStartOfWeek";
import { useWeek } from "../hooks/useWeek";

const CalendarView = () => {
  const { appointments, loading, error, refetch } = useAppointments();
  const { slotTemplate, slotsError } = useSlotTemplate();
  const { startOfWeekIndex } = useStartOfWeek();
  const {
    weekDates,
    isCurrentWeek,
    goPrevWeek,
    goNextWeek,
    goToToday,
  } = useWeek({ startOfWeekIndex });

  const today = useMemo(() => new Date(), []);

  const appointmentsByDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return appointments.filter((apt) => apt.appointment_date === dateString);
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <p>{__("Loading calendar...", "appointment-booking")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-error">
        <p>
          {__("Error loading calendar:", "appointment-booking")} {error}
        </p>
        <button onClick={refetch}>{__("Retry", "appointment-booking")}</button>
      </div>
    );
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <CalendarHeader title={__("Appointment Calendar", "appointment-booking")} />
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
        timeSlots={slotTemplate}
        appointmentsByDate={appointmentsByDate}
        slotsError={slotsError}
      />
    </div>
  );
};

export { CalendarView };


