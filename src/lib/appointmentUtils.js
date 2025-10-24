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
