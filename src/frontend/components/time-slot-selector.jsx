import { __ } from "@wordpress/i18n";
import { Button } from "@wordpress/components";

const TimeSlotSelector = ({ slots, selectedSlot, onSlotSelect, disabled }) => {
  if (disabled || slots.length === 0) {
    return (
      <div className="time-slot-selector disabled">
        <p>{__("Please select a date first", "appointment-booking")}</p>
      </div>
    );
  }

  return (
    <div className="time-slot-selector">
      {slots.length === 0 ? (
        <p className="no-slots">
          {__("No available slots for this date", "appointment-booking")}
        </p>
      ) : (
        <div className="time-slots-grid">
          {slots.map((slot) => (
            <Button
              key={slot}
              variant={selectedSlot === slot ? "primary" : "secondary"}
              onClick={() => onSlotSelect(slot)}
              className={`time-slot-button ${
                selectedSlot === slot ? "selected" : ""
              }`}
            >
              {slot}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export { TimeSlotSelector };
