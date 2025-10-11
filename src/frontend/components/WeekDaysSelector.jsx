import { __ } from "@wordpress/i18n";
import { useMemo } from "@wordpress/element";

const WeekDaysSelector = ({ selectedDate, onDateSelect, disabled = false }) => {
  // Generate next 7 days starting from today
  const next7Days = useMemo(() => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = date.getDate();
    const monthName = date.toLocaleDateString("en-US", { month: "short" });

    return {
      dayName,
      dayNumber,
      monthName,
      isToday,
    };
  };

  const isDateSelected = (date) => {
    return selectedDate === formatDate(date);
  };

  const handleDateClick = (date) => {
    if (disabled) return;
    const formattedDate = formatDate(date);
    onDateSelect(formattedDate);
  };

  return (
    <div className="week-days-selector">
      <div className="week-days-grid">
        {next7Days.map((date, index) => {
          const { dayName, dayNumber, monthName, isToday } =
            formatDisplayDate(date);
          const isSelected = isDateSelected(date);

          return (
            <button
              key={index}
              type="button"
              className={`day-button ${isSelected ? "selected" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => handleDateClick(date)}
              disabled={disabled}
            >
              <div className="day-name">{dayName}</div>
              <div className="day-number">{dayNumber}</div>
              <div className="month-name">{monthName}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { WeekDaysSelector };
