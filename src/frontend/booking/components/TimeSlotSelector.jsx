import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import DayButton from "./DayButton";
import TimeSlotButton from "./TimeSlotButton";

/**
 * TimeSlotSelector component - v2 API compatible
 * Expects schedule.days array with slot objects containing id, schedule_id, start_time, end_time
 */
const TimeSlotSelector = ({ schedule, onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    // Clear selected slot when changing date
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
  };

  // Notify parent component when slot selection changes
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      onSlotSelect?.({
        slotId: selectedSlot.id,
        scheduleId: selectedSlot.schedule_id,
        date: selectedDate,
        timeSlot: `${selectedSlot.start_time}-${selectedSlot.end_time}`,
        slotData: selectedSlot,
      });
    } else {
      onSlotSelect?.(null);
    }
  }, [selectedDate, selectedSlot, onSlotSelect]);

  // Return early if no schedule or no days
  if (!schedule || !schedule.days || schedule.days.length === 0) {
    return (
      <div className="no-slots">
        {__("No available dates", "nobat")}
      </div>
    );
  }

  // Get the selected day's data
  const selectedDayData = selectedDate
    ? schedule.days.find((day) => day.jalali_date === selectedDate)
    : null;

  // Filter available slots for the selected day
  const visibleSlots = selectedDayData
    ? (selectedDayData.slots || []).filter(
        (slot) => slot.status === "available"
      )
    : [];

  return (
    <div className="appointment-selector">
      <div className="week-days-selector">
        <div className="week-days-grid">
          {schedule.days.map((dayData) => {
            // Only show days that have available slots
            const availableSlots = (dayData.slots || []).filter(
              (slot) => slot.status === "available"
            );
            
            if (availableSlots.length === 0) return null;

            const isSelected = selectedDate === dayData.jalali_date;

            return (
              <DayButton
                key={dayData.jalali_date}
                day={dayData}
                isSelected={isSelected}
                isToday={false}
                onClick={handleDateClick}
              />
            );
          })}
        </div>
      </div>

      {selectedDayData && visibleSlots.length > 0 && (
        <div className="time-slots-container">
          <span className="date-selector-label">
            {__("Available Hours", "nobat")}
          </span>
          <div className="time-slots-grid">
            {visibleSlots.map((slot) => {
              const isSlotSelected =
                selectedSlot &&
                selectedSlot.id === slot.id;

              return (
                <TimeSlotButton
                  key={slot.id}
                  slot={slot}
                  isSelected={isSlotSelected}
                  onClick={handleSlotClick}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
