/**
 * BookingForm Component
 *
 * Form component for booking new appointments.
 */
import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  TextareaControl,
} from "../../components/ui";
import TimeSlotSelector from "./TimeSlotSelector";
import { schedule } from "../utils/data";
import { __ } from "../../utils/i18n";

const BookingForm = () => {
  const [notes, setNotes] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setSelectedSlot(null); // Reset slot when day changes
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Booking data:", {
      notes,
      selectedDay,
      selectedSlot,
    });
  };

  const isFormValid = selectedDay && selectedSlot;

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
                days={schedule.days}
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
                {__("Book Appointment", "nobat")}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
export default BookingForm;
