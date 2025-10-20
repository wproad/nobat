import { __ } from "@wordpress/i18n";
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
            <span className="day-number">{day?.day_number}</span>
            <span className="month-name">{day?.month_name} - {day?.date}</span>
          </div>
        </div>
      </div>

      <div className="time-slots">
        {(day.slots || []).map((slot, index) => {
          const isUnavailable = slot.status === "unavailable";
          const isReserved = slot.status === "reserved" && slot.appointment;
          return (
            <div
              key={index}
              className={`time-slot-container${
                isUnavailable ? " excluded" : ""
              }`}
            >
              <div className="time-slot-content">
                {isReserved ? (
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
