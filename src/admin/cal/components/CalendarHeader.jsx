import { __ } from "../../../utils/i18n";
import { useSchedule } from "../../../hooks";

const CalendarHeader = () => {
  const { schedule } = useSchedule();
  if (!schedule || !schedule.id) return null;

  return (
    <h2>
      {schedule?.name}{" "}
      {schedule
        ? Number(schedule.is_active)
          ? __("(Active)", "nobat")
          : __("(Inactive)", "nobat")
        : null}
    </h2>
  );
};

export { CalendarHeader };
