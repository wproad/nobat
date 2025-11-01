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
import { Notice } from "../../ui/index.js";
import { __ } from "../../utils/i18n.js";

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
      <div className="appointment-item-header">
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
