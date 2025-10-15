import { __ } from "@wordpress/i18n";
import { useSchedule } from "../../../hooks";

const CalendarHeader = () => {
  const { schedule } = useSchedule();

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
