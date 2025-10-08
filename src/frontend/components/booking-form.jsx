import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import {
  Button,
  TextControl,
  Notice,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@wordpress/components";
import { TimeSlotSelector } from "./time-slot-selector";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    appointment_date: "",
    time_slot: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear message when user starts typing
    if (message) {
      setMessage(null);
    }
  };

  const fetchAvailableSlots = async (date) => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    try {
      setLoadingSlots(true);
      const response = await fetch(
        `/wp-json/appointment-booking/v1/available-slots?date=${date}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }
      const data = await response.json();
      setAvailableSlots(data);
    } catch (err) {
      setMessage("Failed to load available time slots");
      setMessageType("error");
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    if (formData.appointment_date) {
      fetchAvailableSlots(formData.appointment_date);
    }
  }, [formData.appointment_date]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.client_name ||
      !formData.client_phone ||
      !formData.appointment_date ||
      !formData.time_slot
    ) {
      setMessage("Please fill in all fields");
      setMessageType("error");
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.client_phone.replace(/\s/g, ""))) {
      setMessage("Please enter a valid phone number");
      setMessageType("error");
      return;
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
      setMessage(data.message || "Appointment booked successfully!");
      setMessageType("success");

      // Reset form
      setFormData({
        client_name: "",
        client_phone: "",
        appointment_date: "",
        time_slot: "",
      });
      setAvailableSlots([]);
    } catch (err) {
      setMessage(
        err.message || "Failed to book appointment. Please try again."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="appointment-booking-form">
      <Card>
        <CardHeader>
          <h3>{__("Book an Appointment", "appointment-booking")}</h3>
        </CardHeader>
        <CardBody>
          {message && (
            <Notice
              status={messageType}
              isDismissible
              onRemove={() => setMessage(null)}
            >
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
                placeholder={__(
                  "Enter your phone number",
                  "appointment-booking"
                )}
                type="tel"
              />
            </div>

            <div className="form-row">
              <TextControl
                label={__("Preferred Date", "appointment-booking")}
                value={formData.appointment_date}
                onChange={(value) =>
                  handleInputChange("appointment_date", value)
                }
                required
                type="date"
                min={getMinDate()}
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
                disabled={
                  loading ||
                  !formData.client_name ||
                  !formData.client_phone ||
                  !formData.appointment_date ||
                  !formData.time_slot
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
