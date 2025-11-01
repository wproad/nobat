import { useState } from "react";
import { useFetch } from "./useFetch.js";
import { useNotice } from "./useNotice.js";
import { __ } from "../../utils/i18n.js";

/**
 * useAppointmentCancellation Hook
 *
 * A custom hook that manages the appointment cancellation flow including:
 * - Modal state management
 * - Cancellation reason input
 * - API request handling
 * - Success/error notifications
 *
 * @param {number|string} appointmentId - The ID of the appointment to cancel
 * @param {Function} onSuccess - Optional callback function called after successful cancellation
 * @returns {Object} Object containing cancellation state and control functions
 */
export function useAppointmentCancellation(appointmentId, onSuccess) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");

  // Use useFetch with immediate=false to manually trigger the request
  const { execute } = useFetch(
    `/nobat/v2/appointments/${appointmentId}/cancel`,
    {
      method: "POST",
    },
    { immediate: false }
  );

  const { message, status, isVisible, showSuccess, showError, clearMessage } =
    useNotice();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    if (!isCancelling) {
      setShowModal(false);
      setCancellationReason("");
    }
  };

  const submitCancellation = async () => {
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
        setShowModal(false);
        setCancellationReason("");

        // Call the callback to refresh the appointments list
        if (onSuccess) {
          onSuccess();
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

  return {
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
  };
}
