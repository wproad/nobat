import { TimeColumn } from "./TimeColumn";
import { DayColumn } from "./DayColumn";
import { __ } from "@wordpress/i18n";
import {
  useSchedule,
  useAppointments,
  useAppointmentManagement,
} from "../../../hooks";
import ScheduleNotFound from "./ScheduleNotFound";

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
  const updateSlotStatus = async (date, timeSlot, status) => {
    try {
      const response = await fetch(
        `/wp-json/appointment-booking/v1/schedule/slot`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
          body: JSON.stringify({
            schedule_id: scheduleIdFromData,
            date,
            time_slot: timeSlot,
            status,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to update slot status");
      await response.json().catch(() => ({}));
      refetchSchedule();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleStatusUpdateWithRefresh = async (id, newStatus) => {
    const ok = await handleStatusUpdate(id, newStatus);
    if (ok) {
      refetchAppointments();
    }
    return ok;
  };

  const handleDeleteWithRefresh = async (id) => {
    const ok = await handleDelete(id);
    if (ok) {
      refetchAppointments();
      refetchSchedule();
    }
    return ok;
  };

  const meetingDuration = Number(schedule?.meeting_duration || 30);

  const formatTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}`;
  };

  const parseTimeToMinutes = (hhmm) => {
    if (!hhmm || typeof hhmm !== "string") return null;
    const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  const getDisplayRange = () => {
    const timeslots = schedule?.timeslots;
    let earliest = Infinity;
    let latest = -Infinity;

    if (Array.isArray(timeslots)) {
      timeslots.forEach((day) => {
        const slots = Array.isArray(day?.slots) ? day.slots : [];
        slots.forEach((slot) => {
          const sMin = parseTimeToMinutes(slot?.start);
          const eMin = parseTimeToMinutes(slot?.end);
          if (sMin != null && eMin != null) {
            if (sMin < earliest) earliest = sMin;
            if (eMin > latest) latest = eMin;
          }
        });
      });
    }

    if (
      !Number.isFinite(earliest) ||
      !Number.isFinite(latest) ||
      earliest >= latest
    ) {
      // Fallback: show entire 24 hours when timeslots are not available/valid
      return { start: 0, end: 24 * 60 };
    }
    return { start: earliest, end: latest };
  };

  const computeTimeRows = () => {
    const rows = [];
    if (meetingDuration <= 0) return rows;

    const { start: rangeStart, end: rangeEnd } = getDisplayRange();
    let start = rangeStart;
    while (start + meetingDuration <= rangeEnd) {
      const end = start + meetingDuration;
      rows.push({
        start: formatTime(start),
        end: formatTime(end),
        key: `${formatTime(start)}-${formatTime(end)}`,
      });
      start = end;
    }
    return rows;
  };

  const normalizeDays = () => {
    const days = Array.isArray(schedule?.timeslots) ? schedule.timeslots : [];
    const timeRows = computeTimeRows();

    // Build quick lookup for appointments by date+slot
    const appointmentByDateSlot = new Map(
      (Array.isArray(appointments) ? appointments : []).map((apt) => [
        `${apt.appointment_date} ${apt.time_slot}`,
        apt,
      ])
    );

    return days.map((day) => {
      const slotByKey = new Map(
        (Array.isArray(day?.slots) ? day.slots : []).map((slot) => [
          `${slot.start}-${slot.end}`,
          slot,
        ])
      );

      const normalizedSlots = timeRows.map((row) => {
        const existing = slotByKey.get(row.key);
        if (existing) {
          // Attach appointment if this reserved slot has one
          if (existing.status === "reserved") {
            const aptKey = `${day.date} ${row.key}`;
            const apt = appointmentByDateSlot.get(aptKey);
            return apt ? { ...existing, appointment: apt } : existing;
          }
          return existing;
        }
        return { start: row.start, end: row.end, status: "unavailable" };
      });

      return {
        ...day,
        slots: normalizedSlots,
      };
    });
  };

  if (loadingSchedule || loadingAppointments) {
    return (
      <div className="calendar-loading">
        <p>{__("Loading calendar...", "appointment-booking")}</p>
      </div>
    );
  }

  if (scheduleError) {
    return (
      <div className="calendar-error">
        <p>
          {__("Error loading calendar:", "appointment-booking")} {scheduleError}
        </p>
      </div>
    );
  }

  if (appointmentsError) {
    return (
      <div className="calendar-error">
        <p>
          {__("Error loading appointments:", "appointment-booking")}{" "}
          {appointmentsError}
        </p>
      </div>
    );
  }

  // Handle case when no schedule is found or schedule has no timeslots
  if (
    !schedule ||
    !schedule.id ||
    !Array.isArray(schedule.timeslots) ||
    schedule.timeslots.length === 0
  ) {
    return <ScheduleNotFound />;
  }

  const normalizedDays = normalizeDays();

  return (
    <div
      className="calendar-grid"
      style={{
        gridTemplateColumns: `100px repeat(${normalizedDays.length}, 120px)`,
      }}
    >
      <TimeColumn schedule={schedule} />
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
