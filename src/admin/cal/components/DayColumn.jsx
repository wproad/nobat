import { __ } from "@wordpress/i18n";
import { AppointmentSlot } from "./AppointmentSlot";

const DayColumn = ({ day, onStatusUpdate, onDelete }) => {
  return (
    <div className="day-column">
      <div className="day-header">
        <div className="day-name">{day.formatted_date}</div>
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
                  <div className="empty-slot">
                    {isUnavailable
                      ? __("unavailable", "appointment-booking")
                      : slot.status}
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
