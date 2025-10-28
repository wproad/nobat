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
