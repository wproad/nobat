/**
 * AppointmentRow Component
 *
 * Soft Slot appointment card with optional note/cancel wells and cancel action.
 *
 * @param {Object} appointment - Appointment object containing appointment details
 * @param {Function} onCancelled - Optional callback after successful cancellation
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
    <article className="bf-card">
      <AppointmentInfo appointment={appointment} />

      {appointment.note && (
        <div className="bf-well">
          {__("Note:", "nobat")} {appointment.note}
        </div>
      )}

      {appointment.cancellation_reason && (
        <div className="bf-well bf-well--cancel">
          {__("Cancellation Reason:", "nobat")}{" "}
          {appointment.cancellation_reason}
        </div>
      )}

      {cancelAllowed && (
        <div className="bf-card__actions">
          <button
            type="button"
            className="bf-link-cancel"
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
    </article>
  );
};

export default AppointmentRow;
