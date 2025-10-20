import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";
import { __ } from "@wordpress/i18n";
import {
  useSchedule,
  useAppointments,
  useAppointmentManagement,
} from "../../../hooks";
import ScheduleNotFound from "./ScheduleNotFound";
import { useNormalizedDays } from "../hooks/useNormalizedDays";
import { useSlotActions } from "../hooks/useSlotActions";
import CalendarLoading from "./CalendarLoading";
import CalendarError from "./CalendarError";

const CalendarGrid = () => {
  const {
    schedule,
    loading: loadingSchedule,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useSchedule();

  const scheduleIdFromData = schedule?.id;

  const {
    appointments,
    loading: loadingAppointments,
    error: appointmentsError,
    refetch: refetchAppointments,
  } = useAppointments(scheduleIdFromData);

  const { handleStatusUpdate, handleDelete } = useAppointmentManagement();

  const meetingDuration = Number(schedule?.meeting_duration || 30);
  const {
    updateSlotStatus,
    handleStatusUpdateWithRefresh,
    handleDeleteWithRefresh,
  } = useSlotActions(
    scheduleIdFromData,
    { refetchSchedule, refetchAppointments },
    { handleStatusUpdate, handleDelete }
  );

  const { normalizedDays, timeRows } = useNormalizedDays(
    schedule,
    appointments,
    meetingDuration
  );

  if (loadingSchedule || loadingAppointments) return <CalendarLoading />;

  if (!schedule || !schedule.id) return <ScheduleNotFound />;

  if (appointmentsError || scheduleError)
    return (
      <CalendarError>
        {__("Error loading Calendar:", "appointment-booking")}
      </CalendarError>
    );

  return (
    <div
      className="calendar-grid"
      style={{
        gridTemplateColumns: `100px repeat(${normalizedDays.length}, 120px)`,
      }}
    >
      <TimeColumn timeRows={timeRows} />
      {normalizedDays.map((day) => (
        <DayColumn
          key={day.date}
          day={day}
          onStatusUpdate={handleStatusUpdateWithRefresh}
          onChangeSlotStatus={updateSlotStatus}
          onDelete={handleDeleteWithRefresh}
        />
      ))}
    </div>
  );
};

export { CalendarGrid };
