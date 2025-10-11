import { __ } from "@wordpress/i18n";

const TimeBlock = ({ appointment }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f0ad4e"; // Orange
      case "confirmed":
        return "#5cb85c"; // Green
      case "completed":
        return "#337ab7"; // Blue
      case "cancelled":
        return "#d9534f"; // Red
      default:
        return "#777"; // Gray
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case "pending":
        return "#d58512";
      case "confirmed":
        return "#449d44";
      case "completed":
        return "#286090";
      case "cancelled":
        return "#b52b27";
      default:
        return "#333333";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return __("Pending", "appointment-booking");
      case "confirmed":
        return __("Confirmed", "appointment-booking");
      case "completed":
        return __("Completed", "appointment-booking");
      case "cancelled":
        return __("Cancelled", "appointment-booking");
      default:
        return status;
    }
  };

  return (
    <div
      className="time-block"
      style={{
        backgroundColor: getStatusColor(appointment.status),
        borderLeftColor: getStatusBorderColor(appointment.status),
      }}
    >
      <div className="time-block-content">
        <div className="client-name">{appointment.client_name}</div>
        <div className="client-phone">{appointment.client_phone}</div>
        <div className="time-slot">{appointment.time_slot}</div>
        <div className="status-badge">{getStatusLabel(appointment.status)}</div>
      </div>
    </div>
  );
};

export { TimeBlock };
