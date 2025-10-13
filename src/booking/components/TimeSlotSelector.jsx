const TimeSlotSelector = (schedule) => {
  console.log(schedule);
  const isSelected = false;
  const isToday = false;

  const handleDateClick = () => {
    console.log("handleDateClick");
  };
  const disabled = false;
  const dayName = "Monday";
  const dayNumber = "1";
  const monthName = "January";
  
  return (
    <div className="week-days-selector">
      <div className="week-days-grid">
        <button
          type="button"
          className={`day-button ${isSelected ? "selected" : ""} ${
            isToday ? "today" : ""
          }`}
          onClick={() => handleDateClick()}
          disabled={disabled}
        >
          <div className="day-name">{dayName}</div>
          <div className="day-number">{dayNumber}</div>
          <div className="month-name">{monthName}</div>
        </button>
      </div>
    </div>
  );
};

export default TimeSlotSelector;
