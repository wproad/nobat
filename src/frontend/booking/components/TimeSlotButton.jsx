import { __ } from "@wordpress/i18n";

/**
 * Strip seconds from time string (HH:MM:SS -> HH:MM)
 */
const stripSeconds = (time) => {
  if (!time) return time;
  const parts = time.split(":");
  return parts.length > 2 ? `${parts[0]}:${parts[1]}` : time;
};

/**
 * TimeSlotButton component - v2 API compatible
 * Expects slot object with id, start_time, end_time, status
 */
const TimeSlotButton = ({ slot, isSelected, onClick }) => {
  const { start_time, end_time, status } = slot;
  const isBooked = status === "booked";
  
  // Strip seconds from times
  const startTime = stripSeconds(start_time);
  const endTime = stripSeconds(end_time);

  if (isBooked) {
    return (
      <span className="time-slot-button booked" disabled>
        <div className="slot-time-display">
          <div className="time-start">{startTime}</div>
          <div className="time-separator">{__("to", "nobat")}</div>
          <div className="time-end">{endTime}</div>
        </div>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`time-slot-button ${status} ${isSelected ? "selected" : ""}`}
      onClick={() => onClick(slot)}
      disabled={status !== "available"}
    >
      <div className="slot-time-display">
        <div className="time-start">{startTime}</div>
        <div className="time-separator">{__("to", "nobat")}</div>
        <div className="time-end">{endTime}</div>
      </div>
    </button>
  );
};

export default TimeSlotButton;
