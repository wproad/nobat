/**
 * AppointmentTicket Component
 *
 * Soft Slot success summary after booking: lead → meta → status → queue chip.
 *
 * @param {Object} appointment - Appointment object containing id, dates, times, and status
 */
import {
  getStatusClass,
  getStatusText,
  formatTimeRange,
} from "../utils/displayHelpers";
import { __ } from "../../utils/i18n";

const AppointmentTicket = ({ appointment }) => {
  if (!appointment) {
    return null;
  }

  const { id, slot_date_jalali, start_time, end_time, status, slot_date } =
    appointment;

  const reservationMessage =
    (typeof window !== "undefined" &&
      window.wpApiSettings?.reservationMessage) ||
    __("Appointment booked successfully!", "nobat");

  return (
    <section className="bf-card bf-success">
      <p
        className="bf-success__lead"
        dangerouslySetInnerHTML={{ __html: reservationMessage }}
      />
      <hr className="bf-divider" />
      <div className="bf-success__rows">
        <div className="bf-success__row">
          <span className="bf-success__label">{__("Date", "nobat")}</span>
          <span className="bf-success__value">
            {slot_date_jalali || slot_date}
          </span>
        </div>
        <div className="bf-success__row">
          <span className="bf-success__label">{__("Time", "nobat")}</span>
          <span className="bf-success__value">
            {formatTimeRange(start_time, end_time)}
          </span>
        </div>
        <div className="bf-success__row">
          <span className="bf-success__label">{__("Status", "nobat")}</span>
          <span className={`bf-badge ${getStatusClass(status)}`}>
            {getStatusText(status)}
          </span>
        </div>
      </div>
      <hr className="bf-divider" />
      <div className="bf-queue">
        {__("Appointment Number:", "nobat")} #{id}
      </div>
    </section>
  );
};

export default AppointmentTicket;
