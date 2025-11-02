/**
 * AppointmentInfo Component
 *
 * Display-only component for appointment information (date, time, status).
 * Separates presentation logic from action logic for better component architecture.
 * Uses utility functions for time formatting and status color/text mapping.
 * Renders Jalali date and formatted time range with status badge.
 *
 * @param {Object} appointment - Appointment object containing slot_date_jalali, start_time, end_time, status
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
