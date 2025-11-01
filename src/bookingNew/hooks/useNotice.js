import { useState, useCallback } from "react";

/**
 * useNotice Hook
 *
 * A reusable hook for managing notice/message state to be used with the Notice component.
 * Provides functions to show success, error, warning, and info messages with automatic
 * visibility management and cleanup animations.
 * Messages persist until manually dismissed or cleared.
 *
 * @returns {Object} Object containing notice state and control functions:
 * { message, status, isVisible, showMessage, showSuccess, showError, showWarning, showInfo, clearMessage, reset }
 */
export function useNotice() {
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState("info");
  const [isVisible, setIsVisible] = useState(false);

  const showMessage = useCallback((msg, noticeStatus = "info") => {
    setMessage(msg);
    setStatus(noticeStatus);
    setIsVisible(true);
  }, []);

  const showSuccess = useCallback(
    (msg) => {
      showMessage(msg, "success");
    },
    [showMessage]
  );

  const showError = useCallback(
    (msg) => {
      showMessage(msg, "error");
    },
    [showMessage]
  );

  const showWarning = useCallback(
    (msg) => {
      showMessage(msg, "warning");
    },
    [showMessage]
  );

  const showInfo = useCallback(
    (msg) => {
      showMessage(msg, "info");
    },
    [showMessage]
  );

  const clearMessage = useCallback(() => {
    setIsVisible(false);
    // Clear message after animation if needed
    setTimeout(() => {
      setMessage(null);
      setStatus("info");
    }, 300);
  }, []);

  const reset = useCallback(() => {
    setMessage(null);
    setStatus("info");
    setIsVisible(false);
  }, []);

  return {
    message,
    status,
    isVisible,
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearMessage,
    reset,
  };
}
