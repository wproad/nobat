import { useState, useEffect } from "react";
import { __ } from "../../../utils/i18n";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Notice,
  Spinner,
  Modal,
  TextareaControl,
} from "../../../ui";

/**
 * MyAppointments component - Shows user's appointments
 * Allows users to request cancellation
 * @param {boolean} shouldLoad - Controls when to load appointments data
 * @param {function} onBookNew - Callback when book new button is clicked
 * @param {function} onAppointmentsLoaded - Callback when appointments are loaded with count
 */
const MyAppointments = ({ shouldLoad = true, onBookNew, onAppointmentsLoaded }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [hasLoaded, setHasLoaded] = useState(false);

  // Check if user is logged in
  const isLoggedIn = window.nobatBooking && window.nobatBooking.isLoggedIn ? true : false;

  useEffect(() => {
    // Only load if shouldLoad is true and hasn't been loaded yet
    if (shouldLoad && !hasLoaded && isLoggedIn) {
      fetchAppointments();
      setHasLoaded(true);
    } else if (!isLoggedIn) {
      setLoading(false);
      setError("You must be logged in to view your appointments.");
    }
  }, [isLoggedIn, shouldLoad, hasLoaded]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "/wp-json/nobat/v2/appointments",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": window.nobatBooking?.nonce || "",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch appointments");
      }

      const data = await response.json();
      const appointmentsList = data.appointments || [];
      setAppointments(appointmentsList);
      
      // Notify parent about appointments count
      if (onAppointmentsLoaded) {
        onAppointmentsLoaded(appointmentsList.length);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };
  console.log(appointments);
  
  const handleRequestCancellation = (appointment) => {
    setSelectedAppointment(appointment);
    setCancellationReason("");
    setCancelModalOpen(true);
  };

  const submitCancellationRequest = async () => {
    if (!selectedAppointment) return;

    try {
      setSubmitting(true);
      const response = await fetch(
        `/wp-json/nobat/v2/appointments/${selectedAppointment.id}/cancel`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": window.nobatBooking?.nonce || "",
          },
          body: JSON.stringify({
            reason: cancellationReason || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to request cancellation");
      }

      // Success!
      setMessage(
        __("Cancellation request submitted successfully!", "nobat")
      );
      setMessageType("success");
      setCancelModalOpen(false);
      setSelectedAppointment(null);

      // Refresh appointments list
      fetchAppointments();
    } catch (err) {
      console.error("Error requesting cancellation:", err);
      setMessage(err.message || "Failed to submit cancellation request");
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      completed: "status-completed",
      cancelled: "status-cancelled",
      cancel_requested: "status-cancel-requested",
    };
    return statusMap[status] || "status-default";
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      pending: __("Pending", "nobat"),
      confirmed: __("Confirmed", "nobat"),
      completed: __("Completed", "nobat"),
      cancelled: __("Cancelled", "nobat"),
      cancel_requested: __("Cancellation Requested", "nobat"),
    };
    return statusLabels[status] || status;
  };

  const canRequestCancellation = (appointment) => {
    return (
      appointment.status === "pending" || appointment.status === "confirmed"
    );
  };

  // Show login message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="my-appointments">
        <Card>
          <CardHeader>
            <h3>{__("My Appointments", "nobat")}</h3>
          </CardHeader>
          <CardBody>
            <Notice status="warning" isDismissible={false}>
              <p>
                {__(
                  "You must be logged in to view your appointments.",
                  "nobat"
                )}
              </p>
            </Notice>
            <div className="form-actions" style={{ marginTop: "16px" }}>
              <Button
                variant="primary"
                href={
                  "/wp-login.php?redirect_to=" +
                  encodeURIComponent(window.location.href)
                }
                __next40pxDefaultSize
              >
                {__("Log In", "nobat")}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="my-appointments">
      <Card>
        <CardHeader>
          <div className="card-header-content">
            <h3>{__("My Appointments", "nobat")}</h3>
            <div className="header-actions">
              {onBookNew && (
                <Button
                  variant="primary"
                  onClick={onBookNew}
                  className="book-new-button"
                  size="compact"
                >
                  {__("Book New Appointment", "nobat")}
                </Button>
              )}
            </div>
          </div>
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

          {loading ? (
            <div className="loading-appointments">
              <Spinner />
              <span>{__("Loading appointments...", "nobat")}</span>
            </div>
          ) : error ? (
            <Notice status="error" isDismissible={false}>
              {error}
            </Notice>
          ) : appointments.length === 0 ? (
            <div className="no-appointments">
              <p>{__("You don't have any appointments yet. Click the button above to book your first appointment.", "nobat")}</p>
            </div>
          ) : (
            <div className="appointments-list">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="appointment-card">
                  <CardBody>
                    <div className="appointment-content">
                      <div className="appointment-info-group">
                        <div className="appointment-info">
                          <h4>
                            {appointment.slot_date_jalali || appointment.slot_date}
                          </h4>
                          <div className="appointment-time">
                            <div className="time-start">
                              {appointment.start_time ? appointment.start_time.substring(0, 5) : ""}
                            </div>
                            <div className="time-separator">{__("to", "nobat")}</div>
                            <div className="time-end">
                              {appointment.end_time ? appointment.end_time.substring(0, 5) : ""}
                            </div>
                          </div>
                        </div>
                        <div className="appointment-status">
                          <span
                            className={`status-badge ${getStatusBadgeClass(
                              appointment.status
                            )}`}
                          >
                            {getStatusLabel(appointment.status)}
                          </span>
                        </div>

                        {appointment.note && (
                          <div className="appointment-note">
                            <strong>{__("Note:", "nobat")}</strong>{" "}
                            {appointment.note}
                          </div>
                        )}

                        {appointment.assigned_admin_id && appointment.admin_name && (
                          <div className="appointment-admin">
                            <strong>
                              {__("Assigned to:", "nobat")}
                            </strong>{" "}
                            {appointment.admin_name}
                          </div>
                        )}
                      </div>

                      {canRequestCancellation(appointment) && (
                        <div className="appointment-actions">
                          <Button
                            variant="outline-destructive"
                            onClick={() => handleRequestCancellation(appointment)}
                            size="compact"
                          >
                            {__("Cancel", "nobat")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <Modal
          title={__("Request Cancellation", "nobat")}
          onRequestClose={() => {
            if (!submitting) {
              setCancelModalOpen(false);
              setSelectedAppointment(null);
            }
          }}
        >
          <p>
            {__(
              "Are you sure you want to request cancellation for this appointment?",
              "nobat"
            )}
          </p>

          {selectedAppointment && (
            <div className="cancellation-appointment-info">
              <p>
                <strong>{__("Date:", "nobat")}</strong>{" "}
                {selectedAppointment.slot_date_jalali ||
                  selectedAppointment.slot_date}
              </p>
              <p>
                <strong>{__("Time:", "nobat")}</strong>{" "}
                {selectedAppointment.start_time} - {selectedAppointment.end_time}
              </p>
            </div>
          )}

          <TextareaControl
            label={__("Reason for cancellation (optional)", "nobat")}
            value={cancellationReason}
            onChange={(value) => setCancellationReason(value)}
            placeholder={__(
              "Please provide a reason for cancellation",
              "nobat"
            )}
            rows={4}
          />

          <div className="modal-actions" style={{ marginTop: "16px" }}>
            <Button
              variant="primary"
              isDestructive
              onClick={submitCancellationRequest}
              disabled={submitting}
              __next40pxDefaultSize
            >
              {submitting ? (
                <>
                  <Spinner />
                  {__("Submitting...", "nobat")}
                </>
              ) : (
                __("Submit Request", "nobat")
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCancelModalOpen(false);
                setSelectedAppointment(null);
              }}
              disabled={submitting}
              __next40pxDefaultSize
              style={{ marginLeft: "8px" }}
            >
              {__("Cancel", "nobat")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export { MyAppointments };

