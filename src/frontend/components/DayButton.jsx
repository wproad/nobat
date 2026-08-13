/**
 * DayButton Component
 *
 * Soft Slot date chip for selecting a booking day.
 * Displays Jalali weekday, day number, and month name.
 *
 * @param {Object} day - Day object containing date, jalali_date, weekday, day_number, month_name
 * @param {boolean} isSelected - Whether this day is currently selected
 * @param {Function} onClick - Callback function when button is clicked (receives day object)
 */
const DayButton = ({ day, isSelected, onClick }) => {
  return (
    <button
      type="button"
      className="bf-date"
      role="option"
      aria-selected={isSelected ? "true" : "false"}
      data-date={day?.jalali_date}
      onClick={onClick}
    >
      <span className="bf-date__weekday">{day?.weekday}</span>
      <span className="bf-date__day">{day?.day_number}</span>
      <span className="bf-date__month">{day?.month_name}</span>
    </button>
  );
};

export default DayButton;
