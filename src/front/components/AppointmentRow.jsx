import {
  getStatusColor,
  getStatusText,
  formatTimeRange,
} from "../utils/displayHelpers.js";
import { canCancelAppointment } from "../utils/appointmentHelpers.js";
import { __ } from "../../utils/i18n";

const AppointmentRow = ({ appointment }) => {
  if (!appointment) return null;

  const canCancel = canCancelAppointment(appointment);

  const handleCancel = () => {
    // TODO: Refresh appointments list when connected to real API
    console.log("Appointment cancelled - refresh needed");
  };
  return (
    <div className="appointment-item">
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

      {appointment.note && (
        <div className="appointment-note">
          <strong>{__("Note:", "nobat")}</strong> {appointment.note}
        </div>
      )}

      {appointment.cancellation_reason && (
        <div className="cancellation-reason">
          <strong>{__("Cancellation Reason:", "nobat")}</strong>{" "}
          {appointment.cancellation_reason}
        </div>
      )}

      {canCancel && (
        <div className="appointment-actions">
          <button className="btn-cancel" onClick={handleCancel}>
            {__("Cancel Appointment", "nobat")}
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentRow;
