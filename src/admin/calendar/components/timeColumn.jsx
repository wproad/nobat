const TimeColumn = ({ timeSlots = [], error }) => {
  const slots = (
    timeSlots.length
      ? timeSlots
      : [
          { label: "9:00-10:00", excluded: false },
          { label: "10:00-11:00", excluded: false },
          { label: "11:00-12:00", excluded: false },
          { label: "14:00-15:00", excluded: false },
          { label: "15:00-16:00", excluded: false },
          { label: "16:00-17:00", excluded: false },
        ]
  ).map((s) => (typeof s === "string" ? { label: s, excluded: false } : s));

  return (
    <div className="time-column">
      <div className="time-header">Time</div>
      {slots.map((slot, idx) => {
        const [startLabel] = String(slot.label).split("-");
        return (
          <div key={idx} className="time-slot">
            {startLabel}
          </div>
        );
      })}
    </div>
  );
};

export { TimeColumn };
