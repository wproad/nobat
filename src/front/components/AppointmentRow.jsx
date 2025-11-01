/**
 * AppointmentRow Component
 *
 * Displays individual appointment item in the appointments list.
 * Shows cancel button (if appointment can be cancelled).
 *
 * @param {Object} appointment - Appointment object containing appointment details
 * @param {Function} onCancelled - Optional callback function called after successful cancellation
 */
import { AppointmentInfo } from "./AppointmentInfo.jsx";
import { CancellationModal } from "./CancellationModal.jsx";
import { useAppointmentCancellation } from "../hooks/useAppointmentCancellation.js";
import { userAllowedToCancelAppointment } from "../utils/appointmentHelpers.js";
import { Notice } from "../../components/ui";
import { __ } from "../../utils/i18n";

const AppointmentRow = ({ appointment, onCancelled }) => {
  if (!appointment) return null;

  const cancelAllowed = userAllowedToCancelAppointment(appointment);

  const {
    isCancelling,
    showModal,
    cancellationReason,
    setCancellationReason,
    message,
    status,
    isVisible,
    clearMessage,
    openModal,
    closeModal,
    submitCancellation,
  } = useAppointmentCancellation(appointment.id, onCancelled);

  return (
    <div className="appointment-item">
      <AppointmentInfo appointment={appointment} />

      {cancelAllowed && (
        <div className="appointment-actions">
          <button
            className="btn-cancel"
            onClick={openModal}
            disabled={isCancelling}
          >
            {__("Cancel Appointment", "nobat")}
          </button>
        </div>
      )}

      {isVisible && (
        <Notice status={status} onRemove={clearMessage} isDismissible>
          {message}
        </Notice>
      )}

      <CancellationModal
        appointment={appointment}
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={submitCancellation}
        isCancelling={isCancelling}
        cancellationReason={cancellationReason}
        onReasonChange={setCancellationReason}
      />
    </div>
  );
};

export default AppointmentRow;
