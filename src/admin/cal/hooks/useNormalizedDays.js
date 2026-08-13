import { computeTimeRows } from "../utils/time";

export const useNormalizedDays = (schedule, appointments, meetingDuration) => {
  const days = Array.isArray(schedule?.timeslots) ? schedule.timeslots : [];
  const timeRows = computeTimeRows(schedule?.timeslots, meetingDuration);

  const appointmentByDateSlot = new Map(
    (Array.isArray(appointments) ? appointments : []).map((apt) => {
      const key = `${apt.slot_date} ${apt.start_time?.substring(0, 5)}-${apt.end_time?.substring(0, 5)}`;
      return [key, apt];
    })
  );

  const normalizedDays = days.map((day) => {
    const slotByKey = new Map(
      (Array.isArray(day?.slots) ? day.slots : []).map((slot) => [
        `${slot.start}-${slot.end}`,
        slot,
      ])
    );

    const normalizedSlots = timeRows.map((row) => {
      const existing = slotByKey.get(row.key);
      if (existing) {
        // Attach appointment data for booked slots
        if (existing.status === "booked") {
          const aptKey = `${day.date} ${row.key}`;
          const apt = appointmentByDateSlot.get(aptKey);
          if (apt) {
            return { ...existing, appointment: apt };
          }
          return existing;
        }
        return existing;
      }
      return { start: row.start, end: row.end, status: "unavailable" };
    });

    return { ...day, slots: normalizedSlots };
  });

  return { normalizedDays, timeRows };
};
