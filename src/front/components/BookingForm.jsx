/**
 * BookingForm Component
 *
 * Form component for booking new appointments.
 */
import { useState, useEffect } from "react";
import { Button, TextareaControl, Notice } from "../../components/ui";
import TimeSlotSelector from "./TimeSlotSelector";
import { __ } from "../../utils/i18n";
import { useFormSubmit } from "../hooks/useFormSubmit";
import { useNotice } from "../hooks/useNotice";

const BookingForm = ({ schedule }) => {
  const [notes, setNotes] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const { submitForm, loading, error, response } = useFormSubmit();
  const { showError, showSuccess, isVisible, message, status, clearMessage } =
    useNotice();
  const isFormValid = selectedDay && selectedSlot;

  // Handle error messages from form submission
  useEffect(() => {
    if (error) {
      const errorMessage =
        error.message ||
        __("An error occurred while booking the appointment.", "nobat");
      showError(errorMessage);
    }
  }, [error, showError]);

  // Handle success messages from form submission
  useEffect(() => {
    if (response?.success) {
      showSuccess(__("Appointment booked successfully!", "nobat"));
    }
  }, [response, showSuccess]);

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

      const result = await submitForm("/nobat/v2/appointments", requestBody);

      if (result.success) {
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
