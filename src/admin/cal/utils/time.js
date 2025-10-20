// src/admin/cal/utils/time.js
export const formatTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}`;
};

export const parseTimeToMinutes = (hhmm) => {
  if (!hhmm || typeof hhmm !== "string") return null;
  const [h, m] = hhmm.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

export const getDisplayRange = (timeslots) => {
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
    return { start: 0, end: 24 * 60 };
  }
  return { start: earliest, end: latest };
};

export const computeTimeRows = (timeslots, meetingDuration) => {
  const rows = [];
  if (meetingDuration <= 0) return rows;

  const { start: rangeStart, end: rangeEnd } = getDisplayRange(timeslots);
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
