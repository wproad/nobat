/**
 * TimeSlotSelector Component
 *
 * Manages day and time slot selection for appointment booking with two-step selection.
 * Renders week days grid for day selection, then displays available time slots for selected day.
 * Shows empty state message when no slots are available for the selected day.
 * Resets slot selection when day changes to prevent inconsistent state.
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
  return (
    <div className="appointment-selector">
      <div className="week-days-selector">
        <div className="week-days-grid">
          {days.map((dayData) => {
            const isSelected = selectedDay?.jalali_date === dayData.jalali_date;

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
      </div>

      {selectedDay && (
        <div className="time-slots-container">
          <div className="date-selector-label">
            {__("Available time slots for", "nobat")} {selectedDay.jalali_date}
          </div>
          <div className="time-slots-grid">
            {selectedDay.slots?.map((slot) => {
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
          {!selectedDay.slots || selectedDay.slots.length === 0 ? (
            <div className="no-slots">
              {__("No available time slots for this day", "nobat")}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
