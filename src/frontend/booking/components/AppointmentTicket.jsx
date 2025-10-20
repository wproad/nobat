import { __ } from "@wordpress/i18n";

const AppointmentTicket = ({ appointmentData }) => {
  if (!appointmentData) {
    return null;
  }

  return (
    <div className="appointment-ticket">
      <div className="ticket-card">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div className="ticket-header-top">
            {/* <div className="ticket-logo">
              <div className="ticket-logo-icon">📅</div>
              <span className="ticket-logo-text">
                {__("Appointment", "appointment-booking")}
              </span>
            </div>
            <div className="ticket-status">
              <span className="status-badge pending">
                {__("Pending", "appointment-booking")}
              </span>
            </div> */}
          </div>
          <div className="ticket-title">
            <h2>
              {__(
                "{name} Your appointment request was sent successfully",
                "appointment-booking"
              ).replace("{name}", appointmentData.client_name)}
            </h2>
            <p className="ticket-subtitle">
              {__(
                "Youll recieve confirmation SMS to phone number {phone}",
                "appointment-booking"
              ).replace("{phone}", appointmentData.client_phone)}
            </p>
          </div>
        </div>

        {/* Ticket Body */}
        <div className="ticket-body">
          {/* Main Info Section */}
          <div className="ticket-main-info">
            <div className="info-row">
              <div className="info-item">
                <div className="info-label">
                  {__("Date", "appointment-booking")}
                </div>
                <div className="info-value">
                  {appointmentData.appointment_date_jalali}
                </div>
              </div>
              <div className="info-item">
                <div className="info-label">
                  {__("Time", "appointment-booking")}
                </div>
                <div className="info-value">{appointmentData.time_slot}</div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          {/* <div className="ticket-appointment-details">
            <div className="appointment-date-time">
              <div className="date-section">
                <div className="date-icon">📅</div>
                <div className="date-info">
                  <div className="date-label">
                    {__("Date", "appointment-booking")}
                  </div>
                  <div className="date-value">
                    {formatJalaliDate(appointmentData.appointment_date_jalali)}
                  </div>
                </div>
              </div>
              <div className="time-section">
                <div className="time-icon">🕐</div>
                <div className="time-info">
                  <div className="time-label">
                    {__("Time", "appointment-booking")}
                  </div>
                  <div className="time-value">{appointmentData.time_slot}</div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Ticket Footer */}
          <div className="ticket-footer">
            <div className="ticket-id-section">
              <div className="ticket-id-label">
                {__("Booking Reference", "appointment-booking")}
              </div>
              <div className="ticket-id-value">
                #{appointmentData.id || "TBD"}
              </div>
            </div>
            {/* <div className="ticket-note">
              <div className="note-icon">ℹ️</div>
              <div className="note-text">
                {__(
                  "You'll receive an SMS confirmation after admin approval",
                  "appointment-booking"
                )}
              </div>
            </div> */}
          </div>
        </div>

        {/* Ticket Perforation */}
        {/* <div className="ticket-perforation"></div> */}
      </div>
    </div>
  );
};

export { AppointmentTicket };
