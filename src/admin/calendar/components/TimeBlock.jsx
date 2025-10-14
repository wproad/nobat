import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { AppointmentDetailModal } from "./AppointmentDetailModal";
import {
  getStatusColor,
  getStatusBorderColor,
} from "../../../lib/appointmentUtils";

const TimeBlock = ({ appointment, onStatusUpdate, onDelete }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleTimeBlockClick = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <div
        className="time-block clickable"
        style={{
          backgroundColor: getStatusColor(appointment.status),
          borderLeftColor: getStatusBorderColor(appointment.status),
          cursor: "pointer",
        }}
        onClick={handleTimeBlockClick}
      >
        <div className="time-block-content">
          <div className="client-name">{appointment.client_name}</div>
          <div className="client-phone">{appointment.client_phone}</div>
        </div>
      </div>
      <AppointmentDetailModal
        appointment={appointment}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onStatusUpdate={onStatusUpdate}
        onDelete={onDelete}
      />
    </>
  );
};

export { TimeBlock };
