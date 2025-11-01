/**
 * AppointmentRow Component
 *
 * Displays individual appointment item in the appointments list.
 * Shows cancel button (if appointment can be cancelled).
 *
 * @param {Object} appointment - Appointment object containing appointment details
 * @param {Function} onCancelled - Optional callback function called after successful cancellation
 */
import { useState } from "react";
import {
  getStatusColor,
  getStatusText,
  formatTimeRange,
} from "../utils/displayHelpers.js";
import { userAllowedToCancelAppointment } from "../utils/appointmentHelpers.js";
import { useFetch } from "../hooks/useFetch.js";
import { useNotice } from "../hooks/useNotice.js";
import {
  Notice,
  Modal,
  TextareaControl,
  Button,
  Spinner,
} from "../../components/ui";
import { __ } from "../../utils/i18n";

const AppointmentRow = ({ appointment, onCancelled }) => {
  if (!appointment) return null;

  const cancelAllowed = userAllowedToCancelAppointment(appointment);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const { message, status, isVisible, showSuccess, showError, clearMessage } =
    useNotice();

  // Use useFetch with immediate=false to manually trigger the request
  const { execute } = useFetch(
    `/nobat/v2/appointments/${appointment.id}/cancel`,
    {
      method: "POST",
    },
    { immediate: false }
  );

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleCloseModal = () => {
    if (!isCancelling) {
      setShowCancelModal(false);
      setCancellationReason("");
    }
  };

  const handleSubmitCancellation = async () => {
    setIsCancelling(true);

    try {
      const response = await execute({
        body: {
          reason: cancellationReason.trim() || "",
        },
      });

      if (response?.success) {
        showSuccess(
          response.message ||
            __(
              "Cancellation request submitted. An admin will review your request.",
              "nobat"
            )
        );

        // Close modal and reset form
        setShowCancelModal(false);
        setCancellationReason("");

        // Call the callback to refresh the appointments list
        if (onCancelled) {
          onCancelled();
        }
      }
    } catch (error) {
      const errorMessage =
        error.message ||
        error.data?.message ||
        __("Failed to request cancellation.", "nobat");
      showError(errorMessage);
    } finally {
      setIsCancelling(false);
    }
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

      {cancelAllowed && (
        <div className="appointment-actions">
          <button
            className="btn-cancel"
            onClick={handleCancelClick}
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

      {/* Cancellation Modal */}
      <Modal
        title={__("Request Cancellation", "nobat")}
        isOpen={showCancelModal}
        onRequestClose={handleCloseModal}
      >
        <p>
          {__(
            "Are you sure you want to request cancellation for this appointment?",
            "nobat"
          )}
        </p>

        <div
          className="cancellation-appointment-info"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
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
          onChange={setCancellationReason}
          placeholder={__("Please provide a reason for cancellation", "nobat")}
          rows={4}
          disabled={isCancelling}
        />

        <div
          className="modal-actions"
          style={{
            marginTop: "16px",
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            disabled={isCancelling}
          >
            {__("Cancel", "nobat")}
          </Button>
          <Button
            variant="primary"
            isDestructive
            onClick={handleSubmitCancellation}
            disabled={isCancelling}
            isBusy={isCancelling}
          >
            {isCancelling ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Spinner />
                {__("Submitting...", "nobat")}
              </span>
            ) : (
              __("Submit Request", "nobat")
            )}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentRow;
