import { __ } from "@wordpress/i18n";
import { Card, CardBody, CardHeader } from "@wordpress/components";

const AppointmentTicket = ({ appointmentData }) => {
  if (!appointmentData) {
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeSlot) => {
    // Assuming timeSlot is in format "HH:MM" or "HH:MM-HH:MM"
    if (timeSlot.includes("-")) {
      return timeSlot;
    }
    // If it's just start time, format it nicely
    const [hours, minutes] = timeSlot.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="appointment-ticket">
      <Card className="ticket-card">
        <CardHeader className="ticket-header">
          <div className="ticket-title">
            <h3>{__("Appointment Confirmation", "appointment-booking")}</h3>
            <div className="ticket-status success">
              {__("Confirmed", "appointment-booking")}
            </div>
          </div>
        </CardHeader>
        <CardBody className="ticket-body">
          <div className="ticket-content">
            <div className="ticket-section">
              <div className="ticket-field">
                <label>{__("Client Name", "appointment-booking")}</label>
                <span className="ticket-value">
                  {appointmentData.client_name}
                </span>
              </div>

              <div className="ticket-field">
                <label>{__("Phone Number", "appointment-booking")}</label>
                <span className="ticket-value">
                  {appointmentData.client_phone}
                </span>
              </div>
            </div>

            <div className="ticket-section">
              <div className="ticket-field">
                <label>{__("Date", "appointment-booking")}</label>
                <span className="ticket-value date-value">
                  {formatDate(appointmentData.appointment_date)}
                </span>
              </div>

              <div className="ticket-field">
                <label>{__("Time", "appointment-booking")}</label>
                <span className="ticket-value time-value">
                  {formatTime(appointmentData.time_slot)}
                </span>
              </div>
            </div>

            <div className="ticket-footer">
              <div className="ticket-id">
                <span className="ticket-id-label">
                  {__("Booking ID", "appointment-booking")}:
                </span>
                <span className="ticket-id-value">
                  #{appointmentData.id || "TBD"}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export { AppointmentTicket };
