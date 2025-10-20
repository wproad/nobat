import { computeTimeRows } from "../utils/time";

export const useNormalizedDays = (schedule, appointments, meetingDuration) => {
  const days = Array.isArray(schedule?.timeslots) ? schedule.timeslots : [];
  const timeRows = computeTimeRows(schedule?.timeslots, meetingDuration);

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
        if (existing.status === "reserved") {
          const aptKey = `${day.date} ${row.key}`;
          const apt = appointmentByDateSlot.get(aptKey);
          return apt ? { ...existing, appointment: apt } : existing;
        }
        return existing;
      }
      return { start: row.start, end: row.end, status: "unavailable" };
    });

    return { ...day, slots: normalizedSlots };
  });
};