import { useState, useCallback, useMemo } from "@wordpress/element";

/**
 * Custom hook for managing booking form state and validation (v2 API)
 * @returns {Object} - Form state and handlers
 */
export const useBookingForm = () => {
  const [formData, setFormData] = useState({
    slot_id: "",
    schedule_id: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [bookedAppointment, setBookedAppointment] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    window.nobatBooking && window.nobatBooking.isLoggedIn ? true : false
  );

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      if (bookedAppointment) {
        setBookedAppointment(null);
      }
    },
    [bookedAppointment]
  );

  const validateForm = useCallback(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      setMessage("You must be logged in to book appointments");
      setMessageType("error");
      return false;
    }

    // Basic validation
    if (!formData.slot_id || !formData.schedule_id) {
      setMessage("Please select a time slot");
      setMessageType("error");
      return false;
    }

    return true;
  }, [formData, isLoggedIn]);

  const submitBooking = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      setLoading(true);
      // Build request body
      const requestBody = {
        slot_id: parseInt(formData.slot_id),
        schedule_id: parseInt(formData.schedule_id),
      };

      // Only include note if it has a value (empty string causes validation error)
      if (formData.note && formData.note.trim() !== '') {
        requestBody.note = formData.note.trim();
      }

      const response = await fetch(
        "/wp-json/nobat/v2/appointments",
        {
          method: "POST",
          credentials: "include", // Important for authentication
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": window.nobatBooking?.nonce || "", // WordPress authentication
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error codes
        if (data.code === "not_logged_in") {
          setMessage("You must be logged in to book appointments. Redirecting to login...");
          setMessageType("error");
          setTimeout(() => {
            window.location.href = "/wp-login.php?redirect_to=" + encodeURIComponent(window.location.href);
          }, 2000);
          return false;
        } else if (data.code === "max_appointments_reached") {
          setMessage(data.message || "You have reached the maximum of 3 active appointments");
          setMessageType("error");
          return false;
        }
        throw new Error(data.message || "Failed to book appointment");
      }

      // Success!
      setBookedAppointment(data.appointment);
      setMessage(data.message || "Appointment booked successfully!");
      setMessageType("success");

      // Reset form
      setFormData({
        slot_id: "",
        schedule_id: "",
        note: "",
      });

      return true;
    } catch (err) {
      console.error("Booking error:", err);
      setMessage(
        err.message || "Failed to book appointment. Please try again."
      );
      setMessageType("error");
      return false;
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm]);

  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      slot_id: "",
      schedule_id: "",
      note: "",
    });
    setBookedAppointment(null);
    setMessage(null);
  }, []);

  const getMinDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  // Reactive form validation that updates when formData changes
  const isFormValid = useMemo(() => {
    return !!(
      isLoggedIn &&
      formData.slot_id &&
      formData.schedule_id
    );
  }, [
    isLoggedIn,
    formData.slot_id,
    formData.schedule_id,
  ]);

  return {
    formData,
    loading,
    message,
    messageType,
    bookedAppointment,
    isLoggedIn,
    handleInputChange,
    submitBooking,
    clearMessage,
    resetForm,
    getMinDate,
    isFormValid,
  };
};
