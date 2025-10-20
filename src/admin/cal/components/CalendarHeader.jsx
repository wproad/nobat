import { __ } from "@wordpress/i18n";
import { useSchedule } from "../../../hooks";

const CalendarHeader = () => {
  const { schedule } = useSchedule();
  if (
    !schedule ||
    !schedule.id ||
    !Array.isArray(schedule.timeslots) ||
    schedule.timeslots.length === 0
  )
    return null;

  return (
    <h2>
      {schedule?.name}{" "}
      {schedule
        ? Number(schedule.is_active)
          ? __("(Active)", "appointment-booking")
          : __("(Inactive)", "appointment-booking")
        : null}
    </h2>
  );
};

export { CalendarHeader };
