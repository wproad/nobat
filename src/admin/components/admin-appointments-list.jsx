import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Notice,
} from "@wordpress/components";
import { AppointmentRow } from "./appointment-row";

const AdminAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "/wp-json/appointment-booking/v1/appointments",
        {
          headers: {
            "X-WP-Nonce": wpApiSettings.nonce,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch appointments");
      }
      const data = await response.json();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(
        `/wp-json/appointment-booking/v1/appointments/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": wpApiSettings.nonce,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }

      // Refresh the list
      fetchAppointments();
    } catch (err) {
      setError("Failed to update appointment status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      const response = await fetch(
        `/wp-json/appointment-booking/v1/appointments/${id}`,
        {
          method: "DELETE",
          headers: {
            "X-WP-Nonce": wpApiSettings.nonce,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete appointment");
      }

      // Refresh the list
      fetchAppointments();
    } catch (err) {
      setError("Failed to delete appointment");
    }
  };

  if (loading) {
    return (
      <div className="appointment-booking-admin">
        <h1>{__("Appointments", "appointment-booking")}</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="appointment-booking-admin">
      <div className="appointment-booking-header">
        <h1>{__("Appointments", "appointment-booking")}</h1>
        <Button
          variant="secondary"
          onClick={fetchAppointments}
          disabled={loading}
        >
          {__("Refresh", "appointment-booking")}
        </Button>
      </div>

      {error && (
        <Notice status="error" isDismissible onRemove={() => setError(null)}>
          {error}
        </Notice>
      )}

      <Card>
        <CardHeader>
          <h2>{__("All Appointments", "appointment-booking")}</h2>
        </CardHeader>
        <CardBody>
          {appointments.length === 0 ? (
            <p>{__("No appointments found.", "appointment-booking")}</p>
          ) : (
            <div className="appointments-table">
              <div className="appointments-header">
                <div>{__("Client", "appointment-booking")}</div>
                <div>{__("Phone", "appointment-booking")}</div>
                <div>{__("Date", "appointment-booking")}</div>
                <div>{__("Time", "appointment-booking")}</div>
                <div>{__("Status", "appointment-booking")}</div>
                <div>{__("Actions", "appointment-booking")}</div>
              </div>
              {appointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export { AdminAppointmentsList };
