const DayButton = ({
  date,
  formattedDate,
  isSelected,
  isToday,
  hasSlots,
  onClick,
}) => {
  const parseDateInfo = (formattedDate) => {
    // formattedDate is in format: "Monday, October 13"
    const parts = formattedDate.split(", ");
    const dayName = parts[0]; // "Monday"
    const dateParts = parts[1].split(" "); // ["October", "13"]
    const monthName = dateParts[0]; // "October"
    const dayNumber = dateParts[1]; // "13"

    return { dayName, dayNumber, monthName };
  };

  const { dayName, dayNumber, monthName } = parseDateInfo(formattedDate);

  return (
    <button
      type="button"
      className={`day-button ${isSelected ? "selected" : ""} ${
        isToday ? "today" : ""
      } ${!hasSlots ? "no-slots" : ""}`}
      onClick={() => onClick(date)}
      disabled={!hasSlots}
    >
      <div className="day-name">{dayName}</div>
      <div className="day-number">{dayNumber}</div>
      <div className="month-name">{monthName}</div>
    </button>
  );
};

export default DayButton;
