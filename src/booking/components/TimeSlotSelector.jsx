import { useState, useEffect } from "@wordpress/element";
import DayButton from "./DayButton";
import TimeSlotButton from "./TimeSlotButton";

const TimeSlotSelector = ({ schedule, onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  console.log("TimeSlotSelector schedule:", schedule);

  const handleDateClick = (date) => {
    console.log("handleDateClick", date);
    setSelectedDate(date);
    // Clear selected slot when changing date
    setSelectedSlot(null);
  };

  const handleSlotClick = (slot) => {
    console.log("handleSlotClick", slot);
    setSelectedSlot(slot);
  };

  // Notify parent component when slot selection changes
  useEffect(() => {
    if (selectedDate && selectedSlot) {
      onSlotSelect?.({
        date: selectedDate,
        timeSlot: `${selectedSlot.start}-${selectedSlot.end}`,
        slotData: selectedSlot,
      });
    } else {
      onSlotSelect?.(null);
    }
  }, [selectedDate, selectedSlot, onSlotSelect]);

  // Return early if no schedule or no timeslots
  if (!schedule || !schedule.timeslots || schedule.timeslots.length === 0) {
    return <div className="no-slots">No available dates</div>;
  }

  const isToday = (dateString) => {
    const today = new Date();
    const checkDate = new Date(dateString);
    return (
      today.getDate() === checkDate.getDate() &&
      today.getMonth() === checkDate.getMonth() &&
      today.getFullYear() === checkDate.getFullYear()
    );
  };

  // Get the selected day's data
  const selectedDayData = selectedDate
    ? schedule.timeslots.find((day) => day.date === selectedDate)
    : null;

  return (
    <div className="appointment-selector">
      <div className="week-days-selector">
        <div className="week-days-grid">
          {schedule.timeslots.map((dayData) => {
            const isSelected = selectedDate === dayData.date;
            const isTodayDate = isToday(dayData.date);
            const hasSlots = dayData.slots && dayData.slots.length > 0;

            return (
              <DayButton
                key={dayData.date}
                date={dayData.date}
                formattedDate={dayData.formatted_date}
                isSelected={isSelected}
                isToday={isTodayDate}
                hasSlots={hasSlots}
                onClick={handleDateClick}
              />
            );
          })}
        </div>
      </div>

      {selectedDayData && selectedDayData.slots.length > 0 && (
        <div className="time-slots-container">
          <h4 className="time-slots-title">Available Time Slots</h4>
          <div className="time-slots-grid">
            {selectedDayData.slots.map((slot, index) => {
              const isSlotSelected =
                selectedSlot &&
                selectedSlot.start === slot.start &&
                selectedSlot.end === slot.end;

              return (
                <TimeSlotButton
                  key={`${slot.start}-${slot.end}-${index}`}
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
