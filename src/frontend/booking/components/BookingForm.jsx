import { useCallback } from "react";
import { __ } from "../../../utils/i18n";
import {
  Button,
  TextareaControl,
  Notice,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "../../../components/ui";
import { useBookingForm } from "../hooks";
import TimeSlotSelector from "./TimeSlotSelector";
import { useAvailableSchedule } from "../hooks";
import { AppointmentTicket } from "./AppointmentTicket";

const BookingForm = ({ scheduleId, onSuccess, onBack }) => {
  const {
    formData,
    loading,
    message,
    messageType,
    bookedAppointment,
    isLoggedIn,
    handleInputChange,
    submitBooking,
    clearMessage,
    getMinDate,
    isFormValid,
  } = useBookingForm(scheduleId);

  const {
    schedule,
    loading: loadingSchedule,
    error: scheduleError,
    refetch,
  } = useAvailableSchedule(scheduleId);

  const handleSlotSelection = useCallback(
    (selectionData) => {
      if (selectionData) {
        handleInputChange("slot_id", selectionData.slotId);
        handleInputChange("schedule_id", selectionData.scheduleId);
      } else {
        handleInputChange("slot_id", "");
        handleInputChange("schedule_id", "");
      }
    },
    [handleInputChange]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitBooking();

    // If booking was successful and onSuccess callback is provided, call it
    if (success && onSuccess) {
      // Check if there's a custom success message
      const successMessage = window.nobatBooking?.successMessage || "";

      if (successMessage) {
        // Show custom message, don't redirect
        // The success message will be shown by the form itself
        // Don't call onSuccess to prevent redirect
      } else {
        // No custom message, redirect after showing the default success message
        // setTimeout(() => {
        //   onSuccess();
        // }, 5000);
      }
    }
  };

  // Check if user is logged in
  if (!isLoggedIn) {
    return (
      <div className="appointment-booking-form">
        <Card>
          <CardHeader>
            <h3>{__("Book an Appointment", "nobat")}</h3>
          </CardHeader>
          <CardBody>
            <Notice status="warning" isDismissible={false}>
              <p>
                {__("You must be logged in to book appointments.", "nobat")}
              </p>
            </Notice>
            <div className="form-actions" style={{ marginTop: "16px" }}>
              <Button
                variant="primary"
                href={
                  "/wp-login.php?redirect_to=" +
                  encodeURIComponent(window.location.href)
                }
              >
                {__("Log In", "nobat")}
              </Button>
              <Button
                variant="secondary"
                href="/wp-login.php?action=register"
                style={{ marginLeft: "8px" }}
              >
                {__("Register", "nobat")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // If appointment was successfully booked, show the ticket instead of form
  if (bookedAppointment) {
    return (
      <div className="appointment-booking-form">
        <Card>
          <CardHeader>
            <div className="card-header-content">
              <h3>{__("Appointment Booked!", "nobat")}</h3>
            </div>
          </CardHeader>
          <CardBody>
            <AppointmentTicket appointmentData={bookedAppointment} />

            <div
              className="form-actions"
              style={{
                marginTop: "24px",
                display: "flex",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              {onBack && (
                <Button variant="primary" onClick={onBack}>
                  {__("See My Appointments", "nobat")}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => window.location.reload()}
              >
                {__("Book Another Appointment", "nobat")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="appointment-booking-form">
      <Card>
        <CardHeader>
          <div className="card-header-content">
            <h3>{__("Book an Appointment", "nobat")}</h3>
            <div className="header-actions">
              {onBack && (
                <Button
                  variant="secondary"
                  onClick={onBack}
                  className="back-button"
                  size="compact"
                >
                  ← {__("See My Appointments", "nobat")}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {message && messageType !== "success" && (
            <Notice status={messageType} isDismissible onRemove={clearMessage}>
              {message}
            </Notice>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            {loadingSchedule ? (
              <div className="loading-slots">
                <Spinner />
                <span>{__("Loading available slots...", "nobat")}</span>
              </div>
            ) : scheduleError ? (
              <div className="form-row">
                <Notice status="error" isDismissible={false}>
                  {scheduleError}
                </Notice>
                <div className="form-actions">
                  <Button onClick={refetch} variant="secondary">
                    {__("Retry", "nobat")}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <span className="date-selector-label">
                    {__("Select a Time Slot", "nobat")}
                  </span>
                  <TimeSlotSelector
                    schedule={schedule}
                    onSlotSelect={handleSlotSelection}
                  />
                </div>

                <div className="form-row">
                  <TextareaControl
                    label={__("Note (Optional)", "nobat")}
                    value={formData.note}
                    onChange={(value) => handleInputChange("note", value)}
                    placeholder={__(
                      "Add any additional information or special requests",
                      "nobat"
                    )}
                    rows={3}
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={
                  loading || loadingSchedule || !!scheduleError || !isFormValid
                }
              >
                {loading ? (
                  <>
                    <Spinner />
                    {__("Booking...", "nobat")}
                  </>
                ) : (
                  __("Book Appointment", "nobat")
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
