
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
  const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

  return (
    <div className="appointment-selector">
      <div className="week-days-selector">
        <div className="week-days-grid">
          {days.map((dayData) => {
            const isSelected = selectedDay?.jalali_date === dayData.jalali_date;
            const isCurrentDay = dayData?.date === today;

            return (
              <DayButton
                key={dayData.jalali_date}
                day={dayData}
                isSelected={isSelected}
                isCurrentDay={isCurrentDay}
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
