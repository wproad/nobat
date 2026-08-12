import { __ } from "../utils/i18n";

/**
 * Soft Slot status class for appointment time-blocks (paired bg/fg via CSS).
 */
export const getStatusClass = (status) => {
  switch (status) {
    case "pending":
    case "cancel_requested":
      return "appt-status--pending";
    case "confirmed":
      return "appt-status--confirmed";
    case "completed":
      return "appt-status--past";
    case "cancelled":
      return "appt-status--cancelled";
    default:
      return "appt-status--past";
  }
};

/**
 * Soft Slot bf-badge class pair for appointment status chips.
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "pending":
    case "cancel_requested":
      return "bf-badge bf-badge--pending";
    case "confirmed":
      return "bf-badge bf-badge--confirmed";
    case "completed":
      return "bf-badge bf-badge--past";
    case "cancelled":
      return "bf-badge bf-badge--cancelled";
    default:
      return "bf-badge bf-badge--past";
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return __("Pending", "nobat");
    case "confirmed":
      return __("Confirmed", "nobat");
    case "completed":
      return __("Completed", "nobat");
    case "cancelled":
      return __("Cancelled", "nobat");
    default:
      return status;
  }
};

export const statusOptions = [
  { label: __("Pending", "nobat"), value: "pending" },
  { label: __("Confirmed", "nobat"), value: "confirmed" },
  { label: __("Completed", "nobat"), value: "completed" },
  { label: __("Cancelled", "nobat"), value: "cancelled" },
];

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export const generateWhatsAppLink = (phone, message) => {
  const cleanPhone = phone.replace(/\D/g, ""); // Remove non-digits
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const getDefaultWhatsAppMessage = (appointment) => {
  return __(
    "Hello {name}, this is regarding your appointment on {date} at {time}.",
    "nobat"
  )
    .replace("{name}", appointment.client_name)
    .replace("{date}", formatDate(appointment.appointment_date))
    .replace("{time}", appointment.time_slot);
};
