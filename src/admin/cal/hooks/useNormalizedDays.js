import { computeTimeRows } from "../utils/time";

export const useNormalizedDays = (schedule, appointments, meetingDuration) => {
  const days = Array.isArray(schedule?.timeslots) ? schedule.timeslots : [];
  const timeRows = computeTimeRows(schedule?.timeslots, meetingDuration);

  console.log("🗓️ useNormalizedDays - appointments received:", appointments);
  console.log("🗓️ useNormalizedDays - days:", days.length);
  
  const appointmentByDateSlot = new Map(
    (Array.isArray(appointments) ? appointments : []).map((apt) => {
      const key = `${apt.slot_date} ${apt.start_time?.substring(0, 5)}-${apt.end_time?.substring(0, 5)}`;
      console.log(`🔑 Creating map key: "${key}" for appointment:`, apt);
      return [key, apt];
    })
  );
  
  console.log("🗺️ appointmentByDateSlot Map:", Array.from(appointmentByDateSlot.entries()));

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
          console.log(`🔍 Looking for appointment with key: "${aptKey}"`);
          const apt = appointmentByDateSlot.get(aptKey);
          if (apt) {
            console.log(`✅ Found appointment:`, apt);
            return { ...existing, appointment: apt };
          } else {
            console.log(`❌ No appointment found for key: "${aptKey}"`);
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
