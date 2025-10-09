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

  const getSlotTimeRange = (timeSlot) => {
    const [startStr, endStr] = timeSlot.split("-");
    const [sH, sM] = startStr.split(":").map((n) => parseInt(n, 10));
    const [eH, eM] = endStr.split(":").map((n) => parseInt(n, 10));
    const start = new Date(date);
    start.setHours(sH, sM || 0, 0, 0);
    const end = new Date(date);
    end.setHours(eH, eM || 0, 0, 0);
    return { start, end };
  };

  const getPastClassForSlot = (timeSlot) => {
    const now = new Date();
    const { start, end } = getSlotTimeRange(timeSlot);
    if (end < now) return "past-full"; // fully in the past
    if (start < now) return "past-partial"; // started but not ended
    return "";
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

          const pastClass = getPastClassForSlot(timeSlot);
          return (
            <div key={index} className={`time-slot-container ${pastClass}`}>
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
