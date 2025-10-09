import { __ } from "@wordpress/i18n";
import { TimeBlock } from "./time-block";

const DayColumn = ({ date, appointments, isToday }) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const timeSlots = [
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
  ];

  const getAppointmentForSlot = (timeSlot) => {
    return appointments.find((apt) => apt.time_slot === timeSlot);
  };

  return (
    <div className={`day-column ${isToday ? "today" : ""}`}>
      <div className="day-header">
        <div className="day-name">{formatDate(date)}</div>
        <div className="appointment-count">
          {appointments.length} {__("appointments", "appointment-booking")}
        </div>
      </div>

      <div className="time-slots">
        {timeSlots.map((timeSlot, index) => {
          const appointment = getAppointmentForSlot(timeSlot);

          return (
            <div key={index} className="time-slot-container">
              <div className="time-slot-label">{timeSlot}</div>
              <div className="time-slot-content">
                {appointment ? (
                  <TimeBlock appointment={appointment} />
                ) : (
                  <div className="empty-slot">
                    {__("Available", "appointment-booking")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { DayColumn };
