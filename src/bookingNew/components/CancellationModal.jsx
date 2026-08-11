/**
 * CancellationModal Component
 *
 * Soft Slot-styled cancel confirm: appointment meta, optional reason, danger + ghost actions.
 *
 * @param {Object} appointment - Appointment object containing appointment details
 * @param {boolean} isOpen - Whether the modal is open
 * @param {Function} onClose - Function to call when modal should be closed
 * @param {Function} onConfirm - Function to call when cancellation is confirmed
 * @param {boolean} isCancelling - Whether cancellation is in progress
 * @param {string} cancellationReason - Current value of cancellation reason input
 * @param {Function} onReasonChange - Function to call when reason input changes
 */
import { Modal, Spinner } from "../../ui/index.js";
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

  return (
    <Modal
      title={__("Request Cancellation", "nobat")}
      isOpen={isOpen}
      onRequestClose={onClose}
      className="cancellation-modal bf-root"
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

      <div className="bf-field">
        <label className="bf-field__label" htmlFor="nobat-cancel-reason">
          {__("Reason for cancellation (optional)", "nobat")}
        </label>
        <textarea
          id="nobat-cancel-reason"
          className="bf-textarea"
          value={cancellationReason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder={__("Please provide a reason for cancellation", "nobat")}
          rows={4}
          disabled={isCancelling}
        />
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="bf-btn bf-btn--ghost"
          onClick={onClose}
          disabled={isCancelling}
        >
          {__("Cancel", "nobat")}
        </button>
        <button
          type="button"
          className="bf-btn bf-btn--danger"
          onClick={onConfirm}
          disabled={isCancelling}
        >
          {isCancelling ? (
            <>
              <Spinner />
              {__("Submitting...", "nobat")}
            </>
          ) : (
            __("Submit Request", "nobat")
          )}
        </button>
      </div>
    </Modal>
  );
}
