import { __ } from "../../../utils/i18n";
import { WorkingHoursForDay } from "./WorkingHoursForDay";

export function WeeklyHoursEditor({ weekdays, weeklyHours, setWeeklyHours }) {
  const addWorkingHour = (day) => {
    setWeeklyHours((prev) => ({
      ...prev,
      [day]: [...prev[day], "09:00-12:00"],
    }));
  };

  const removeWorkingHour = (day, index) => {
    setWeeklyHours((prev) => {
      const newDay = [...prev[day]];
      newDay.splice(index, 1);
      return { ...prev, [day]: newDay };
    });
  };

  const updateWorkingHour = (day, index, value) => {
    setWeeklyHours((prev) => {
      const newDay = [...prev[day]];
      newDay[index] = value;
      return { ...prev, [day]: newDay };
    });
  };

  return (
    <>
      <h3>{__("Weekly Hours", "nobat")}</h3>
      {weekdays.map((day) => (
        <WorkingHoursForDay
          key={day}
          day={day}
          hours={weeklyHours[day]}
          onAdd={addWorkingHour}
          onRemove={removeWorkingHour}
          onUpdate={updateWorkingHour}
        />
      ))}
    </>
  );
}
