const DayButton = ({ day, isSelected, isToday, onClick }) => {
  return (
    <button
      type="button"
      className={`day-button ${isSelected ? "selected" : ""} ${
        isToday ? "today" : ""
      }`}
      onClick={() => onClick(day.date_jalali)}
    >
      {/* {console.log(day?.date_jalali)} */}
      <div className="day-name">{day?.weekday}</div>
      <div className="day-number">{day?.day_number}</div>
      <div className="month-name">{day?.month_name}</div>
    </button>
  );
};

export default DayButton;
