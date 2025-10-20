import { useState, useCallback, useMemo } from "@wordpress/element";

/**
 * Custom hook for managing booking form state and validation
 * @returns {Object} - Form state and handlers
 */
export const useBookingForm = () => {
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    appointment_date: "",
    time_slot: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [bookedAppointment, setBookedAppointment] = useState(null);

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
    // Basic validation
    if (
      !formData.client_name ||
      !formData.client_phone ||
      !formData.appointment_date ||
      !formData.time_slot
    ) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return false;
    }

    // Phone number validation (Iranian format: 09xxxxxxxxx)
    // const phoneRegex = /^09\d{9}$/;
    // if (!phoneRegex.test(formData.client_phone.replace(/\s/g, ""))) {
    //   setMessage("Please enter a valid phone number");
    //   setMessageType("error");
    //   return false;
    // }

    return true;
  }, [formData]);

  const submitBooking = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "/wp-json/appointment-booking/v1/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book appointment");
      }

      const data = await response.json();
      // console.log("API response data:", data);

      // Store the booked appointment data for the ticket
      const appointmentData = {
        ...formData,
        appointment_date_jalali: formData.appointment_date, // The form date is already in Jalali format
        id: data.id || Date.now(),
      };
      // console.log("Setting booked appointment:", appointmentData);
      setBookedAppointment(appointmentData);

      // Reset form
      setFormData({
        client_name: "",
        client_phone: "",
        appointment_date: "",
        time_slot: "",
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
      client_name: "",
      client_phone: "",
      appointment_date: "",
      time_slot: "",
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
      formData.client_name &&
      formData.client_phone &&
      formData.appointment_date &&
      formData.time_slot
    );
  }, [
    formData.client_name,
    formData.client_phone,
    formData.appointment_date,
    formData.time_slot,
  ]);

  return {
    formData,
    loading,
    message,
    messageType,
    bookedAppointment,
    handleInputChange,
    submitBooking,
    clearMessage,
    resetForm,
    getMinDate,
    isFormValid,
  };
};
