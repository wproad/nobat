import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  TextareaControl,
} from "../../components/ui";
import TimeSlotSelector from "./TimeSlotSelector";
import { schedule } from "../utils/data";

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
          <h3>Book an Appointment</h3>
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
                label="Additional Notes"
                value={notes}
                onChange={(value) => setNotes(value)}
                placeholder="Any special requests or additional information"
                rows={3}
                help="Optional: Add any specific requirements or questions"
              />
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary" disabled={!isFormValid}>
                Book Appointment
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
export default BookingForm;
