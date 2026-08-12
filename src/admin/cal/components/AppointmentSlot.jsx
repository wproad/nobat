import { __ } from "../../../utils/i18n";
import { useState } from "react";
import { AppointmentDetailModal } from "./AppointmentDetailModal";
import { getStatusClass } from "../../../lib/appointmentUtils";

const AppointmentSlot = ({ appointment, onStatusUpdate, onDelete }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleTimeBlockClick = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <div
        className={`time-block clickable ${getStatusClass(appointment.status)}`}
        onClick={handleTimeBlockClick}
      >
        <div className="time-block-content">
          <div className="client-name">{appointment.user_name}</div>
          <div className="client-phone">{appointment.user_phone}</div>
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

export { AppointmentSlot };
