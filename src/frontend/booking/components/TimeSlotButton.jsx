const TimeSlotButton = ({ slot, isSelected, onClick }) => {
  const { start, end, status } = slot;
  const isReserved = status === "reserved";
  const timeText = `${start} - ${end}`;

  if (isReserved) {
    return (
      <span className="time-slot-button reserved" disabled>
        {timeText}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`time-slot-button ${status} ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(slot)}
      disabled={status === "unavailable"}
    >
      {timeText}
    </button>
  );
};

export default TimeSlotButton;
