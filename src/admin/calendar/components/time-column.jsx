const TimeColumn = () => {
  const timeSlots = [
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "14:00-15:00",
    "15:00-16:00",
    "16:00-17:00",
  ];

  return (
    <div className="time-column">
      <div className="time-header">Time</div>
      {timeSlots.map((slot, idx) => (
        <div key={idx} className="time-slot">
          {slot}
        </div>
      ))}
    </div>
  );
};

export { TimeColumn };
