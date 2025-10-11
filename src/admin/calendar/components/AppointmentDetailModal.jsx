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
  generateWhatsAppLink,
  getDefaultWhatsAppMessage,
} from "../../lib/appointmentUtils";

const AppointmentDetailModal = ({
  appointment,
  isOpen,
  onClose,
  onStatusUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!appointment) return null;

  const handleWhatsAppClick = () => {
    const message = getDefaultWhatsAppMessage(appointment);
    const whatsappLink = generateWhatsAppLink(
      appointment.client_phone,
      message
    );
    window.open(whatsappLink, "_blank");
  };

  const handleStatusUpdate = async (newStatus) => {
    const success = await onStatusUpdate(appointment.id, newStatus);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    const success = await onDelete(appointment.id);
    if (success) {
      setShowDeleteModal(false);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <Modal
          title={__("Appointment Details", "appointment-booking")}
          isOpen={isOpen}
          onRequestClose={onClose}
          className="appointment-detail-modal"
        >
          <div className="appointment-detail-content">
            <div className="appointment-info">
              <div className="info-row">
                <strong>{__("Client Name:", "appointment-booking")}</strong>
                <span>{appointment.client_name}</span>
              </div>
              <div className="info-row">
                <strong>{__("Phone:", "appointment-booking")}</strong>
                <span>{appointment.client_phone}</span>
              </div>
              <div className="info-row">
                <strong>{__("Date:", "appointment-booking")}</strong>
                <span>{formatDate(appointment.appointment_date)}</span>
              </div>
              <div className="info-row">
                <strong>{__("Time Slot:", "appointment-booking")}</strong>
                <span className="time-slot">{appointment.time_slot}</span>
              </div>
              <div className="info-row">
                <strong>{__("Status:", "appointment-booking")}</strong>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(appointment.status),
                  }}
                >
                  {getStatusLabel(appointment.status)}
                </span>
              </div>
            </div>

            <div className="appointment-actions">
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                {__("Edit Status", "appointment-booking")}
              </Button>
              <Button variant="secondary" onClick={handleWhatsAppClick}>
                {__("Open in WhatsApp", "appointment-booking")}
              </Button>
              <Button
                variant="link"
                isDestructive
                onClick={() => setShowDeleteModal(true)}
              >
                {__("Delete", "appointment-booking")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Status Modal */}
      {isEditing && (
        <Modal
          title={__("Edit Appointment Status", "appointment-booking")}
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
              onChange={handleStatusUpdate}
            />
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
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
            <Button variant="primary" isDestructive onClick={handleDelete}>
              {__("Delete", "appointment-booking")}
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
};

export { AppointmentDetailModal };
