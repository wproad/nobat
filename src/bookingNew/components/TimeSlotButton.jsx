/**
 * TimeSlotButton Component
 *
 * Soft Slot time slot control. Available slots are selectable; booked/unavailable
 * slots stay in the grid as muted dashed buttons.
 *
 * @param {Object} slot - Time slot object containing id, start_time, end_time, status
 * @param {boolean} isSelected - Whether this slot is currently selected
 * @param {Function} onClick - Callback function when slot is clicked
 */
import { __ } from "../../utils/i18n";
import { stripSeconds } from "../utils/displayHelpers";

const TimeSlotButton = ({ slot, isSelected, onClick }) => {
  const { start_time, end_time, status } = slot;
  const isUnavailable = status !== "available";
  const label = `${stripSeconds(start_time)} ${__("to", "nobat")} ${stripSeconds(end_time)}`;

  if (isUnavailable) {
    return (
      <button type="button" className="bf-slot" disabled aria-disabled="true">
        {label}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="bf-slot"
      aria-pressed={isSelected ? "true" : "false"}
      onClick={() => onClick(slot)}
    >
      {label}
    </button>
  );
};

export default TimeSlotButton;
