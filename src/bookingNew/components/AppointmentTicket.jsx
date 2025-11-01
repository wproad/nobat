/**
 * AppointmentTicket Component
 *
 * Displays appointment confirmation ticket after successful booking.
 */
import React from "react";
import { appointmentTicket, reservationMessage } from "../utils/data";
import {
  getStatusColor,
  getStatusText,
  formatTimeRange,
} from "../utils/displayHelpers";

const AppointmentTicket = () => {
  const { id, slot_date_jalali, start_time, end_time, status } =
    appointmentTicket;

  return (
    <div className="appointment-ticket">
      <div className="ticket-header">
        <h3>نوبت شما با موفقیت رزرو شد!</h3>
      </div>

      <div className="ticket-content">
        <div className="ticket-row">
          <span className="label">تاریخ:</span>
          <span className="value">{slot_date_jalali}</span>
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

        <div className="reservation-message">{reservationMessage}</div>
      </div>

      <div className="ticket-footer">
        <div className="ticket-id">شماره نوبت: #{id}</div>
      </div>
    </div>
  );
};

export default AppointmentTicket;
