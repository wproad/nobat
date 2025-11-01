/**
 * AppointmentInfo Component
 *
 * Displays appointment information including date, time, and status.
 * This component handles the display logic separately from action logic.
 *
 * @param {Object} appointment - Appointment object containing appointment details
 */
import {
  getStatusColor,
  getStatusText,
  formatTimeRange,
} from "../utils/displayHelpers.js";
import { __ } from "../../utils/i18n.js";

export function AppointmentInfo({ appointment }) {
  if (!appointment) return null;

  return (
    <div className="appointment-info">
      <div className="appointment-date-time">
        <div className="date-jalali">{appointment.slot_date_jalali}</div>
        <div className="time-range">
          {formatTimeRange(appointment.start_time, appointment.end_time)}
        </div>
      </div>
      <div className="appointment-status">
        <span
          className="status-badge"
          style={{
            backgroundColor: getStatusColor(appointment.status),
          }}
        >
          {getStatusText(appointment.status)}
        </span>
      </div>
    </div>
  );
}
