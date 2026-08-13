/**
 * AppointmentInfo Component
 *
 * Soft Slot card header row: date · time · status badge.
 *
 * @param {Object} appointment - Appointment object containing slot_date_jalali, start_time, end_time, status
 */
import {
  getStatusClass,
  getStatusText,
  formatTimeRange,
} from "../utils/displayHelpers.js";

export function AppointmentInfo({ appointment }) {
  if (!appointment) return null;

  return (
    <div className="bf-card__row">
      <div className="bf-card__meta">
        <span className="bf-card__date">{appointment.slot_date_jalali}</span>
        <span className="bf-card__time">
          {formatTimeRange(appointment.start_time, appointment.end_time)}
        </span>
      </div>
      <span className={`bf-badge ${getStatusClass(appointment.status)}`}>
        {getStatusText(appointment.status)}
      </span>
    </div>
  );
}
