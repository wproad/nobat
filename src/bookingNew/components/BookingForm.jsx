/**
 * BookingForm Component
 *
 * Form component for booking new appointments.
 * Handles day and time slot selection, optional notes, form submission,
 * and success/error notifications. Displays booking confirmation ticket
 * after successful booking.
 *
 * @param {Object} schedule - Schedule object containing timeslots data
 */
import { useState, useEffect } from "react";
import { Button, TextareaControl, Notice } from "../../ui";
import TimeSlotSelector from "./TimeSlotSelector";
import AppointmentTicket from "./AppointmentTicket";
import { __ } from "../../utils/i18n";
import { useFetch } from "../hooks/useFetch";
import { useNotice } from "../hooks/useNotice";

const BookingForm = ({ schedule }) => {
  const [notes, setNotes] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookedAppointment, setBookedAppointment] = useState(null);

  const { execute, loading, error, data } = useFetch(
    "/nobat/v2/appointments",
    { method: "POST" },
    { immediate: false }
  );
  const { showError, showSuccess, isVisible, message, status, clearMessage } =
    useNotice();
  const isFormValid = selectedDay && selectedSlot;

  // Handle error messages from form submission
  useEffect(() => {
    if (error) {
      const errorMessage =
        (error instanceof Error ? error.message : error) ||
        __("An error occurred while booking the appointment.", "nobat");
      console.log("booking form error: ", errorMessage);
      showError(errorMessage);
    }
  }, [error, showError]);

  // Handle success messages from form submission
  useEffect(() => {
    if (data?.success) {
      showSuccess(__("Appointment booked successfully!", "nobat"));
    }
  }, [data, showSuccess]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null); // Reset slot when day changes
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot || !schedule) {
      return;
    }

    try {
      // Build request body with required fields
      const requestBody = {
        slot_id: parseInt(selectedSlot.id),
        schedule_id: parseInt(schedule.id),
        note: notes.trim(),
      };

      // Use execute function from useFetch to trigger the POST request
      const result = await execute({ body: requestBody });

      if (result?.success && result?.appointment) {
        // Store appointment data to show ticket
        setBookedAppointment(result.appointment);
        // Reset form
        setNotes("");
        setSelectedDay(null);
        setSelectedSlot(null);
        // Success message will be handled by useEffect
      }
    } catch (err) {
      // Error message will be handled by useEffect
      console.error("Failed to book appointment:", err);
    }
  };

  // Show ticket if appointment was booked successfully
  if (bookedAppointment) {
    return (
      <div className="appointment-booking-form">
        <AppointmentTicket appointment={bookedAppointment} />
      </div>
    );
  }

  return (
    <div className="appointment-booking-form">
      {isVisible && message && (
        <Notice
          status={status}
          isDismissible={true}
          onRemove={clearMessage}
          className="booking-form__notice"
        >
          {message}
        </Notice>
      )}
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <TimeSlotSelector
            days={schedule.timeslots}
            selectedDay={selectedDay}
            selectedSlot={selectedSlot}
            onDaySelect={handleDaySelect}
            onSlotSelect={handleSlotSelect}
          />
        </div>

        <div className="form-row">
          <TextareaControl
            label={__("Additional Notes", "nobat")}
            value={notes}
            onChange={(value) => setNotes(value)}
            placeholder={__(
              "Any special requests or additional information",
              "nobat"
            )}
            rows={3}
            help={__(
              "Optional: Add any specific requirements or questions",
              "nobat"
            )}
          />
        </div>

        <div className="form-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || loading}
          >
            {loading
              ? __("Booking...", "nobat")
              : __("Book Appointment", "nobat")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
