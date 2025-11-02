/**
 * CancellationModal Component
 *
 * A reusable modal component for requesting appointment cancellation.
 * Displays appointment details (date/time) in formatted view, collects optional
 * cancellation reason via textarea, and provides confirmation actions.
 * Handles loading state with spinner and disabled inputs during submission.
 *
 * @param {Object} appointment - Appointment object containing appointment details
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when modal should be closed
 * @param {Function} onConfirm - Function to call when cancellation is confirmed
 * @param {boolean} isCancelling - Whether cancellation is in progress
 * @param {string} cancellationReason - Current value of cancellation reason input
 * @param {Function} onReasonChange - Function to call when reason input changes
 */
import { Modal, TextareaControl, Button, Spinner } from "../../ui/index.js";
import { formatTimeRange } from "../utils/displayHelpers.js";
import { __ } from "../../utils/i18n.js";

export function CancellationModal({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  isCancelling,
  cancellationReason,
  onReasonChange,
}) {
  if (!appointment) return null;
  // TODO: sjhow taost on successful cancellation

  return (
    <Modal
      title={__("Request Cancellation", "nobat")}
      isOpen={isOpen}
      onRequestClose={onClose}
      className="cancellation-modal"
    >
      <p>
        {__(
          "Are you sure you want to request cancellation for this appointment?",
          "nobat"
        )}
      </p>

      <div className="cancellation-appointment-info">
        <p>
          <strong>{__("Date:", "nobat")}</strong>{" "}
          {appointment.slot_date_jalali || appointment.slot_date}
        </p>
        <p>
          <strong>{__("Time:", "nobat")}</strong>{" "}
          {formatTimeRange(appointment.start_time, appointment.end_time)}
        </p>
      </div>

      <TextareaControl
        label={__("Reason for cancellation (optional)", "nobat")}
        value={cancellationReason}
        onChange={onReasonChange}
        placeholder={__("Please provide a reason for cancellation", "nobat")}
        rows={4}
        disabled={isCancelling}
      />

      <div className="modal-actions">
        <Button variant="secondary" onClick={onClose} disabled={isCancelling}>
          {__("Cancel", "nobat")}
        </Button>
        <Button
          variant="primary"
          // isDestructive
          onClick={onConfirm}
          disabled={isCancelling}
          isBusy={isCancelling}
        >
          {isCancelling ? (
            <>
              <Spinner />
              {__("Submitting...", "nobat")}
            </>
          ) : (
            __("Submit Request", "nobat")
          )}
        </Button>
      </div>
    </Modal>
  );
}
