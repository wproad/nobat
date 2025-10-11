import { __ } from "@wordpress/i18n";
import { TimeBlock } from "./TimeBlock";

const DayColumn = ({
  date,
  appointments,
  isToday,
  timeSlots,
  onStatusUpdate,
  onDelete,
}) => {
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getAppointmentForSlot = (label) => {
    return appointments.find((apt) => apt.time_slot === label);
  };

  const getSlotTimeRange = (label) => {
    const [startStr, endStr] = label.split("-");
    const [sH, sM] = startStr.split(":").map((n) => parseInt(n, 10));
    const [eH, eM] = endStr.split(":").map((n) => parseInt(n, 10));
    const start = new Date(date);
    start.setHours(sH, sM || 0, 0, 0);
    const end = new Date(date);
    end.setHours(eH, eM || 0, 0, 0);
    return { start, end };
  };

  const getPastClassForSlot = (label) => {
    const now = new Date();
    const { start, end } = getSlotTimeRange(label);
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
        {timeSlots.map((slot, index) => {
          const label = slot.label;
          const appointment = getAppointmentForSlot(label);
          const pastClass = getPastClassForSlot(label);
          const excludedClass = slot.excluded ? "excluded" : "";
          return (
            <div
              key={index}
              className={`time-slot-container ${pastClass} ${excludedClass}`}
            >
              <div className="time-slot-content">
                {appointment ? (
                  <TimeBlock
                    appointment={appointment}
                    onStatusUpdate={onStatusUpdate}
                    onDelete={onDelete}
                  />
                ) : slot.excluded ? (
                  <div className="empty-slot" />
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
