import { TimeColumn } from "./timeColumn";
import { DayColumn } from "./DayColumn";
import { useAppointments } from "../hooks/useAppointments";
import { __ } from "@wordpress/i18n";
import { useSlotTemplate } from "../hooks/useSlotTemplate";

const CalendarGrid = ({ weekDates, today }) => {
  const { appointments, loading, error, refetch } = useAppointments();
  const { slotTemplate } = useSlotTemplate();

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
    <div className="calendar-grid">
      <TimeColumn timeSlots={slotTemplate} />
      {weekDates.map((date) => (
        <DayColumn
          key={date.toISOString().split("T")[0]}
          date={date}
          appointments={appointmentsByDate(date)}
          isToday={date.toDateString() === today.toDateString()}
          timeSlots={slotTemplate}
        />
      ))}
    </div>
  );
};

export { CalendarGrid };
