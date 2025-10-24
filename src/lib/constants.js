import { __ } from "@wordpress/i18n";

export const defaultWeeklyHours = {
  sat: ["09:00-12:00"],
  sun: ["09:00-12:00"],
  mon: ["09:00-12:00"],
  tue: ["09:00-12:00"],
  wed: ["09:00-12:00"],
  thu: ["09:00-12:00"],
  fri: [],
};

export const weekdayLabels = {
  sat: { key: "sat", label: __("Saturday", "nobat") },
  sun: { key: "sun", label: __("Sunday", "nobat") },
  mon: { key: "mon", label: __("Monday", "nobat") },
  tue: { key: "tue", label: __("Tuesday", "nobat") },
  wed: { key: "wed", label: __("Wednesday", "nobat") },
  thu: { key: "thu", label: __("Thursday", "nobat") },
  fri: { key: "fri", label: __("Friday", "nobat") },
};
