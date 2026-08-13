/**
 * BookingForm Component
 *
 * Form component for booking new appointments.
 * Soft Slot layout: date strip → slots → notes → primary CTA; success uses AppointmentTicket.
 *
 * @param {Object} schedule - Schedule object containing timeslots data
 */
import { useState, useEffect, useMemo } from "react";
import { Notice } from "../../ui";
import TimeSlotSelector from "./TimeSlotSelector";
import AppointmentTicket from "./AppointmentTicket";
import { __ } from "../../utils/i18n";
import { useFetch } from "../hooks/useFetch";
import { useNotice } from "../hooks/useNotice";
import { getBookableDays } from "../utils/slotHelpers";

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
  const bookableDays = useMemo(
    () => getBookableDays(schedule?.timeslots),
    [schedule?.timeslots]
  );
  const isFormValid = selectedDay && selectedSlot;

  useEffect(() => {
    if (error) {
      const errorMessage =
        (error instanceof Error ? error.message : error) ||
        __("An error occurred while booking the appointment.", "nobat");
      showError(errorMessage);
    }
  }, [error, showError]);

  useEffect(() => {
    if (data?.success) {
      showSuccess(__("Appointment booked successfully!", "nobat"));
    }
  }, [data, showSuccess]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null);
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
      const requestBody = {
        slot_id: parseInt(selectedSlot.id),
        schedule_id: parseInt(schedule.id),
        note: notes.trim(),
      };

      const result = await execute({ body: requestBody });

      if (result?.success && result?.appointment) {
        setBookedAppointment(result.appointment);
        setNotes("");
        setSelectedDay(null);
        setSelectedSlot(null);
      }
    } catch {
      // Error is surfaced via useFetch + useNotice.
    }
  };

  if (bookedAppointment) {
    return <AppointmentTicket appointment={bookedAppointment} />;
  }

  return (
    <div>
      {isVisible && message && (
        <Notice
          status={status}
          isDismissible={true}
          onRemove={clearMessage}
          className="bf-notice"
        >
          {message}
        </Notice>
      )}
      <form onSubmit={handleSubmit}>
        <TimeSlotSelector
          days={bookableDays}
          selectedDay={selectedDay}
          selectedSlot={selectedSlot}
          onDaySelect={handleDaySelect}
          onSlotSelect={handleSlotSelect}
        />

        <div className="bf-field">
          <label className="bf-field__label" htmlFor="nobat-booking-notes">
            {__("Additional Notes", "nobat")}
          </label>
          <textarea
            id="nobat-booking-notes"
            className="bf-textarea"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={__(
              "Any special requests or additional information",
              "nobat"
            )}
            rows={4}
          />
          <p className="bf-field__help">
            {__(
              "Optional: Add any specific requirements or questions",
              "nobat"
            )}
          </p>
        </div>

        <hr className="bf-divider" />

        <div className="bf-actions">
          <button
            type="submit"
            className="bf-btn bf-btn--primary"
            disabled={!isFormValid || loading}
          >
            {loading
              ? __("Booking...", "nobat")
              : __("Book Appointment", "nobat")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
