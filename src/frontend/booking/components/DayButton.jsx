const DayButton = ({ date, isSelected, isToday, onClick }) => {
  return (
    <button
      type="button"
      className={`day-button ${isSelected ? "selected" : ""} ${
        isToday ? "today" : ""
      }`}
      onClick={() => onClick(date)}
    >
      {date}
      {/* TODO: fix this */}
      {/* <div className="day-name">{dayNameShort || dayName}</div>
      <div className="day-number">{dayNumber}</div>
      <div className="month-name">{monthName}</div> */}
    </button>
  );
};

export default DayButton;
