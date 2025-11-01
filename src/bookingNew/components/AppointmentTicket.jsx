/**
 * AppointmentTicket Component
 *
 * Displays a formatted appointment confirmation ticket after successful booking.
 * Shows customizable reservation message from WordPress settings, appointment details,
 * and unique appointment ID. Used as success state replacement for BookingForm.
 * Supports Jalali date format and styled status badge.
 *
 * @param {Object} appointment - Appointment object containing id, dates, times, and status
 */
import React from "react";
import {
  getStatusColor,
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

  // Get reservation message from WordPress settings
  const reservationMessage =
    (typeof window !== "undefined" &&
      window.wpApiSettings?.reservationMessage) ||
    __("نوبت شما با موفقیت رزرو شد!", "nobat");

  return (
    <div className="appointment-ticket">
      <div className="ticket-header">
        <h3 dangerouslySetInnerHTML={{ __html: reservationMessage }} />
      </div>

      <div className="ticket-content">
        <div className="ticket-row">
          <span className="label">تاریخ:</span>
          <span className="value">{slot_date_jalali || slot_date}</span>
        </div>

        <div className="ticket-row">
          <span className="label">ساعت:</span>
          <span className="value">{formatTimeRange(start_time, end_time)}</span>
        </div>

        <div className="ticket-row">
          <span className="label">وضعیت:</span>
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(status) }}
          >
            {getStatusText(status)}
          </span>
        </div>
      </div>

      <div className="ticket-footer">
        <div className="ticket-id">شماره نوبت: #{id}</div>
      </div>
    </div>
  );
};

export default AppointmentTicket;
