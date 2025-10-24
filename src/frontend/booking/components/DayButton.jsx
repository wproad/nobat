/**
 * DayButton component - v2 API compatible
 * Expects day object with jalali_date, weekday, day_number, month_name
 */
const DayButton = ({ day, isSelected, isToday, onClick }) => {
  return (
    <button
      type="button"
      className={`day-button ${isSelected ? "selected" : ""} ${
        isToday ? "today" : ""
      }`}
      onClick={() => onClick(day.jalali_date)}
    >
      <div className="day-name">{day?.weekday}</div>
      <div className="day-number">{day?.day_number}</div>
      <div className="month-name">{day?.month_name}</div>
    </button>
  );
};

export default DayButton;
