import { __ } from "@wordpress/i18n";

export default function CalendarLoading() {
  return (
    <div className="calendar-loading">
      <p>{__("Loading calendar...", "appointment-booking")}</p>
    </div>
  );
}