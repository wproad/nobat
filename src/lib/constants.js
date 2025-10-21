import { __ } from "@wordpress/i18n";

export const defaultWeeklyHours = {
  sat: ["9:00-14:00"],
  sun: ["9:00-14:00"],
  mon: ["9:00-14:00"],
  tue: ["9:00-14:00"],
  wed: ["9:00-14:00"],
  thu: ["9:00-12:00"],
  fri: [],
};

export const weekdayLabels = {
  sat: { key: "sat", label: __("Saturday", "appointment-booking") },
  sun: { key: "sun", label: __("Sunday", "appointment-booking") },
  mon: { key: "mon", label: __("Monday", "appointment-booking") },
  tue: { key: "tue", label: __("Tuesday", "appointment-booking") },
  wed: { key: "wed", label: __("Wednesday", "appointment-booking") },
  thu: { key: "thu", label: __("Thursday", "appointment-booking") },
  fri: { key: "fri", label: __("Friday", "appointment-booking") },
};
