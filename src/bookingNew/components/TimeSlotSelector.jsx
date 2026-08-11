/**
 * TimeSlotSelector Component
 *
 * Soft Slot date strip + time slot panel for appointment booking.
 *
 * @param {Array} days - Array of day objects with available slots (timeslots from schedule)
 * @param {Object} selectedDay - Currently selected day object
 * @param {Object} selectedSlot - Currently selected time slot object
 * @param {Function} onDaySelect - Callback when a day is selected (receives day object)
 * @param {Function} onSlotSelect - Callback when a time slot is selected (receives slot object)
 */
import { __ } from "../../utils/i18n";
import DayButton from "./DayButton";
import TimeSlotButton from "./TimeSlotButton";

const TimeSlotSelector = ({
  days,
  selectedDay,
  selectedSlot,
  onDaySelect,
  onSlotSelect,
}) => {
  if (!days || days.length === 0) {
    return (
      <p className="bf-field__help">
        {__("No available booking dates at this time.", "nobat")}
      </p>
    );
  }

  return (
    <div className="bf-stack">
      <section aria-label={__("Select a date", "nobat")}>
        <div
          className="bf-dates"
          role="listbox"
          aria-label={__("Available booking dates", "nobat")}
        >
          {days.map((dayData) => {
            const isSelected =
              selectedDay?.jalali_date === dayData.jalali_date;

            return (
              <DayButton
                key={dayData.jalali_date}
                day={dayData}
                isSelected={isSelected}
                onClick={() => onDaySelect(dayData)}
              />
            );
          })}
        </div>
      </section>

      {selectedDay && (
        <section>
          <div className="bf-panel">
            <p className="bf-panel__title" id="nobat-slot-title">
              {__("Available time slots for", "nobat")} {selectedDay.jalali_date}
            </p>
            {selectedDay.slots && selectedDay.slots.length > 0 ? (
              <div
                className="bf-slots"
                role="group"
                aria-labelledby="nobat-slot-title"
              >
                {selectedDay.slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <TimeSlotButton
                      key={slot.id}
                      slot={slot}
                      isSelected={isSelected}
                      onClick={() => onSlotSelect(slot)}
                    />
                  );
                })}
              </div>
            ) : (
              <p className="bf-field__help">
                {__("No available time slots for this day", "nobat")}
              </p>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TimeSlotSelector;
