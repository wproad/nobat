import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
  Button,
  SelectControl,
  Modal,
  TextControl,
} from "@wordpress/components";
import {
  getStatusColor,
  getStatusLabel,
  statusOptions,
  formatDate,
} from "../lib/appointmentUtils";

const AppointmentRow = ({ appointment, onStatusUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <div className="appointment-row">
        <div className="appointment-cell">
          <strong>{appointment.client_name}</strong>
        </div>
        <div className="appointment-cell">{appointment.client_phone}</div>
        <div className="appointment-cell">
          {formatDate(appointment.appointment_date)}
        </div>
        <div className="appointment-cell">{appointment.time_slot}</div>
        <div className="appointment-cell">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(appointment.status) }}
          >
            {getStatusLabel(appointment.status)}
          </span>
        </div>
        <div className="appointment-cell">
          <div className="appointment-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => setIsEditing(true)}
            >
              {__("Edit", "appointment-booking")}
            </Button>
            <Button
              variant="link"
              isDestructive
              size="small"
              onClick={() => setShowDeleteModal(true)}
            >
              {__("Delete", "appointment-booking")}
            </Button>
          </div>
        </div>
      </div>

      {isEditing && (
        <Modal
          title={__("Edit Appointment", "appointment-booking")}
          onRequestClose={() => setIsEditing(false)}
        >
          <div className="appointment-edit-form">
            <TextControl
              label={__("Client Name", "appointment-booking")}
              value={appointment.client_name}
              disabled
            />
            <TextControl
              label={__("Phone", "appointment-booking")}
              value={appointment.client_phone}
              disabled
            />
            <TextControl
              label={__("Date", "appointment-booking")}
              value={formatDate(appointment.appointment_date)}
              disabled
            />
            <TextControl
              label={__("Time Slot", "appointment-booking")}
              value={appointment.time_slot}
              disabled
            />
            <SelectControl
              label={__("Status", "appointment-booking")}
              value={appointment.status}
              options={statusOptions}
              onChange={(newStatus) => {
                onStatusUpdate(appointment.id, newStatus);
                setIsEditing(false);
              }}
            />
          </div>
        </Modal>
      )}

      {showDeleteModal && (
        <Modal
          title={__("Delete Appointment", "appointment-booking")}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <p>
            {__(
              "Are you sure you want to delete this appointment? This action cannot be undone.",
              "appointment-booking"
            )}
          </p>
          <div className="modal-actions">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              {__("Cancel", "appointment-booking")}
            </Button>
            <Button
              variant="primary"
              isDestructive
              onClick={() => {
                onDelete(appointment.id);
                setShowDeleteModal(false);
              }}
            >
              {__("Delete", "appointment-booking")}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export { AppointmentRow };
