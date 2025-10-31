/**
 * BookingForm Component
 *
 * Form component for booking new appointments.
 */
import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  TextareaControl,
} from "../../components/ui";
import TimeSlotSelector from "./TimeSlotSelector";
import { __ } from "../../utils/i18n";
import { useFetch } from "../hooks/useFetch";

const BookingForm = ({ schedule }) => {
  const [notes, setNotes] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitBody, setSubmitBody] = useState(null);

  // Use useFetch with conditional URL to prevent auto-execution on mount
  // Only execute when submitBody is set
  const { data, loading, error } = useFetch(
    submitBody ? "/nobat/v2/appointments" : null,
    submitBody
      ? {
          method: "POST",
          body: submitBody,
        }
      : {}
  );

  // Handle successful booking
  useEffect(() => {
    if (data && data.success && data.appointment) {
      // Reset form
      setNotes("");
      setSelectedDay(null);
      setSelectedSlot(null);
      setSubmitBody(null); // Reset submit body
    }
  }, [data]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null); // Reset slot when day changes
    setSubmitBody(null); // Clear any pending submission
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setSubmitBody(null); // Clear any pending submission
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot) {
      return;
    }

    // Build request body
    const body = {
      slot_id: parseInt(selectedSlot.id),
      schedule_id: parseInt(selectedSlot.schedule_id || schedule.id),
    };

    // Only include note if it has a value
    if (notes && notes.trim() !== "") {
      body.note = notes.trim();
    }

    // Trigger the POST request by setting submitBody
    // This will cause useFetch to execute with the body
    setSubmitBody(body);
  };

  const isFormValid = selectedDay && selectedSlot && !loading;

  return (
    <div className="appointment-booking-form">
      <Card>
        <CardHeader>
          <h3>{__("Book an Appointment", "nobat")}</h3>
        </CardHeader>
        <CardBody>
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
              <Button type="submit" variant="primary" disabled={!isFormValid}>
                {loading
                  ? __("Booking...", "nobat")
                  : __("Book Appointment", "nobat")}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default BookingForm;
