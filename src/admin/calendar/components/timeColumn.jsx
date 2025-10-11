const TimeColumn = ({ timeSlots }) => {
  const timeSlotStart = (timeSlot) => {
    return String(timeSlot).split("-")[0];
  };

  return (
    <div className="time-column">
      <div className="time-header">Time</div>
      {timeSlots.map((slot) => {
        return (
          <div key={slot.label} className="time-slot">
            {timeSlotStart(slot.label)}
          </div>
        );
      })}
    </div>
  );
};

export { TimeColumn };
