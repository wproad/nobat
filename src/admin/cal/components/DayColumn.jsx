import { __ } from "../../../utils/i18n";
import { AppointmentSlot } from "./AppointmentSlot";
import { Slot } from "./Slot";

const DayColumn = ({ day, onStatusUpdate, onDelete, onChangeSlotStatus }) => {
  const today = new Date().toISOString().split("T")[0];
  const isToday = day.date === today;

  return (
    <div className={`day-column ${isToday ? "today" : ""}`}>
      <div>
        
        <div className="day-header">
          <div className="day-name">{day?.weekday}</div>
          <div>
            <span className="day-number">{day?.day_number}</span>{" "}
            <span className="month-name">{day?.month_name}</span>{" "}
            <span className="year-number">{day?.year}</span>
          </div>
        </div>
      </div>

      <div className="time-slots">
        {(day.slots || []).map((slot, index) => {
          const isUnavailable = slot.status === "unavailable";
          const hasAppointment = slot.status === "booked" && slot.appointment;
          // Check if this slot starts on the hour (e.g., 09:00, 10:00, etc.)
          const isOnTheHour = slot.start?.endsWith(':00');
          
          return (
            <div
              key={index}
              className={`time-slot-container${
                isUnavailable ? " excluded" : ""
              }${isOnTheHour ? " on-the-hour" : ""}`}
            >
              <div className="time-slot-content">
                {hasAppointment ? (
                  <AppointmentSlot
                    appointment={slot.appointment}
                    onStatusUpdate={onStatusUpdate}
                    onDelete={onDelete}
                  />
                ) : (
                  <Slot
                    slot={slot}
                    date={day.date}
                    onChangeStatus={onChangeSlotStatus}
                  />
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
