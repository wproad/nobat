import { __ } from "../../../utils/i18n";

/**
 * AppointmentTicket component - v2 API compatible
 * Shows confirmation after successful booking
 */
const AppointmentTicket = ({ appointmentData }) => {
  if (!appointmentData) {
    return null;
  }

  console.log(appointmentData);

  // Format time slot display (hours:minutes only)
  const formatTime = (timeString) => {
    if (!timeString) return "";
    // Remove seconds if present (HH:MM:SS -> HH:MM)
    return timeString.substring(0, 5);
  };

  const timeSlot =
    appointmentData.start_time && appointmentData.end_time
      ? `${formatTime(appointmentData.start_time)} - ${formatTime(
          appointmentData.end_time
        )}`
      : "";

  // Get custom success message from window object
  const customSuccessMessage = window.nobatBooking?.successMessage || "";

  // Use Jalali date if available, otherwise fallback to gregorian
  const displayDate =
    appointmentData.slot_date_jalali || appointmentData.slot_date;

  return (
    <div className="appointment-ticket">
      <div className="ticket-card">
        {/* Ticket Header */}
        <div className="ticket-header">
          <div className="ticket-header-top">
            <div className="ticket-status">
              <span className="status-badge pending">
                {__("Pending Confirmation", "nobat")}
              </span>
            </div>
          </div>

          {customSuccessMessage ? (
            <div className="ticket-title custom-message">
              <div dangerouslySetInnerHTML={{ __html: customSuccessMessage }} />
            </div>
          ) : (
            <div className="ticket-title">
              <h2>
                {__("Your appointment request was sent successfully!", "nobat")}
              </h2>
              <p className="ticket-subtitle">
                {__(
                  "You will be notified once an admin confirms your appointment.",
                  "nobat"
                )}
              </p>
            </div>
          )}
        </div>

        {/* Ticket Body */}
        <div className="ticket-body">
          {/* Main Info Section */}
          <div className="ticket-main-info">
            <div className="info-row">
              <div className="info-item">
                <div className="info-label">{__("Date", "nobat")}</div>
                <div className="info-value">{displayDate}</div>
              </div>
              <div className="info-item">
                <div className="info-label">{__("Time", "nobat")}</div>
                <div className="info-value">{timeSlot}</div>
              </div>
            </div>

            {appointmentData.note && (
              <div className="info-row">
                <div className="info-item" style={{ width: "100%" }}>
                  <div className="info-label">{__("Your Note", "nobat")}</div>
                  <div className="info-value">{appointmentData.note}</div>
                </div>
              </div>
            )}
          </div>

          {/* Appointment Details */}
          {/* <div className="ticket-appointment-details">
            <div className="appointment-date-time">
              <div className="date-section">
                <div className="date-icon">📅</div>
                <div className="date-info">
                  <div className="date-label">
                    {__("Date", "nobat")}
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
                    {__("Time", "nobat")}
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
                {__("Booking Reference", "nobat")}
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
                  "nobat"
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
