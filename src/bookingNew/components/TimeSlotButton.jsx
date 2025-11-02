/**
 * TimeSlotButton Component
 *
 * Interactive button component for selecting a time slot.
 * Handles multiple states: available (selectable), booked (disabled), and selected (highlighted).
 * Automatically formats time display and handles booking status.
 *
 * @param {Object} slot - Time slot object containing id, start_time, end_time, status
 * @param {boolean} isSelected - Whether this slot is currently selected
 * @param {Function} onClick - Callback function when slot is clicked
 */
import { __ } from "../../utils/i18n";
import { stripSeconds } from "../utils/displayHelpers";

const TimeSlotButton = ({ slot, isSelected, onClick }) => {
  const { start_time, end_time, status } = slot;
  const isBooked = status === "booked";

  const buttonClasses = [
    "time-slot-button",
    status,
    isSelected ? "selected" : "",
  ]
    .filter(Boolean)
    .join(" ");

  if (isBooked) {
    return (
      <span className={`${buttonClasses} booked`} disabled>
        <div className="slot-time-display">
          <div className="time-start">{stripSeconds(start_time)}</div>
          <div className="time-separator">{__("to", "nobat")}</div>
          <div className="time-end">{stripSeconds(end_time)}</div>
        </div>
      </span>
    );
  }

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={() => onClick(slot)}
      disabled={status !== "available"}
    >
      <div className="slot-time-display">
        <div className="time-start">{stripSeconds(start_time)}</div>
        <div className="time-separator">{__("to", "nobat")}</div>
        <div className="time-end">{stripSeconds(end_time)}</div>
      </div>
    </button>
  );
};

export default TimeSlotButton;
