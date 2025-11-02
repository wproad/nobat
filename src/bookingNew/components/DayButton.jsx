/**
 * DayButton Component
 *
 * Button component for selecting a specific day in the booking calendar.
 * Displays Jalali date format with weekday, day number, and month name.
 * Automatically highlights the current day and selected day with CSS classes.
 * Helps users navigate through available booking dates.
 *
 * @param {Object} day - Day object containing date, jalali_date, weekday, day_number, month_name
 * @param {boolean} isSelected - Whether this day is currently selected
 * @param {Function} onClick - Callback function when button is clicked (receives day object)
 */
const DayButton = ({ day, isSelected, onClick }) => {
  const today = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const isCurrentDay = day?.date === today;

  const buttonClasses = [
    "day-button",
    isSelected ? "selected" : "",
    isCurrentDay ? "current-day" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      <div className="day-name">{day?.weekday}</div>
      <div className="day-number">{day?.day_number}</div>
      <div className="month-name">{day?.month_name}</div>
    </button>
  );
};

export default DayButton;
