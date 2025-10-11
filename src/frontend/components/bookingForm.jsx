import { __ } from "@wordpress/i18n";
import {
  Button,
  TextControl,
  Notice,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@wordpress/components";
import { TimeSlotSelector } from "./timeSlotSelector";
import { AppointmentTicket } from "./AppointmentTicket";
import { WeekDaysSelector } from "./WeekDaysSelector";
import { useAvailableSlots, useBookingForm } from "../../hooks";

const BookingForm = () => {
  // Use custom hooks for state management
  const {
    formData,
    loading,
    message,
    messageType,
    bookedAppointment,
    handleInputChange,
    submitBooking,
    clearMessage,
    getMinDate,
    isFormValid,
  } = useBookingForm();

  const {
    availableSlots,
    loading: loadingSlots,
    error: slotsError,
  } = useAvailableSlots(formData.appointment_date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitBooking();
  };

  return (
    <div className="appointment-booking-form">
      <Card>
        <CardHeader>
          <h3>{__("Book an Appointment", "appointment-booking")}</h3>
        </CardHeader>
        <CardBody>
          {message && (
            <Notice status={messageType} isDismissible onRemove={clearMessage}>
              {message}
            </Notice>
          )}

          {slotsError && (
            <Notice
              status="error"
              isDismissible
              onRemove={() => {}} // Let the hook handle error clearing
            >
              {slotsError}
            </Notice>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-row">
              <TextControl
                label={__("Your Name", "appointment-booking")}
                value={formData.client_name}
                onChange={(value) => handleInputChange("client_name", value)}
                required
                placeholder={__("Enter your full name", "appointment-booking")}
              />
            </div>

            <div className="form-row">
              <TextControl
                label={__("Phone Number", "appointment-booking")}
                value={formData.client_phone}
                onChange={(value) => handleInputChange("client_phone", value)}
                required
                placeholder="09xxxxxxxxx"
                type="tel"
                name="tel"
                id="appointment-booking-phone"
                autoComplete="tel"
                inputMode="tel"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            <div className="form-row">
              <label className="date-selector-label">
                {__("Select a Date", "appointment-booking")}
              </label>
              <WeekDaysSelector
                selectedDate={formData.appointment_date}
                onDateSelect={(date) =>
                  handleInputChange("appointment_date", date)
                }
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <label className="time-slot-label">
                {__("Available Time Slots", "appointment-booking")}
              </label>
              {loadingSlots ? (
                <div className="loading-slots">
                  <Spinner />
                  <span>
                    {__("Loading available slots...", "appointment-booking")}
                  </span>
                </div>
              ) : (
                <TimeSlotSelector
                  slots={availableSlots}
                  selectedSlot={formData.time_slot}
                  onSlotSelect={(slot) => handleInputChange("time_slot", slot)}
                  disabled={!formData.appointment_date}
                />
              )}
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !isFormValid}
                __next40pxDefaultSize
              >
                {loading ? (
                  <>
                    <Spinner />
                    {__("Booking...", "appointment-booking")}
                  </>
                ) : (
                  __("Book Appointment", "appointment-booking")
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <AppointmentTicket appointmentData={bookedAppointment} />
    </div>
  );
};

export { BookingForm };
