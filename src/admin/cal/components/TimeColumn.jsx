import { useMemo } from "@wordpress/element";

const TimeColumn = ({ schedule }) => {
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

  const entries = useMemo(() => {
    const results = [];
    if (meetingDuration <= 0) return results;

    const { start: rangeStart, end: rangeEnd } = getDisplayRange();
    let start = rangeStart;
    while (start + meetingDuration <= rangeEnd) {
      const end = start + meetingDuration;
      results.push({
        type: "slot",
        label: `${formatTime(start)}-${formatTime(end)}`,
      });

      start = end;
    }
    return results;
  }, [meetingDuration, schedule]);

  return (
    <div className="time-column">
      <div className="time-header">Time</div>
      {entries.map((entry, index) => (
        <div key={`slot-${index}`} className="time-slot">
          {entry.label}
        </div>
      ))}
    </div>
  );
};

export { TimeColumn };
