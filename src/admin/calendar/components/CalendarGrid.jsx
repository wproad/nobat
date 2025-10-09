import { TimeColumn } from "./timeColumn";
import { DayColumn } from "./DayColumn";

const CalendarGrid = ({
  weekDates,
  today,
  timeSlots,
  appointmentsByDate,
  slotsError,
}) => {
  return (
    <div className="calendar-grid">
      <TimeColumn timeSlots={timeSlots} error={slotsError} />
      {weekDates.map((date, index) => (
        <DayColumn
          key={index}
          date={date}
          appointments={appointmentsByDate(date)}
          isToday={date.toDateString() === today.toDateString()}
          timeSlots={timeSlots}
        />
      ))}
    </div>
  );
};

export { CalendarGrid };
