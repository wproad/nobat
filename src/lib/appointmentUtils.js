import { __ } from "@wordpress/i18n";

export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "#f0ad4e"; // Orange
    case "confirmed":
      return "#5cb85c"; // Green
    case "completed":
      return "#337ab7"; // Blue
    case "cancelled":
      return "#d9534f"; // Red
    default:
      return "#777"; // Gray
  }
};

export const getStatusBorderColor = (status) => {
  switch (status) {
    case "pending":
      return "#d58512";
    case "confirmed":
      return "#449d44";
    case "completed":
      return "#286090";
    case "cancelled":
      return "#b52b27";
    default:
      return "#333333";
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return __("Pending", "appointment-booking");
    case "confirmed":
      return __("Confirmed", "appointment-booking");
    case "completed":
      return __("Completed", "appointment-booking");
    case "cancelled":
      return __("Cancelled", "appointment-booking");
    default:
      return status;
  }
};

export const statusOptions = [
  { label: __("Pending", "appointment-booking"), value: "pending" },
  { label: __("Confirmed", "appointment-booking"), value: "confirmed" },
  { label: __("Completed", "appointment-booking"), value: "completed" },
  { label: __("Cancelled", "appointment-booking"), value: "cancelled" },
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
  return `Hello ${
    appointment.client_name
  }, this is regarding your appointment on ${formatDate(
    appointment.appointment_date
  )} at ${appointment.time_slot}.`;
};
