import { __ } from "@wordpress/i18n";
import { Card, CardBody, CardHeader } from "@wordpress/components";
import { displayDate } from "../../../lib/helpers";

const AppointmentTicket = ({ appointmentData }) => {
  if (!appointmentData) {
    return null;
  }

  console.log(appointmentData)

  return (
    <div className="appointment-ticket">
      <Card className="ticket-card">
        <CardHeader className="ticket-header">
          <div className="ticket-title">
            <h3>
              {__(
                "Your appointment request was sent successfully",
                "appointment-booking"
              )}
            </h3>
            <p>
              {__(
                "You'll get an sms after admin's confirmation",
                "appointment-booking"
              )}
            </p>
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
                  {appointmentData.appointment_date_jalali}
                </span>
              </div>

              <div className="ticket-field">
                <label>{__("Time", "appointment-booking")}</label>
                <span className="ticket-value time-value">
                  {appointmentData.time_slot}
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
