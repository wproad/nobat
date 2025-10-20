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
import { useBookingForm } from "../hooks";
import TimeSlotSelector from "./TimeSlotSelector";
import { useAvailableSchedule } from "../hooks";
import { AppointmentTicket } from "./AppointmentTicket";

const BookingForm = () => {
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
    schedule,
    loading: loadingSchedule,
    error: scheduleError,
    refetch,
  } = useAvailableSchedule();

  const handleSlotSelection = (selectionData) => {
    if (selectionData) {
      handleInputChange("appointment_date", selectionData.date);
      handleInputChange("time_slot", selectionData.timeSlot);
    } else {
      handleInputChange("appointment_date", "");
      handleInputChange("time_slot", "");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitBooking();
  };

  // If appointment is booked successfully, show only the ticket
  if (bookedAppointment) {
    return (
      <div className="appointment-booking-form">
        <AppointmentTicket appointmentData={bookedAppointment} />
      </div>
    );
  }

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

            {loadingSchedule ? (
              <div className="loading-slots">
                <Spinner />
                <span>{__("Loading schedule...", "appointment-booking")}</span>
              </div>
            ) : scheduleError ? (
              <div className="form-row">
                <Notice status="error" isDismissible={false}>
                  {scheduleError}
                </Notice>
                <div className="form-actions">
                  <Button
                    onClick={refetch}
                    variant="secondary"
                    __next40pxDefaultSize
                  >
                    {__("Retry", "appointment-booking")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="form-row">
                <span className="date-selector-label">
                  {__("Select a Date", "appointment-booking")}
                </span>
                <TimeSlotSelector
                  schedule={schedule}
                  onSlotSelect={handleSlotSelection}
                />
              </div>
            )}

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={
                  loading || loadingSchedule || !!scheduleError || !isFormValid
                }
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
    </div>
  );
};

export { BookingForm };
